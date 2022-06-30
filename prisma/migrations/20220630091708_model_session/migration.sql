-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "exp" DATETIME NOT NULL,
    "sjwt" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "deviceType" TEXT,
    "deviceVendor" TEXT,
    "os" TEXT,
    "osVersion" INTEGER,
    "browser" TEXT,
    "browserVersion" INTEGER,
    "isBot" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sjwt_key" ON "Session"("sjwt");
