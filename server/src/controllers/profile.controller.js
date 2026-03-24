import prisma from "../lib/prisma.js";

const PROFILE_FIELDS = {
  id: true,
  name: true,
  email: true,
  headline: true,
  skills: true,
  experience: true,
  education: true,
  bio: true,
  phone: true,
  linkedIn: true,
  resumeUrl: true,
};

function sanitize(str, maxLen = 200) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

export async function getMyProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: PROFILE_FIELDS,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { headline, skills, experience, education, bio, phone, linkedIn } = req.body;

    const data = {};
    if (headline !== undefined) data.headline = sanitize(headline, 120);
    if (skills !== undefined) data.skills = sanitize(skills, 500);
    if (experience !== undefined) data.experience = sanitize(experience, 2000);
    if (education !== undefined) data.education = sanitize(education, 2000);
    if (bio !== undefined) data.bio = sanitize(bio, 1000);
    if (phone !== undefined) data.phone = sanitize(phone, 20);
    if (linkedIn !== undefined) data.linkedIn = sanitize(linkedIn, 200);

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data,
      select: PROFILE_FIELDS,
    });

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function uploadResumeHandler(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Please upload a PDF." });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { resumeUrl },
      select: PROFILE_FIELDS,
    });

    res.json(user);
  } catch (error) {
    console.error("Upload resume error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: PROFILE_FIELDS,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
