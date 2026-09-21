import { Router } from "express";
import {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
} from "../controllers/client.controller";
import {
    authMiddleware,
    requireAdmin,
    requireEmployeeOrAdmin,
} from "../middleware/auth.middleware";

const router = Router();

// Protect all client / brand management endpoints
router.use(authMiddleware);

// Read, Create, Update: Employee or Admin
router.get("/", requireEmployeeOrAdmin, getClients);
router.get("/:id", requireEmployeeOrAdmin, getClientById);
router.post("/", requireEmployeeOrAdmin, createClient);
router.put("/:id", requireEmployeeOrAdmin, updateClient);

// Delete: Admin ONLY
router.delete("/:id", requireAdmin, deleteClient);

export default router;
