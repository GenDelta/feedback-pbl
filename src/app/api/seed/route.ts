import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";

async function GET() {
  try {
    console.log("Emptying feedback table...");

    // Empty the feedback table first
    const deletedCount = await prisma.feedback.deleteMany({});
    console.log(
      `Deleted ${deletedCount.count} feedback records from the database`
    );

    // No longer creating feedback types or questions since they've already been seeded

    return new Response(
      `Successfully emptied feedback table (${deletedCount.count} records deleted).`
    );
  } catch (error: any) {
    console.error("Error in operation:", error);
    return new Response(
      `Error in operation: ${error?.message || "Unknown error"}`,
      { status: 500 }
    );
  }
}

export { GET };
