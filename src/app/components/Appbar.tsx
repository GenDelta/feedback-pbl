import React from "react";
import SignInButton from "./SignInButton";

const Appbar = () => {
  return (
    <header className="absolute top-0 right-0 w-svw flex gap-4 p-4 bg-transparent pr-8">
      <SignInButton />
    </header>
  );
};

export default Appbar;
