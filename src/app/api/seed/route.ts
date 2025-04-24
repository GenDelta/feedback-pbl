import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";

async function GET() {
  // Clear all tables first (in correct order to respect foreign key constraints)
  try {
    console.log("Clearing all tables...");

    // Clear tables with dependencies first
    await prisma.feedback.deleteMany({});
    await prisma.electives.deleteMany({});
    await prisma.faculty_Subject.deleteMany({});
    await prisma.questions.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.faculty.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.verificationRequest.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.feedBack_Name.deleteMany({});

    console.log("All tables cleared successfully");

    // Now seed with fresh data
    // Create two feedback types - one for faculty and one for curriculum
    const facultyFeedbackName = await prisma.feedBack_Name.create({
      data: {
        name: "Faculty Evaluation 2023-24",
      },
    });

    const curriculumFeedbackName = await prisma.feedBack_Name.create({
      data: {
        name: "Curriculum Feedback 2023-24",
      },
    });

    // Keep the required user insertions intact
    const student = await prisma.user.create({
      data: {
        name: "student",
        email: "student@sitpune.edu.in",
        password: bcrypt.hashSync("1234", 10),
        role: "student",
        branch: "CSE", // Updated to match nomenclature
      },
    });

    const coordinator = await prisma.user.create({
      data: {
        name: "cscoordinator",
        email: "cscoordinator@sitpune.edu.in",
        password: bcrypt.hashSync("1234", 10),
        role: "coordinator",
        branch: "CSE", // Updated to match nomenclature
      },
    });

    const faculty = await prisma.user.create({
      data: {
        name: "faculty",
        email: "faculty@sitpune.edu.in",
        password: bcrypt.hashSync("1234", 10),
        role: "faculty",
        branch: "CSE", // Updated to match nomenclature
      },
    });

    const guest = await prisma.user.create({
      data: {
        name: "guest",
        email: "guest@gmail.com",
        password: bcrypt.hashSync("1234", 10),
        role: "guest",
        branch: null, // Guests don't need a branch
      },
    });

    const admin = await prisma.user.create({
      data: {
        name: "admin",
        email: "systemadmin@sitpune.edu.in",
        password: bcrypt.hashSync("1234", 10),
        role: "admin",
        branch: null, // Admin doesn't need a branch
      },
    });

    // Create additional students across different branches and batches
    const additionalStudents = await prisma.user.createMany({
      data: [
        {
          name: "Rahul Sharma",
          email: "rahul.sharma@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "student",
          branch: "CSE",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Priya Patel",
          email: "priya.patel@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "student",
          branch: "AIML",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Vikram Singh",
          email: "vikram.singh@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "student",
          branch: "ENTC",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Ananya Desai",
          email: "ananya.desai@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "student",
          branch: "RA",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Rohit Kumar",
          email: "rohit.kumar@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "student",
          branch: "MECH",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Meera Joshi",
          email: "meera.joshi@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "student",
          branch: "CIVIL",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
      ],
    });

    // Create faculty evaluation questions (1-5 scale)
    await prisma.questions.createMany({
      data: [
        {
          question:
            "The faculty demonstrates thorough knowledge of the subject matter",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question: "The faculty effectively communicates concepts and ideas",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question: "The faculty is punctual and regularly conducts classes",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question: "The faculty encourages questions and class participation",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The faculty provides clear and helpful feedback on assignments",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The faculty uses relevant examples and case studies to explain concepts",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The faculty is available for consultation outside of class hours",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The faculty is fair and impartial in evaluating student performance",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question: "The faculty effectively uses technology and teaching aids",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          question: "Overall rating of the faculty's teaching effectiveness",
          feedback_ID: facultyFeedbackName.Feedback_Name_ID,
        },
      ],
    });

    // Create curriculum evaluation questions (1-5 scale)
    await prisma.questions.createMany({
      data: [
        {
          question: "The curriculum is well-structured and organized logically",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question: "The course objectives are clear and attainable",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The curriculum covers current industry trends and practices",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The laboratory components complement theoretical concepts effectively",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The assessment methods effectively evaluate learning outcomes",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question: "The curriculum promotes practical application of concepts",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The curriculum provides opportunities for developing technical skills",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question:
            "The curriculum includes sufficient elective courses for specialization",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question: "The curriculum promotes research and innovation",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
        {
          question: "Overall rating of the curriculum's effectiveness",
          feedback_ID: curriculumFeedbackName.Feedback_Name_ID,
        },
      ],
    });

    // Create student profiles for all students
    // For the main student
    await prisma.student.create({
      data: {
        user_ID: student.id,
        PRN: "230701101",
        branch: "CSE",
        semester: 4,
        department: "Computer Engineering",
        feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
      },
    });

    // Fetch all student users to create their profiles
    const studentUsers = await prisma.user.findMany({
      where: {
        role: "student",
        id: { not: student.id }, // Exclude the main student who already has a profile
      },
    });

    // Create student profiles for the additional students
    for (let i = 0; i < studentUsers.length; i++) {
      const branches = ["CSE", "AIML", "ENTC", "RA", "MECH", "CIVIL"];
      const branch = studentUsers[i].branch || branches[i % branches.length];
      const department =
        {
          CSE: "Computer Engineering",
          AIML: "AI & ML Engineering",
          ENTC: "Electronics & Telecom Engineering",
          RA: "Robotics & Automation",
          MECH: "Mechanical Engineering",
          CIVIL: "Civil Engineering",
        }[branch] || "Computer Engineering";

      await prisma.student.create({
        data: {
          user_ID: studentUsers[i].id,
          PRN: `230701${(102 + i).toString()}`,
          branch: branch,
          semester: 4,
          department: department,
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
      });
    }

    // Create faculty profile for the main faculty user
    const facultyProfile = await prisma.faculty.create({
      data: {
        user_ID: faculty.id,
        department: "Computer Engineering",
        feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
      },
    });

    // Create additional faculty users
    const additionalFaculty = await prisma.user.createMany({
      data: [
        {
          name: "Dr. Ajay Verma",
          email: "ajay.verma@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "faculty",
          branch: "CSE",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Prof. Sunita Deshmukh",
          email: "sunita.deshmukh@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "faculty",
          branch: "AIML",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Dr. Rahul Mehta",
          email: "rahul.mehta@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "faculty",
          branch: "ENTC",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Prof. Neha Gupta",
          email: "neha.gupta@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "faculty",
          branch: "RA",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Dr. Prakash Sharma",
          email: "prakash.sharma@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "faculty",
          branch: "MECH",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
        {
          name: "Prof. Anjali Patel",
          email: "anjali.patel@sitpune.edu.in",
          password: bcrypt.hashSync("1234", 10),
          role: "faculty",
          branch: "CIVIL",
          feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
        },
      ],
    });

    // Fetch the additional faculty users
    const createdFacultyUsers = await prisma.user.findMany({
      where: {
        email: {
          in: [
            "ajay.verma@sitpune.edu.in",
            "sunita.deshmukh@sitpune.edu.in",
            "rahul.mehta@sitpune.edu.in",
            "neha.gupta@sitpune.edu.in",
            "prakash.sharma@sitpune.edu.in",
            "anjali.patel@sitpune.edu.in",
          ],
        },
      },
    });

    // Create faculty profiles for the additional faculty
    const facultyDataToCreate = createdFacultyUsers.map((user) => {
      const branch = user.branch || "CSE";
      const department =
        {
          CSE: "Computer Engineering",
          AIML: "AI & ML Engineering",
          ENTC: "Electronics & Telecom Engineering",
          RA: "Robotics & Automation",
          MECH: "Mechanical Engineering",
          CIVIL: "Civil Engineering",
        }[branch] || "Computer Engineering";

      return {
        user_ID: user.id,
        department: department,
        feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
      };
    });

    await prisma.faculty.createMany({
      data: facultyDataToCreate,
    });

    // Create comprehensive list of subjects across branches
    // CSE Subjects
    const cseSubjects = [
      { name: "Data Structures and Algorithms", type: "Theory" },
      { name: "Database Management Systems", type: "Theory" },
      { name: "Computer Networks", type: "Theory" },
      { name: "Operating Systems", type: "Theory" },
      { name: "Web Technologies Lab", type: "Lab" },
      { name: "DBMS Lab", type: "Lab" },
      { name: "Blockchain Technology", type: "Elective" },
      { name: "Cloud Computing", type: "Elective" },
    ];

    // AIML Subjects
    const aimlSubjects = [
      { name: "Machine Learning Fundamentals", type: "Theory" },
      { name: "Deep Learning", type: "Theory" },
      { name: "Natural Language Processing", type: "Theory" },
      { name: "Computer Vision", type: "Theory" },
      { name: "ML Lab", type: "Lab" },
      { name: "Data Science Lab", type: "Lab" },
      { name: "Reinforcement Learning", type: "Elective" },
      { name: "AI Ethics", type: "Elective" },
    ];

    // ENTC Subjects
    const entcSubjects = [
      { name: "Digital Signal Processing", type: "Theory" },
      { name: "Microprocessors and Microcontrollers", type: "Theory" },
      { name: "Analog Communication", type: "Theory" },
      { name: "Digital Communication", type: "Theory" },
      { name: "DSP Lab", type: "Lab" },
      { name: "Microcontroller Lab", type: "Lab" },
      { name: "VLSI Design", type: "Elective" },
      { name: "Embedded Systems", type: "Elective" },
    ];

    // Other branches subjects
    const otherSubjects = [
      { name: "Engineering Mathematics", type: "Theory" },
      { name: "Engineering Physics", type: "Theory" },
      { name: "Technical Communication", type: "Theory" },
      { name: "Environmental Studies", type: "Theory" },
      { name: "Physics Lab", type: "Lab" },
      { name: "Professional Ethics", type: "Elective" },
      { name: "Financial Mathematics", type: "Elective" },
    ];

    // Combine all subjects
    const allSubjectData = [
      ...cseSubjects.map((s) => ({
        ...s,
        branch: "CSE",
        feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
      })),
      ...aimlSubjects.map((s) => ({
        ...s,
        branch: "AIML",
        feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
      })),
      ...entcSubjects.map((s) => ({
        ...s,
        branch: "ENTC",
        feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
      })),
      ...otherSubjects.map((s) => ({
        ...s,
        branch: "Common",
        feedbackName_ID: facultyFeedbackName.Feedback_Name_ID,
      })),
    ];

    // Create all subjects
    for (const subjectData of allSubjectData) {
      await prisma.subject.create({
        data: {
          name: subjectData.name,
          type: subjectData.type,
          feedbackName_ID: subjectData.feedbackName_ID,
        },
      });
    }

    // Fetch all created subjects
    const subjectsList = await prisma.subject.findMany();

    // Group subjects by branch
    const cseSubjectsList = subjectsList.filter(
      (s, i) => i < cseSubjects.length
    );
    const aimlSubjectsList = subjectsList.filter(
      (s, i) =>
        i >= cseSubjects.length && i < cseSubjects.length + aimlSubjects.length
    );
    const entcSubjectsList = subjectsList.filter(
      (s, i) =>
        i >= cseSubjects.length + aimlSubjects.length &&
        i < cseSubjects.length + aimlSubjects.length + entcSubjects.length
    );
    const commonSubjectsList = subjectsList.filter(
      (s, i) =>
        i >= cseSubjects.length + aimlSubjects.length + entcSubjects.length
    );

    // Fetch all faculty profiles
    const allFaculty = await prisma.faculty.findMany();

    // Group faculty by department
    const cseFaculty = allFaculty.filter(
      (f) => f.department === "Computer Engineering"
    );
    const aimlFaculty = allFaculty.filter(
      (f) => f.department === "AI & ML Engineering"
    );
    const entcFaculty = allFaculty.filter(
      (f) => f.department === "Electronics & Telecom Engineering"
    );
    const otherFaculty = allFaculty.filter(
      (f) =>
        ![
          "Computer Engineering",
          "AI & ML Engineering",
          "Electronics & Telecom Engineering",
        ].includes(f.department)
    );

    // Create faculty-subject relationships with appropriate batches
    const facultySubjects = [];

    // Assign CSE subjects to CSE faculty with batches
    const cseBatches = ["A1", "A2", "A3", "A4", "B1", "B2"];
    for (let i = 0; i < cseSubjectsList.length; i++) {
      const facultyIndex = i % cseFaculty.length;
      const batchIndex = i % cseBatches.length;
      facultySubjects.push({
        Faculty_ID: cseFaculty[facultyIndex].Faculty_ID,
        Subject_ID: cseSubjectsList[i].Subject_ID,
        batch: cseBatches[batchIndex],
      });
    }

    // Assign AIML subjects to AIML faculty with batches
    const aimlBatches = ["A1", "A2", "B1", "B2"];
    for (let i = 0; i < aimlSubjectsList.length; i++) {
      const facultyIndex = i % Math.max(1, aimlFaculty.length);
      const batchIndex = i % aimlBatches.length;
      facultySubjects.push({
        Faculty_ID:
          aimlFaculty.length > 0
            ? aimlFaculty[facultyIndex].Faculty_ID
            : cseFaculty[0].Faculty_ID,
        Subject_ID: aimlSubjectsList[i].Subject_ID,
        batch: aimlBatches[batchIndex],
      });
    }

    // Assign ENTC subjects to ENTC faculty with batches
    const entcBatches = ["A1", "A2", "B1", "B2", "C1", "C2"];
    for (let i = 0; i < entcSubjectsList.length; i++) {
      const facultyIndex = i % Math.max(1, entcFaculty.length);
      const batchIndex = i % entcBatches.length;
      facultySubjects.push({
        Faculty_ID:
          entcFaculty.length > 0
            ? entcFaculty[facultyIndex].Faculty_ID
            : cseFaculty[0].Faculty_ID,
        Subject_ID: entcSubjectsList[i].Subject_ID,
        batch: entcBatches[batchIndex],
      });
    }

    // Assign common subjects to various faculty
    const commonBatches = ["A1", "B1", "C1", "A2", "B2", "C2"];
    for (let i = 0; i < commonSubjectsList.length; i++) {
      // Rotate through all faculty for common subjects
      const facultyIndex = i % allFaculty.length;
      const batchIndex = i % commonBatches.length;
      facultySubjects.push({
        Faculty_ID: allFaculty[facultyIndex].Faculty_ID,
        Subject_ID: commonSubjectsList[i].Subject_ID,
        batch: commonBatches[batchIndex],
      });
    }

    // Create the faculty-subject relationships
    await prisma.faculty_Subject.createMany({
      data: facultySubjects,
    });

    // Create elective relationships for students
    // Fetch all students
    const allStudents = await prisma.student.findMany();

    // Get all elective subjects
    const electiveSubjects = subjectsList.filter(
      (s) =>
        allSubjectData.find((sd) => sd.name === s.name)?.type === "Elective"
    );

    // Create elective selections for students
    const electiveSelections = [];
    for (let i = 0; i < allStudents.length; i++) {
      // Each student selects 2 electives
      const electiveIndices = [
        i % electiveSubjects.length,
        (i + Math.floor(electiveSubjects.length / 2)) % electiveSubjects.length,
      ];

      for (const index of electiveIndices) {
        electiveSelections.push({
          Student_ID: allStudents[i].Student_ID,
          Subject_ID: electiveSubjects[index].Subject_ID,
        });
      }
    }

    // Insert elective selections
    await prisma.electives.createMany({
      data: electiveSelections,
    });

    // Create sample feedback entries
    // Get faculty evaluation questions
    const facultyQuestions = await prisma.questions.findMany({
      where: {
        feedback_ID: facultyFeedbackName.Feedback_Name_ID,
      },
    });

    // Create some feedback entries for the first few students
    for (let i = 0; i < Math.min(3, allStudents.length); i++) {
      const student = allStudents[i];

      // Get faculty-subject pairs relevant to this student's branch
      const facultySubjectPairs = await prisma.faculty_Subject.findMany({
        include: {
          faculty: true,
          subject: true,
        },
      });

      // Create feedback for a subset of faculty-subject pairs
      for (let j = 0; j < Math.min(3, facultySubjectPairs.length); j++) {
        const pair = facultySubjectPairs[j];

        // Create feedback for each question
        for (const question of facultyQuestions) {
          await prisma.feedback.create({
            data: {
              feedback_name_ID: facultyFeedbackName.Feedback_Name_ID,
              student_ID: student.Student_ID,
              faculty_ID: pair.faculty.Faculty_ID,
              subject_ID: pair.subject.Subject_ID,
              question_ID: question.Question_ID,
              answer: (Math.floor(Math.random() * 4) + 2).toString(), // Random score 2-5
            },
          });
        }
      }
    }

    return new Response(
      "Database cleared and seeded with comprehensive data successfully"
    );
  } catch (error: any) {
    console.error("Error in seed operation:", error);
    return new Response(
      `Error in seed operation: ${error?.message || "Unknown error"}`,
      { status: 500 }
    );
  }

  // const feedBackName = await prisma.feedBack_Name.create({
  //     data:{
  //         name:"test",
  //     }
  // })

  // ...existing code...
}

export { GET };
