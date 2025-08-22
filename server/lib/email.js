import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendVerificationEmail(to, token){
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=${token}`;
  const mail = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your Profit Bliss account",
    html: `<p>Welcome to Profit Bliss — click to verify your email:</p>
           <p><a href="${verifyUrl}">Verify email</a></p>`
  };
  await transporter.sendMail(mail);
}
