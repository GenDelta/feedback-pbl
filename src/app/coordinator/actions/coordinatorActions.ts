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
