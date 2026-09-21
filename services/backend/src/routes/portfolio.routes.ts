import { Router } from "express";
import {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller";
import {
  authMiddleware,
  requireAdmin,
  requireEmployeeOrAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// GET Portfolio: Allow public read ONLY if querying published/featured items; all CMS management requires Employee/Admin
router.get("/", (req, res, next) => {
  if (req.query.status === "published" || req.query.featured === "true") {
    return getPortfolio(req, res);
  }
  return authMiddleware(req as any, res, () => {
    requireEmployeeOrAdmin(req as any, res, () => getPortfolio(req, res));
  });
});

// Create & Update: Employee or Admin
router.post("/", authMiddleware, requireEmployeeOrAdmin, createPortfolio);
router.put("/:id", authMiddleware, requireEmployeeOrAdmin, updatePortfolio);

// Delete: Admin ONLY
router.delete("/:id", authMiddleware, requireAdmin, deletePortfolio);

export default router;
