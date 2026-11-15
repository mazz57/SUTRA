-- CreateEnum
CREATE TYPE "DisasterStatus" AS ENUM ('ACTIVE', 'CONTAINED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ShelterPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('OPTIMAL', 'FEASIBLE', 'INFEASIBLE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Disaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "disasterType" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "status" "DisasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shelter" (
    "id" TEXT NOT NULL,
    "disasterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "population" INTEGER NOT NULL DEFAULT 0,
    "capacity" INTEGER NOT NULL,
    "priority" "ShelterPriority" NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shelter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "disasterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "weightPerUnit" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "availableQuantity" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demand" (
    "id" TEXT NOT NULL,
    "shelterId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "requiredQuantity" INTEGER NOT NULL,
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "priority" "ShelterPriority" NOT NULL DEFAULT 'MEDIUM',
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Demand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadNode" (
    "id" TEXT NOT NULL,
    "disasterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RoadNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadEdge" (
    "id" TEXT NOT NULL,
    "disasterId" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "destinationNodeId" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "travelTimeMin" DOUBLE PRECISION NOT NULL,
    "isAccessible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RoadEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllocationRun" (
    "id" TEXT NOT NULL,
    "disasterId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "algorithm" TEXT NOT NULL,
    "status" "AllocationStatus" NOT NULL DEFAULT 'UNKNOWN',
    "objectiveValue" DOUBLE PRECISION,
    "executionTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllocationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllocationLine" (
    "id" TEXT NOT NULL,
    "allocationRunId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "shelterId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "allocatedQuantity" INTEGER NOT NULL,
    "routeDistanceKm" DOUBLE PRECISION,
    "reasonCode" TEXT,

    CONSTRAINT "AllocationLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shelter_disasterId_idx" ON "Shelter"("disasterId");

-- CreateIndex
CREATE INDEX "Warehouse_disasterId_idx" ON "Warehouse"("disasterId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_key" ON "Resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_warehouseId_resourceId_key" ON "Inventory"("warehouseId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Demand_shelterId_resourceId_key" ON "Demand"("shelterId", "resourceId");

-- CreateIndex
CREATE INDEX "RoadNode_disasterId_idx" ON "RoadNode"("disasterId");

-- CreateIndex
CREATE INDEX "RoadEdge_disasterId_idx" ON "RoadEdge"("disasterId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadEdge_sourceNodeId_destinationNodeId_key" ON "RoadEdge"("sourceNodeId", "destinationNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "AllocationRun_disasterId_version_key" ON "AllocationRun"("disasterId", "version");

-- CreateIndex
CREATE INDEX "AllocationLine_allocationRunId_idx" ON "AllocationLine"("allocationRunId");

-- AddForeignKey
ALTER TABLE "Shelter" ADD CONSTRAINT "Shelter_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "Disaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "Disaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demand" ADD CONSTRAINT "Demand_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demand" ADD CONSTRAINT "Demand_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadNode" ADD CONSTRAINT "RoadNode_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "Disaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadEdge" ADD CONSTRAINT "RoadEdge_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "Disaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadEdge" ADD CONSTRAINT "RoadEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "RoadNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadEdge" ADD CONSTRAINT "RoadEdge_destinationNodeId_fkey" FOREIGN KEY ("destinationNodeId") REFERENCES "RoadNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationRun" ADD CONSTRAINT "AllocationRun_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "Disaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationLine" ADD CONSTRAINT "AllocationLine_allocationRunId_fkey" FOREIGN KEY ("allocationRunId") REFERENCES "AllocationRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationLine" ADD CONSTRAINT "AllocationLine_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationLine" ADD CONSTRAINT "AllocationLine_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationLine" ADD CONSTRAINT "AllocationLine_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
