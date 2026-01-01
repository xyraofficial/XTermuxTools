import express from 'express';
import { db } from './db';
import { users, chatSessions } from './schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({
      email,
      password: hashedPassword,
      username
    }).returning();
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ user, token });
});

// Chat Sync
router.get('/chats', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send();
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const sessions = await db.select().from(chatSessions).where(eq(chatSessions.userId, decoded.userId));
    res.json(sessions);
  } catch (err) {
    res.status(401).send();
  }
});

router.post('/chats', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send();
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const { id, title, messages } = req.body;
    await db.insert(chatSessions).values({
      id,
      userId: decoded.userId,
      title,
      messages
    }).onConflictDoUpdate({
      target: chatSessions.id,
      set: { title, messages, updatedAt: new Date() }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;