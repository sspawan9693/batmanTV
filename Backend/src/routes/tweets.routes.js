import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createTweet,
    deleteTweet,
    getUserTweet,
    getAllTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router
    .route("/")
    .get(getAllTweets)
    .post(verifyJWT, createTweet);

router
    .route("/user/:userId")
    .get(verifyJWT, getUserTweet);

router
    .route("/:tweetId")
    .patch(verifyJWT, updateTweet);

router
    .route("/:tweetId")
    .delete(verifyJWT, deleteTweet);

export default router;