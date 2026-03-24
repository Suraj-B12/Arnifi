import { Router } from "express";
import { signup, login, refreshTokenHandler, logoutAll } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", authenticate, logoutAll);

export default router;
