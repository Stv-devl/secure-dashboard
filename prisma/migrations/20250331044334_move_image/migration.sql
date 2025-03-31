/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image";
