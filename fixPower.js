import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { recalcPower } from './index.js';   // if you exported it; else paste code here

for (const u of await prisma.user.findMany()) {
    const pow = await recalcPower(u.id);
    console.log(`${u.username}: ${pow}`);
}
process.exit();
