import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID);

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role, name: user.name }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Google token is required" });
  }

  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    env.GOOGLE_CLIENT_ID ||
    "92086230756-iq85ekta3fc2q0kjlbu2g3ar6rpu5i7f.apps.googleusercontent.com";

  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    return res.status(400).json({ error: "Invalid Google token payload" });
  }

  const { email, name, picture } = payload;
  let user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    user = await User.create({
      name: name || email.split("@")[0],
      email: email.toLowerCase().trim(),
      authProvider: "google",
      avatar: picture,
      role: "member",
    });
  } else if (!user.avatar && picture) {
    user.avatar = picture;
    await user.save();
  }

  res.json({ token: signToken(user), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  res.json({ user: publicUser(user) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const matches = await user.comparePassword(currentPassword);
  if (!matches) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  user.passwordHash = await User.hashPassword(newPassword);
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
});

function publicUser(u) {
  return { id: u._id, name: u.name, email: u.email, role: u.role, preferredLanguage: u.preferredLanguage, avatar: u.avatar };
}

