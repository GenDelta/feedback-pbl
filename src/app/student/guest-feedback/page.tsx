"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import { signOut } from "next-auth/react";

interface Question {
  id: string;
  text: string;
  type: "rating" | "text";
}

type RatingValue = number | null;
type TextValue = string;
type ResponseValue = RatingValue | TextValue;
type Responses = Record<string, ResponseValue>;

const CurriculumFeedbackPage = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Responses>({});
  const router = useRouter();

  useEffect(() => {
    // Mock fetch student name - Replace with actual API call
    const fetchStudentName = async () => {
      // Replace with an actual API call to get the logged in faculty's information
      setStudentName("Ankush Dutta");
    };

    // Mock fetch questions - Replace with actual API call
    const fetchQuestions = async () => {
      // Replace with an actual database query
      const mockQuestions: Question[] = [
        {
          id: "Q1",
          text: "How well did the guest lecture align with the course content? ",
          type: "rating",
        },
        {
          id: "Q2",
          text: "Did the guest lecturer effectively explain complex concepts? ",
          type: "rating",
        },
        {
          id: "Q3",
          text: "Did the guest lecture enhance your understanding of the subject?",
          type: "rating",
        },
        {
          id: "Q4",
          text: "How engaging was the guest lecturer's presentation style?  ",
          type: "rating",
        },
        {
          id: "Q5",
          text: "Were the practical examples and insights beneficial? ",
          type: "rating",
        },
        {
          id: "Q6",
          text: "Did the guest lecturer interact well with students and address questions? ",
          type: "rating",
        },
        {
          id: "Q7",
          text: "How valuable was this guest lecture for your academic growth? ",
          type: "rating",
        },
        {
          id: "Q8",
          text: "Would you recommend having more guest lectures in the curriculum? ",
          type: "rating",
        },
        {
          id: "Q9",
          text: "Overall, how satisfied were you with the guest lecture? ",
          type: "rating",
        },
      ];

      setQuestions(mockQuestions);

      const initialResponses: Record<string, any> = {};
      mockQuestions.forEach((question) => {
        initialResponses[question.id] = question.type === "rating" ? null : "";
      });
      setResponses(initialResponses);
    };

    fetchStudentName();
    fetchQuestions();
  }, []);

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
      ([_, value]) => value === null || value === ""
    );

    if (unansweredQuestions.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Replace with an actual API call to submit feedback
    console.log("Submitting feedback:", responses);

    try {
      // Mock API call
      // await submitFeedback(responses);
      alert("Feedback submitted successfully!");
      router.push("/student/dashboard"); // Redirect to dashboard after submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const handleLogout = () => {
    signOut();
  };

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
            Faculty Feedback
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8 relative p-8">
            <div className="absolute right-0 top-0 text-sm text-gray-700 p-8">
              <div>5-Strongly Agree</div>
              <div>4-Agree</div>
              <div>3-Neutral</div>
              <div>2-Disagree</div>
              <div>1-Strongly Disagree</div>
            </div>

            {questions.map((question) => (
              <div key={question.id} className="mb-6">
                <p className="mb-2 text-gray-800">
                  {question.id} {question.text}
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
                className="bg-[#f03e65] hover:bg-[#d03050] text-white font-bold py-2 px-8 rounded"
              >
                Submit Feedback
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
