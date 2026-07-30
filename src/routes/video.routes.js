import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { publishVideo, getAllVideos, getVideoById, updateVideo, deleteVideo, togglePublishStatus } from "../controllers/video.controller.js";

const router = Router();

router.delete("/:videoId", verifyJWT, deleteVideo);
router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);


router.post(
  "/upload",
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);

router.patch(
  "/:videoId",
  verifyJWT,
  upload.single("thumbnail"),
  updateVideo
);

router.patch(
  "/toggle/:videoId",
  verifyJWT,
  togglePublishStatus
);

export default router;
