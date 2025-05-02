import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";

// Define interface for subjects
interface SubjectData {
  name: string;
  type: string;
}

// Define interface for subject with ID
interface Subject extends SubjectData {
  Subject_ID: string;
}

async function GET() {
  try {
    console.log("Starting database seeding...");

    // Hash password (1234) for all users
    const hashedPassword = await bcrypt.hash("1234", 10);

    // Define branches and departments with the updated branch list
    const branches = ["CSE", "AIML", "ENTC", "MECH", "CIVIL", "RA"];
    const departments = [
      "Computer Science",
      "Artificial Intelligence & Machine Learning",
      "Electronics & Telecommunications",
      "Mechanical",
      "Civil",
      "Robotics & Automation",
    ];
    const branchCodes = ["cs", "aiml", "entc", "mech", "civil", "ra"];

    // Define students count per branch
    const studentsCount = 15; // 15 students per branch

    // First, check for existing subjects to avoid duplicates
    const existingSubjects = await prisma.subject.findMany();
    const existingSubjectNames = existingSubjects.map((s) =>
      s.name.toLowerCase()
    );

    // Create new subjects that don't already exist
    const subjectsToCreate: SubjectData[] = [
      // Core subjects
      { name: "Analysis of Algorithms", type: "Theory" },
      { name: "Advanced Data Structures", type: "Lab" },
      { name: "Compiler Design", type: "Theory" },
      { name: "Web Technologies Lab", type: "Lab" },
      { name: "DBMS Lab", type: "Lab" },
      { name: "Blockchain Technology", type: "Elective" },
      { name: "Cloud Computing", type: "Elective" },
      { name: "Machine Learning Fundamentals", type: "Theory" },
      { name: "Deep Learning", type: "Theory" },
      { name: "Natural Language Processing", type: "Theory" },
      { name: "Reinforcement Learning", type: "Elective" },
      { name: "AI Ethics", type: "Elective" },
      { name: "Digital Signal Processing", type: "Theory" },
      { name: "DSP Lab", type: "Lab" },
      { name: "Microcontroller Lab", type: "Lab" },
      { name: "Digital Communication", type: "Theory" },
      { name: "Analog Communication", type: "Theory" },
      { name: "ML Lab", type: "Lab" },
      { name: "Data Science Lab", type: "Lab" },
      { name: "Engineering Mathematics", type: "Theory" },
      { name: "Engineering Physics", type: "Theory" },
      { name: "Technical Communication", type: "Theory" },
      { name: "Environmental Studies", type: "Theory" },
      { name: "Physics Lab", type: "Lab" },
      { name: "Professional Ethics", type: "Elective" },
      { name: "Financial Mathematics", type: "Elective" },
    ].filter(
      (subject) => !existingSubjectNames.includes(subject.name.toLowerCase())
    );

    // Create filtered subjects
    const createdSubjects: Subject[] = [...existingSubjects];
    for (const subject of subjectsToCreate) {
      const createdSubject = await prisma.subject.create({
        data: {
          name: subject.name,
          type: subject.type,
        },
      });
      createdSubjects.push(createdSubject);
      console.log(`Created subject: ${subject.name}`);
    }

    // Check existing users to avoid duplicates
    const existingUsers = await prisma.user.findMany();
    const existingEmails = new Set(
      existingUsers.map((u) => u.email.toLowerCase())
    );

    // Create coordinators (one for each department)
    const coordinators = [];
    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      const department = departments[i];
      const branchCode = branchCodes[i];
      const email = `${branchCode}coordinator@sitpune.edu.in`;

      // Skip if email already exists
      if (existingEmails.has(email.toLowerCase())) {
        console.log(`Coordinator for ${department} already exists. Skipping.`);
        continue;
      }

      const coordinator = await prisma.user.create({
        data: {
          name: `${department} Coordinator`,
          email: email,
          password: hashedPassword,
          role: "coordinator",
          branch: branch,
          faculty: {
            create: {
              department: department,
            },
          },
        },
        include: {
          faculty: true,
        },
      });

      // Add the email to our tracking set
      existingEmails.add(email.toLowerCase());

      coordinators.push(coordinator);
      console.log(`Created coordinator for ${department}`);
    }

    // Faculty first and last names for realistic email generation
    const facultyFirstNames = [
      "Sunita",
      "Vijay",
      "Deepa",
      "Rajan",
      "Meenakshi",
      "Prakash",
      "Anita",
      "Suresh",
      "Kavita",
      "Rajesh",
      "Alok",
      "Bharti",
      "Chandan",
      "Divya",
      "Esha",
      "Farhan",
      "Garima",
      "Harish",
      "Ishita",
      "Jai",
    ];

    const facultyLastNames = [
      "Gohil",
      "Thakur",
      "Banerjee",
      "Menon",
      "Chadha",
      "Narayan",
      "Bhatt",
      "Rajagopal",
      "Chowdhury",
      "Venugopal",
      "Acharya",
      "Bakshi",
      "Chopra",
      "Dhawan",
      "Easwaran",
      "Fernandes",
      "Ghosh",
      "Hegde",
      "Iyer",
      "Jindal",
    ];

    // Create faculties (multiple for each department)
    const faculties = [];
    const facultyCount = 5; // 5 faculties per department

    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      const branch = branches[i];
      let facultiesCreated = 0;
      let attempts = 0;

      // Try to create the requested number of faculties per department
      while (facultiesCreated < facultyCount && attempts < facultyCount * 3) {
        attempts++;
        // Generate random combinations to avoid duplicates
        const fnIndex = Math.floor(Math.random() * facultyFirstNames.length);
        const lnIndex = Math.floor(Math.random() * facultyLastNames.length);

        const firstName = facultyFirstNames[fnIndex];
        const lastName = facultyLastNames[lnIndex];
        // Generate email with a uniqueness factor
        const uniqueSuffix = attempts > facultyCount ? `.${attempts}` : "";
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueSuffix}@sitpune.edu.in`;

        // Skip if email already exists
        if (existingEmails.has(email.toLowerCase())) {
          console.log(
            `Faculty email ${email} already exists. Trying another combination.`
          );
          continue;
        }

        try {
          const faculty = await prisma.user.create({
            data: {
              name: `${firstName} ${lastName}`,
              email: email,
              password: hashedPassword,
              role: "faculty",
              branch: branch,
              faculty: {
                create: {
                  department: department,
                },
              },
            },
            include: {
              faculty: true,
            },
          });

          // Add the email to our tracking set
          existingEmails.add(email.toLowerCase());

          faculties.push(faculty);
          facultiesCreated++;
          console.log(
            `Created faculty: ${firstName} ${lastName} for ${department}`
          );
        } catch (error) {
          console.error(`Error creating faculty with email ${email}:`, error);
          // Continue the loop to try another combination
        }
      }
    }

    // Get all faculty members including existing ones
    const allFaculties = await prisma.faculty.findMany({
      include: {
        user: true,
      },
    });

    // Check existing faculty-subject assignments to avoid duplicates
    const existingFacultySubjects = await prisma.faculty_Subject.findMany();
    const existingAssignments = new Set(
      existingFacultySubjects.map((fs) => `${fs.Faculty_ID}-${fs.Subject_ID}`)
    );

    // Assign subjects to faculties
    const batches = ["A", "B", "C"];

    // First, assign department-specific subjects to respective department faculties
    for (let i = 0; i < departments.length; i++) {
      const departmentFaculties = allFaculties.filter(
        (f) => f.department === departments[i]
      );

      // Filter subjects based on department
      let departmentSubjects: Subject[] = [];
      if (i === 0) {
        // CSE
        departmentSubjects = createdSubjects.filter(
          (s) =>
            s.name.includes("Data Structure") ||
            s.name.includes("Algorithm") ||
            s.name.includes("Compiler")
        );
      } else if (i === 1) {
        // AIML
        departmentSubjects = createdSubjects.filter(
          (s) =>
            s.name.includes("Artificial") ||
            s.name.includes("Machine") ||
            s.name.includes("Deep") ||
            s.name.includes("Natural") ||
            s.name.includes("Vision")
        );
      } else if (i === 2) {
        // ENTC
        departmentSubjects = createdSubjects.filter(
          (s) =>
            s.name.includes("Signal") ||
            s.name.includes("VLSI") ||
            s.name.includes("Embedded") ||
            s.name.includes("Micro") ||
            s.name.includes("Communication")
        );
      } else if (i === 3) {
        // MECH
        departmentSubjects = createdSubjects.filter(
          (s) =>
            s.name.includes("Thermo") ||
            s.name.includes("Fluid") ||
            s.name.includes("Machine Design") ||
            s.name.includes("Manufacturing") ||
            s.name.includes("Materials")
        );
      } else if (i === 4) {
        // CIVIL
        departmentSubjects = createdSubjects.filter(
          (s) =>
            s.name.includes("Structural") ||
            s.name.includes("Transport") ||
            s.name.includes("Environment") ||
            s.name.includes("Geotechnical") ||
            s.name.includes("Construction")
        );
      } else if (i === 5) {
        // RA
        departmentSubjects = createdSubjects.filter(
          (s) =>
            s.name.includes("Robotics") ||
            s.name.includes("Control") ||
            s.name.includes("Mechatronics") ||
            s.name.includes("Kinematics") ||
            s.name.includes("Automation")
        );
      }

      for (let j = 0; j < departmentSubjects.length; j++) {
        const facultyIndex = j % departmentFaculties.length;
        if (facultyIndex >= departmentFaculties.length) continue;

        const subject = departmentSubjects[j];
        const faculty = departmentFaculties[facultyIndex];

        // Skip if assignment already exists
        const assignmentKey = `${faculty.Faculty_ID}-${subject.Subject_ID}`;
        if (existingAssignments.has(assignmentKey)) {
          console.log(
            `Assignment of ${subject.name} to faculty already exists. Skipping.`
          );
          continue;
        }

        await prisma.faculty_Subject.create({
          data: {
            Faculty_ID: faculty.Faculty_ID,
            Subject_ID: subject.Subject_ID,
            batch: batches[j % batches.length],
          },
        });
        console.log(`Assigned ${subject.name} to ${faculty.user.name}`);
      }
    }

    // Then, assign core subjects to random faculties
    const coreSubjects = createdSubjects.filter((s) =>
      ["Database", "Operating", "Computer Networks", "Software"].some((term) =>
        s.name.includes(term)
      )
    );

    for (const subject of coreSubjects) {
      // Get random faculties that don't already teach this subject
      const eligibleFaculties = allFaculties.filter(
        (faculty) =>
          !existingAssignments.has(
            `${faculty.Faculty_ID}-${subject.Subject_ID}`
          )
      );

      // Get random set of 3 faculties
      const randomFaculties = eligibleFaculties
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      for (let i = 0; i < randomFaculties.length; i++) {
        const faculty = randomFaculties[i];

        await prisma.faculty_Subject.create({
          data: {
            Faculty_ID: faculty.Faculty_ID,
            Subject_ID: subject.Subject_ID,
            batch: batches[i % batches.length],
          },
        });
        console.log(
          `Assigned core subject ${subject.name} to ${
            faculty.user.name
          } (Batch ${batches[i % batches.length]})`
        );
      }
    }

    // Student first and last names for realistic email generation
    const studentFirstNames = [
      "Deepak",
      "Priyanka",
      "Vishal",
      "Anjali",
      "Karan",
      "Megha",
      "Siddharth",
      "Ritika",
      "Ankit",
      "Swati",
      "Mukesh",
      "Anamika",
      "Pranav",
      "Shivani",
      "Mohit",
      "Neha",
      "Chirag",
      "Tanuja",
      "Prakash",
      "Ruchi",
      "Ashish",
      "Bhavna",
      "Chetan",
      "Dipti",
      "Eshwar",
      "Falguni",
      "Gaurav",
      "Hema",
      "Ishan",
      "Juhi",
      "Kartik",
      "Leela",
      "Manoj",
      "Nidhi",
      "Om",
      "Pooja",
      "Rahul",
      "Sarika",
      "Tarun",
      "Uma",
    ];

    const studentLastNames = [
      "Malhotra",
      "Dewangan",
      "Ghosh",
      "Bhandari",
      "Israni",
      "Lokhande",
      "Murthy",
      "Parekh",
      "Qureshi",
      "Rastogi",
      "Saini",
      "Tiwari",
      "Uppal",
      "Venkatesh",
      "Wadhwa",
      "Yadav",
      "Shetty",
      "Kannan",
      "Prabhu",
      "Dixit",
      "Ahluwalia",
      "Bajaj",
      "Chakraborty",
      "Dutt",
      "Emani",
      "Farooqui",
      "Gokhale",
      "Haksar",
      "Iyengar",
      "Jaitly",
      "Khanna",
      "Lamba",
      "Mathur",
      "Nadkarni",
      "Oberoi",
      "Pillai",
      "Rana",
      "Sengupta",
      "Tandon",
      "Unnikrishnan",
    ];

    // Check existing students to avoid duplicates
    const existingStudents = await prisma.student.findMany({
      include: { user: true },
    });
    const existingPRNs = new Set(existingStudents.map((s) => s.PRN));

    // Create students (at least 10 per branch)
    const currentYear = new Date().getFullYear();
    const joiningYears = [
      currentYear - 3,
      currentYear - 2,
      currentYear - 1,
      currentYear,
    ]; // Students from different batches

    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      const department = departments[i];
      let studentsCreated = 0;

      // We'll try to create up to the desired number of students per branch
      for (let j = 1; j <= studentsCount * 2; j++) {
        // Try more combinations to meet the target
        if (studentsCreated >= studentsCount) break; // Stop if we've created enough students

        // Generate random name combination
        const fnIndex = Math.floor(Math.random() * studentFirstNames.length);
        const lnIndex = Math.floor(Math.random() * studentLastNames.length);

        const firstName = studentFirstNames[fnIndex];
        const lastName = studentLastNames[lnIndex];
        const joiningYear =
          joiningYears[Math.floor(Math.random() * joiningYears.length)];
        const joiningYearLastTwoDigits = joiningYear.toString().slice(-2);

        // PRN format with uniqueness factor
        const prn = `PRN${branch}${(j + 100).toString().padStart(3, "0")}`;

        // Skip if PRN already exists
        if (existingPRNs.has(prn)) {
          console.log(`Student with PRN ${prn} already exists. Skipping.`);
          continue;
        }

        // Generate email with a uniqueness factor
        const uniqueSuffix = j > studentsCount ? `.${j}` : "";
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueSuffix}.btech${joiningYearLastTwoDigits}@sitpune.edu.in`;

        // Skip if email already exists
        if (existingEmails.has(email.toLowerCase())) {
          console.log(`Student email ${email} already exists. Skipping.`);
          continue;
        }

        try {
          // Semester calculation based on joining year
          const yearDiff = currentYear - joiningYear;
          const semester = Math.min(
            yearDiff * 2 + (Math.random() > 0.5 ? 1 : 2),
            8
          );

          const student = await prisma.user.create({
            data: {
              name: `${firstName} ${lastName}`,
              email: email,
              password: hashedPassword,
              role: "student",
              branch: branch,
              student: {
                create: {
                  PRN: prn,
                  branch: branch,
                  semester: semester,
                  department: department,
                },
              },
            },
            include: {
              student: true,
            },
          });

          // Add to tracking sets
          existingEmails.add(email.toLowerCase());
          existingPRNs.add(prn);

          studentsCreated++;
          console.log(
            `Created student: ${firstName} ${lastName} (${branch}, Sem ${semester})`
          );

          // Check existing electives to avoid duplicates
          const existingElectives = await prisma.electives.findMany({
            where: {
              Student_ID: student.student?.Student_ID,
            },
          });
          const existingElectiveSubjects = new Set(
            existingElectives.map((e) => e.Subject_ID)
          );

          // Assign subjects (electives) to students
          if (student.student) {
            // Get department specific subjects based on branch
            let departmentSubjects: Subject[] = [];
            if (i === 0) {
              // CSE
              departmentSubjects = createdSubjects.filter(
                (s) =>
                  s.name.includes("Data Structure") ||
                  s.name.includes("Algorithm") ||
                  s.name.includes("Compiler") ||
                  s.name.includes("Web Technologies")
              );
            } else if (i === 1) {
              // AIML
              departmentSubjects = createdSubjects.filter(
                (s) =>
                  s.name.includes("Artificial") ||
                  s.name.includes("Machine") ||
                  s.name.includes("Deep") ||
                  s.name.includes("Natural") ||
                  s.name.includes("Vision") ||
                  s.name.includes("Reinforcement")
              );
            } else if (i === 2) {
              // ENTC
              departmentSubjects = createdSubjects.filter(
                (s) =>
                  s.name.includes("Signal") ||
                  s.name.includes("VLSI") ||
                  s.name.includes("Embedded") ||
                  s.name.includes("Micro") ||
                  s.name.includes("Communication")
              );
            } else if (i === 3) {
              // MECH
              departmentSubjects = createdSubjects.filter(
                (s) =>
                  s.name.includes("Thermo") ||
                  s.name.includes("Fluid") ||
                  s.name.includes("Machine Design") ||
                  s.name.includes("Engineering Physics") ||
                  s.name.includes("Engineering Mathematics")
              );
            } else if (i === 4) {
              // CIVIL
              departmentSubjects = createdSubjects.filter(
                (s) =>
                  s.name.includes("Structural") ||
                  s.name.includes("Transport") ||
                  s.name.includes("Environment") ||
                  s.name.includes("Physics") ||
                  s.name.includes("Technical")
              );
            } else if (i === 5) {
              // RA
              departmentSubjects = createdSubjects.filter(
                (s) =>
                  s.name.includes("Robotics") ||
                  s.name.includes("Control") ||
                  s.name.includes("Mechatronics") ||
                  s.name.includes("Automation") ||
                  s.name.includes("Engineering")
              );
            }

            // Assign department subjects that don't already exist
            for (const subject of departmentSubjects) {
              if (existingElectiveSubjects.has(subject.Subject_ID)) {
                console.log(
                  `Elective ${subject.name} already assigned to student. Skipping.`
                );
                continue;
              }

              await prisma.electives.create({
                data: {
                  Student_ID: student.student.Student_ID,
                  Subject_ID: subject.Subject_ID,
                },
              });
              existingElectiveSubjects.add(subject.Subject_ID);
            }

            // Assign 3 random core subjects that don't already exist
            const eligibleCoreSubjects = coreSubjects.filter(
              (subject) => !existingElectiveSubjects.has(subject.Subject_ID)
            );

            const randomCoreSubjects = eligibleCoreSubjects
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);

            for (const subject of randomCoreSubjects) {
              await prisma.electives.create({
                data: {
                  Student_ID: student.student.Student_ID,
                  Subject_ID: subject.Subject_ID,
                },
              });
              existingElectiveSubjects.add(subject.Subject_ID);
            }

            console.log(`Assigned subjects to student ${student.name}`);
          }
        } catch (error) {
          console.error(`Error creating student with email ${email}:`, error);
          // Continue the loop to try another combination
        }
      }

      console.log(`Created ${studentsCreated} students for ${branch} branch`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Database seeded successfully with additional faculties, coordinators, students, and subjects",
        stats: {
          newSubjects: subjectsToCreate.length,
          totalSubjects: createdSubjects.length,
          newCoordinators: coordinators.length,
          newFaculties: faculties.length,
          studentsCreated: branches.reduce((total, branch, i) => {
            // Count of students created per branch
            return total + studentsCount;
          }, 0),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in operation:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error in operation: ${error?.message || "Unknown error"}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export { GET };