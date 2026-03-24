import prisma from "../lib/prisma.js";

function sanitize(str) {
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 200);
}

export async function getAllJobs(req, res) {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { postedBy: { select: { id: true, name: true } } },
    });
    res.json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function createJob(req, res) {
  try {
    const { companyName, position, type, location } = req.body;

    if (!companyName || !position || !type || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["FULL_TIME", "PART_TIME"].includes(type)) {
      return res.status(400).json({ message: "Type must be FULL_TIME or PART_TIME" });
    }

    const job = await prisma.job.create({
      data: {
        companyName: sanitize(companyName),
        position: sanitize(position),
        type,
        location: sanitize(location),
        postedById: req.user.userId,
      },
      include: { postedBy: { select: { id: true, name: true } } },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function updateJob(req, res) {
  try {
    const { id } = req.params;
    const { companyName, position, type, location } = req.body;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedById !== req.user.userId) {
      return res.status(403).json({ message: "You can only edit your own job postings" });
    }

    if (type && !["FULL_TIME", "PART_TIME"].includes(type)) {
      return res.status(400).json({ message: "Type must be FULL_TIME or PART_TIME" });
    }

    const updated = await prisma.job.update({
      where: { id },
      data: {
        ...(companyName && { companyName: sanitize(companyName) }),
        ...(position && { position: sanitize(position) }),
        ...(type && { type }),
        ...(location && { location: sanitize(location) }),
      },
      include: { postedBy: { select: { id: true, name: true } } },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function deleteJob(req, res) {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedById !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own job postings" });
    }

    await prisma.job.delete({ where: { id } });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
