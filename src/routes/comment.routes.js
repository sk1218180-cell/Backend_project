import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addComment, getVideoComments, updateComment, deleteComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/:videoId", verifyJWT, addComment);
router.get("/:videoId", getVideoComments);

router.patch(
  "/:commentId",
  verifyJWT,
  updateComment
);

router.delete(
  "/:commentId",
  verifyJWT,
  deleteComment
);

export default router;