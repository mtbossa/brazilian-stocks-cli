-- CreateTable
CREATE TABLE "Sector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subsector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sectorId" INTEGER NOT NULL,
    CONSTRAINT "Subsector_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "subsectorId" INTEGER NOT NULL,
    CONSTRAINT "Segment_subsectorId_fkey" FOREIGN KEY ("subsectorId") REFERENCES "Subsector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompanyCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "segmentId" INTEGER NOT NULL,
    CONSTRAINT "CompanyCode_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "Segment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Sector_name_key" ON "Sector"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subsector_name_key" ON "Subsector"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_name_key" ON "Segment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyCode_code_key" ON "CompanyCode"("code");
