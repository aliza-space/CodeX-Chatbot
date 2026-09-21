import Announcement from "../models/Announcement.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listAnnouncements = asyncHandler(async (req, res) => {
  const anns = await Announcement.find({}).sort({ priority: -1, createdAt: -1 }).lean();
  res.json({ announcements: anns });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const ann = await Announcement.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ announcement: ann });
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ announcement: ann });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
