-- CreateTable
CREATE TABLE "Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "slot" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    CONSTRAINT "Equipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_inventoryId_key" ON "Equipment"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_userId_slot_key" ON "Equipment"("userId", "slot");
