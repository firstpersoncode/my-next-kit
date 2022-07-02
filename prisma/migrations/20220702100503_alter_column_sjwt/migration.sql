-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "exp" DATETIME NOT NULL,
    "sjwt" TEXT,
    "source" TEXT NOT NULL,
    "deviceType" TEXT,
    "deviceVendor" TEXT,
    "os" TEXT,
    "osVersion" INTEGER,
    "browser" TEXT,
    "browserVersion" INTEGER,
    "isBot" BOOLEAN
);
INSERT INTO "new_Session" ("browser", "browserVersion", "createdAt", "deviceType", "deviceVendor", "exp", "id", "isBot", "os", "osVersion", "sjwt", "source", "updatedAt") SELECT "browser", "browserVersion", "createdAt", "deviceType", "deviceVendor", "exp", "id", "isBot", "os", "osVersion", "sjwt", "source", "updatedAt" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_sjwt_key" ON "Session"("sjwt");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
