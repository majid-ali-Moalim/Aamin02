/*
  Warnings:

  - The values [ON_THE_WAY,ARRIVED,PICKED_UP,AT_HOSPITAL] on the enum `EmergencyRequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[patientCode]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientCode` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('ACCIDENT', 'MEDICAL', 'PREGNANCY', 'TRAUMA', 'CARDIAC', 'FIRE_INCIDENT', 'VIOLENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "RequestSource" AS ENUM ('PHONE_CALL', 'WALK_IN', 'STAFF', 'REFERRAL', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "EmergencyRequestStatus_new" AS ENUM ('PENDING', 'ASSIGNED', 'DISPATCHED', 'ON_SCENE', 'TRANSPORTING', 'ARRIVED_HOSPITAL', 'COMPLETED', 'CANCELLED');
ALTER TABLE "emergency_requests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "emergency_requests" ALTER COLUMN "status" TYPE "EmergencyRequestStatus_new" USING ("status"::text::"EmergencyRequestStatus_new");
ALTER TABLE "emergency_status_logs" ALTER COLUMN "fromStatus" TYPE "EmergencyRequestStatus_new" USING ("fromStatus"::text::"EmergencyRequestStatus_new");
ALTER TABLE "emergency_status_logs" ALTER COLUMN "toStatus" TYPE "EmergencyRequestStatus_new" USING ("toStatus"::text::"EmergencyRequestStatus_new");
ALTER TYPE "EmergencyRequestStatus" RENAME TO "EmergencyRequestStatus_old";
ALTER TYPE "EmergencyRequestStatus_new" RENAME TO "EmergencyRequestStatus";
DROP TYPE "EmergencyRequestStatus_old";
ALTER TABLE "emergency_requests" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "emergency_requests" ADD COLUMN     "arrivedAtSceneAt" TIMESTAMP(3),
ADD COLUMN     "arrivedDestinationAt" TIMESTAMP(3),
ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "callerName" TEXT,
ADD COLUMN     "callerPhone" TEXT,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "departedSceneAt" TIMESTAMP(3),
ADD COLUMN     "destinationLandmark" TEXT,
ADD COLUMN     "dispatchedAt" TIMESTAMP(3),
ADD COLUMN     "incidentType" "IncidentType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "manualDispatchNotes" TEXT,
ADD COLUMN     "patientCondition" TEXT,
ADD COLUMN     "pickupLandmark" TEXT,
ADD COLUMN     "requestSource" "RequestSource" NOT NULL DEFAULT 'PHONE_CALL',
ADD COLUMN     "responseMinutes" INTEGER,
ADD COLUMN     "serviceMinutes" INTEGER,
ADD COLUMN     "symptoms" TEXT;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "bloodType" "BloodType",
ADD COLUMN     "conditions" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "insuranceProvider" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "patientCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "emergency_status_logs" (
    "id" TEXT NOT NULL,
    "emergencyRequestId" TEXT NOT NULL,
    "fromStatus" "EmergencyRequestStatus",
    "toStatus" "EmergencyRequestStatus" NOT NULL,
    "notes" TEXT,
    "changedByEmployeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emergency_status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "emergency_status_logs_emergencyRequestId_idx" ON "emergency_status_logs"("emergencyRequestId");

-- CreateIndex
CREATE INDEX "emergency_status_logs_changedByEmployeeId_idx" ON "emergency_status_logs"("changedByEmployeeId");

-- CreateIndex
CREATE INDEX "emergency_requests_patientId_idx" ON "emergency_requests"("patientId");

-- CreateIndex
CREATE INDEX "emergency_requests_dispatcherId_idx" ON "emergency_requests"("dispatcherId");

-- CreateIndex
CREATE INDEX "emergency_requests_driverId_idx" ON "emergency_requests"("driverId");

-- CreateIndex
CREATE INDEX "emergency_requests_ambulanceId_idx" ON "emergency_requests"("ambulanceId");

-- CreateIndex
CREATE INDEX "emergency_requests_status_idx" ON "emergency_requests"("status");

-- CreateIndex
CREATE INDEX "emergency_requests_priority_idx" ON "emergency_requests"("priority");

-- CreateIndex
CREATE INDEX "emergency_requests_createdAt_idx" ON "emergency_requests"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "patients_patientCode_key" ON "patients"("patientCode");

-- AddForeignKey
ALTER TABLE "emergency_status_logs" ADD CONSTRAINT "emergency_status_logs_emergencyRequestId_fkey" FOREIGN KEY ("emergencyRequestId") REFERENCES "emergency_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_status_logs" ADD CONSTRAINT "emergency_status_logs_changedByEmployeeId_fkey" FOREIGN KEY ("changedByEmployeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
