import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content?.trim()) {
        throw new apiError(400, "Tweet Content is required");
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user._id,
    });

    if (!tweet) {
        throw new apiError(500, "Error while creating tweet");
    }

    const createdTweet = await Tweet.aggregate([
        {
            $match: {
                _id: tweet._id,
            },
        },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
            },
        },

        {
            $unwind: "$ownerDetails",
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
                    avatar: "$ownerDetails.avatar",
                },

                likesCount: {
                    $literal: 0,
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                createdTweet[0],
                "Tweeted successfully"
            )
        );
});

const getUserTweet = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError(400, "Invalid user id");
    }

    const aggregate = Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
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
                foreignField: "tweet",
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

    const tweets = await Tweet.aggregatePaginate(
        aggregate,
        options
    );

    return res.status(200).json(
        new apiResponse(
            200,
            tweets,
            "Tweets fetched successfully"
        )
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Invalid tweet Id")
    }

    if (!content?.trim()) {
        throw new apiError(400, "Content is required")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new apiError(404, "Tweet not Found")
    }

    if (!tweet.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized")
    }

    tweet.content = content

    await tweet.save()

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                tweet,
                "Tweet Updated sucessfully"
            )
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Invalid tweet Id")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new apiError(400, "Tweet not Found")
    }

    if (!tweet.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized")
    }

    await tweet.deleteOne()

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "Tweet Deleted successfully"
            )
        )

})

const getAllTweets = asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const currentUserId = req.user?._id;

    const aggregate = Tweet.aggregate([

        // Newest tweets first
        {
            $sort: {
                createdAt: -1,
            },
        },

        // Get tweet owner
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
            },
        },

        {
            $unwind: "$ownerDetails",
        },

        // Get likes
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
            },
        },

        // Calculate like information
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },

                isLiked: currentUserId
                    ? {
                          $in: [
                              currentUserId,
                              "$likes.likedBy",
                          ],
                      }
                    : false,
            },
        },

        // Send only required data
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
                    avatar: "$ownerDetails.avatar",
                },

                likesCount: 1,
                isLiked: 1,
            },
        },
    ]);

    const options = {
        page,
        limit,
    };

    const tweets = await Tweet.aggregatePaginate(
        aggregate,
        options
    );

    return res.status(200).json(
        new apiResponse(
            200,
            tweets,
            "All tweets fetched successfully"
        )
    );
});

export {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet,
    getAllTweets,
}