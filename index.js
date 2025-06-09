// ──────────────────── imports ───────────────────────────────
import express from 'express';
import cors     from 'cors';
import bcrypt   from 'bcryptjs';
import jwt      from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// ──────────────────── setup ─────────────────────────────────
const prisma = new PrismaClient();
const app    = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// ──────────────────── helpers ───────────────────────────────
function tokenForUser(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

const rarities = [
  { name: 'common',    weight: 55, mult: 1 },
  { name: 'rare',      weight: 25, mult: 2 },
  { name: 'epic',      weight: 12, mult: 4 },
  { name: 'legendary', weight:  7, mult: 7 },
  { name: 'ancient',   weight:  1, mult:12 },
];
const stats = ['length','thickness','power','divinity','vitality','strength'];

function weightedPick(arr) {
  const total = arr.reduce((s, r) => s + r.weight, 0);
  let rnd = Math.random() * total;
  for (const r of arr) {
    if (rnd < r.weight) return r;
    rnd -= r.weight;
  }
  return arr[0];
}

function rollRune() {
  const stat   = stats[Math.floor(Math.random() * stats.length)];
  const rarity = weightedPick(rarities);
  const value  = Math.floor(Math.random() * 16) + 5;   // 5–20
  return { stat, rarity: rarity.name, value };
}

// ── recompute Power from EQUIPPED runes only ────────────────
async function recalcPower(userId) {
  const eq = await prisma.equipment.findMany({
    where:   { userId },
    include: { inventory: { include: { rune: true } } }
  });
  const power = eq.reduce((sum, e) => {
    const mult = rarities.find(r => r.name === e.inventory.rune.rarity).mult;
    return sum + e.inventory.rune.value * mult;
  }, 0);
  await prisma.user.update({ where: { id: userId }, data: { power } });
  return power;
}

// ──────────────────── routes ────────────────────────────────
// 1.  Register
app.post('/api/register', async (req,res)=>{
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username & password required' });
  if (!/Conq$/i.test(username))
    return res.status(400).json({ error: 'Username must end with "Conq"' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data:{ username, password: hash }});
    res.json({ token: tokenForUser(user) });
  } catch {
    res.status(400).json({ error: 'Username taken' });
  }
});

// 2.  Login
app.post('/api/login', async (req,res)=>{
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username }});
  if (!user) return res.status(400).json({ error: 'Bad credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Bad credentials' });

  res.json({ token: tokenForUser(user) });
});

// 3.  Current user
app.get('/api/me', auth, async (req,res)=>{
  const user = await prisma.user.findUnique({
    where:  { id: req.user.id },
    include:{ inventory:{ include:{ rune:true } },
      equipment:{ include:{ inventory:{ include:{ rune:true }}}}}
  });
  res.json(user);
});

// 4.  Pull (gacha) — no power update
app.post('/api/pull', auth, async (req,res)=>{
  const user = await prisma.user.findUnique({ where: { id: req.user.id }});
  const now  = Date.now();
  const COOLDOWN = 1000*60*60*12;        // 12 h

  if (user.lastPullAt && now - user.lastPullAt.getTime() < COOLDOWN) {
    return res.status(429).json({ error:'Cooldown' });
  }

  const runeData = rollRune();
  const rune     = await prisma.rune.create({ data: runeData });
  await prisma.inventory.create({ data:{ userId:user.id, runeId:rune.id }});
  await prisma.user.update({ where:{ id:user.id }, data:{ lastPullAt:new Date(now) }});

  res.json({ rune });
});

// 5.  Get equipped items
app.get('/api/equipment', auth, async (req,res)=>{
  const eq = await prisma.equipment.findMany({
    where:   { userId: req.user.id },
    include: { inventory: { include: { rune:true } } }
  });
  res.json(eq);
});

// 6.  Equip
app.post('/api/equip', auth, async (req,res)=>{
  const { inventoryId } = req.body;

  const inv = await prisma.inventory.findUnique({
    where: { id: inventoryId },
    include:{ rune:true }
  });
  if (!inv || inv.userId !== req.user.id) return res.sendStatus(403);

  // one per slot → remove previous
  await prisma.equipment.deleteMany({
    where:{ userId:req.user.id, slot:inv.rune.stat }
  });

  const eq = await prisma.equipment.create({
    data:{ userId:req.user.id, slot:inv.rune.stat, inventoryId }
  });

  await recalcPower(req.user.id);
  res.json(eq);
});

// 7.  Unequip
app.post('/api/unequip', auth, async (req,res)=>{
  const { slot } = req.body;

  await prisma.equipment.deleteMany({
    where:{ userId:req.user.id, slot }
  });

  await recalcPower(req.user.id);
  res.json({ ok:true });
});

// 8.  Leaderboard
app.get('/api/leaderboard', async (_req,res)=>{
  const board = await prisma.user.findMany({
    orderBy:{ power:'desc' },
    take:100,
    select:{ username:true, power:true }
  });
  res.json(board);
});

// 9.  Health-check (optional)
app.get('/api/health', (_req,res)=> res.json({ ok:true }));

// ──────────────────── start server ──────────────────────────
const PORT = process.env.PORT || 4000;
import path from 'path';
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, ()=> console.log('⚡ Conq backend ready on port', PORT));

// (optional) export for scripts
export { recalcPower };
