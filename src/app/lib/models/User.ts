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
  signInCount: {
    type: Number,
    required: false,
    default: 0,
  },
});

const User = mongoose.models.User || mongoose.model<iUser>("User", userSchema);

export default User;
