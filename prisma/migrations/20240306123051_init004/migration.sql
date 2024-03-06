/*
  Warnings:

  - The values [PERSONAL,COMPANY] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `PasswordResetToken` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `TwoFactorConfirmation` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `TwoFactorToken` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_email_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_email_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "TwoFactorConfirmation" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "TwoFactorToken" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "username",
ADD COLUMN     "name" TEXT,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "created_at";

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "linkedinLink" TEXT,
    "githubLink" TEXT,
    "profileImage" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_linkedinLink_key" ON "Account"("linkedinLink");

-- CreateIndex
CREATE UNIQUE INDEX "Account_githubLink_key" ON "Account"("githubLink");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
