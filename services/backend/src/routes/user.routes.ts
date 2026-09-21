import { Router } from "express";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/user.controller";
import {
    authMiddleware,
    requireAdmin,
    requireEmployeeOrAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// Protect all user management endpoints with authentication
router.use(authMiddleware);

// Read, Create, Update: Employee or Admin
router.get("/", requireEmployeeOrAdmin, getUsers);
router.post("/", requireEmployeeOrAdmin, createUser);
router.put("/:id", requireEmployeeOrAdmin, updateUser);

// Delete: Admin ONLY
router.delete("/:id", requireAdmin, deleteUser);

export default router;