import { useSession } from "next-auth/react";
import background_login from "../../public/background_login.jpg";
import LoginFooter from "./components/LoginFooter";
import SignInButton from "./components/SignInButton";
import { Redirector } from "./components/Redirector";
import { auth } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    return <Redirector />;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center justify-center items-center flex"
      style={{ backgroundImage: `url(${background_login.src})` }}
    >
      {/* Enhanced background overlay with more visible gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-blue-900/20 to-black/40"></div>

      <div className="relative z-10">
        <div className="bg-primary-dark bg-opacity-95 p-12 rounded-2xl flex flex-col items-center shadow-lg animate-fadeIn">
          {/* Logo placeholder */}
          <div className="w-12 h-12 mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white/80"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-3xl text-white text-center my-3">Login</h1>
          <p className="text-gray-200 text-center mb-10">
            Please sign in to continue
          </p>

          <div className="w-full">
            <SignInButton />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full">
        <LoginFooter />
      </div>
    </div>
  );
}
