import mongoose, { Schema, Document } from "mongoose";

export interface iUser extends Document {
  email: string;
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  accountType: string;
}

const userSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false, // Not required for OAuth users
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  accountType: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: false,
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpires: {
    type: Date,
    required: false,
  },
  verificationToken: {
    type: String,
    required: false,
  },
});

const User = mongoose.models.User || mongoose.model<iUser>("User", userSchema);

export default User;
