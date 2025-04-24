import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear all authentication-related cookies
    const cookieStore = await cookies();

    // Clear NextAuth.js session cookies
    cookieStore.delete("next-auth.session-token");
    cookieStore.delete("next-auth.csrf-token");
    cookieStore.delete("next-auth.callback-url");

    // Clear any other auth cookies that might be present
    cookieStore.delete("__Secure-next-auth.session-token");
    cookieStore.delete("__Host-next-auth.csrf-token");

    // Return success response with cookie clearing headers
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      {
        headers: {
          // Force expire the cookies in the browser as well
          "Set-Cookie":
            "next-auth.session-token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax, " +
            "next-auth.csrf-token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax, " +
            "next-auth.callback-url=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax",
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to logout" },
      { status: 500 }
    );
  }
}
