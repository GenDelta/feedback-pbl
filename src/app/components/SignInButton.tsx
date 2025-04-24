"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import GoogleButton from "react-google-button";
import React from "react";
import { useRouter } from "next/navigation";

const SignInButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session && session.user) {
    return (
      <div className="flex gap-4 ml-auto">
        <button
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              signOut();
            } catch (error) {
              console.error("Error during logout:", error);
              signOut();
            }
          }}
          className="text-white bg-[#f03e65] hover:bg-[#d03050] rounded-md py-2 px-4 transition-colors duration-200"
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
