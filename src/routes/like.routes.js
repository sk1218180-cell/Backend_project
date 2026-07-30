import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { toggleVideoLike, toggleCommentLike, getLikedVideos } from "../controllers/like.controller.js";

const router = Router();

router.post("/video/:videoId", verifyJWT, toggleVideoLike);
router.post("/comment/:commentId", verifyJWT, toggleCommentLike);
router.get("/videos", verifyJWT, getLikedVideos);


export default router;