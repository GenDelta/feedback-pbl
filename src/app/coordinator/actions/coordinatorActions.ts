"use server";

import prisma from "@/prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function getCurrentCoordinatorBranch(): Promise<string | null> {
  try {
    // Get the current session
    const session = await auth();

    if (!session || !session.user?.email) {
      throw new Error("Not authenticated");
    }

    // Find the user with coordinator role
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        role: "coordinator",
      },
    });

    if (!user) {
      throw new Error("User not found or not a coordinator");
    }

    // Return the branch of the coordinator
    return user.branch || null;
  } catch (error) {
    console.error("Error fetching coordinator branch:", error);
    return null;
  }
}

// Updated type definitions to match the schema
export interface Subject {
  id: string;
  name: string;
  type: string;
  batch: string | null; // Changed from academicYear to batch to be more accurate
  feedbackName_ID: string | null;
}

// Function to fetch all subjects
export async function getAllSubjects(): Promise<Subject[]> {
  try {
    // Get all subjects with their faculty-subject relationships
    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        facultySubjects: {
          select: {
            batch: true,
          },
        },
      },
    });

    // Transform the data to match our interface
    return subjects.map((subject) => {
      // Get the batch from facultySubjects if available
      const batch =
        subject.facultySubjects.length > 0
          ? subject.facultySubjects[0].batch
          : null;

      return {
        id: subject.Subject_ID,
        name: subject.name,
        type: subject.type,
        batch: batch,
        feedbackName_ID: subject.feedbackName_ID,
      };
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}

// Function to search subjects with filters - fixed for SQLite compatibility
export async function searchSubjects(
  nameQuery: string = "",
  typeQuery: string = "",
  batchQuery: string = ""
): Promise<Subject[]> {
  try {
    // For SQLite, we'll do a simpler query without case-insensitive mode
    // and filter more precisely in JavaScript
    const subjects = await prisma.subject.findMany({
      where: {
        name: nameQuery
          ? {
              contains: nameQuery,
            }
          : undefined,
        type: typeQuery
          ? {
              contains: typeQuery,
            }
          : undefined,
      },
      orderBy: {
        name: "asc",
      },
      include: {
        facultySubjects: {
          select: {
            batch: true,
          },
        },
      },
    });

    // Transform and filter the results with case-insensitive filtering in JS
    const transformedSubjects = subjects.map((subject) => {
      const batch =
        subject.facultySubjects.length > 0
          ? subject.facultySubjects[0].batch
          : null;

      return {
        id: subject.Subject_ID,
        name: subject.name,
        type: subject.type,
        batch: batch,
        feedbackName_ID: subject.feedbackName_ID,
      };
    });

    // Apply additional case-insensitive filtering in JavaScript
    // for more precise matching and to handle the batch filter
    return transformedSubjects.filter((subject) => {
      const nameMatch =
        !nameQuery ||
        subject.name.toLowerCase().includes(nameQuery.toLowerCase());

      const typeMatch =
        !typeQuery ||
        subject.type.toLowerCase().includes(typeQuery.toLowerCase());

      const batchMatch =
        !batchQuery ||
        (subject.batch &&
          subject.batch.toLowerCase().includes(batchQuery.toLowerCase()));

      return nameMatch && typeMatch && batchMatch;
    });
  } catch (error) {
    console.error("Error searching subjects:", error);
    return [];
  }
}

// Interface for student data
export interface Student {
  id: string;
  name: string;
  email: string;
  branch: string;
  semester: number;
  department: string;
  prn: string;
}

// Function to fetch students by branch
export async function getStudentsByBranch(branch: string): Promise<Student[]> {
  try {
    // First get all users with student role and the specified branch
    const users = await prisma.user.findMany({
      where: {
        role: "student",
        branch: branch,
      },
      include: {
        student: true, // Include the related student record
      },
      orderBy: {
        name: "asc",
      },
    });

    // Map and sanitize the data
    return users
      .filter((user) => user.student) // Only include users that have a student record
      .map((user) => {
        return {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          branch: user.student?.branch || "",
          semester: user.student?.semester || 0,
          department: user.student?.department || "",
          prn: user.student?.PRN || "",
        };
      });
  } catch (error) {
    console.error("Error fetching students by branch:", error);
    return [];
  }
}

// Function to convert student data to CSV - making it async for server action compatibility
export async function convertStudentsToCSV(
  students: Student[]
): Promise<string> {
  // CSV header
  const header = "Name,Email,Branch,Department,Semester,PRN\n";

  // Convert each student to a CSV row
  const rows = students
    .map(
      (student) =>
        `${student.name},${student.email},${student.branch},${student.department},${student.semester},${student.prn}`
    )
    .join("\n");

  return header + rows;
}

// Interface for faculty data
export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
}

// Function to fetch faculty by department/branch
export async function getFacultyByDepartment(
  department: string
): Promise<Faculty[]> {
  try {
    // Get users with faculty role in the specified department
    const users = await prisma.user.findMany({
      where: {
        role: "faculty",
        branch: department, // Using branch field to filter by department
      },
      include: {
        faculty: true, // Include the related faculty record
      },
      orderBy: {
        name: "asc",
      },
    });

    // Map and sanitize the data
    return users
      .filter((user) => user.faculty) // Only include users that have a faculty record
      .map((user) => {
        return {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          department: user.faculty?.department || "",
        };
      });
  } catch (error) {
    console.error("Error fetching faculty by department:", error);
    return [];
  }
}

// Function to convert faculty data to CSV
export async function convertFacultyToCSV(faculty: Faculty[]): Promise<string> {
  // CSV header
  const header = "Name,Email,Department\n";

  // Convert each faculty to a CSV row
  const rows = faculty
    .map((teacher) => `${teacher.name},${teacher.email},${teacher.department}`)
    .join("\n");

  return header + rows;
}

// Interface for students who haven't submitted feedback
export interface StudentWithoutFeedback {
  id: string;
  name: string;
  email: string;
  prn: string;
  semester: number;
}

// Function to get students who haven't submitted feedback yet
export async function getStudentsWithoutFeedback(
  branch: string
): Promise<StudentWithoutFeedback[]> {
  try {
    // Get all students from the specified branch
    const students = await prisma.user.findMany({
      where: {
        role: "student",
        branch: branch,
      },
      include: {
        student: {
          include: {
            feedbacks: {
              where: {
                faculty_ID: { not: null }, // Only consider faculty feedback
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Filter for students without feedback submissions
    return students
      .filter(
        (user) =>
          user.student &&
          (!user.student.feedbacks || user.student.feedbacks.length === 0)
      )
      .map((user) => {
        return {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          prn: user.student?.PRN || "",
          semester: user.student?.semester || 0,
        };
      });
  } catch (error) {
    console.error("Error fetching students without feedback:", error);
    return [];
  }
}

// Function to convert students without feedback to CSV
export async function convertStudentsWithoutFeedbackToCSV(
  students: StudentWithoutFeedback[]
): Promise<string> {
  // CSV header
  const header = "Name,Email,PRN,Semester\n";

  // Convert each student to a CSV row
  const rows = students
    .map(
      (student) =>
        `${student.name},${student.email},${student.prn},${student.semester}`
    )
    .join("\n");

  return header + rows;
}

// Interface for feedback data
export interface FeedbackData {
  studentName: string;
  prn: string;
  semester: number;
  batch: string;
  teacherName: string;
  subjectName: string;
  answers: { [key: string]: string };
  average: number;
}

// Function to get submitted feedback data by branch
export async function getFeedbackByBranch(
  branch: string
): Promise<FeedbackData[]> {
  try {
    // Get all feedback entries with related data where the student is from the specified branch
    const feedbacks = await prisma.feedback.findMany({
      where: {
        student: {
          branch: branch,
        },
        faculty_ID: { not: null },
        subject_ID: { not: null },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        faculty: {
          include: {
            user: true,
          },
        },
        subject: true,
        question: true,
      },
      orderBy: [
        { student_ID: "asc" },
        { faculty_ID: "asc" },
        { subject_ID: "asc" },
      ],
    });

    // Group feedback by student-faculty-subject combination
    const feedbackGroups: { [key: string]: FeedbackData } = {};

    for (const feedback of feedbacks) {
      if (!feedback.student || !feedback.faculty || !feedback.subject) continue;

      const groupKey = `${feedback.student_ID}-${feedback.faculty_ID}-${feedback.subject_ID}`;

      if (!feedbackGroups[groupKey]) {
        feedbackGroups[groupKey] = {
          studentName: feedback.student.user.name,
          prn: feedback.student.PRN,
          semester: feedback.student.semester,
          batch: feedback.student.branch, // Using branch as batch
          teacherName: feedback.faculty.user.name,
          subjectName: feedback.subject.name,
          answers: {},
          average: 0,
        };
      }

      // Add this answer to the group
      feedbackGroups[groupKey].answers[`Q${feedback.question.question}`] =
        feedback.answer;
    }

    // Calculate averages and convert to array
    return Object.values(feedbackGroups).map((group) => {
      // Calculate average of numerical answers
      const numericAnswers = Object.values(group.answers)
        .filter((answer) => !isNaN(Number(answer)))
        .map((answer) => Number(answer));

      if (numericAnswers.length > 0) {
        const sum = numericAnswers.reduce((a, b) => a + b, 0);
        group.average = parseFloat((sum / numericAnswers.length).toFixed(2));
      }

      return group;
    });
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    return [];
  }
}

// Function to convert feedback data to CSV
export async function convertFeedbackToCSV(
  feedbackData: FeedbackData[]
): Promise<string> {
  if (feedbackData.length === 0) {
    return "No feedback data available";
  }

  // Get all possible question keys across all feedback entries
  const allQuestionKeys = new Set<string>();
  feedbackData.forEach((feedback) => {
    Object.keys(feedback.answers).forEach((key) => allQuestionKeys.add(key));
  });

  // Sort question keys to ensure consistent order (Q1, Q2, etc.)
  const sortedQuestionKeys = Array.from(allQuestionKeys).sort((a, b) => {
    const numA = parseInt(a.replace("Q", ""));
    const numB = parseInt(b.replace("Q", ""));
    return numA - numB;
  });

  // Create CSV header
  const headerRow = [
    "Student Name",
    "PRN",
    "Semester",
    "Batch",
    "Teacher Name",
    "Subject",
    ...sortedQuestionKeys,
    "Average",
  ].join(",");

  // Create CSV rows
  const dataRows = feedbackData.map((feedback) => {
    const questionValues = sortedQuestionKeys.map(
      (key) => feedback.answers[key] || ""
    );

    return [
      feedback.studentName,
      feedback.prn,
      feedback.semester,
      feedback.batch,
      feedback.teacherName,
      feedback.subjectName,
      ...questionValues,
      feedback.average,
    ].join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

// Interface for remarks data
export interface RemarkData {
  remark: string;
  timestamp: Date;
}

// Function to get remarks by branch
export async function getRemarksByBranch(
  branch: string
): Promise<RemarkData[]> {
  try {
    // Get all remarks for the specified branch
    const remarks = await prisma.remarks.findMany({
      where: {
        branch: branch,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // Map to our interface
    return remarks.map((remark) => ({
      remark: remark.remark,
      timestamp: remark.timestamp,
    }));
  } catch (error) {
    console.error("Error fetching remarks by branch:", error);
    return [];
  }
}

// Function to convert remarks to CSV
export async function convertRemarksToCSV(
  remarks: RemarkData[]
): Promise<string> {
  if (remarks.length === 0) {
    return "No remarks available";
  }

  // Create CSV header
  const header = "Remark,Timestamp";

  // Create CSV rows
  const rows = remarks.map((remark) => {
    // Format the date for better readability
    const formattedDate = remark.timestamp.toLocaleString();

    // Escape any commas in the remark by enclosing in quotes
    const escapedRemark = remark.remark.includes(",")
      ? `"${remark.remark.replace(/"/g, '""')}"` // Replace " with "" for CSV escaping
      : remark.remark;

    return `${escapedRemark},${formattedDate}`;
  });

  return [header, ...rows].join("\n");
}

// Interface for consolidated feedback data
export interface ConsolidatedFeedbackData {
  facultyName: string;
  subjectName: string;
  scores: { [key: string]: number };
  average: number;
}

// Function to get consolidated feedback data by branch
export async function getConsolidatedFeedbackByBranch(
  branch: string
): Promise<ConsolidatedFeedbackData[]> {
  try {
    // Get all feedback entries with related data for faculty in the specified branch
    const feedbacks = await prisma.feedback.findMany({
      where: {
        faculty: {
          user: {
            branch: branch,
          },
        },
        faculty_ID: { not: null },
        subject_ID: { not: null },
      },
      include: {
        faculty: {
          include: {
            user: true,
          },
        },
        subject: true,
        question: true,
      },
      orderBy: [{ faculty_ID: "asc" }, { subject_ID: "asc" }],
    });

    // Group feedback by faculty-subject combination
    const feedbackGroups: {
      [key: string]: {
        facultyName: string;
        subjectName: string;
        scoresByQuestion: { [key: string]: number[] };
      };
    } = {};

    for (const feedback of feedbacks) {
      if (!feedback.faculty || !feedback.subject) continue;

      const groupKey = `${feedback.faculty_ID}-${feedback.subject_ID}`;

      if (!feedbackGroups[groupKey]) {
        feedbackGroups[groupKey] = {
          facultyName: feedback.faculty.user.name,
          subjectName: feedback.subject.name,
          scoresByQuestion: {},
        };
      }

      // Skip non-numeric answers
      const numericAnswer = Number(feedback.answer);
      if (isNaN(numericAnswer)) continue;

      // Create question key (Q1, Q2, etc.)
      const questionKey = `${feedback.question.question}`;

      // Initialize array for this question if it doesn't exist
      if (!feedbackGroups[groupKey].scoresByQuestion[questionKey]) {
        feedbackGroups[groupKey].scoresByQuestion[questionKey] = [];
      }

      // Add this score to the appropriate question array
      feedbackGroups[groupKey].scoresByQuestion[questionKey].push(
        numericAnswer
      );
    }

    // Calculate average scores for each question and overall
    return Object.values(feedbackGroups).map((group) => {
      const consolidatedData: ConsolidatedFeedbackData = {
        facultyName: group.facultyName,
        subjectName: group.subjectName,
        scores: {},
        average: 0,
      };

      let totalScore = 0;
      let totalQuestions = 0;

      // Calculate average for each question
      Object.entries(group.scoresByQuestion).forEach(
        ([questionKey, scores]) => {
          if (scores.length > 0) {
            const questionAvg =
              scores.reduce((sum, score) => sum + score, 0) / scores.length;
            consolidatedData.scores[questionKey] = parseFloat(
              questionAvg.toFixed(2)
            );
            totalScore += questionAvg;
            totalQuestions++;
          }
        }
      );

      // Calculate overall average
      if (totalQuestions > 0) {
        consolidatedData.average = parseFloat(
          (totalScore / totalQuestions).toFixed(2)
        );
      }

      return consolidatedData;
    });
  } catch (error) {
    console.error("Error fetching consolidated feedback data:", error);
    return [];
  }
}

// Function to convert consolidated feedback data to CSV
export async function convertConsolidatedFeedbackToCSV(
  feedbackData: ConsolidatedFeedbackData[]
): Promise<string> {
  if (feedbackData.length === 0) {
    return "No consolidated feedback data available";
  }

  // Get all possible question keys across all feedback entries
  const allQuestionKeys = new Set<string>();
  feedbackData.forEach((feedback) => {
    Object.keys(feedback.scores).forEach((key) => allQuestionKeys.add(key));
  });

  // Sort question keys to ensure consistent order (Q1, Q2, etc.)
  const sortedQuestionKeys = Array.from(allQuestionKeys).sort((a, b) => {
    const numA = parseInt(a.replace("Q", ""));
    const numB = parseInt(b.replace("Q", ""));
    return numA - numB;
  });

  // Create CSV header
  const headerRow = [
    "Faculty Name",
    "Subject",
    ...sortedQuestionKeys,
    "Average",
  ].join(",");

  // Create CSV rows
  const dataRows = feedbackData.map((feedback) => {
    const questionValues = sortedQuestionKeys.map(
      (key) => feedback.scores[key] || ""
    );

    return [
      feedback.facultyName,
      feedback.subjectName,
      ...questionValues,
      feedback.average,
    ].join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

// Interface for complete feedback data (faculty with overall average)
export interface CompleteFeedbackData {
  facultyName: string;
  average: number;
}

// Function to get complete feedback data by branch
export async function getCompleteFeedbackByBranch(
  branch: string
): Promise<CompleteFeedbackData[]> {
  try {
    // Get all feedback entries with related data for faculty in the specified branch
    const feedbacks = await prisma.feedback.findMany({
      where: {
        faculty: {
          user: {
            branch: branch,
          },
        },
        faculty_ID: { not: null }, // Ensure we only get entries with a faculty_ID
      },
      include: {
        faculty: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [{ faculty_ID: "asc" }],
    });

    // Group feedback by faculty
    const facultyScores: {
      [key: string]: {
        facultyName: string;
        scores: number[];
      };
    } = {};

    for (const feedback of feedbacks) {
      // Skip if faculty is null or faculty_ID is null
      if (!feedback.faculty || !feedback.faculty_ID) continue;

      const facultyId = feedback.faculty_ID;

      if (!facultyScores[facultyId]) {
        facultyScores[facultyId] = {
          facultyName: feedback.faculty.user.name,
          scores: [],
        };
      }

      // Skip non-numeric answers
      const numericAnswer = Number(feedback.answer);
      if (!isNaN(numericAnswer)) {
        facultyScores[facultyId].scores.push(numericAnswer);
      }
    }

    // Calculate average scores for each faculty
    return Object.values(facultyScores).map((faculty) => {
      const completeFeedback: CompleteFeedbackData = {
        facultyName: faculty.facultyName,
        average: 0,
      };

      // Calculate overall average if scores exist
      if (faculty.scores.length > 0) {
        const sum = faculty.scores.reduce((acc, score) => acc + score, 0);
        completeFeedback.average = parseFloat(
          (sum / faculty.scores.length).toFixed(2)
        );
      }

      return completeFeedback;
    });
  } catch (error) {
    console.error("Error fetching complete feedback data:", error);
    return [];
  }
}

// Function to convert complete feedback data to CSV
export async function convertCompleteFeedbackToCSV(
  feedbackData: CompleteFeedbackData[]
): Promise<string> {
  if (feedbackData.length === 0) {
    return "No complete feedback data available";
  }

  // Create CSV header
  const header = "Faculty Name,Average";

  // Create CSV rows
  const rows = feedbackData
    .map((feedback) => `${feedback.facultyName},${feedback.average}`)
    .join("\n");

  return [header, rows].join("\n");
}

// Interface for curriculum feedback data
export interface CurriculumFeedbackData {
  studentName: string;
  prn: string;
  semester: number;
  branch: string;
  answers: { [key: string]: string };
  average: number;
}

// Function to get curriculum feedback data by branch
export async function getCurriculumFeedbackByBranch(
  branch: string
): Promise<CurriculumFeedbackData[]> {
  try {
    // Get all curriculum feedback entries (where faculty_ID and subject_ID are null) for students in the specified branch
    const feedbacks = await prisma.feedback.findMany({
      where: {
        student: {
          branch: branch,
        },
        faculty_ID: null, // Curriculum feedback has no faculty
        subject_ID: null, // Curriculum feedback has no subject
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        question: true,
      },
      orderBy: [{ student_ID: "asc" }],
    });

    // Group feedback by student
    const feedbackGroups: { [key: string]: CurriculumFeedbackData } = {};

    for (const feedback of feedbacks) {
      if (!feedback.student || !feedback.student_ID) continue;

      const studentId = feedback.student_ID;

      if (!feedbackGroups[studentId]) {
        feedbackGroups[studentId] = {
          studentName: feedback.student.user.name,
          prn: feedback.student.PRN,
          semester: feedback.student.semester,
          branch: feedback.student.branch,
          answers: {},
          average: 0,
        };
      }

      // Add this answer to the group with Q prefix
      feedbackGroups[studentId].answers[`Q${feedback.question.question}`] =
        feedback.answer;
    }

    // Calculate averages and convert to array
    return Object.values(feedbackGroups).map((group) => {
      // Calculate average of numerical answers
      const numericAnswers = Object.values(group.answers)
        .filter((answer) => !isNaN(Number(answer)))
        .map((answer) => Number(answer));

      if (numericAnswers.length > 0) {
        const sum = numericAnswers.reduce((a, b) => a + b, 0);
        group.average = parseFloat((sum / numericAnswers.length).toFixed(2));
      }

      return group;
    });
  } catch (error) {
    console.error("Error fetching curriculum feedback data:", error);
    return [];
  }
}

// Function to convert curriculum feedback data to CSV
export async function convertCurriculumFeedbackToCSV(
  feedbackData: CurriculumFeedbackData[]
): Promise<string> {
  if (feedbackData.length === 0) {
    return "No curriculum feedback data available";
  }

  // Get all possible question keys across all feedback entries
  const allQuestionKeys = new Set<string>();
  feedbackData.forEach((feedback) => {
    Object.keys(feedback.answers).forEach((key) => allQuestionKeys.add(key));
  });

  // Sort question keys to ensure consistent order (Q1, Q2, etc.)
  const sortedQuestionKeys = Array.from(allQuestionKeys).sort((a, b) => {
    const numA = parseInt(a.replace("Q", ""));
    const numB = parseInt(b.replace("Q", ""));
    return numA - numB;
  });

  // Create CSV header
  const headerRow = [
    "Student Name",
    "PRN",
    "Semester",
    ...sortedQuestionKeys,
    "Average",
  ].join(",");

  // Create CSV rows
  const dataRows = feedbackData.map((feedback) => {
    const questionValues = sortedQuestionKeys.map(
      (key) => feedback.answers[key] || ""
    );

    return [
      feedback.studentName,
      feedback.prn,
      feedback.semester,
      ...questionValues,
      feedback.average,
    ].join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

// Function to get students who haven't submitted curriculum feedback yet
export async function getStudentsWithoutCurriculumFeedback(
  branch: string
): Promise<StudentWithoutFeedback[]> {
  try {
    // Get all students from the specified branch
    const students = await prisma.user.findMany({
      where: {
        role: "student",
        branch: branch,
      },
      include: {
        student: {
          include: {
            feedbacks: {
              where: {
                faculty_ID: null, // Curriculum feedback has no faculty
                subject_ID: null, // Curriculum feedback has no subject
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Filter for students without curriculum feedback submissions
    return students
      .filter(
        (user) =>
          user.student &&
          (!user.student.feedbacks || user.student.feedbacks.length === 0)
      )
      .map((user) => {
        return {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          prn: user.student?.PRN || "",
          semester: user.student?.semester || 0,
        };
      });
  } catch (error) {
    console.error(
      "Error fetching students without curriculum feedback:",
      error
    );
    return [];
  }
}
