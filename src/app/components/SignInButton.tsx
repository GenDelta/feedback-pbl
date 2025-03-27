"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import GoogleButton from "react-google-button";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignInButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user && session.user.email) {
      const email = session.user.email;
      if (email.endsWith("@sitpune.edu.in")) {
        if (email.includes("btech")) {
          router.push("/student/dashboard");
        } else if (email.includes("coordinator")) {
          router.push("/coordinator/dashboard");
        } else {
          router.push("/faculty/dashboard");
        }
      } else {
        router.push("/guest/dashboard");
      }
    }
  }, [session, router]);

  if (session && session.user) {
    return (
      <div className="flex gap-4 ml-auto">
        <button
          onClick={() => signOut()}
          className="text-white bg-buttons-primary rounded-xl py-2 px-2"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <GoogleButton type="dark" onClick={() => signIn()}>
      Sign In
    </GoogleButton>
  );
};

export default SignInButton;
