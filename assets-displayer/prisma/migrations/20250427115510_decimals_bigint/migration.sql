/*
  Warnings:

  - You are about to alter the column `decimals` on the `Token` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" BIGINT NOT NULL,
    "totalSupply" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Token" ("address", "createdAt", "decimals", "id", "logoUrl", "name", "symbol", "totalSupply", "updatedAt") SELECT "address", "createdAt", "decimals", "id", "logoUrl", "name", "symbol", "totalSupply", "updatedAt" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token_address_key" ON "Token"("address");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
