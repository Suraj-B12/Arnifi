import prisma from "../lib/prisma.js";

export async function applyToJob(req, res) {
  try {
    const { id: jobId } = req.params;
    const userId = req.user.userId;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    if (existing) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }

    const application = await prisma.application.create({
      data: { userId, jobId },
      include: { job: true },
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "You have already applied to this job" });
    }
    console.error("Apply to job error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

const VALID_STATUSES = ["PENDING", "REVIEWED", "INTERVIEW", "OFFER", "REJECTED"];

export async function getJobApplications(req, res) {
  try {
    const { id: jobId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedById !== req.user.userId) {
      return res.status(403).json({ message: "You can only view applicants for your own postings" });
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function updateApplicationStatus(req, res) {
  try {
    const { id: jobId, appId } = req.params;
    const { status, notes } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.postedById !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const application = await prisma.application.findUnique({ where: { id: appId } });
    if (!application || application.jobId !== jobId) {
      return res.status(404).json({ message: "Application not found" });
    }

    const data = { status };
    if (application.status === "PENDING" && status !== "PENDING") {
      data.reviewedAt = new Date();
    }
    if (notes !== undefined) {
      data.notes = notes;
    }

    const updated = await prisma.application.update({
      where: { id: appId },
      data,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function getApplications(req, res) {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.userId },
      include: {
        job: {
          include: { postedBy: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
