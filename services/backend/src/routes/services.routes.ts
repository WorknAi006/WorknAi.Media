import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller";
import {
  authMiddleware,
  requireAdmin,
  requireEmployeeOrAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// GET Services: Public read for published items; full CMS listing requires Employee or Admin
router.get("/", (req, res) => {
  if (req.query.status === "published" || req.query.featured === "true") {
    return getServices(req, res);
  }
  return authMiddleware(req as any, res, () => {
    requireEmployeeOrAdmin(req as any, res, () => getServices(req, res));
  });
});

// GET single service by id or slug (public read)
router.get("/:id", (req, res) => {
  return getServiceById(req, res);
});

// Create & Update: Employee or Admin
router.post("/", authMiddleware, requireEmployeeOrAdmin, createService);
router.put("/:id", authMiddleware, requireEmployeeOrAdmin, updateService);

// Delete: Admin ONLY
router.delete("/:id", authMiddleware, requireAdmin, deleteService);

export default router;
