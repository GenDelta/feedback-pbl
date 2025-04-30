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

/**
 * Gets the current visibility state for a specific feature
 */
export async function getVisibilityState(name: string): Promise<number> {
  try {
    const result = await prisma.$queryRaw`
      SELECT State FROM Visibility_State WHERE Visibility_Name = ${name}
    `;

    // Return the state if found, otherwise default to 1 (visible)
    if (Array.isArray(result) && result.length > 0) {
      return result[0].State;
    }
    return 1;
  } catch (error) {
    console.error(`Error fetching visibility state for ${name}:`, error);
    return 1; // Default to visible in case of error
  }
}

/**
 * Updates the visibility state for a specific feature
 */
export async function updateVisibilityState(
  name: string,
  state: number
): Promise<boolean> {
  try {
    await prisma.$executeRaw`
      UPDATE Visibility_State 
      SET State = ${state}
      WHERE Visibility_Name = ${name}
    `;

    return true;
  } catch (error) {
    console.error(`Error updating visibility state for ${name}:`, error);
    return false;
  }
}

/**
 * Gets all visibility states
 */
export async function getAllVisibilityStates(): Promise<
  { name: string; state: number }[]
> {
  try {
    const result = await prisma.$queryRaw`
      SELECT Visibility_Name as name, State as state FROM Visibility_State
    `;

    if (Array.isArray(result)) {
      return result as { name: string; state: number }[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching all visibility states:", error);
    return [];
  }
}
