import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    if (openQuestion === index) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(index);
    }
  };

  const faqItems = [
    {
      question: "How do I control student and faculty login access?",
      answer:
        "You can control student and faculty login access through the 'Login ON/OFF' section in the admin dashboard. This allows you to enable or disable logins for students and faculty members separately. This is particularly useful during maintenance or when you want to restrict access during specific periods.",
    },
    {
      question: "How do I add a new coordinator?",
      answer:
        "Navigate to the 'Add Coordinator' section in the admin dashboard. Enter the email address of the faculty member you wish to assign as a coordinator and specify their branch. The system will automatically set up their permissions and send them an invitation if they don't already have an account.",
    },
    {
      question: "Can I remove a coordinator?",
      answer:
        "Yes, you can remove a coordinator by going to the 'Show Coordinator' section, which displays all active coordinators. Each coordinator entry has a 'Delete' button that will revoke their coordinator privileges.",
    },
    {
      question: "How does the visibility system work?",
      answer:
        "The visibility system controls which user roles can access the application. There are three main visibility states: studentLogin, facultyLogin, and facultyDashboard. Each can be set to 1 (visible/enabled) or 0 (hidden/disabled). This gives you fine-grained control over system access.",
    },
    {
      question:
        "What should I do if a student cannot access their feedback forms?",
      answer:
        "First, check if student logins are enabled in the 'Login ON/OFF' section. If they are enabled but students still can't access forms, verify that the student's account is correctly set up with the proper role and branch. You might also want to check with the relevant coordinator to ensure feedback assignments are properly configured.",
    },
    {
      question: "How can I reset a user's password?",
      answer:
        "Currently, there is no direct way to reset passwords from the admin dashboard. If a user is completely locked out, you may need to contact the development team for technical support.",
    },
    {
      question: "What's the difference between a coordinator and an admin?",
      answer:
        "Admins have system-wide control, including the ability to manage coordinators, control login visibility, and access all system functions. Coordinators have more limited permissions, focused on managing students, faculty, and feedback for their specific branch or department.",
    },
    {
      question: "How can I backup the feedback data?",
      answer:
        "The system doesn't currently have a built-in backup feature in the UI. To backup data, you'll need to access the database directly or work with your IT team to set up scheduled backups of the database files.",
    },
    {
      question: "What happens to incomplete feedback submissions?",
      answer:
        "Incomplete feedback submissions are not recorded in the system. Students must complete all required fields and submit the form for their feedback to be counted. Partial submissions are not saved.",
    },
    {
      question: "Can I customize the feedback questions?",
      answer:
        "Feedback questions are managed at the system level and cannot be customized directly from the admin interface. Please contact the development team if you need to modify the standard questions or add new question types.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-white mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200"
          >
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
              onClick={() => toggleQuestion(index)}
            >
              <h3 className="text-xl font-medium text-white">
                {item.question}
              </h3>
              <svg
                className={`w-5 h-5 text-white transform transition-transform duration-200 ${
                  openQuestion === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openQuestion === index && (
              <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
                <p className="text-gray-300">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-900 bg-opacity-50 rounded-lg">
        <h3 className="text-xl font-medium text-white mb-2">Need more help?</h3>
        <p className="text-gray-300">
          If you can&apos;t find the answer to your question, please contact the
          development team:
        </p>
        <ul className="mt-2 space-y-1 text-gray-300">
          <li>
            <a
              href="mailto:ankush.dutta.btech2023@sitpune.edu.in"
              className="text-blue-400 hover:underline"
            >
              ankush.dutta.btech2023@sitpune.edu.in
            </a>
          </li>
          <li>
            <a
              href="mailto:mitiksha.paliwal.btech2023@sitpune.edu.in"
              className="text-blue-400 hover:underline"
            >
              mitiksha.paliwal.btech2023@sitpune.edu.in
            </a>
          </li>
          <li>
            <a
              href="mailto:tanvee.patil.btech2023@sitpune.edu.in"
              className="text-blue-400 hover:underline"
            >
              tanvee.patil.btech2023@sitpune.edu.in
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FAQ;
