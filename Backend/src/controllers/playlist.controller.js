import { Playlist } from '../models/playlist.model.js'
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import mongoose from 'mongoose'
import { Video } from '../models/video.model.js'

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name?.trim()) {
        throw new apiError(400, "Playlist name is required")
    }

    if (!description?.trim()) {
        throw new apiError(400, "Description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                playlist,
                "Playlist Created successfully"
            )
        )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError(400, "Invalid user id")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(404, "User not found")
    }

    const aggregate = Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            thumbnail: 1
                        }
                    }
                ],
                as: "videoDetails"
            }
        },

        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },

                thumbnail: {
                    $cond: {
                        if: {
                            $gt: [
                                { $size: "$videoDetails" },
                                0
                            ]
                        },
                        then: {
                            $arrayElemAt: [
                                "$videoDetails.thumbnail",
                                0
                            ]
                        },
                        else: null
                    }
                }
            }
        },

        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                thumbnail: 1,
                videos: 1,
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    const options = {
        page,
        limit
    }

    const playlists = await Playlist.aggregatePaginate(
        aggregate,
        options
    )

    return res.status(200).json(
        new apiResponse(
            200,
            playlists,
            "Playlists fetched successfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
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
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    {
                        $unwind: "$owner"
                    },
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            description: 1,
                            duration: 1,
                            views: 1,
                            createdAt: 1,
                            owner: {
                                _id: "$owner._id",
                                username: "$owner.username",
                                fullName: "$owner.fullName",
                                avatar: "$owner.avatar"
                            }
                        }
                    }
                ],
                as: "videos"
            }
        },

        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                }
            }
        },

        {
            $project: {
                name: 1,
                description: 1,
                videos: 1,
                totalVideos: 1,
                createdAt: 1,
                updatedAt: 1,

                ownerDetails: {
                    _id: "$ownerDetails._id",
                    username: "$ownerDetails.username",
                    fullName: "$ownerDetails.fullName",
                    avatar: "$ownerDetails.avatar",
                    coverImage: "$ownerDetails.coverImage"
                }
            }
        }
    ])

    if (!playlist.length) {
        throw new apiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new apiResponse(
            200,
            playlist[0],
            "Playlist fetched successfully"
        )
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Invalid playlist id")
    }

    if (!name?.trim() && !description?.trim()) {
        throw new apiError(400, " Title and description  cannot be empty")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new apiError(404, "Playlist not found")
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized access")
    }

    if (name?.trim()) {
        playlist.name = name
    }

    if (description?.trim()) {
        playlist.description = description
    }

    await playlist.save()

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                playlist,
                "Playlist updated Successfully"
            )
        )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Invalid Playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new apiError(404, "Playlist not found")
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized access")
    }

    await playlist.deleteOne()

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "Playlist deleted successfully"
            )
        )
})

const addVideosToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Invalid playlist Id")
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video Id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new apiError(404, "Playlist not found")
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized access")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not found")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                "Video added to playlist successfully"
            )
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Invalid playlist Id")
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video Id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new apiError(404, "Playlist not found")
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new apiError(403, "Unauthorized access")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not found")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                "Video removed from playlist successfully"
            )
        )
})

export {
    createPlaylist,
    getPlaylistById,
    updatePlaylist,
    getUserPlaylists,
    addVideosToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
}