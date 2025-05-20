/*
  Warnings:

  - Added the required column `type` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('expense', 'income');

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "type" "CategoryType" NOT NULL;
