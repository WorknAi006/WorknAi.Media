import { Router } from "express";
import {
    getLeads,
    createLead,
    updateLead,
    deleteLead,
} from "../controllers/leads.controller";
import {
    authMiddleware,
    requireAdmin,
    requireEmployeeOrAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// Protect all leads endpoints with JWT authentication
router.use(authMiddleware);

// Read, Create, Update: Employee or Admin
router.get("/", requireEmployeeOrAdmin, getLeads);
router.post("/", requireEmployeeOrAdmin, createLead);
router.put("/:id", requireEmployeeOrAdmin, updateLead);
router.patch("/:id", requireEmployeeOrAdmin, updateLead);

// Delete: Admin ONLY
router.delete("/:id", requireAdmin, deleteLead);

export default router;
