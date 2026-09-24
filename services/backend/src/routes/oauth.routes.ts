import { Router } from "express";
import {
  startInstagramOAuth,
  handleInstagramCallback,
  refreshInstagramTokens,
} from "../controllers/oauth.controller";

const router = Router();

// 1. Start OAuth flow (Public or authenticated)
router.get("/instagram/start", startInstagramOAuth);
router.post("/instagram/start", startInstagramOAuth);

// 2. OAuth Callback from Meta (Public endpoint that browser popup redirects to)
router.get("/instagram/callback", handleInstagramCallback);

// 3. Refresh token(s)
router.post("/instagram/refresh", refreshInstagramTokens);

export default router;
