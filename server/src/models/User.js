import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    avatar: { type: String },
    role: { type: String, enum: ["guest", "member", "admin"], default: "member" },
    preferredLanguage: { type: String, enum: ["en", "te", "hi"], default: "en" },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plain) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 10);
};

export default mongoose.model("User", userSchema);

