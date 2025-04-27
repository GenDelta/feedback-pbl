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
