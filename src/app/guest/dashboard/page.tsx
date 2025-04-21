import React from "react";
import Appbar from "../../components/Appbar";
import background_login from "../../../../public/background_login.jpg";
import curriculum from "../../../../public/curriculum.png";
import Image from "next/image";
import GiveFeedbackButton from "@/app/components/GiveFeedbackButton";
import Footer from "@/app/components/Footer";

export default function StudentDashboard() {
  return (
    <div
      className="min-h-svh bg-cover bg-center"
      style={{ backgroundImage: `url(${background_login.src})` }}
    >
      <Appbar />
      <div>
        <div className="flex flex-col align-middle items-center justify-center my-auto mx-auto p-16">
          <div className="text-3xl text-white font-poppins font-light my-auto ">
            Feedback Page
          </div>
          <div className="flex space-x-4 mt-4">
            <div className="bg-primary-light rounded-lg p-6 flex flex-col items-center space-y-6 max-w-lg bg-opacity-90">
              <Image src={curriculum} alt="teacher" />
              <div className="text-primary-dark text-center text-xl font-poppins">
                Curriculum Feedback
              </div>
              <div className="text-primary-dark text-center text-sm font-poppins">
                Please provide feedback on the courses and curriculum structure.
              </div>
              <GiveFeedbackButton context="Guest Curriculum Feedback" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
