import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { Subscription } from '../models/subscription.model.js'
import { apiResponse } from '../utils/apiResponse.js'

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new apiError(400, "Invalid channel Id")
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new apiError(404, "Channel not Found")
    }

    if (channel._id.equals(req.user._id)) {
        throw new apiError(400, "You cannot subscribe your own channel.")
    }

    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })

    let isSubscribed;
    if (existingSubscription) {
        await existingSubscription.deleteOne()
        isSubscribed = false;

        return res.status(200).json(
            new apiResponse(
                200,
                { isSubscribed },
                "Channel unsubscribed"
            )
        )

    } else {
        await Subscription.create({
            channel: channelId,
            subscriber: req.user._id
        })

        isSubscribed = true

        return res.status(201).json(
            new apiResponse(
                201,
                { isSubscribed },
                "Channel subscribed successfully"
            )
        )
    }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new apiError(400, "Invalid channel Id")
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new apiError(404, "Channel not found")
    }

    const aggregate = Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },

        {
            $unwind: "$subscriberDetails"
        },

        {
            $project: {
                _id: "$subscriberDetails._id",
                username: "$subscriberDetails.username",
                fullName: "$subscriberDetails.fullName",
                avatar: "$subscriberDetails.avatar"
            }
        }
    ])

    const options = {
        page,
        limit
    }

    const subscribers = await Subscription.aggregatePaginate(
        aggregate,
        options
    )

    return res.status(200).json(
        new apiResponse(
            200,
            subscribers,
            "Subscribers fetched successfully"
        )
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new apiError(400, "Invalid subscriber Id")
    }

    const user = await User.findById(subscriberId)

    if (!user) {
        throw new apiError(404, "User not found")
    }

    const aggregate = Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails"
            }
        },

        {
            $unwind: "$channelDetails"
        },

        {
            $project: {
                _id: "$channelDetails._id",
                username: "$channelDetails.username",
                fullName: "$channelDetails.fullName",
                avatar: "$channelDetails.avatar",
                coverImage: "$channelDetails.coverImage"
            }
        }
    ])

    const options = {
        page,
        limit
    }

    const subscribedChannels = await Subscription.aggregatePaginate(
        aggregate,
        options
    )

    return res.status(200).json(
        new apiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
        )
    )
})

export{
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
}