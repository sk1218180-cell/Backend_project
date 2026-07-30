import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists,
} from "../controllers/playlist.controller.js";

const router = Router();

router.post("/", verifyJWT, createPlaylist);

router.get("/:playlistId", getPlaylistById);

router.patch("/:playlistId", verifyJWT, updatePlaylist);

router.delete("/:playlistId", verifyJWT, deletePlaylist);

router.post(
  "/:playlistId/videos/:videoId",
  verifyJWT,
  addVideoToPlaylist
);

router.delete(
  "/:playlistId/videos/:videoId",
  verifyJWT,
  removeVideoFromPlaylist
);

router.get("/user/:userId", getUserPlaylists);

export default router;