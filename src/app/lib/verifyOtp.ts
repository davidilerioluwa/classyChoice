"use server";
import dbConnect from "./DBconnect";
import User from "./models/User";

export async function verifyOtp(verificationToken: string, otp: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return { error: "User not found." };
    }
    if (user.otp !== otp) {
      return { error: "Invalid OTP." };
    }
    if (user.otpExpires < new Date()) {
      return { error: "OTP has expired." };
    }
    // OTP is valid, you can mark the user as verified or perform other actions
    user.otp = null;
    user.otpExpires = null;
    user.verificationToken = null;
    user.isVerified = true; // Mark the user as verified
    await user.save();
    return { success: true };
  } catch (error) {
    console.error("OTP verification error:", error);
    return { error: "An error occurred during OTP verification." };
  }
}
