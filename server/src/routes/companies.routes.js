import { Router } from "express";
import { getAllCompanies, getCompany, createCompany, updateCompany } from "../controllers/companies.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

router.get("/", getAllCompanies);
router.post("/", authenticate, requireAdmin, createCompany);
router.put("/:id", authenticate, requireAdmin, updateCompany);
router.get("/:id", getCompany);

export default router;
