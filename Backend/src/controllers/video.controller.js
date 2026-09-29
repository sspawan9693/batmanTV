import { apiError } from "../utils/apiError.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { Video } from '../models/video.model.js'
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { User } from "../models/user.model.js";

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    let videoFileLocalPath = req.files?.videoFile?.[0]?.path
    let thumbnailFileLocalPath = req.files?.thumbnail?.[0]?.path

    if (!title?.trim() || !description?.trim()) {
        throw new apiError(400, "Title and description are required")
    }

    if (!videoFileLocalPath) {
        throw new apiError(400, "Video file is required")
    }

    if (!thumbnailFileLocalPath) {
        throw new apiError(400, "Thumbnail file is required")
    }

    const video = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath)

    if (!video) {
        throw new apiError(400, "Video file is required")
    }

    if (!thumbnail) {
        throw new apiError(400, "Thumbnail file is required")
    }

    const publishedVideo = await Video.create({
        videoFile: video.url,
        videoFilePublicId: video.public_id,
        thumbnail: thumbnail.url,
        thumbnailPublicId: thumbnail.public_id,
        title,
        duration: video.duration,
        description,
        owner: req.user._id,
    })

    if (!publishedVideo) {
        throw new apiError(500, "Something went wrong while uploading video")
    }

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                publishedVideo,
                "Video Published successfully."
            )
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid Video Id")
    }

    // Increment views first
    await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                views: 1
            }
        }
    )

    // Update watch history only for logged-in users
    if (req.user) {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: {
                    watchHistory: videoId,
                },
            }
        );

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $push: {
                    watchHistory: {
                        $each: [new mongoose.Types.ObjectId(videoId)],
                        $position: 0,
                    },
                },
            }
        );
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },

        {
            $unwind: "$ownerDetails"
        },

        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                }
            }
        },

        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1,
                likesCount: 1,

                owner: {
                    _id: "$ownerDetails._id",
                    username: "$ownerDetails.username",
                    fullName: "$ownerDetails.fullName",
                    avatar: "$ownerDetails.avatar",
                    coverImage: "$ownerDetails.coverImage"
                }
            }
        }
    ])

    if (!video.length) {
        throw new apiError(404, "Cannot Found Video")
    }

    return res.status(200).json(
        new apiResponse(
            200,
            video[0],
            "Video Fetched Successfully"
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailFileLocalPath = req.file?.path

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Video does not exist")
    }

    const existingVideo = await Video.findById(videoId)
    const oldThumbnailFileId = existingVideo?.thumbnailPublicId

    if (!existingVideo) {
        throw new apiError(404, "Video not found")
    }

    if (!existingVideo.owner.equals(req.user._id)) {
        throw new apiError(400, "Unauthorized access")
    }

    if (!title?.trim() && !description?.trim() && !thumbnailFileLocalPath) {
        throw new apiError(400, "At least one field is required")
    }

    let thumbnail;

    if (thumbnailFileLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath)
        if (!thumbnail?.url) {
            throw new apiError(400, "Error while updating thumbnail ")
        }
    }

    const updateFields = {}

    if (title?.trim()) {
        updateFields.title = title
    }

    if (description?.trim()) {
        updateFields.description = description
    }

    if (thumbnail) {
        updateFields.thumbnail = thumbnail.url
        updateFields.thumbnailPublicId = thumbnail.public_id
    }

    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set: updateFields
        },
        { new: true }
    )

    if (thumbnail && oldThumbnailFileId) {
        await deleteFromCloudinary(oldThumbnailFileId)
    }

    return res
        .status(200)
        .json(new apiResponse(200, video, "Video details updated            successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(403, "Invalid video Id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not found")
    }

    if (!video.owner.equals(req.user._id)) {
        throw new apiError(400, "Unauthorized access")
    }

    const videoFilePublicId = video?.videoFilePublicId
    const thumbnailPublicId = video?.thumbnailPublicId

    if (videoFilePublicId) {
        await deleteFromCloudinary(videoFilePublicId, "video")
    }

    if (thumbnailPublicId) {
        await deleteFromCloudinary(thumbnailPublicId)
    }

    await video.deleteOne()

    return res
        .status(200)
        .json(
            new apiResponse(200,
                {},
                "Video deleted successfully"
            )
        )
})

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query

    const matchStage = {
        isPublished: true
    }

    if (query) {
        matchStage.$or = [
            {
                title: {
                    $regex: query,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query,
                    $options: "i"
                }
            }
        ]
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId)
    }

    const aggregate = Video.aggregate([
        {
            $match: matchStage
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "$ownerDetails"
        },
        {
            $project: {
                _id: 1,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1,

                owner: {
                    _id: "$ownerDetails._id",
                    username: "$ownerDetails.username",
                    fullName: "$ownerDetails.fullName",
                    avatar: "$ownerDetails.avatar"
                }
            }
        }
    ])

    const options = {
        page: Number(page),
        limit: Number(limit)
    }

    const videos = await Video.aggregatePaginate(
        aggregate,
        options
    )

    return res.status(200).json(
        new apiResponse(
            200,
            videos,
            "Videos fetched successfully"
        )
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid Video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not Found")
    }

    if (!video.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized Access")
    }

    video.isPublished = !video.isPublished

    await video.save()

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                video,
                "Publish Status updated successfully"
            )
        )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}