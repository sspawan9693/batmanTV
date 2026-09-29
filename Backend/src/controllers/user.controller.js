import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'
import jwt from "jsonwebtoken"
import mongoose from 'mongoose'

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exist : username / email
    //check for images 
    //check for avatars
    //upload them to cloudinary, avatar
    //create user object - create entry in DB
    //remove password and refresh token field from response 
    //check for user creation 
    //return response 


    const { fullName, email, username, password } = req.body
    // console.log("Email", email)

    if (
        [fullName, email, username, password].some((field) => !field || field?.trim() === "")
    ) {
        throw new apiError(400, "All Fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //get data from req body
    //username or email
    //find the user
    //if user exist check pass
    //access and refresh token 
    //send cookies

    const { email, username, password } = req.body

    if (!username && !email) {
        throw new apiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, "invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "user Logged in successfully")
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new apiError(401, "invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(200, {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                    "Access token refreshed")
            )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new apiResponse(200, {}, "password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new apiResponse(
                200, req.user, "Current User fetched successfully"
            ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName && !email) {
        throw new apiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email,
            }
        },

        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new apiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is missing")
    }

    const existingUser = await User.findById(req.user._id)
    const oldAvatarPublicId = existingUser?.avatarPublicId

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new apiError(400, "Error while updating avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
                avatarPublicId: avatar.public_id
            }
        },
        { new: true }
    ).select("-password")

    if (oldAvatarPublicId) {
        await deleteFromCloudinary(oldAvatarPublicId)
    }

    return res
        .status(200)
        .json(new apiResponse(200, user, "avatar file updated successfully"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new apiError(400, "coverImage file is missing")
    }

    const existingUser = await User.findById(req.user._id)
    const oldCoverImagePublicId = existingUser?.coverImagePublicId

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new apiError(400, "Error while updating coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
                coverImagePublicId: coverImage.public_id
            }
        },
        { new: true }
    ).select("-password")

    if (oldCoverImagePublicId) {
        await deleteFromCloudinary(oldCoverImagePublicId)
    }

    return res
        .status(200)
        .json(new apiResponse(200, user, "coverImage file updated successfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new apiError(400, "Username is missing");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase(),
            },
        },

        // Subscribers
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },

        // Channels this user subscribed to
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscriberdTo",
            },
        },

        // User's published videos
        {
            $lookup: {
                from: "videos",
                let: {
                    ownerId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$owner", "$$ownerId"],
                                    },
                                    {
                                        $eq: ["$isPublished", true],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },
                ],
                as: "videos",
            },
        },

        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers",
                },

                channelsSubscribedToCounts: {
                    $size: "$subscriberdTo",
                },

                videosCount: {
                    $size: "$videos",
                },

                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        },

        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,

                subscribersCount: 1,
                channelsSubscribedToCounts: 1,
                videosCount: 1,
                isSubscribed: 1,

                videos: {
                    $map: {
                        input: "$videos",
                        as: "video",
                        in: {
                            _id: "$$video._id",
                            title: "$$video.title",
                            thumbnail: "$$video.thumbnail",
                            views: "$$video.views",
                            duration: "$$video.duration",
                            createdAt: "$$video.createdAt",
                        },
                    },
                },
            },
        },
    ]);

    if (!channel.length) {
        throw new apiError(404, "Channel does not exist");
    }

    return res.status(200).json(
        new apiResponse(
            200,
            channel[0],
            "User channel fetched successfully"
        )
    );
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                user[0].watchHistory,
                "Watch History Fetched successfully"
            )
        )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory,
}  