import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { apiResponse } from "../utils/apiResponse.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video Id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not found")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    let isLiked;

    if (existingLike) {
        await existingLike.deleteOne()

        isLiked = false

        return res.status(200).json(
            new apiResponse(
                200,
                { isLiked },
                "Video unliked successfully"
            )
        )
    }

    await Like.create({
        video: videoId,
        likedBy: req.user._id
    })

    isLiked = true

    return res.status(200).json(
        new apiResponse(
            200,
            { isLiked },
            "Video liked successfully"
        )
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment Id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new apiError(404, "Comment not found")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    let isLiked;

    if (existingLike) {
        await existingLike.deleteOne()

        isLiked = false

        return res.status(200).json(
            new apiResponse(
                200,
                { isLiked },
                "Comment unliked successfully"
            )
        )
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    isLiked = true

    return res.status(200).json(
        new apiResponse(
            200,
            { isLiked },
            "Comment liked successfully"
        )
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Invalid tweet Id")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new apiError(404, "Tweet not found")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    let isLiked;

    if (existingLike) {
        await existingLike.deleteOne()

        isLiked = false

        return res.status(200).json(
            new apiResponse(
                200,
                { isLiked },
                "Tweet unliked successfully"
            )
        )
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    })

    isLiked = true

    return res.status(200).json(
        new apiResponse(
            200,
            { isLiked },
            "Tweet liked successfully"
        )
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.params.page) || 1
    const limit = parseInt(req.params.limit) || 10

    const aggregate = Like.aggregate([
        {
            $match: {
                likedBy: req.user._id,
                video: { $exists: true }
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },

        {
            $unwind: "$videoDetails"
        },

        {
            $lookup: {
                from: "users",
                localField: "videoDetails.owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },

        {
            $unwind: "$ownerDetails"
        },

        {
            $project: {
                _id: "$videoDetails._id",
                videoFile: "$videoDetails.videoFile",
                thumbnail: "$videoDetails.thumbnail",
                title: "$videoDetails.title",
                description: "$videoDetails.description",
                views: "$videoDetails.views",
                duration: "$videoDetails.duration",
                createdAt: "$videoDetails.createdAt",

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
        page,
        limit
    }

    const likedVideos = await Like.aggregatePaginate(
        aggregate,
        options
    )

    return res.status(200).json(
        new apiResponse(
            200,
            likedVideos,
            "Liked videos fetched successfully"
        )
    )
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
}