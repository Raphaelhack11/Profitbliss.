import express from "express";
import { db } from "../startup/db.js";
import { requireAuth } from "./_middleware.js";

const router = express.Router();

router.post("/deposit", requireAuth, async (req, res) => {
  const userId = req.userId;
  const { amount, currency } = req.body;
  if(!amount || amount < 50) return res.status(400).json({ error: 'Minimum deposit $50' });
  // create pending deposit for admin approval (assuming manual)
  await db.run('INSERT INTO transactions (userId,type,amount,currency,status) VALUES (?,?,?,?,?)', [userId, 'deposit', amount, currency||'USD', 'pending']);
  res.json({ ok: true, message: 'Deposit recorded as pending. Admin will approve after verification.' });
});

router.post("/withdraw", requireAuth, async (req, res) => {
  const userId = req.userId;
  const { amount, toAddress } = req.body;
  if(!amount || amount < 70) return res.status(400).json({ error: 'Minimum withdrawal $70' });
  const user = await db.get('SELECT balance FROM users WHERE id=?', userId);
  if(user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });
  // create pending withdrawal for admin
  await db.run('INSERT INTO transactions (userId,type,amount,status,meta) VALUES (?,?,?,?,?)', [userId,'withdrawal',amount,'pending', JSON.stringify({ toAddress })]);
  res.json({ ok: true, message: 'Withdrawal request submitted (pending admin approval).' });
});

router.get("/history", requireAuth, async (req, res) => {
  const userId = req.userId;
  const txs = await db.all('SELECT * FROM transactions WHERE userId=? ORDER BY createdAt DESC', userId);
  res.json({ transactions: txs });
});

export default router;
