import { Router } from "express";
import {
  getSchedulerOverview,
  triggerPublishCheck,
  reschedulePost,
  getInstagramStatus,
  testPublishToInstagram,
  getInstagramAccounts,
  addInstagramAccount,
  setDefaultInstagramAccount,
  deleteInstagramAccount,
} from "../controllers/scheduler.controller";
import {
  authMiddleware,
  requireAdmin,
  requireEmployeeOrAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// Protect ALL scheduler endpoints with JWT authentication
router.use(authMiddleware);

// Read & Trigger operations: Employee or Admin
router.get("/overview", requireEmployeeOrAdmin, getSchedulerOverview);
router.post("/trigger", requireEmployeeOrAdmin, triggerPublishCheck);
router.put("/reschedule/:id", requireEmployeeOrAdmin, reschedulePost);
router.get("/instagram/status", requireEmployeeOrAdmin, getInstagramStatus);
router.get("/instagram/accounts", requireEmployeeOrAdmin, getInstagramAccounts);
router.post("/instagram/test", requireEmployeeOrAdmin, testPublishToInstagram);

// Sensitive social integration mutations: Admin ONLY
router.post("/instagram/accounts", requireAdmin, addInstagramAccount);
router.put("/instagram/accounts/:id/default", requireAdmin, setDefaultInstagramAccount);
router.delete("/instagram/accounts/:id", requireAdmin, deleteInstagramAccount);

export default router;
