import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/toggle/video/:videoId").post(verifyJWT,toggleVideoLike)

router.route("/toggle/comment/:commentId").post(verifyJWT,toggleCommentLike)

router.route("/toggle/tweet/:tweetId").post(verifyJWT,toggleTweetLike)

router.route("/videos").get(verifyJWT,getLikedVideos)

export default router