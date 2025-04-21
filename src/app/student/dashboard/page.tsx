import React from "react";
import Appbar from "../../components/Appbar";
import background_login from "../../../../public/background_login.jpg";
import teacher from "../../../../public/teacher.webp";
import guest from "../../../../public/guest.png"
import curriculum from "../../../../public/curriculum.png"
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
        <div className="flex flex-col align-middle items-center justify-center h-full my-auto mx-auto p-20">
          <div className="text-4xl text-white font-poppins font-light my-auto ">
            Feedback Page
          </div>
          <div className="flex space-x-4 mt-4">
            <div className="bg-primary-light rounded-lg p-8 flex flex-col items-center bg-opacity-90">
              <Image src={teacher} alt="teacher" />
              <div className="text-primary-dark text-center text-xl font-poppins my-2">
                Faculty Feedback
              </div>
              <div className="text-primary-dark text-center text-sm font-poppins my-2 mb-5">
                Provide feedback on your experience with faculty members.
              </div>
              <GiveFeedbackButton context="Faculty Feedback" />
            </div>
            <div className="bg-primary-light rounded-lg p-8 flex flex-col items-center bg-opacity-90">
              <Image src={guest} alt="teacher" />
              <div className="text-primary-dark text-center text-xl font-poppins my-2">
                Guest Feedback
              </div>
              <div className="text-primary-dark text-center text-sm font-poppins my-2 mb-5">
                Share your thoughts on presentations and sessions by industry experts.
              </div>
              <GiveFeedbackButton context="Guest Feedback" />
            </div>
            <div className="bg-primary-light rounded-lg p-8 flex flex-col items-center bg-opacity-90">
              <Image src={curriculum} alt="teacher" />
              <div className="text-primary-dark text-center text-xl font-poppins my-2">
                Curriculum Feedback
              </div>
              <div className="text-primary-dark text-center text-sm font-poppins my-2 mb-5">
                Please provide feedback on the courses and curriculum structure.
              </div>
              <GiveFeedbackButton context="Student Curriculum Feedback" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
