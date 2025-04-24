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

    // First, check if there are ANY valid feedback entries for this student
    const existingFeedbackCount = await prisma.feedback.count({
      where: {
        student_ID: studentInfo.id,
        isValid: 1,
      },
    });

    console.log(
      `Found ${existingFeedbackCount} valid feedback entries for this student`
    );

    // If the student has already submitted any feedback, don't show the form
    if (existingFeedbackCount > 0) {
      console.log(
        "Student has already submitted feedback, returning empty array"
      );
      return [];
    }

    // Get the faculty-subject pairs relevant to this student's branch
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

    // Also get elective subjects if applicable
    const electiveSelections = await prisma.electives.findMany({
      where: {
        Student_ID: studentInfo.id,
      },
      include: {
        subject: true,
      },
    });

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

    // Combine regular and elective subjects
    const allFacultySubjects = [...facultySubjects, ...electiveFacultySubjects];

    console.log(`Total faculty-subjects: ${allFacultySubjects.length}`);

    // Map to the required format
    const result: FacultySubject[] = allFacultySubjects.map((fs) => ({
      facultyId: fs.faculty.Faculty_ID,
      facultyName: fs.faculty.user.name,
      subjectId: fs.subject.Subject_ID,
      subjectName: fs.subject.name,
      department: fs.faculty.department || "Unknown Department",
    }));

    // Apply a limit to prevent too many feedback pages
    return result.slice(0, 5);
  } catch (error) {
    console.error("Error fetching faculty subjects:", error);
    return [];
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

// Helper function to get default questions
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
            await prisma.feedback.create({
              data: {
                feedback_name_ID: fallbackFeedbackTypeId,
                student_ID: studentId,
                faculty_ID: facultyId,
                subject_ID: subjectId,
                question_ID: questionId,
                answer: responses[responseKey].toString(),
                timestamp: new Date(),
                isValid: 1, // Set the feedback as valid
              },
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
          await prisma.feedback.create({
            data: {
              feedback_name_ID: facultyFeedbackType.Feedback_Name_ID,
              student_ID: studentId,
              faculty_ID: facultyId,
              subject_ID: subjectId,
              question_ID: question.Question_ID,
              answer: responses[questionKey].toString(),
              timestamp: new Date(),
              isValid: 1, // Explicitly set isValid to 1
            },
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
