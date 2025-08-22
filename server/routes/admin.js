import express from "express";
import { db } from "../startup/db.js";
import { requireAdmin } from "./_middleware.js";

const router = express.Router();

router.get("/pending/deposits", requireAdmin, async (_req, res) => {
  const rows = await db.all("SELECT t.*, u.email FROM transactions t JOIN users u ON t.userId = u.id WHERE t.type='deposit' AND t.status='pending' ORDER BY t.createdAt DESC");
  res.json({ pending: rows });
});

router.post("/deposits/:id/approve", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const tx = await db.get('SELECT * FROM transactions WHERE id=?', id);
  if(!tx) return res.status(404).json({ error: 'Not found' });
  if(tx.status !== 'pending') return res.status(400).json({ error: 'Not pending' });
  await db.run('UPDATE transactions SET status=? WHERE id=?', ['completed', id]);
  await db.run('UPDATE users SET balance = balance + ? WHERE id=?', [tx.amount, tx.userId]);
  res.json({ ok: true });
});

router.get("/pending/withdrawals", requireAdmin, async (_req, res) => {
  const rows = await db.all("SELECT t.*, u.email FROM transactions t JOIN users u ON t.userId = u.id WHERE t.type='withdrawal' AND t.status='pending' ORDER BY t.createdAt DESC");
  res.json({ pending: rows });
});

router.post("/withdrawals/:id/approve", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const tx = await db.get('SELECT * FROM transactions WHERE id=?', id);
  if(!tx) return res.status(404).json({ error: 'Not found' });
  if(tx.status !== 'pending') return res.status(400).json({ error: 'Not pending' });
  // deduct balance and mark completed
  await db.run('UPDATE users SET balance = balance - ? WHERE id=?', [tx.amount, tx.userId]);
  await db.run('UPDATE transactions SET status=? WHERE id=?', ['completed', id]);
  res.json({ ok: true });
});

router.get("/users", requireAdmin, async (_req,res) => {
  const rows = await db.all('SELECT id,name,email,balance,isAdmin,emailVerified,createdAt FROM users ORDER BY createdAt DESC');
  res.json({ users: rows });
});

export default router;
