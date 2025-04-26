"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import { signOut } from "next-auth/react";
import {
  FacultySubject,
  Question,
  getCurrentStudentInfo,
  getStudentFacultySubjects,
  getFeedbackQuestions,
  submitFeedback,
} from "../actions/studentActions";

// Non-null ratings or text input
type RatingValue = number | null;
type TextValue = string;
type ResponseValue = RatingValue | TextValue;
type Responses = Record<string, ResponseValue>;

// Type for processed feedback to be submitted
type SubmissionResponses = Record<string, number | string>;
type ProcessedFeedback = {
  facultyId: string;
  subjectId: string;
  responses: SubmissionResponses;
}[];

const FacultyFeedbackPage = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [facultySubjects, setFacultySubjects] = useState<FacultySubject[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [allResponses, setAllResponses] = useState<Record<number, Responses>>(
    {}
  );
  const [currentResponses, setCurrentResponses] = useState<Responses>({});
  const [additionalRemarks, setAdditionalRemarks] = useState<string>("");
  const [showRemarks, setShowRemarks] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get student info
        const studentInfo = await getCurrentStudentInfo();
        if (studentInfo) {
          setStudentName(studentInfo.name);
          setStudentId(studentInfo.id);
        }

        // Get faculty subjects
        const facultySubjectsData = await getStudentFacultySubjects();

        // If no faculty subjects are returned, it means the student has already
        // completed all their feedback or has no courses to provide feedback for
        if (facultySubjectsData.length === 0) {
          console.log("No pending feedback found for this student");
          // We'll show the "already submitted" message when rendering
          setFacultySubjects([]);
          setLoading(false);
          return; // Exit early since there's no need to load questions
        }

        setFacultySubjects(facultySubjectsData);

        // Get questions
        const questionsData = await getFeedbackQuestions();
        setQuestions(questionsData);

        // Initialize responses for all faculty-subjects
        const initialAllResponses: Record<number, Responses> = {};
        facultySubjectsData.forEach((_, index) => {
          const initialResponses: Responses = {};
          questionsData.forEach((question) => {
            initialResponses[question.id] =
              question.type === "rating" ? null : "";
          });
          initialAllResponses[index] = initialResponses;
        });
        setAllResponses(initialAllResponses);

        // Set current responses
        if (facultySubjectsData.length > 0) {
          setCurrentResponses(initialAllResponses[0] || {});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update current responses when currentIndex changes
    if (currentIndex in allResponses) {
      setCurrentResponses(allResponses[currentIndex]);
    }
  }, [currentIndex, allResponses]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setCurrentResponses((prev) => {
      const updated = { ...prev, [questionId]: rating };

      // Update the allResponses state as well
      setAllResponses((prevAll) => ({
        ...prevAll,
        [currentIndex]: updated,
      }));

      return updated;
    });
  };

  const handleTextChange = (text: string) => {
    setAdditionalRemarks(text);
  };

  const isCurrentSlideComplete = () => {
    // For the remarks slide, there's no required input
    if (showRemarks) return true;

    // For regular question slides, check if all ratings are filled
    return Object.entries(currentResponses).every(([questionId, value]) => {
      // Find the question to check its type
      const question = questions.find((q) => q.id === questionId);
      return question?.type === "rating" ? value !== null : true;
    });
  };

  const handleNext = () => {
    // Validate that all questions are answered
    if (!isCurrentSlideComplete()) {
      alert("Please fill in all ratings before proceeding.");
      return;
    }

    // If we've reached the end of faculty subjects, show remarks
    if (currentIndex >= facultySubjects.length - 1) {
      setShowRemarks(true);
    } else {
      // Otherwise move to the next faculty
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (showRemarks) {
      setShowRemarks(false);
    } else if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive check for any incomplete slides
    const incompleteSlides = Object.keys(allResponses).some((slideIndex) => {
      const slideResponses = allResponses[Number(slideIndex)];
      return Object.entries(slideResponses).some(([questionId, value]) => {
        // Find the question to check its type
        const question = questions.find((q) => q.id === questionId);
        return question?.type === "rating" && value === null;
      });
    });

    if (incompleteSlides) {
      alert(
        "Please complete all questions for all faculty members before submitting."
      );
      // Go back to first incomplete slide
      for (let i = 0; i < facultySubjects.length; i++) {
        const slideResponses = allResponses[i];
        const isIncomplete = Object.entries(slideResponses).some(
          ([questionId, value]) => {
            const question = questions.find((q) => q.id === questionId);
            return question?.type === "rating" && value === null;
          }
        );

        if (isIncomplete) {
          setCurrentIndex(i);
          setShowRemarks(false);
          return;
        }
      }
      return;
    }

    try {
      setSubmitting(true);

      // Process data for submission - remove any null values
      const processedFeedback = facultySubjects.map((facultySubject, index) => {
        const rawResponses = allResponses[index];
        const processedResponses: SubmissionResponses = {};

        // Convert all responses to non-null values for submission
        Object.entries(rawResponses).forEach(([key, value]) => {
          if (value !== null) {
            processedResponses[key] = value;
          }
        });

        return {
          facultyId: facultySubject.facultyId,
          subjectId: facultySubject.subjectId,
          responses: processedResponses,
        };
      });

      // Submit feedback
      const result = await submitFeedback(
        studentId,
        processedFeedback,
        additionalRemarks
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

  if (facultySubjects.length === 0) {
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
              <p>You have already submitted feedback for all your courses.</p>
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
          {!showRemarks ? (
            <>
              <h2 className="text-xl font-semibold text-center p-6 bg-gray-700 text-white">
                {facultySubjects[currentIndex]?.facultyName || "Faculty"}
                <br />
                <span className="text-base font-normal">
                  ({facultySubjects[currentIndex]?.subjectName || "Subject"})
                </span>
              </h2>

              <form className="space-y-8 relative p-8">
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
                      {question.id}) {question.text}
                    </p>

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
                            checked={currentResponses[question.id] === rating}
                            onChange={() =>
                              handleRatingChange(question.id, rating)
                            }
                            className="form-radio h-4 w-4 text-[#f03e65]"
                          />
                          <span className="text-gray-800">{rating}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-center p-6 bg-gray-700 text-white">
                Additional Remarks (Optional)
              </h2>

              <div className="p-8">
                <textarea
                  value={additionalRemarks}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Please provide any additional feedback or comments (optional)"
                  className="w-full p-4 h-48 border border-gray-300 rounded bg-white text-gray-800 focus:border-[#f03e65] focus:ring-1 focus:ring-[#f03e65]"
                ></textarea>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 ${
              currentIndex === 0 && !showRemarks ? "invisible" : ""
            }`}
          >
            Previous Slide
          </button>

          {showRemarks ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#f03e65] hover:bg-[#d03050] text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isCurrentSlideComplete()}
              className="bg-[#f03e65] hover:bg-[#d03050] text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50"
            >
              Next Slide
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-gray-400">
          {!showRemarks
            ? `Faculty ${currentIndex + 1} of ${facultySubjects.length}`
            : "Final step"}
        </div>
      </div>

      <footer className="mt-10">
        <Footer />
      </footer>
    </div>
  );
};

export default FacultyFeedbackPage;
