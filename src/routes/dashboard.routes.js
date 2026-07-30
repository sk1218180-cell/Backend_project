import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/stats", verifyJWT, getChannelStats);

router.get("/videos", verifyJWT, getChannelVideos);

export default router;