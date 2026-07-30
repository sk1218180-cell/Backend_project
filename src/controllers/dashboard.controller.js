import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const totalVideos = await Video.countDocuments({
    owner: ownerId,
  });

  const totalViews = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $group: {
        _id: null,
        totalViews: {
          $sum: "$views",
        },
      },
    },
  ]);

  const totalSubscribers = await Subscription.countDocuments({
    channel: ownerId,
  });

  const totalLikes = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $match: {
        "video.owner": new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $count: "likes",
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalViews: totalViews[0]?.totalViews || 0,
      totalSubscribers,
      totalLikes: totalLikes[0]?.likes || 0,
    }, "Channel stats fetched successfully")
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({
    owner: req.user._id,
  }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      videos,
      "Channel videos fetched successfully"
    )
  );
});

export {
  getChannelStats,
  getChannelVideos,
};
