"use server";
import nodemailer from "nodemailer";
import dbConnect from "@/app/lib/DBconnect";
import User from "@/app/lib/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function registerUser(formData: FormData) {
  try {
    // 1. Establish Database Connection
    await dbConnect();

    // 2. Extract Data from Form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 3. Basic Validation
    if (!name || !email || !password) {
      return { error: "All fields are required." };
    }

    // 4. Password Strength Validation (8+ chars & 1+ number)
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }
    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
      return { error: "Password must contain at least one number." };
    }

    // 5. Check if User Already Exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // 6. Hash the Password
    // '10' is the salt rounds (cost factor)
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    // 7. Create the User in MongoDB
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      otp,
      otpExpires,
      verificationToken,
      accountType: "user",
      createdAt: new Date(),
    });
    // Initialize the transporter with pooling for better reliability
    const transporter = nodemailer.createTransport({
      pool: true, // Keeps the connection open to prevent intermittent handshake failures
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_PORT === "465",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      maxConnections: 3, // Limits simultaneous connections to avoid being flagged as spam
    });

    await transporter.sendMail({
      from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
      to: email,
      subject: "Your Verification Code",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    return { success: "Otp has been sent", verificationToken };
  } catch (error: any) {
    console.error("Registration Error:", error);

    // Handle specific MongoDB errors (like network timeouts)
    if (
      error.name === "MongooseServerSelectionError" ||
      error.code === "ETIMEDOUT"
    ) {
      return {
        error: "Database connection failed. Please check your internet or VPN.",
      };
    }

    return { error: "An unexpected error occurred. Please try again." };
  }
}
