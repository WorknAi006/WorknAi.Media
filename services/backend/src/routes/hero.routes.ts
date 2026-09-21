import { Router } from "express";
import {
    getHero,
    createHero,
    updateHero,
    deleteHero,
} from "../controllers/hero.controller";
import {
    authMiddleware,
    requireAdmin,
    requireEmployeeOrAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// Public / Authenticated read for hero banner
router.get("/", getHero);

// Protected writes
router.post("/", authMiddleware, requireEmployeeOrAdmin, createHero);
router.put("/:id", authMiddleware, requireEmployeeOrAdmin, updateHero);
router.delete("/:id", authMiddleware, requireAdmin, deleteHero);

export default router;
