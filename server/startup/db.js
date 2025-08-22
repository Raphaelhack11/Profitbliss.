import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import fs from 'fs';
const DB_PATH = './data/profitbliss.sqlite';

export let db;

export async function initDb(){
  // Ensure data dir
  if(!fs.existsSync('./data')) fs.mkdirSync('./data');
  db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      passwordHash TEXT,
      phone TEXT,
      isAdmin INTEGER DEFAULT 0,
      emailVerified INTEGER DEFAULT 0,
      balance REAL DEFAULT 0,
      referral TEXT,
      createdAt DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      stake REAL,
      dailyRoi REAL,
      durationDays INTEGER
    );

    CREATE TABLE IF NOT EXISTS user_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      planId INTEGER,
      startAt DATETIME DEFAULT (datetime('now')),
      lastCreditedAt DATETIME,
      endAt DATETIME,
      active INTEGER DEFAULT 1,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(planId) REFERENCES plans(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      type TEXT, -- deposit|withdrawal|roi|subscribe
      amount REAL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending', -- pending|completed|failed
      meta TEXT,
      createdAt DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      fromAdmin INTEGER DEFAULT 0,
      body TEXT,
      createdAt DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);
}

export async function seedInitialData(){
  // seed admin & demo user & plans
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@profitbliss.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const demoEmail = 'user@profitbliss.com';
  const demoPassword = 'password123';

  const admin = await db.get('SELECT id FROM users WHERE email = ?', adminEmail);
  if(!admin){
    const hash = await bcrypt.hash(adminPassword, 10);
    await db.run(
      'INSERT INTO users (name,email,passwordHash,isAdmin,emailVerified,balance) VALUES (?,?,?,?,?,?)',
      ['Admin', adminEmail, hash, 1, 1, 0]
    );
    console.log('Admin seeded');
  }

  const demo = await db.get('SELECT id FROM users WHERE email = ?', demoEmail);
  if(!demo){
    const hash = await bcrypt.hash(demoPassword, 10);
    await db.run(
      'INSERT INTO users (name,email,passwordHash,isAdmin,emailVerified,balance) VALUES (?,?,?,?,?,?)',
      ['Demo User', demoEmail, hash, 0, 1, 500]
    );
    console.log('Demo user seeded (balance $500)');
  }

  // seed plans if empty
  const count = await db.get('SELECT COUNT(*) as c FROM plans');
  if(count.c == 0){
    const plans = [
      ['Basic', 50, 0.20, 30],
      ['Gold', 100, 0.35, 30],
      ['Master', 200, 0.50, 30],
      ['Premium', 300, 0.75, 30],
    ];
    for(const p of plans){
      await db.run('INSERT INTO plans (name, stake, dailyRoi, durationDays) VALUES (?,?,?,?)', p);
    }
    console.log('Plans seeded');
  }
                }
