-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'INTERVIEW', 'OFFER', 'REJECTED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "description" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "salary" TEXT;

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");
