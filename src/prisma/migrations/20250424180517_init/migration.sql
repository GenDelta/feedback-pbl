-- CreateTable
CREATE TABLE "Remarks" (
    "Remark_ID" TEXT NOT NULL PRIMARY KEY,
    "remark" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
