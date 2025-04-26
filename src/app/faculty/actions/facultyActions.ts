"use server";

import prisma from "@/prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export interface FeedbackData {
  subject: string;
  batch: string;
  branch: string;
  rating: number;
}

export interface FacultyInfo {
  name: string;
  email: string;
  facultyId: string;
  department: string;
}

export interface AdditionalFeedback {
  id: string;
  subject: string;
  batch: string;
  branch: string;
  comment: string;
  timestamp: string;
}

export interface Question {
  id: string;
  text: string;
  type: "rating" | "text";
}

export async function getCurriculumFeedbackQuestions(): Promise<Question[]> {
  try {
    // Get the existing "Curriculum Feedback" type based on the database
    const feedbackType = await prisma.feedBack_Name.findFirst({
      where: {
        name: {
          contains: "Curriculum Feedback",
        },
      },
    });

    if (!feedbackType) {
      console.error("Curriculum Feedback type not found in database");
      return getDefaultCurriculumQuestions();
    }

    // Fetch questions for curriculum feedback
    const questions = await prisma.questions.findMany({
      where: {
        feedback_ID: feedbackType.Feedback_Name_ID,
      },
      orderBy: {
        Question_ID: "asc",
      },
    });

    if (questions.length === 0) {
      // No questions found, return default ones
      return getDefaultCurriculumQuestions();
    }

    return questions.map((q, index) => ({
      id: `Q${index + 1}`,
      text: q.question,
      type:
        q.question.toLowerCase().includes("recommend") ||
        q.question.toLowerCase().includes("suggest")
          ? "text"
          : "rating",
    }));
  } catch (error) {
    console.error("Error fetching curriculum feedback questions:", error);
    return getDefaultCurriculumQuestions();
  }
}

// Default curriculum feedback questions if DB fetch fails
function getDefaultCurriculumQuestions(): Question[] {
  return [
    {
      id: "Q1",
      text: "I am given enough freedom to contribute my ideas on curriculum design and development.",
      type: "rating",
    },
    {
      id: "Q2",
      text: "The faculty members/teachers are supported with adequate learning resources",
      type: "rating",
    },
    {
      id: "Q3",
      text: "The faculty members/teachers are encouraged to establish linkages with Industry.",
      type: "rating",
    },
    {
      id: "Q4",
      text: "The syllabus is relevant and adequate in terms of scope, depth, and choice to help develop the required competencies amongst students",
      type: "rating",
    },
    {
      id: "Q5",
      text: "Would you recommend any new course/topic to be added in the program structure?",
      type: "text",
    },
  ];
}

// Check if faculty has already submitted curriculum feedback
export async function hasFacultySubmittedCurriculumFeedback(
  facultyId: string
): Promise<boolean> {
  try {
    // Get curriculum feedback type ID
    const feedbackType = await prisma.feedBack_Name.findFirst({
      where: {
        name: {
          contains: "Curriculum Feedback",
        },
      },
    });

    if (!feedbackType) {
      console.error("Curriculum feedback type not found");
      return false;
    }

    // Check if faculty has submitted this feedback type
    const feedbackCount = await prisma.feedback.count({
      where: {
        faculty_ID: facultyId,
        feedback_name_ID: feedbackType.Feedback_Name_ID,
        isValid: 1,
      },
    });

    return feedbackCount > 0;
  } catch (error) {
    console.error(
      "Error checking if faculty submitted curriculum feedback:",
      error
    );
    return false;
  }
}

// Submit curriculum feedback from faculty
export async function submitFacultyCurriculumFeedback(
  facultyId: string,
  responses: Record<string, number | string>
): Promise<boolean> {
  try {
    // Get the feedback type ID
    const feedbackType = await prisma.feedBack_Name.findFirst({
      where: {
        name: {
          contains: "Curriculum Feedback",
        },
      },
    });

    if (!feedbackType) {
      console.error("Curriculum Feedback type not found");
      return false;
    }

    // Get faculty info
    const faculty = await prisma.faculty.findUnique({
      where: {
        Faculty_ID: facultyId,
      },
      include: {
        user: true,
      },
    });

    if (!faculty) {
      console.error("Faculty not found");
      return false;
    }

    // Check if faculty has already submitted this feedback type
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        faculty_ID: facultyId,
        feedback_name_ID: feedbackType.Feedback_Name_ID,
        isValid: 1,
      },
    });

    if (existingFeedback) {
      console.error("Faculty has already submitted curriculum feedback");
      return false;
    }

    // Get questions for this feedback type
    const questions = await prisma.questions.findMany({
      where: {
        feedback_ID: feedbackType.Feedback_Name_ID,
      },
    });

    if (questions.length === 0) {
      console.error("No questions found for curriculum feedback");
      return false;
    }

    // Create feedback entries for each question
    for (const question of questions) {
      const questionIndex = questions.indexOf(question);
      const questionKey = `Q${questionIndex + 1}`;

      if (
        responses[questionKey] !== undefined &&
        responses[questionKey] !== null
      ) {
        // Use direct SQL queries as a workaround for Prisma's type checking issues
        await prisma.$executeRaw`
          INSERT INTO Feedback (
            Feedback_ID, 
            feedback_name_ID, 
            faculty_ID, 
            question_ID, 
            answer, 
            timestamp, 
            isValid
          ) VALUES (
            ${crypto.randomUUID()}, 
            ${feedbackType.Feedback_Name_ID}, 
            ${facultyId}, 
            ${question.Question_ID}, 
            ${String(responses[questionKey])}, 
            ${new Date()}, 
            1
          )
        `;
      }
    }

    // If there are text responses, save them as remarks too
    const textResponses = Object.entries(responses).filter(
      ([key, value]) => typeof value === "string" && value.trim().length > 0
    );

    if (textResponses.length > 0) {
      // Get the text from the first text question (usually the last question)
      const [_, textValue] = textResponses[0];

      await prisma.remarks.create({
        data: {
          Remark_ID: crypto.randomUUID(),
          remark: textValue.toString(),
          branch: faculty.department || "Faculty",
          timestamp: new Date(),
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error submitting faculty curriculum feedback:", error);
    return false;
  }
}

export async function getCurrentFacultyInfo(): Promise<FacultyInfo | null> {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    let facultyEmailFromCookie: string | undefined;
    try {
      const cookieValue = process.env.COOKIE_VALUE;
      if (
        typeof cookieValue === "string" &&
        cookieValue.includes("faculty_email")
      ) {
        const match = cookieValue.match(/faculty_email=([^;]+)/);
        if (match) {
          facultyEmailFromCookie = decodeURIComponent(match[1]);
        }
      }
    } catch (e) {
      console.error("Error accessing cookies:", e);
    }

    if (userEmail) {
      const facultyBySession = await prisma.user.findUnique({
        where: {
          email: userEmail,
          role: "faculty",
        },
        include: { faculty: true },
      });

      if (facultyBySession?.faculty) {
        return {
          name: facultyBySession.name,
          email: facultyBySession.email,
          facultyId: facultyBySession.faculty.Faculty_ID,
          department: facultyBySession.faculty.department,
        };
      }
    }

    if (facultyEmailFromCookie) {
      const facultyByCookie = await prisma.user.findUnique({
        where: {
          email: facultyEmailFromCookie,
          role: "faculty",
        },
        include: { faculty: true },
      });

      if (facultyByCookie?.faculty) {
        console.log("Found faculty by cookie:", facultyByCookie.email);
        return {
          name: facultyByCookie.name,
          email: facultyByCookie.email,
          facultyId: facultyByCookie.faculty.Faculty_ID,
          department: facultyByCookie.faculty.department,
        };
      }
    }

    const urlFacultyEmail =
      process.env.FACULTY_EMAIL || "faculty@sitpune.edu.in";
    const urlFaculty = await prisma.user.findUnique({
      where: {
        email: urlFacultyEmail,
        role: "faculty",
      },
      include: { faculty: true },
    });

    if (urlFaculty?.faculty) {
      console.log("Using configured faculty:", urlFaculty.email);
      return {
        name: urlFaculty.name,
        email: urlFaculty.email,
        facultyId: urlFaculty.faculty.Faculty_ID,
        department: urlFaculty.faculty.department,
      };
    }

    console.log("Falling back to demo faculty");
    const demoFaculty = await prisma.user.findFirst({
      where: { role: "faculty" },
      include: { faculty: true },
    });

    if (demoFaculty?.faculty) {
      console.log("Using demo faculty:", demoFaculty.email);
      return {
        name: demoFaculty.name,
        email: demoFaculty.email,
        facultyId: demoFaculty.faculty.Faculty_ID,
        department: demoFaculty.faculty.department,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching faculty info:", error);
    return null;
  }
}

export async function getFacultyFeedbackAnalytics(facultyId: string): Promise<{
  feedbackData: FeedbackData[];
  batches: string[];
  branches: string[];
}> {
  try {
    // Add debug information
    console.log(`Fetching analytics for faculty ID: ${facultyId}`);

    const facultySubjects = await prisma.faculty_Subject.findMany({
      where: { Faculty_ID: facultyId },
      include: { subject: true },
    });

    console.log(`Faculty teaches ${facultySubjects.length} subjects`);

    const batches = [...new Set(facultySubjects.map((fs) => fs.batch))];
    console.log(`Available batches: ${batches.join(", ")}`);

    // First let's get all branches from the database for debugging
    const allBranches = await prisma.student.findMany({
      select: {
        branch: true,
      },
      distinct: ["branch"],
    });

    console.log(
      `All branches in database: ${allBranches.map((b) => b.branch).join(", ")}`
    );

    // Get student feedback for this faculty
    const studentFeedbacks = await prisma.$queryRaw<
      Array<{
        subject_name: string;
        batch: string;
        branch: string;
        answer: string;
        question_ID: string;
      }>
    >`
      SELECT f.*, s.branch, sub.name as subject_name, fs.batch
      FROM Feedback f
      JOIN Student s ON f.student_ID = s.Student_ID
      JOIN Subject sub ON f.subject_ID = sub.Subject_ID
      JOIN Faculty_Subject fs ON f.subject_ID = fs.Subject_ID AND fs.Faculty_ID = ${facultyId}
      WHERE f.faculty_ID = ${facultyId} 
      AND f.student_ID IS NOT NULL
      AND f.subject_ID IS NOT NULL
    `;

    console.log(
      `Found ${studentFeedbacks.length} feedback entries for this faculty`
    );

    // Now get all students who have subjects taught by this faculty
    const studentsInFacultyClasses = await prisma.$queryRaw<
      Array<{
        branch: string;
      }>
    >`
      SELECT DISTINCT s.branch
      FROM Student s
      JOIN Electives e ON s.Student_ID = e.Student_ID
      JOIN Faculty_Subject fs ON e.Subject_ID = fs.Subject_ID
      WHERE fs.Faculty_ID = ${facultyId}
    `;

    console.log(
      `Students from branches: ${studentsInFacultyClasses
        .map((s) => s.branch)
        .join(", ")} attend this faculty's classes`
    );

    // Collect branches from student feedback as well as students in faculty classes
    const feedbackBranches = new Set(studentFeedbacks.map((f) => f.branch));
    const classBranches = new Set(
      studentsInFacultyClasses.map((s) => s.branch)
    );
    const allRelevantBranches = [
      ...new Set([...feedbackBranches, ...classBranches]),
    ];

    console.log(`Branches with feedback: ${[...feedbackBranches].join(", ")}`);
    console.log(
      `Combined relevant branches: ${allRelevantBranches.join(", ")}`
    );

    // Use the combined branches instead of just feedback branches
    const branches: string[] = allRelevantBranches;

    // Group feedback by subject, batch, branch, and question to ensure correct averaging
    const feedbackByGroups = new Map<
      string,
      {
        subject: string;
        batch: string;
        branch: string;
        ratings: number[];
      }
    >();

    // Process student feedback and group by subject/batch/branch
    for (const feedback of studentFeedbacks) {
      const subject = feedback.subject_name;
      const batch = feedback.batch;
      const branch = feedback.branch;

      // Skip non-numeric ratings
      const rating = parseFloat(feedback.answer);
      if (isNaN(rating)) continue;

      // Create a key to group feedback (subject + batch + branch)
      const groupKey = `${subject}-${batch}-${branch}`;

      // Initialize or update the group
      if (!feedbackByGroups.has(groupKey)) {
        feedbackByGroups.set(groupKey, {
          subject,
          batch,
          branch,
          ratings: [rating],
        });
      } else {
        // Add this rating to the existing group
        feedbackByGroups.get(groupKey)!.ratings.push(rating);
      }
    }

    // Create feedback data entries - ONLY for groups that have ratings
    const feedbackData: FeedbackData[] = [];

    // Process the grouped feedback and calculate averages
    feedbackByGroups.forEach((group) => {
      // Only include groups that have ratings
      if (group.ratings.length > 0) {
        const totalRating = group.ratings.reduce(
          (sum, rating) => sum + rating,
          0
        );
        const averageRating = totalRating / group.ratings.length;

        feedbackData.push({
          subject: group.subject,
          batch: group.batch,
          branch: group.branch,
          rating: averageRating,
        });
      }
    });

    console.log(
      `Generated ${feedbackData.length} feedback data entries with actual ratings`
    );

    return {
      feedbackData,
      batches,
      branches,
    };
  } catch (error) {
    console.error("Error fetching faculty feedback analytics:", error);
    return { feedbackData: [], batches: [], branches: [] };
  }
}

export async function getAdditionalFeedback(facultyId: string): Promise<{
  feedbackData: AdditionalFeedback[];
  batches: string[];
  branches: string[];
  subjects: string[];
}> {
  try {
    const facultySubjects = await prisma.faculty_Subject.findMany({
      where: { Faculty_ID: facultyId },
      include: { subject: true },
    });

    const batches = [...new Set(facultySubjects.map((fs) => fs.batch))];
    const subjects = [...new Set(facultySubjects.map((fs) => fs.subject.name))];

    // Use raw query to get text feedback that's related to subjects taught by this faculty
    const textFeedbacksRaw = await prisma.$queryRaw<
      Array<{
        Feedback_ID: string;
        answer: string;
        timestamp: Date;
        branch: string;
        subject_name: string;
        batch: string;
      }>
    >`
      SELECT f.Feedback_ID, f.answer, f.timestamp, 
             s.branch, sub.name as subject_name, fs.batch
      FROM Feedback f
      JOIN Student s ON f.student_ID = s.Student_ID
      JOIN Subject sub ON f.subject_ID = sub.Subject_ID
      JOIN Faculty_Subject fs ON f.subject_ID = fs.Subject_ID AND fs.Faculty_ID = ${facultyId}
      WHERE f.faculty_ID = ${facultyId}
      AND f.answer NOT IN ('1', '2', '3', '4', '5')
      AND f.answer != ''
      AND f.student_ID IS NOT NULL
      ORDER BY f.timestamp DESC
    `;

    const branches: string[] = [
      ...new Set(textFeedbacksRaw.map((f) => f.branch)),
    ];

    const feedbackData: AdditionalFeedback[] = textFeedbacksRaw.map(
      (feedback) => {
        return {
          id: feedback.Feedback_ID,
          subject: feedback.subject_name,
          batch: feedback.batch,
          branch: feedback.branch,
          comment: feedback.answer,
          timestamp: new Date(feedback.timestamp).toISOString(),
        };
      }
    );

    return {
      feedbackData,
      batches,
      branches,
      subjects,
    };
  } catch (error) {
    console.error("Error fetching additional feedback:", error);
    return { feedbackData: [], batches: [], branches: [], subjects: [] };
  }
}
