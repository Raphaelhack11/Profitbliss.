import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import planRoutes from "./routes/plans.js";
import txRoutes from "./routes/transactions.js";
import msgRoutes from "./routes/messages.js";

dotenv.config();

const app = express();
app.use(express.json());

// Allow requests from your frontend
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/messages", msgRoutes);

// Example: access environment variables
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ROI_WORKER_INTERVAL_MINUTES = process.env.ROI_WORKER_INTERVAL_MINUTES;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin Email: ${ADMIN_EMAIL}`);
});
