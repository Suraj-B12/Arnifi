import prisma from "../lib/prisma.js";

function sanitize(str, maxLen = 200) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

const VALID_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE", "HYBRID"];

export async function getAllJobs(req, res) {
  try {
    const { search, type, location, cursor, limit: limitParam } = req.query;
    const limit = Math.min(Math.max(parseInt(limitParam) || 12, 1), 50);

    const where = {};

    if (search) {
      where.OR = [
        { position: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      const types = type.split(",").filter((t) => VALID_TYPES.includes(t));
      if (types.length > 0) {
        where.type = { in: types };
      }
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    const queryArgs = {
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      include: {
        postedBy: { select: { id: true, name: true } },
        company: { select: { id: true, name: true, logo: true } },
        _count: { select: { applications: true } },
      },
    };

    if (cursor) {
      queryArgs.cursor = { id: cursor };
      queryArgs.skip = 1;
    }

    const jobs = await prisma.job.findMany(queryArgs);

    let hasMore = false;
    let nextCursor = null;

    if (jobs.length > limit) {
      jobs.pop();
      hasMore = true;
      nextCursor = jobs[jobs.length - 1].id;
    }

    res.json({ jobs, nextCursor, hasMore });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function getJob(req, res) {
  try {
    const { id } = req.params;

    const job = await prisma.job.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        postedBy: { select: { id: true, name: true } },
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            about: true,
            industry: true,
            size: true,
            website: true,
            location: true,
          },
        },
        _count: { select: { applications: true } },
      },
    });

    // Compute acceptance rate
    const totalApps = job._count.applications;
    let acceptanceRate = 0;
    if (totalApps > 0) {
      const offerCount = await prisma.application.count({
        where: { jobId: id, status: "OFFER" },
      });
      acceptanceRate = Math.round((offerCount / totalApps) * 100);
    }

    res.json({ ...job, acceptanceRate });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Job not found" });
    }
    console.error("Get job error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function createJob(req, res) {
  try {
    const { companyName, position, type, location, description, salary, requirements, companyId, interviewProcess, benefits } = req.body;

    if (!companyName || !position || !type || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: `Type must be one of: ${VALID_TYPES.join(", ")}` });
    }

    const job = await prisma.job.create({
      data: {
        companyName: sanitize(companyName),
        position: sanitize(position),
        type,
        location: sanitize(location),
        ...(description && { description: sanitize(description, 2000) }),
        ...(salary && { salary: sanitize(salary) }),
        ...(requirements && { requirements: sanitize(requirements, 1000) }),
        ...(companyId && { companyId }),
        ...(interviewProcess && { interviewProcess: sanitize(interviewProcess, 2000) }),
        ...(benefits && { benefits: sanitize(benefits, 2000) }),
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
    const { companyName, position, type, location, description, salary, requirements, companyId, interviewProcess, benefits } = req.body;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedById !== req.user.userId) {
      return res.status(403).json({ message: "You can only edit your own job postings" });
    }

    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: `Type must be one of: ${VALID_TYPES.join(", ")}` });
    }

    const updated = await prisma.job.update({
      where: { id },
      data: {
        ...(companyName && { companyName: sanitize(companyName) }),
        ...(position && { position: sanitize(position) }),
        ...(type && { type }),
        ...(location && { location: sanitize(location) }),
        ...(description !== undefined && { description: description ? sanitize(description, 2000) : null }),
        ...(salary !== undefined && { salary: salary ? sanitize(salary) : null }),
        ...(requirements !== undefined && { requirements: requirements ? sanitize(requirements, 1000) : null }),
        ...(companyId !== undefined && { companyId: companyId || null }),
        ...(interviewProcess !== undefined && { interviewProcess: interviewProcess ? sanitize(interviewProcess, 2000) : null }),
        ...(benefits !== undefined && { benefits: benefits ? sanitize(benefits, 2000) : null }),
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
