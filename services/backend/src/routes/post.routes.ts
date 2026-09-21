import { Router } from "express";
import {
    getPosts,
    createPost,
    updatePost,
    deletePost,
} from "../controllers/post.controller";
import {
    authMiddleware,
    requireAdmin,
    requireEmployeeOrAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// GET: Allow public read ONLY for explicitly published posts; all others require Employee or Admin auth
router.get("/", (req, res, next) => {
    if (req.query.status === "published") {
        return getPosts(req, res);
    }
    return authMiddleware(req as any, res, () => {
        requireEmployeeOrAdmin(req as any, res, () => getPosts(req, res));
    });
});

// Create & Update: Employee or Admin
router.post("/", authMiddleware, requireEmployeeOrAdmin, createPost);
router.put("/:id", authMiddleware, requireEmployeeOrAdmin, updatePost);

// Delete: Admin ONLY
router.delete("/:id", authMiddleware, requireAdmin, deletePost);

export default router;
