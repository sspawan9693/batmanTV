import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { apiResponse } from "../utils/apiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video Id");
    }

    const aggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },

        {
            $sort: {
                createdAt: -1
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
                foreignField: "comment",
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
                _id: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,

                owner: {
                    _id: "$ownerDetails._id",
                    username: "$ownerDetails.username",
                    fullName: "$ownerDetails.fullName",
                    avatar: "$ownerDetails.avatar"
                },

                likesCount: 1
            }
        }
    ]);

    const options = {
        page,
        limit
    };

    const comments = await Comment.aggregatePaginate(
        aggregate,
        options
    );

    return res.status(200).json(
        new apiResponse(
            200,
            comments,
            "Comments fetched successfully"
        )
    );
});

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { videoId } = req.params

    if (!content?.trim()) {
        throw new apiError(400, "Comment can't be empty")
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video Id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not found")
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    })

    if (!comment) {
        throw new apiError(500, "Something went wrong while creating the comment")
    }

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                comment,
                "Commented Successfully"
            )
        )

})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid Comment Id")
    }

    if (!content?.trim()) {
        throw new apiError(400, "Content is required")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new apiError(404, "Comment not found")
    }

    if (!comment.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized access")
    }

    comment.content = content.trim()

    await comment.save()

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                comment,
                "Comment Updated successfully"
            )
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new apiError(404, "Comment not found")
    }

    if (!comment.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized user")
    }

    await comment.deleteOne()

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "Comment deleted"
            )
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
