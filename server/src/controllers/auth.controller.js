import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  let user = await User.findOne({ email });
  if (!user) {
    const randomPass = Math.random().toString(36).slice(-10) + "Aa1!";
    const passwordHash = await User.hashPassword(randomPass);
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      passwordHash,
      role: "member",
    });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

export const googleOAuthCallback = asyncHandler(async (req, res) => {
  const code = req.query.code || req.body.code;
  const credential = req.query.credential || req.body.credential;
  const error = req.query.error || req.body.error;

  const clientUrl = env.CLIENT_URL || "http://localhost:5173";

  if (error) {
    return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(error)}`);
  }

  let email = null;
  let name = null;

  try {
    // 1. Check if credential (Google Identity Services ID token) is present
    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (verifyRes.ok) {
          const payload = await verifyRes.json();
          email = payload.email;
          name = payload.name || payload.given_name;
        }
      } catch (err) {
        console.warn("Google token verification error:", err.message);
      }
    }

    // 2. Check if authorization code is present and client credentials configured
    if (!email && code && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
      try {
        const callbackUrl = env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get("host")}/api/auth/google/callback`;
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: callbackUrl,
            grant_type: "authorization_code",
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            if (userRes.ok) {
              const userData = await userRes.json();
              email = userData.email;
              name = userData.name || userData.given_name;
            }
          }
        }
      } catch (err) {
        console.warn("Google authorization code exchange failed:", err.message);
      }
    }

    // If an email was resolved from Google:
    if (email) {
      let user = await User.findOne({ email });
      if (!user) {
        const randomPass = Math.random().toString(36).slice(-10) + "Aa1!";
        const passwordHash = await User.hashPassword(randomPass);
        user = await User.create({
          name: name || email.split("@")[0],
          email,
          passwordHash,
          role: "member",
        });
      }

      const token = signToken(user);
      return res.redirect(`${clientUrl}/login?token=${token}`);
    }

    return res.redirect(`${clientUrl}/login?error=${encodeURIComponent("Could not authenticate with Google")}`);
  } catch (err) {
    console.error("Google OAuth callback handler error:", err);
    return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(err.message || "Google authentication failed")}`);
  }
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
  return { id: u._id, name: u.name, email: u.email, role: u.role, preferredLanguage: u.preferredLanguage };
}
