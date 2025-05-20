/*
  Warnings:

  - Added the required column `start_date` to the `budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "budget" ADD COLUMN     "start_date" INTEGER NOT NULL;
