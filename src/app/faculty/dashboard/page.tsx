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
        <div className="flex flex-col align-middle items-center justify-center h-full my-auto mx-auto p-20">
          <div className="text-4xl text-white font-poppins font-light my-auto ">
            Faculty Page
          </div>
          <div className="flex space-x-4 mt-4">
            <div className="bg-gray-700 rounded-lg p-8 flex flex-col items-center ">
              <Image src={dashboard} alt="teacher" />
              <div className="text-gray-200 text-center text-xl font-poppins my-2">
                Dashboard
              </div>
              <div className="text-gray-200 text-center text-sm font-poppins my-2 mb-5">
                View feedback given by students
              </div>
              <GiveFeedbackButton context="Open Dashboard" />
            </div>
            <div className="bg-gray-700 rounded-lg p-8 flex flex-col items-center">
              <Image src={curriculum} alt="teacher" />
              <div className="text-gray-200 text-center text-xl font-poppins my-2">
                Curriculum Feedback
              </div>
              <div className="text-gray-200 text-center text-sm font-poppins my-2 mb-5">
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
