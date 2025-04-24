"use server";

import prisma from "@/prisma/client";

export interface FeedbackStats {
  submitted: number;
  total: number;
  percentage: number;
}

export interface AnalyticsData {
  facultyFeedbackStats: FeedbackStats;
  curriculumFeedbackStats: FeedbackStats;
  totalStudents: number;
  totalFaculty: number;
  pendingSubmissions: number;
  totalSubjects: number;
  branch: string | null;
}

export async function getAnalyticsData(branch: string): Promise<AnalyticsData> {
  try {
    // Get total students for this branch
    const totalStudents = await prisma.student.count({
      where: {
        branch: branch,
      },
    });

    // Get total faculty for this branch
    const totalFaculty = await prisma.faculty.count({
      where: {
        user: {
          branch: branch,
        },
      },
    });

    // Get total subjects related to this branch
    const totalSubjects = await prisma.subject.count({
      where: {
        facultySubjects: {
          some: {
            faculty: {
              user: {
                branch: branch,
              },
            },
          },
        },
      },
    });

    // Get faculty feedback stats
    const facultyFeedbackName = await prisma.feedBack_Name.findFirst({
      where: { name: { contains: "Faculty" } },
    });

    let facultyFeedbackStats: FeedbackStats = {
      submitted: 0,
      total: 0,
      percentage: 0,
    };

    if (facultyFeedbackName) {
      // Count submitted faculty feedback for this branch - get unique student IDs who submitted feedback
      const studentsWithFeedback = await prisma.feedback.findMany({
        where: {
          feedback_name_ID: facultyFeedbackName.Feedback_Name_ID,
          student: {
            branch: branch,
          },
        },
        select: {
          student_ID: true,
        },
        distinct: ["student_ID"],
      });

      // Get unique student IDs - we don't need to do this now that we're using distinct
      const submittedFacultyFeedback = studentsWithFeedback.length;

      // The total should be based on the number of students in the branch, not (students × faculty)
      // This is because each student only needs to submit one feedback form, not one per faculty
      facultyFeedbackStats = {
        submitted: submittedFacultyFeedback,
        total: totalStudents,
        percentage:
          totalStudents > 0
            ? Math.round((submittedFacultyFeedback / totalStudents) * 100)
            : 0,
      };
    }

    // Get curriculum feedback stats
    const curriculumFeedbackName = await prisma.feedBack_Name.findFirst({
      where: { name: { contains: "Curriculum" } },
    });

    let curriculumFeedbackStats: FeedbackStats = {
      submitted: 0,
      total: 0,
      percentage: 0,
    };

    if (curriculumFeedbackName) {
      // Count submitted curriculum feedback for this branch
      const studentsWithCurriculumFeedback = await prisma.feedback.findMany({
        where: {
          feedback_name_ID: curriculumFeedbackName.Feedback_Name_ID,
          student: {
            branch: branch,
          },
        },
        select: {
          student_ID: true,
        },
        distinct: ["student_ID"],
      });

      // Use the count directly since we're using distinct
      const submittedCurriculumFeedback = studentsWithCurriculumFeedback.length;

      curriculumFeedbackStats = {
        submitted: submittedCurriculumFeedback,
        total: totalStudents,
        percentage:
          totalStudents > 0
            ? Math.round((submittedCurriculumFeedback / totalStudents) * 100)
            : 0,
      };
    }

    // Calculate pending submissions
    const pendingSubmissions = Math.max(
      0,
      facultyFeedbackStats.total - facultyFeedbackStats.submitted
    );

    return {
      facultyFeedbackStats,
      curriculumFeedbackStats,
      totalStudents,
      totalFaculty,
      pendingSubmissions,
      totalSubjects,
      branch,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
}
