import { Router } from "express";
import {
  getIntegrationsOverview,
  setPrimaryIntegration,
  disconnectIntegration,
  deleteIntegration,
  refreshIntegrationProfile,
} from "../controllers/integrations.controller";
import {
  authMiddleware,
  requireEmployeeOrAdmin,
  requireAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// Protect integrations endpoints with JWT auth
router.use(authMiddleware);

// Read operations: Employee or Admin
router.get("/", requireEmployeeOrAdmin, getIntegrationsOverview);

// Mutations: Admin
router.put("/:id/primary", requireAdmin, setPrimaryIntegration);
router.post("/:id/disconnect", requireAdmin, disconnectIntegration);
router.delete("/:id", requireAdmin, deleteIntegration);
router.post("/:id/refresh-profile", requireEmployeeOrAdmin, refreshIntegrationProfile);

export default router;
