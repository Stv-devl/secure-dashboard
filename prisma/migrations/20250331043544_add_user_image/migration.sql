/*
  Warnings:

  - You are about to drop the column `subscription` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "subscription";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "files",
ADD COLUMN     "image" TEXT;
