"use server";

import prisma from "@/prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export interface FacultySubject {
  facultyId: string;
  facultyName: string;
  subjectId: string;
  subjectName: string;
  department: string;
}

export interface StudentInfo {
  id: string;
  name: string;
  email: string;
  branch: string;
}

export interface Question {
  id: string;
  text: string;
  type: "rating" | "text";
}

export interface FeedbackType {
  id: string;
  name: string;
}

export async function getCurrentStudentInfo(): Promise<StudentInfo | null> {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) return null;

    const student = await prisma.user.findUnique({
      where: {
        email: userEmail,
        role: "student",
      },
      include: {
        student: true,
      },
    });

    if (!student?.student) return null;

    return {
      id: student.student.Student_ID,
      name: student.name,
      email: student.email,
      branch: student.branch || "",
    };
  } catch (error) {
    console.error("Error fetching student info:", error);
    return null;
  }
}

export async function getStudentFacultySubjects(): Promise<FacultySubject[]> {
  try {
    const studentInfo = await getCurrentStudentInfo();

    if (!studentInfo) {
      console.log("No student info found for the current user");
      return [];
    }

    console.log(
      `Fetching feedback for student: ${studentInfo.id} (${studentInfo.name})`
    );

    // Get student details
    const studentDetails = await prisma.student.findUnique({
      where: {
        Student_ID: studentInfo.id,
      },
    });

    if (!studentDetails) {
      console.log("Student details not found in the database");
      return [];
    }

    // Debug information
    console.log(
      `Student branch: ${studentDetails.branch}, semester: ${studentDetails.semester}`
    );

    console.log(
      `CRITICAL DEBUG - Student ID for feedback check: ${studentInfo.id}`
    );

    // First check if this student has ANY feedback entries at all
    const totalStudentFeedback = await prisma.feedback.count({
      where: {
        student_ID: studentInfo.id,
        isValid: 1,
      },
    });

    console.log(
      `DEBUG: Total feedback count for student ${studentInfo.name}: ${totalStudentFeedback}`
    );

    // If they have submitted enough feedback entries, don't show any more subjects
    // Assuming each subject has the same number of questions (e.g., 9 questions)
    const questionsPerSubject = 9; // Change this if your subjects have different question counts
    const maxFeedbackSubjectsAllowed = 5; // This should match your limit at the end of the function

    if (
      totalStudentFeedback >=
      questionsPerSubject * maxFeedbackSubjectsAllowed
    ) {
      console.log(
        `Student ${studentInfo.name} has already submitted maximum allowed feedback`
      );
      return []; // Return empty array to indicate no more feedback needed
    }

    // Get all faculty-subject pairs first
    // We'll filter them based on the student specifics later
    const facultySubjects = await prisma.faculty_Subject.findMany({
      include: {
        faculty: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
    });

    console.log(
      `Total faculty-subject pairs in system: ${facultySubjects.length}`
    );

    // Also get elective subjects specifically for THIS student
    const electiveSelections = await prisma.electives.findMany({
      where: {
        Student_ID: studentInfo.id,
      },
      include: {
        subject: true,
      },
    });

    console.log(`Student has ${electiveSelections.length} elective subjects`);

    // Find faculty teaching these electives
    const electiveFacultySubjects = [];
    for (const elective of electiveSelections) {
      const facultyForElective = await prisma.faculty_Subject.findFirst({
        where: {
          Subject_ID: elective.Subject_ID,
        },
        include: {
          faculty: {
            include: {
              user: true,
            },
          },
          subject: true,
        },
      });

      if (facultyForElective) {
        electiveFacultySubjects.push(facultyForElective);
      }
    }

    // Combine elective subjects with regular subjects
    let allFacultySubjects = [...electiveFacultySubjects];

    // Filter regular subjects to only include those relevant to the student's branch
    // Since Subject doesn't have branch or semester fields in the schema,
    // we're doing a simpler filtering approach here
    const relevantSubjects = facultySubjects.filter((fs) => {
      // Here's where we would filter by branch and semester
      // Since we can't directly, just include all non-elective subjects for now
      return fs.subject.type !== "Elective";
    });

    // Add the relevant subjects to the student's list
    allFacultySubjects = [...allFacultySubjects, ...relevantSubjects];

    console.log(
      `Combined total of relevant faculty-subjects: ${allFacultySubjects.length}`
    );

    // Map to the required format
    const result: FacultySubject[] = allFacultySubjects.map((fs) => ({
      facultyId: fs.faculty.Faculty_ID,
      facultyName: fs.faculty.user.name,
      subjectId: fs.subject.Subject_ID,
      subjectName: fs.subject.name,
      department: fs.faculty.department || "Unknown Department",
    }));

    // Check which faculty-subject pairs THIS SPECIFIC STUDENT has already given feedback for
    const studentFeedback = await prisma.feedback.findMany({
      where: {
        student_ID: studentInfo.id, // CRITICAL: Only check THIS student's feedback
        isValid: 1,
      },
      select: {
        faculty_ID: true,
        subject_ID: true,
      },
      distinct: ["faculty_ID", "subject_ID"],
    });

    console.log(
      `DETAILED DEBUG - Found ${studentFeedback.length} feedback entries:`
    );
    studentFeedback.forEach((fb, idx) => {
      console.log(
        `  ${idx + 1}. faculty_ID=${fb.faculty_ID}, subject_ID=${fb.subject_ID}`
      );
    });

    // Create a set of 'facultyId-subjectId' strings for faster lookup
    const feedbackGiven = new Set(
      studentFeedback.map((fb) => `${fb.faculty_ID}-${fb.subject_ID}`)
    );

    // Filter out faculty-subject pairs that THIS SPECIFIC STUDENT has already evaluated
    const pendingFeedback = result.filter(
      (item) => !feedbackGiven.has(`${item.facultyId}-${item.subjectId}`)
    );

    console.log(
      `DEBUG - Final pending feedback count: ${pendingFeedback.length}`
    );
    pendingFeedback.forEach((item, idx) => {
      console.log(
        `  ${idx + 1}. ${item.subjectName} (${item.subjectId}) taught by $(
          item.facultyName
        ) (${item.facultyId})`
      );
    });

    // Apply a limit to prevent too many feedback pages
    return pendingFeedback.slice(0, 5);
  } catch (error) {
    console.error("Error fetching faculty subjects:", error);
    return [];
  }
}

// Move the helper functions to the top, before they are used
// Helper function to get default questions for faculty feedback
function getDefaultQuestions(): Question[] {
  return [
    {
      id: "Q1",
      text: "Instructor was well prepared for the lectures?",
      type: "rating",
    },
    {
      id: "Q2",
      text: "Fundamental principles were well emphasized?",
      type: "rating",
    },
    {
      id: "Q3",
      text: "Piece of the instruction was given?",
      type: "rating",
    },
    {
      id: "Q4",
      text: "Course was fully covered?",
      type: "rating",
    },
    {
      id: "Q5",
      text: "Instructor could communicate effectively with the students?",
      type: "rating",
    },
    {
      id: "Q6",
      text: "Instructor encouraged questions and cleared doubts?",
      type: "rating",
    },
    {
      id: "Q7",
      text: "Instructor could be approached beyond normal lecture hours for assisting students?",
      type: "rating",
    },
    {
      id: "Q8",
      text: "All the allotted lectures were held till date?",
      type: "rating",
    },
    {
      id: "Q9",
      text: "Writing on the B/Board was visible?",
      type: "rating",
    },
  ];
}

// Default curriculum feedback questions
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

// Default guest feedback questions
function getDefaultGuestQuestions(): Question[] {
  return [
    {
      id: "Q1",
      text: "How well did the guest lecture align with the course content?",
      type: "rating",
    },
    {
      id: "Q2",
      text: "Did the guest lecturer effectively explain complex concepts?",
      type: "rating",
    },
    {
      id: "Q3",
      text: "Did the guest lecture enhance your understanding of the subject?",
      type: "rating",
    },
    {
      id: "Q4",
      text: "How engaging was the guest lecturer's presentation style?",
      type: "rating",
    },
    {
      id: "Q5",
      text: "Were the practical examples and insights beneficial?",
      type: "rating",
    },
    {
      id: "Q6",
      text: "Did the guest lecturer interact well with students and address questions?",
      type: "rating",
    },
    {
      id: "Q7",
      text: "How valuable was this guest lecture for your academic growth?",
      type: "rating",
    },
    {
      id: "Q8",
      text: "Would you recommend having more guest lectures in the curriculum?",
      type: "rating",
    },
    {
      id: "Q9",
      text: "Overall, how satisfied were you with the guest lecture?",
      type: "rating",
    },
  ];
}

// Function to create default questions for a feedback type
async function createDefaultQuestions(
  feedbackTypeId: string,
  defaultQuestions: Question[]
): Promise<void> {
  try {
    for (const question of defaultQuestions) {
      await prisma.questions.create({
        data: {
          Question_ID: crypto.randomUUID(),
          question: question.text,
          feedback_ID: feedbackTypeId,
        },
      });
    }
    console.log(
      `Created ${defaultQuestions.length} default questions for feedback type ${feedbackTypeId}`
    );
  } catch (error) {
    console.error("Error creating default questions:", error);
  }
}

export async function getFeedbackQuestions(): Promise<Question[]> {
  try {
    // Fetch faculty feedback type ID
    const facultyFeedbackType = await prisma.feedBack_Name.findFirst({
      where: {
        name: {
          contains: "Faculty Feedback",
        },
      },
    });

    if (!facultyFeedbackType) {
      return getDefaultQuestions();
    }

    // Fetch questions for faculty feedback
    const questions = await prisma.questions.findMany({
      where: {
        feedback_ID: facultyFeedbackType.Feedback_Name_ID,
      },
      orderBy: {
        Question_ID: "asc",
      },
    });

    return questions.map((q, index) => ({
      id: `Q${index + 1}`,
      text: q.question,
      type: "rating" as const,
    }));
  } catch (error) {
    console.error("Error fetching feedback questions:", error);
    return getDefaultQuestions();
  }
}

// Export functions for curriculum and guest feedback
export async function getCurriculumFeedbackQuestions(): Promise<Question[]> {
  try {
    // Get the existing "Curriculum Feedback 2023-24" type based on the database
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

export async function getGuestFeedbackQuestions(): Promise<Question[]> {
  try {
    // Get the existing "Guest Curriculum Feedback" type based on the database
    const feedbackType = await prisma.feedBack_Name.findFirst({
      where: {
        name: {
          contains: "Guest Curriculum Feedback",
        },
      },
    });

    if (!feedbackType) {
      console.error("Guest Feedback type not found in database");
      return getDefaultGuestQuestions();
    }

    // Fetch questions for guest feedback
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
      return getDefaultGuestQuestions();
    }

    return questions.map((q, index) => ({
      id: `Q${index + 1}`,
      text: q.question,
      type: "rating",
    }));
  } catch (error) {
    console.error("Error fetching guest feedback questions:", error);
    return getDefaultGuestQuestions();
  }
}

// Export function to check if student has already submitted feedback
export async function hasStudentSubmittedFeedback(
  studentId: string,
  feedbackTypeName: string
): Promise<boolean> {
  try {
    // Get feedback type ID
    const feedbackType = await prisma.feedBack_Name.findFirst({
      where: {
        name: {
          contains: feedbackTypeName,
        },
      },
    });

    if (!feedbackType) {
      console.error(`Feedback type ${feedbackTypeName} not found`);
      return false;
    }

    // Check if student has submitted this feedback type
    const feedbackCount = await prisma.feedback.count({
      where: {
        student_ID: studentId,
        feedback_name_ID: feedbackType.Feedback_Name_ID,
        isValid: 1,
      },
    });

    return feedbackCount > 0;
  } catch (error) {
    console.error(
      `Error checking if student submitted ${feedbackTypeName}:`,
      error
    );
    return false;
  }
}

// Submit curriculum or guest feedback
export async function submitGeneralFeedback(
  studentId: string,
  feedbackTypeName: string,
  responses: Record<string, number | string>
): Promise<boolean> {
  try {
    // Get the feedback type ID
    const feedbackType = await prisma.feedBack_Name.findFirst({
      where: {
        name: {
          contains: feedbackTypeName,
        },
      },
    });

    if (!feedbackType) {
      console.error(`Feedback type ${feedbackTypeName} not found`);
      return false;
    }

    // Get student info
    const student = await prisma.student.findUnique({
      where: {
        Student_ID: studentId,
      },
    });

    if (!student) {
      console.error("Student not found");
      return false;
    }

    // Check if student has already submitted this feedback type
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        student_ID: studentId,
        feedback_name_ID: feedbackType.Feedback_Name_ID,
        isValid: 1,
      },
    });

    if (existingFeedback) {
      console.error(`Student has already submitted ${feedbackTypeName}`);
      return false;
    }

    // Get questions for this feedback type
    const questions = await prisma.questions.findMany({
      where: {
        feedback_ID: feedbackType.Feedback_Name_ID,
      },
    });

    if (questions.length === 0) {
      console.error(`No questions found for ${feedbackTypeName}`);
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
        // Create the base data object without the nullable fields
        const feedbackData: any = {
          Feedback_ID: crypto.randomUUID(),
          feedback_name_ID: feedbackType.Feedback_Name_ID,
          student_ID: studentId,
          question_ID: question.Question_ID,
          answer: responses[questionKey].toString(),
          timestamp: new Date(),
          isValid: 1,
        };

        // For SQLite, we need to omit null/undefined fields rather than setting them to null/undefined
        // This is because SQLite doesn't directly support undefined values

        // Create the feedback entry
        await prisma.feedback.create({
          data: feedbackData,
        });
      }
    }

    // If the feedback includes a text response that could be considered a remark
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
          branch: student.branch,
          timestamp: new Date(),
        },
      });
    }

    return true;
  } catch (error) {
    console.error(`Error submitting ${feedbackTypeName}:`, error);
    return false;
  }
}

// Submit feedback for faculty-subject combinations
export async function submitFeedback(
  studentId: string,
  feedbackData: {
    facultyId: string;
    subjectId: string;
    responses: Record<string, number | string>;
  }[],
  additionalRemarks?: string
): Promise<boolean> {
  try {
    // First, check if the student has already submitted valid feedback for any of these combinations
    const existingFeedback = await prisma.feedback.findMany({
      where: {
        student_ID: studentId,
        isValid: 1,
        OR: feedbackData.map((item) => ({
          AND: [{ faculty_ID: item.facultyId }, { subject_ID: item.subjectId }],
        })),
      },
      distinct: ["faculty_ID", "subject_ID"],
    });

    // If there's already valid feedback for any of these combinations, prevent submission
    if (existingFeedback.length > 0) {
      console.error(
        "Feedback already exists for some faculty-subject combinations"
      );
      return false;
    }

    // Get the feedback name ID for faculty feedback
    const facultyFeedbackType = await prisma.feedBack_Name.findFirst({
      where: {
        name: {
          contains: "Faculty",
        },
      },
    });

    if (!facultyFeedbackType) {
      // Instead of throwing an error, log it and fallback to a safer method
      console.error(
        "Faculty feedback type not found, using first available feedback type"
      );

      // Get any available feedback type
      const anyFeedbackType = await prisma.feedBack_Name.findFirst();

      if (!anyFeedbackType) {
        console.error("No feedback types found at all");
        return false;
      }

      // Continue with the first available feedback type
      const fallbackFeedbackTypeId = anyFeedbackType.Feedback_Name_ID;

      // Get student branch
      const student = await prisma.student.findUnique({
        where: {
          Student_ID: studentId,
        },
      });

      if (!student) {
        console.error("Student not found");
        return false;
      }

      // Get all questions
      const questions = await prisma.questions.findMany({
        where: {
          feedback_ID: fallbackFeedbackTypeId,
        },
      });

      if (questions.length === 0) {
        console.error("No questions found for the feedback type");
        return false;
      }

      // Create all feedback entries
      for (const feedbackItem of feedbackData) {
        const { facultyId, subjectId, responses } = feedbackItem;

        // For each question, create a feedback entry
        for (const question of questions) {
          const questionId = question.Question_ID;
          const responseKey = Object.keys(responses)[0]; // Use any valid response if exact match not found

          if (responses[responseKey] !== null) {
            const feedbackData = {
              Feedback_ID: crypto.randomUUID(),
              feedback_name_ID: fallbackFeedbackTypeId,
              student_ID: studentId,
              faculty_ID: facultyId,
              subject_ID: subjectId,
              question_ID: questionId,
              answer: responses[responseKey].toString(),
              timestamp: new Date(),
              isValid: 1,
            };

            await prisma.feedback.create({
              data: feedbackData,
            });
          }
        }
      }

      // Handle remarks
      if (additionalRemarks && additionalRemarks.trim().length > 0) {
        await prisma.remarks.create({
          data: {
            Remark_ID: crypto.randomUUID(),
            remark: additionalRemarks,
            branch: student.branch,
            timestamp: new Date(),
          },
        });
      }

      return true;
    }

    // Continue with the normal flow if faculty feedback type was found
    // Get student branch
    const student = await prisma.student.findUnique({
      where: {
        Student_ID: studentId,
      },
    });

    if (!student) {
      console.error("Student not found");
      return false;
    }

    // Get all questions for reference
    const questions = await prisma.questions.findMany({
      where: {
        feedback_ID: facultyFeedbackType.Feedback_Name_ID,
      },
    });

    if (questions.length === 0) {
      console.error("No questions found for faculty feedback");
      return false;
    }

    // Create all feedback entries
    for (const feedbackItem of feedbackData) {
      const { facultyId, subjectId, responses } = feedbackItem;

      // For each question, create a feedback entry
      for (const question of questions) {
        // Fix the questionId mapping issue
        // Use the question's position in the array instead of a complex function
        const questionIndex = questions.indexOf(question);
        const questionKey = `Q${questionIndex + 1}`;

        if (
          responses[questionKey] !== undefined &&
          responses[questionKey] !== null
        ) {
          const feedbackData = {
            Feedback_ID: crypto.randomUUID(),
            feedback_name_ID: facultyFeedbackType.Feedback_Name_ID,
            student_ID: studentId,
            faculty_ID: facultyId,
            subject_ID: subjectId,
            question_ID: question.Question_ID,
            answer: responses[questionKey].toString(),
            timestamp: new Date(),
            isValid: 1,
          };

          await prisma.feedback.create({
            data: feedbackData,
          });
        }
      }
    }

    // After creating feedback, update all feedback entries for this student to valid
    const updateResult = await prisma.feedback.updateMany({
      where: {
        student_ID: studentId,
        isValid: 0,
      },
      data: {
        isValid: 1,
      },
    });

    console.log(`Updated ${updateResult.count} feedback entries to isValid=1`);

    // If there are additional remarks, save them separately
    if (additionalRemarks && additionalRemarks.trim().length > 0) {
      await prisma.remarks.create({
        data: {
          Remark_ID: crypto.randomUUID(),
          remark: additionalRemarks,
          branch: student.branch,
          timestamp: new Date(),
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return false;
  }
}
