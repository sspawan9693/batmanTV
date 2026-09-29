import { Like } from '../models/like.model.js'
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import mongoose from 'mongoose'
import { Video } from '../models/video.model.js'
import { Subscription } from '../models/subscription.model.js'

const getChannelStats = asyncHandler(async (req, res) => {
    const totalVideos = await Video.countDocuments({
        owner: req.user._id
    })

    const viewsStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])
    const totalViews = viewsStats[0]?.totalViews || 0

    const totalSubscribers = await Subscription.countDocuments({
        channel: req.user._id
    })

    const videos = await Video.find(
        { owner: req.user._id },
        { _id: 1 }
    )

    const videoIds = videos.map(video => video._id)

    const totalLikes = await Like.countDocuments({
        video: {
            $in: videoIds
        }
    })

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    totalVideos,
                    totalViews,
                    totalSubscribers,
                    totalLikes,
                },
                "Channel stats fetched successfully"
            )
        )

})

const getChannelVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10 } = req.query

    const aggregate = Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
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
                title: 1,
                thumbnail: 1,
                views: 1,
                duration: 1,
                createdAt: 1,
                isPublished: 1,
                likesCount: 1
            }
        },

        {
            $sort: {
                createdAt: -1
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
            "Channel videos fetched successfully"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}