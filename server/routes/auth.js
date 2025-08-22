import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../startup/db.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { sendVerificationEmail } from "../lib/email.js";

const router = express.Router();

// In-memory token store for verification tokens (simple). For production store in DB.
const verifyTokensFile = './data/verify_tokens.json';
let verifyTokens = {};
try { verifyTokens = JSON.parse(fs.readFileSync(verifyTokensFile,'utf8')||'{}') } catch(e){ verifyTokens = {} }

function saveTokens(){ fs.writeFileSync(verifyTokensFile, JSON.stringify(verifyTokens||{})); }

router.post("/register", async (req, res) => {
  const { name, email, password, phone, referral } = req.body;
  if(referral && referral !== 'tmdf28dns'){
    return res.status(400).json({ error: 'Invalid referral code' });
  }
  const pwHash = await bcrypt.hash(password, 10);
  try {
    await db.run('INSERT INTO users (name,email,passwordHash,phone,referral) VALUES (?,?,?,?,?)',[name,email,pwHash,phone,referral||null]);
    // create verification token
    const token = uuidv4();
    verifyTokens[token] = { email, createdAt: Date.now() };
    saveTokens();
    await sendVerificationEmail(email, token);
    res.json({ ok: true, message: 'Registered — verification email sent' });
  } catch(err){
    res.status(400).json({ error: err.message });
  }
});

router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;
  const user = await db.get('SELECT id,email,emailVerified FROM users WHERE email=?', email);
  if(!user) return res.status(404).json({ error: 'User not found' });
  if(user.emailVerified) return res.json({ ok: true, message: 'Already verified' });
  const token = uuidv4();
  verifyTokens[token] = { email, createdAt: Date.now() };
  saveTokens();
  await sendVerificationEmail(email, token);
  res.json({ ok:true });
});

router.get("/verify/:token", async (req, res) => {
  const t = req.params.token;
  if(!verifyTokens[t]) return res.status(400).send('Invalid or expired token');
  const { email } = verifyTokens[t];
  await db.run('UPDATE users SET emailVerified=1 WHERE email=?', email);
  delete verifyTokens[t];
  saveTokens();
  // redirect to frontend success page
  const FE = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(`${FE}/verified`);
});

router.post("/login", async (req,res) => {
  const { email, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE email=?', email);
  if(!user) return res.status(401).json({ error: 'Invalid credentials' });
  if(!user.emailVerified) return res.status(403).json({ error: 'Email not verified' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, isAdmin: !!user.isAdmin }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, balance: user.balance, name: user.name }});
});

export default router;
