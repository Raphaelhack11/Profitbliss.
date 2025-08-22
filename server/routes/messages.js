import express from "express";
import { db } from "../startup/db.js";
import { requireAuth } from "./_middleware.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { body } = req.body;
  const userId = req.userId;
  await db.run('INSERT INTO messages (userId,body,fromAdmin) VALUES (?,?,?)', [userId, body, 0]);
  res.json({ ok: true });
});

router.get("/mine", requireAuth, async (req,res) => {
  const userId = req.userId;
  const rows = await db.all('SELECT * FROM messages WHERE userId=? ORDER BY createdAt DESC', userId);
  res.json({ messages: rows });
});

export default router;
