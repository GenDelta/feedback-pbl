/*
  Warnings:

  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "email_verified" DATETIME,
    "image" TEXT,
    "role" TEXT,
    "feedbackName_ID" TEXT,
    CONSTRAINT "users_feedbackName_ID_fkey" FOREIGN KEY ("feedbackName_ID") REFERENCES "feedback_name" ("Feedback_Name_ID") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("email", "email_verified", "feedbackName_ID", "id", "image", "password", "role") SELECT "email", "email_verified", "feedbackName_ID", "id", "image", "password", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
