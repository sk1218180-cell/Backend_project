import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  toggleSubscription,
  getChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

router.post("/:channelId", verifyJWT, toggleSubscription);

router.get(
  "/channel/:channelId",
  getChannelSubscribers
);

router.get(
  "/user",
  verifyJWT,
  getSubscribedChannels
);

export default router;