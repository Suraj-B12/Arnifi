import prisma from "../lib/prisma.js";

function sanitize(str, maxLen = 200) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

export async function getAllCompanies(req, res) {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
    });
    res.json(companies);
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function getCompany(req, res) {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        jobs: {
          orderBy: { createdAt: "desc" },
          include: {
            _count: { select: { applications: true } },
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function createCompany(req, res) {
  try {
    const { name, logo, about, website, industry, size, location } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const company = await prisma.company.create({
      data: {
        name: sanitize(name),
        ...(logo && { logo: sanitize(logo, 500) }),
        ...(about && { about: sanitize(about, 2000) }),
        ...(website && { website: sanitize(website, 500) }),
        ...(industry && { industry: sanitize(industry) }),
        ...(size && { size: sanitize(size) }),
        ...(location && { location: sanitize(location) }),
      },
    });

    res.status(201).json(company);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "A company with this name already exists" });
    }
    console.error("Create company error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function updateCompany(req, res) {
  try {
    const { id } = req.params;
    const { name, logo, about, website, industry, size, location } = req.body;

    const existing = await prisma.company.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updated = await prisma.company.update({
      where: { id },
      data: {
        ...(name && { name: sanitize(name) }),
        ...(logo !== undefined && { logo: logo ? sanitize(logo, 500) : null }),
        ...(about !== undefined && { about: about ? sanitize(about, 2000) : null }),
        ...(website !== undefined && { website: website ? sanitize(website, 500) : null }),
        ...(industry !== undefined && { industry: industry ? sanitize(industry) : null }),
        ...(size !== undefined && { size: size ? sanitize(size) : null }),
        ...(location !== undefined && { location: location ? sanitize(location) : null }),
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "A company with this name already exists" });
    }
    console.error("Update company error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
