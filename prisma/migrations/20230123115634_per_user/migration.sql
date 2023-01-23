/*
  Warnings:

  - The primary key for the `SavedFacts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `SavedFacts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavedFacts" (
    "userId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "hash"),
    CONSTRAINT "SavedFacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavedFacts" ("createdAt", "fact", "hash") SELECT "createdAt", "fact", "hash" FROM "SavedFacts";
DROP TABLE "SavedFacts";
ALTER TABLE "new_SavedFacts" RENAME TO "SavedFacts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
