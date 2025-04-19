-- CreateTable
CREATE TABLE "Tokens" (
    "User_ID" TEXT NOT NULL PRIMARY KEY,
    "tokens" TEXT NOT NULL,
    CONSTRAINT "Tokens_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "User" ("user_ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "user_ID" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL,
    "feedbackName_ID" TEXT,
    CONSTRAINT "User_feedbackName_ID_fkey" FOREIGN KEY ("feedbackName_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE SET NULL ON UPDATE CASCADE
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
    CONSTRAINT "Student_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "User" ("user_ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Faculty" (
    "Faculty_ID" TEXT NOT NULL PRIMARY KEY,
    "user_ID" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "feedbackName_ID" TEXT,
    CONSTRAINT "Faculty_feedbackName_ID_fkey" FOREIGN KEY ("feedbackName_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Faculty_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "User" ("user_ID") ON DELETE CASCADE ON UPDATE CASCADE
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

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_User_ID_key" ON "Tokens"("User_ID");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_user_ID_key" ON "Student"("user_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Student_PRN_key" ON "Student"("PRN");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_user_ID_key" ON "Faculty"("user_ID");
