import express from "express";
import { db } from "../startup/db.js";
import { requireAuth } from "./_middleware.js";

const router = express.Router();

router.get("/", async (_req,res) => {
  const plans = await db.all('SELECT * FROM plans');
  res.json({ plans });
});

router.post("/subscribe", requireAuth, async (req, res) => {
  const userId = req.userId;
  const { planId } = req.body;
  const plan = await db.get('SELECT * FROM plans WHERE id=?', planId);
  if(!plan) return res.status(404).json({ error: 'Plan not found' });
  const user = await db.get('SELECT * FROM users WHERE id=?', userId);
  if(user.balance < plan.stake) return res.status(402).json({ error: 'Insufficient balance' });
  // deduct and create user_plan + transaction
  await db.run('UPDATE users SET balance = balance - ? WHERE id=?', [plan.stake, userId]);
  const startAt = new Date().toISOString();
  const endAt = new Date(Date.now() + plan.durationDays * 24*60*60*1000).toISOString();
  const result = await db.run('INSERT INTO user_plans (userId, planId, startAt, lastCreditedAt, endAt) VALUES (?,?,?,?,?)', [userId, planId, startAt, startAt, endAt]);
  await db.run('INSERT INTO transactions (userId,type,amount,status) VALUES (?,?,?,?)',[userId,'subscribe',plan.stake,'completed']);
  res.json({ ok:true });
});

router.get("/active", requireAuth, async (req, res) => {
  const userId = req.userId;
  // credit due ROI lazily
  // crediting logic handled by worker; but we also run a quick pass here
  res.json({ active: await db.all('SELECT up.*, p.name, p.dailyRoi, p.stake FROM user_plans up JOIN plans p ON up.planId = p.id WHERE up.userId=? AND up.active=1', userId) });
});

export default router;
