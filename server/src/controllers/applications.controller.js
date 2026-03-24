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
    console.error("Apply to job error:", error);
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
