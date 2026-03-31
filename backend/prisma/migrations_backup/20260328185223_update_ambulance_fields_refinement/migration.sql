-- AlterTable
ALTER TABLE "ambulances" ADD COLUMN     "crewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentArea" TEXT,
ADD COLUMN     "equipmentLevel" TEXT,
ADD COLUMN     "fuelLevel" INTEGER DEFAULT 100,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastMaintenance" TIMESTAMP(3),
ADD COLUMN     "mileage" INTEGER DEFAULT 0,
ADD COLUMN     "nextMaintenance" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "stationId" TEXT,
ADD COLUMN     "vehicleBrand" TEXT,
ADD COLUMN     "vehicleModel" TEXT,
ADD COLUMN     "vehicleType" TEXT;
