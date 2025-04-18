import background_login from "../../public/background_login.jpg";
import LoginFooter from "./components/LoginFooter";
import SignInButton from "./components/SignInButton";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center justify-center items-center flex"
      style={{ backgroundImage: `url(${background_login.src})` }}
    >
      <div className="bg-primary-dark bg-opacity-95 p-12 rounded-2xl justify-items-start">
        <h1 className="text-3xl text-white mx-auto my-3">Login</h1>
        <p className="text-gray-200 mx-auto mb-10">
          Please sign in to continue
        </p>
        <SignInButton />
        <div className="absolute bottom-0 left-0">
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
