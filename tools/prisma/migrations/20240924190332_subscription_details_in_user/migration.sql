-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planId" TEXT DEFAULT '',
ADD COLUMN     "trialAvailed" BOOLEAN NOT NULL DEFAULT false;
