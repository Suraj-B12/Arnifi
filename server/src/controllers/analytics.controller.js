import prisma from "../lib/prisma.js";

export async function getDashboardAnalytics(req, res) {
  try {
    const userId = req.user.userId;

    // Get all jobs posted by this admin
    const jobs = await prisma.job.findMany({
      where: { postedById: userId },
      include: { _count: { select: { applications: true } } },
    });

    const jobIds = jobs.map((j) => j.id);

    // Get all applications for these jobs
    const applications = await prisma.application.findMany({
      where: { jobId: { in: jobIds } },
      select: { id: true, status: true, createdAt: true, jobId: true },
    });

    // Conversion funnel
    const funnel = {
      total: applications.length,
      reviewed: applications.filter((a) =>
        ["REVIEWED", "INTERVIEW", "OFFER"].includes(a.status)
      ).length,
      interview: applications.filter((a) =>
        ["INTERVIEW", "OFFER"].includes(a.status)
      ).length,
      offer: applications.filter((a) => a.status === "OFFER").length,
      rejected: applications.filter((a) => a.status === "REJECTED").length,
      withdrawn: applications.filter((a) => a.status === "WITHDRAWN").length,
    };

    // Daily application counts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApps = applications.filter(
      (a) => new Date(a.createdAt) >= thirtyDaysAgo
    );
    const dailyCounts = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().split("T")[0];
      dailyCounts[key] = 0;
    }
    recentApps.forEach((a) => {
      const key = new Date(a.createdAt).toISOString().split("T")[0];
      if (dailyCounts[key] !== undefined) dailyCounts[key]++;
    });
    const dailyData = Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count,
    }));

    // Views per job (top 10)
    const viewsPerJob = jobs
      .map((j) => ({
        name: j.position.slice(0, 20),
        views: j.viewCount,
        applications: j._count.applications,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Offer rate per job
    const offerRates = jobs
      .map((j) => {
        const jobApps = applications.filter((a) => a.jobId === j.id);
        const offers = jobApps.filter((a) => a.status === "OFFER").length;
        return {
          name: j.position.slice(0, 20),
          rate:
            jobApps.length > 0
              ? Math.round((offers / jobApps.length) * 100)
              : 0,
          total: jobApps.length,
        };
      })
      .filter((j) => j.total > 0);

    res.json({
      summary: {
        totalJobs: jobs.length,
        totalApplications: applications.length,
        totalViews: jobs.reduce((s, j) => s + j.viewCount, 0),
        offerRate:
          applications.length > 0
            ? Math.round((funnel.offer / applications.length) * 100)
            : 0,
        withdrawalRate:
          applications.length > 0
            ? Math.round((funnel.withdrawn / applications.length) * 100)
            : 0,
      },
      funnel,
      dailyData,
      viewsPerJob,
      offerRates,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
