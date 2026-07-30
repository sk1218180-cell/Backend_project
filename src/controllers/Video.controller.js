import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const publishVideo = asyncHandler(async (req, res) => {
  // Get title and description
  const { title, description } = req.body;

  // Validate input
  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  // Get uploaded files
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  // Upload to Cloudinary
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!uploadedVideo) {
    throw new ApiError(500, "Failed to upload video");
  }

  if (!uploadedThumbnail) {
    if (uploadedVideo?.public_id) {
      await deleteFromCloudinary(uploadedVideo.public_id);
    }

    throw new ApiError(500, "Failed to upload thumbnail");
  }

  // Save video in database
  const video = await Video.create({
    videoFile: uploadedVideo.secure_url,
    videoPublicId: uploadedVideo.public_id,

    thumbnail: uploadedThumbnail.secure_url,
    thumbnailPublicId: uploadedThumbnail.public_id,

    title,
    description,

    duration: uploadedVideo.duration || 0,

    owner: req.user._id,

    isPublished: true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ isPublished: true })
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "username fullName avatar"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.views += 1;
  await video.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      video,
      "Video fetched successfully"
    )
  );
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Only the owner can update
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this video");
  }

  // Update title and description
  if (title?.trim()) {
    video.title = title;
  }

  if (description?.trim()) {
    video.description = description;
  }

  // Update thumbnail (optional)
  const thumbnailLocalPath = req.file?.path;

  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedThumbnail) {
      throw new ApiError(500, "Thumbnail upload failed");
    }

    await deleteFromCloudinary(video.thumbnailPublicId);

    video.thumbnail = uploadedThumbnail.secure_url;
    video.thumbnailPublicId = uploadedThumbnail.public_id;
  }

  await video.save();

  return res.status(200).json(
    new ApiResponse(200, video, "Video updated successfully")
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await deleteFromCloudinary(video.videoPublicId, "video");
  await deleteFromCloudinary(video.thumbnailPublicId);

  await Video.findByIdAndDelete(videoId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Video deleted successfully")
  );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  video.isPublished = !video.isPublished;

  await video.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      video,
      "Publish status updated successfully"
    )
  );
});

export { publishVideo, getAllVideos, getVideoById, updateVideo, deleteVideo, togglePublishStatus };
