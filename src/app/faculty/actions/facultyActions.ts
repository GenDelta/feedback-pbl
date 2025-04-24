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
    const facultySubjects = await prisma.faculty_Subject.findMany({
      where: { Faculty_ID: facultyId },
      include: { subject: true },
    });

    const batches = [...new Set(facultySubjects.map((fs) => fs.batch))];

    const feedbacks = await prisma.feedback.findMany({
      where: {
        faculty_ID: facultyId,
      },
      include: {
        subject: true,
        student: true,
      },
    });

    const branches = [...new Set(feedbacks.map((f) => f.student.branch))];

    const subjectRatings = new Map<
      string,
      Map<string, Map<string, { sum: number; count: number }>>
    >();

    for (const feedback of feedbacks) {
      const subjectId = feedback.subject_ID;
      const subjectName = feedback.subject.name;
      const studentBranch = feedback.student.branch;

      const subjectInfo = facultySubjects.find(
        (fs) => fs.Subject_ID === subjectId
      );
      const batch = subjectInfo?.batch || "Unknown";

      const rating = parseFloat(feedback.answer);
      if (isNaN(rating)) continue;

      if (!subjectRatings.has(subjectName)) {
        subjectRatings.set(subjectName, new Map());
      }

      const batchMap = subjectRatings.get(subjectName)!;
      if (!batchMap.has(batch)) {
        batchMap.set(batch, new Map());
      }

      const branchMap = batchMap.get(batch)!;
      if (!branchMap.has(studentBranch)) {
        branchMap.set(studentBranch, { sum: 0, count: 0 });
      }

      const stats = branchMap.get(studentBranch)!;
      stats.sum += rating;
      stats.count += 1;
    }

    const feedbackData: FeedbackData[] = [];

    subjectRatings.forEach((batchMap, subject) => {
      batchMap.forEach((branchMap, batch) => {
        branchMap.forEach((stats, branch) => {
          feedbackData.push({
            subject,
            batch,
            branch,
            rating: stats.count > 0 ? stats.sum / stats.count : 0,
          });
        });
      });
    });

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

    const textFeedbacks = await prisma.feedback.findMany({
      where: {
        faculty_ID: facultyId,
        NOT: {
          answer: {
            in: ["1", "2", "3", "4", "5"],
          },
        },
        answer: {
          not: "",
        },
      },
      include: {
        subject: true,
        student: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    const branches = [...new Set(textFeedbacks.map((f) => f.student.branch))];

    const feedbackData: AdditionalFeedback[] = textFeedbacks.map((feedback) => {
      const subjectInfo = facultySubjects.find(
        (fs) => fs.Subject_ID === feedback.subject_ID
      );
      const batch = subjectInfo?.batch || "Unknown";

      return {
        id: feedback.Feedback_ID,
        subject: feedback.subject.name,
        batch,
        branch: feedback.student.branch,
        comment: feedback.answer,
        timestamp: feedback.timestamp.toISOString(),
      };
    });

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
