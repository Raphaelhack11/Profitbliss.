import jwt from "jsonwebtoken";
import { db } from "../startup/db.js";

const SECRET = process.env.JWT_SECRET || "secret";

export async function requireAuth(req, res, next){
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId;
    req.isAdmin = payload.isAdmin;
    next();
  } catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function requireAdmin(req,res,next){
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, SECRET);
    if(!payload.isAdmin) return res.status(403).json({ error: 'Admin required' });
    req.userId = payload.userId;
    req.isAdmin = true;
    next();
  } catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}
