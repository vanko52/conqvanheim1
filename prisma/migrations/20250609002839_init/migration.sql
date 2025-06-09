-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "power" INTEGER NOT NULL DEFAULT 0,
    "lastPullAt" DATETIME
);

-- CreateTable
CREATE TABLE "Rune" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stat" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "value" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "runeId" INTEGER NOT NULL,
    CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inventory_runeId_fkey" FOREIGN KEY ("runeId") REFERENCES "Rune" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
