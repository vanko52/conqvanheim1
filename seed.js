import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const runes = JSON.parse(fs.readFileSync('./runes_seed.json', 'utf8'));

await prisma.rune.createMany({ data: runes, skipDuplicates: true });
console.log('Seeded', runes.length, 'runes');
process.exit();
