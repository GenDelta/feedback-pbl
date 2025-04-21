"use client";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export const Redirector = () => {
    const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return redirect("/");
  }
  //@ts-expect-error
  if (session?.user.role === "guest") {
    return redirect("/guest/dashboard");
  }
  //@ts-expect-error
  else if (session?.user.role === "student") {
    return redirect("/student/dashboard");
  }
  //@ts-expect-error
  else if (session?.user.role === "coordinator") {
    return redirect("/coordinator/dashboard");
  }
  //@ts-expect-error
  else if (session?.user.role === "admin") {
    return redirect("/admin/dashboard");
  }
  //@ts-expect-error
  else if (session?.user.role === "faculty") {
    return redirect("/faculty/page");
  }
  else {
    //@ts-expect-error
    throw error("Invalid user role" + session?.user.role);
  }
}