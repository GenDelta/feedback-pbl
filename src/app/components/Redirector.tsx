"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Redirector = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      return router.push("/");
    }
    if (session?.user.role === "guest") {
      return router.push("/guest/dashboard");
    } else if (session?.user.role === "student") {
      return router.push("/student/dashboard");
    } else if (session?.user.role === "coordinator") {
      return router.push("/coordinator/dashboard");
    } else if (session?.user.role === "admin") {
      return router.push("/admin/dashboard");
    } else if (session?.user.role === "faculty") {
      return router.push("/faculty/page");
    } else {
      throw new Error("Invalid user role" + session?.user.role);
    }
  }, [session, router]);
  return <></>;
};
