-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('cash', 'blank', 'saving', 'credit', 'debt');

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "type" "AccountType";
