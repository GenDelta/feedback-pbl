import React from "react";
import Appbar from "../../components/Appbar";
import background_login from "../../../../public/background_login.jpg";
import curriculum from "../../../../public/curriculum.png";
import dashboard from "../../../../public/dashboard.png";
import Image from "next/image";
import GiveFeedbackButton from "@/app/components/GiveFeedbackButton";
import Footer from "@/app/components/Footer";

export default function FacultyDashboard() {
  return (
    <div
      className="min-h-svh bg-cover bg-center"
      style={{ backgroundImage: `url(${background_login.src})` }}
    >
      <Appbar />
      <div>
        <div className="flex flex-col align-middle items-center justify-center min-h-screen p-10">
          <div className="text-4xl text-white font-poppins font-light mb-8">
            Faculty Page
          </div>
          <div className="flex space-x-8 mt-4">
            <div className="bg-gray-700 rounded-lg p-8 flex flex-col items-center w-96 min-h-[28rem]">
              <Image
                src={dashboard}
                alt="teacher"
                width={300}
                height={300}
                className="mt-4"
              />
              <div className="text-gray-200 text-center text-xl font-poppins my-3">
                Dashboard
              </div>
              <div className="text-gray-200 text-center text-sm font-poppins my-3 mb-6 max-w-[200px]">
                View feedback given by
                <br />
                students
              </div>
              <GiveFeedbackButton context="Open Dashboard" />
            </div>
            <div className="bg-gray-700 rounded-lg p-8 flex flex-col items-center w-96 min-h-[28rem]">
              <Image
                src={curriculum}
                alt="teacher"
                width={300}
                height={300}
                className="mt-4"
              />
              <div className="text-gray-200 text-center text-xl font-poppins my-3">
                Curriculum Feedback
              </div>
              <div className="text-gray-200 text-center text-sm font-poppins my-3 mb-6">
                Please provide feedback on the courses and curriculum structure.
              </div>
              <GiveFeedbackButton context="Curriculum Feedback" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}