import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";


const router = Router()

router.route("/upload").post(verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },

        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
    publishAVideo
)
router.route("/:videoId").get(optionalAuth, getVideoById)
router.route("/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)
router.route("/:videoId").delete(verifyJWT,deleteVideo)
router.route("/").get(getAllVideos)
router.route("/:videoId/toggle-publish").patch(verifyJWT,togglePublishStatus)

export default router