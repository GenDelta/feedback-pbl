-- CreateTable
CREATE TABLE "Tokens" (
    "User_ID" TEXT NOT NULL PRIMARY KEY,
    "tokens" TEXT NOT NULL,
    CONSTRAINT "Tokens_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "email_verified" DATETIME,
    "image" TEXT,
    "role" TEXT,
    "feedbackName_ID" TEXT,
    CONSTRAINT "users_feedbackName_ID_fkey" FOREIGN KEY ("feedbackName_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "Student_ID" TEXT NOT NULL PRIMARY KEY,
    "user_ID" TEXT NOT NULL,
    "PRN" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "feedbackName_ID" TEXT,
    CONSTRAINT "Student_feedbackName_ID_fkey" FOREIGN KEY ("feedbackName_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Student_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Faculty" (
    "Faculty_ID" TEXT NOT NULL PRIMARY KEY,
    "user_ID" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "feedbackName_ID" TEXT,
    CONSTRAINT "Faculty_feedbackName_ID_fkey" FOREIGN KEY ("feedbackName_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Faculty_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subject" (
    "Subject_ID" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "feedbackName_ID" TEXT,
    CONSTRAINT "Subject_feedbackName_ID_fkey" FOREIGN KEY ("feedbackName_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Faculty_Subject" (
    "Faculty_ID" TEXT NOT NULL,
    "Subject_ID" TEXT NOT NULL,
    "batch" TEXT NOT NULL,

    PRIMARY KEY ("Faculty_ID", "Subject_ID"),
    CONSTRAINT "Faculty_Subject_Faculty_ID_fkey" FOREIGN KEY ("Faculty_ID") REFERENCES "Faculty" ("Faculty_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Faculty_Subject_Subject_ID_fkey" FOREIGN KEY ("Subject_ID") REFERENCES "Subject" ("Subject_ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Electives" (
    "Student_ID" TEXT NOT NULL,
    "Subject_ID" TEXT NOT NULL,

    PRIMARY KEY ("Student_ID", "Subject_ID"),
    CONSTRAINT "Electives_Student_ID_fkey" FOREIGN KEY ("Student_ID") REFERENCES "Student" ("Student_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Electives_Subject_ID_fkey" FOREIGN KEY ("Subject_ID") REFERENCES "Subject" ("Subject_ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "feedback_name" (
    "Feedback_Name_ID" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Questions" (
    "Question_ID" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "feedback_ID" TEXT NOT NULL,
    CONSTRAINT "Questions_feedback_ID_fkey" FOREIGN KEY ("feedback_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feedback" (
    "Feedback_ID" TEXT NOT NULL PRIMARY KEY,
    "feedback_name_ID" TEXT NOT NULL,
    "student_ID" TEXT NOT NULL,
    "faculty_ID" TEXT NOT NULL,
    "subject_ID" TEXT NOT NULL,
    "question_ID" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_feedback_name_ID_fkey" FOREIGN KEY ("feedback_name_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_student_ID_fkey" FOREIGN KEY ("student_ID") REFERENCES "Student" ("Student_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_faculty_ID_fkey" FOREIGN KEY ("faculty_ID") REFERENCES "Faculty" ("Faculty_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_subject_ID_fkey" FOREIGN KEY ("subject_ID") REFERENCES "Subject" ("Subject_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_question_ID_fkey" FOREIGN KEY ("question_ID") REFERENCES "Questions" ("Question_ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "token_type" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "scope" TEXT,
    "id_token" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_User_ID_key" ON "Tokens"("User_ID");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_user_ID_key" ON "Student"("user_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Student_PRN_key" ON "Student"("PRN");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_user_ID_key" ON "Faculty"("user_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_student_ID_faculty_ID_subject_ID_question_ID_feedback_name_ID_key" ON "Feedback"("student_ID", "faculty_ID", "subject_ID", "question_ID", "feedback_name_ID");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_token_key" ON "VerificationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_VerificationRequest_identifier_token" ON "VerificationRequest"("identifier", "token");
