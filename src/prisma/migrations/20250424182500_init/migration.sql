-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feedback" (
    "Feedback_ID" TEXT NOT NULL PRIMARY KEY,
    "feedback_name_ID" TEXT NOT NULL,
    "student_ID" TEXT NOT NULL,
    "faculty_ID" TEXT NOT NULL,
    "subject_ID" TEXT NOT NULL,
    "question_ID" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isValid" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Feedback_feedback_name_ID_fkey" FOREIGN KEY ("feedback_name_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_student_ID_fkey" FOREIGN KEY ("student_ID") REFERENCES "Student" ("Student_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_faculty_ID_fkey" FOREIGN KEY ("faculty_ID") REFERENCES "Faculty" ("Faculty_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_subject_ID_fkey" FOREIGN KEY ("subject_ID") REFERENCES "Subject" ("Subject_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_question_ID_fkey" FOREIGN KEY ("question_ID") REFERENCES "Questions" ("Question_ID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Feedback" ("Feedback_ID", "answer", "faculty_ID", "feedback_name_ID", "question_ID", "student_ID", "subject_ID", "timestamp") SELECT "Feedback_ID", "answer", "faculty_ID", "feedback_name_ID", "question_ID", "student_ID", "subject_ID", "timestamp" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
CREATE UNIQUE INDEX "Feedback_student_ID_faculty_ID_subject_ID_question_ID_feedback_name_ID_key" ON "Feedback"("student_ID", "faculty_ID", "subject_ID", "question_ID", "feedback_name_ID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
