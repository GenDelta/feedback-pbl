"use server";

import prisma from "@/prisma/client";

export interface Coordinator {
  id: string;
  email: string;
  branch: string | null;
}

/**
 * Fetches all users with the coordinator role
 */
export async function getCoordinators(): Promise<Coordinator[]> {
  try {
    const coordinators = await prisma.user.findMany({
      where: {
        role: "coordinator",
      },
      select: {
        id: true,
        email: true,
        branch: true,
      },
      orderBy: {
        email: "asc",
      },
    });

    return coordinators;
  } catch (error) {
    console.error("Error fetching coordinators:", error);
    return [];
  }
}

/**
 * Adds a new coordinator
 */
export async function addCoordinator(
  email: string,
  branch: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If user exists but is not a coordinator, update their role
      if (existingUser.role !== "coordinator") {
        await prisma.user.update({
          where: { email },
          data: {
            role: "coordinator",
            branch,
          },
        });
        return { success: true, message: "User promoted to coordinator role" };
      } else {
        return {
          success: false,
          message: "This user is already a coordinator",
        };
      }
    }

    // Create a new user with coordinator role
    await prisma.user.create({
      data: {
        email,
        name: `Coordinator ${branch.toUpperCase()}`,
        role: "coordinator",
        branch,
      },
    });

    return { success: true, message: "Coordinator added successfully" };
  } catch (error) {
    console.error("Error adding coordinator:", error);
    return { success: false, message: "Failed to add coordinator" };
  }
}

/**
 * Deletes a coordinator
 */
export async function deleteCoordinator(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Option 1: Delete the user completely
    // await prisma.user.delete({
    //   where: { id },
    // });

    // Option 2: Just change their role (keeping the account)
    await prisma.user.update({
      where: { id },
      data: {
        role: "user",
        branch: null,
      },
    });

    return { success: true, message: "Coordinator removed successfully" };
  } catch (error) {
    console.error("Error deleting coordinator:", error);
    return { success: false, message: "Failed to remove coordinator" };
  }
}
