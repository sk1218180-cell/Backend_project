import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Subscribe / Unsubscribe
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);

    return res.status(200).json(
      new ApiResponse(200, {}, "Unsubscribed successfully")
    );
  }

  await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Subscribed successfully")
  );
});

// Get all subscribers of a channel
const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribers = await Subscription.find({
    channel: channelId,
  }).populate("subscriber", "username fullName avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      subscribers,
      "Subscribers fetched successfully"
    )
  );
});

// Get channels subscribed by logged in user
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({
    subscriber: req.user._id,
  }).populate("channel", "username fullName avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      subscriptions,
      "Subscribed channels fetched successfully"
    )
  );
});

export {
  toggleSubscription,
  getChannelSubscribers,
  getSubscribedChannels,
};