"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import { signOut } from "next-auth/react";
import {
  getCurrentStudentInfo,
  getCurriculumFeedbackQuestions,
  hasStudentSubmittedFeedback,
  submitGeneralFeedback,
  Question,
} from "../actions/studentActions";

type RatingValue = number | null;
type TextValue = string;
type ResponseValue = RatingValue | TextValue;
type Responses = Record<string, ResponseValue>;

const CurriculumFeedbackPage = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Responses>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [formComplete, setFormComplete] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get student info
        const studentInfo = await getCurrentStudentInfo();
        if (studentInfo) {
          setStudentName(studentInfo.name);
          setStudentId(studentInfo.id);

          // Check if student has already submitted curriculum feedback
          const submitted = await hasStudentSubmittedFeedback(
            studentInfo.id,
            "Curriculum Feedback 2023-24" // Updated to match database
          );

          setAlreadySubmitted(submitted);

          if (submitted) {
            setLoading(false);
            return; // Exit early if already submitted
          }
        }

        // Get curriculum feedback questions
        const questionsData = await getCurriculumFeedbackQuestions();
        setQuestions(questionsData);

        // Initialize responses
        const initialResponses: Responses = {};
        questionsData.forEach((question) => {
          initialResponses[question.id] =
            question.type === "rating" ? null : "";
        });
        setResponses(initialResponses);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add useEffect to check form completion status whenever responses change
  useEffect(() => {
    if (Object.keys(responses).length === 0 || questions.length === 0) {
      setFormComplete(false);
      return;
    }

    // Check if all questions have been answered
    const unansweredQuestions = questions.filter((question) => {
      const response = responses[question.id];
      if (question.type === "rating") {
        return response === null || response === undefined;
      } else {
        return (
          !response || (typeof response === "string" && response.trim() === "")
        );
      }
    });

    setFormComplete(unansweredQuestions.length === 0);
  }, [responses, questions]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const unansweredQuestions = Object.entries(responses).filter(
      ([key, value]) =>
        (questions.find((q) => q.id === key)?.type === "rating" &&
          value === null) ||
        (questions.find((q) => q.id === key)?.type === "text" &&
          (!value || value === ""))
    );

    if (unansweredQuestions.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      // Process data for submission - remove any null values
      const processedResponses: Record<string, number | string> = {};

      // Convert all responses to non-null values for submission
      Object.entries(responses).forEach(([key, value]) => {
        if (value !== null) {
          processedResponses[key] = value;
        }
      });

      // Submit feedback - update the feedback type name
      const result = await submitGeneralFeedback(
        studentId,
        "Curriculum Feedback 2023-24", // Updated to match database
        processedResponses
      );

      if (result) {
        // Redirect to thank you page on success
        router.push("/thankyou");
      } else {
        alert("Failed to submit feedback. Please try again.");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout API
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center">
        <div className="text-xl">Loading feedback form...</div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-gray-800 text-white p-6 flex flex-col relative">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-[#f03e65] hover:bg-[#d03050] text-white py-2 px-4 rounded transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        <div className="max-w-4xl mx-auto w-full flex-grow flex items-center justify-center">
          <div className="bg-gray-700 p-8 rounded-lg text-center">
            <div className="bg-yellow-600 text-white p-4 rounded-md mb-4">
              <h3 className="text-xl font-bold mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Already Submitted
              </h3>
              <p>You have already submitted curriculum feedback.</p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">No Pending Feedback</h2>
            <p className="mb-6">
              Thank you for your participation. Your feedback has been recorded
              successfully.
            </p>
            <button
              onClick={() => router.push("/student/dashboard")}
              className="bg-[#f03e65] hover:bg-[#d03050] text-white font-bold py-2 px-8 rounded"
            >
              Return to Dashboard
            </button>
          </div>
        </div>

        <footer className="absolute bottom-0 left-0 w-full">
          <Footer />
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex flex-col relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-[#f03e65] hover:bg-[#d03050] text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-grow">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome {studentName}!
        </h1>

        <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden mb-10">
          <h2 className="text-xl font-semibold text-center p-6 bg-gray-700 text-white">
            Curriculum Feedback
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8 relative p-8">
            <div className="absolute right-0 top-0 text-sm text-gray-700 p-8">
              <div>5-Strongly Agree</div>
              <div>4-Agree</div>
              <div>3-Neutral</div>
              <div>2-Disagree</div>
              <div>1-Strongly Disagree</div>
            </div>

            {questions.map((question: Question) => (
              <div key={question.id} className="mb-6">
                <p className="mb-2 text-gray-800">
                  {question.id}) {question.text}
                </p>

                {question.type === "rating" ? (
                  <div className="flex items-center space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center space-x-1 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={rating}
                          checked={responses[question.id] === rating}
                          onChange={() =>
                            handleRatingChange(question.id, rating)
                          }
                          className="form-radio h-4 w-4 text-[#f03e65]"
                        />
                        <span className="text-gray-800">{rating}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={responses[question.id] || ""}
                    onChange={(e) =>
                      handleTextChange(question.id, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-[#f03e65] focus:ring-1 focus:ring-[#f03e65]"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={submitting || !formComplete}
                className="bg-[#f03e65] hover:bg-[#d03050] text-white font-bold py-2 px-8 rounded disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : formComplete
                  ? "Submit Feedback"
                  : "Please Complete All Questions"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default CurriculumFeedbackPage;
