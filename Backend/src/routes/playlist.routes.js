import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addVideosToPlaylist,
    removeVideoFromPlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/")
    .post(verifyJWT, createPlaylist);

router.route("/user/:userId")
    .get(getUserPlaylists);

router.route("/:playlistId")
    .get(getPlaylistById)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);

router.route("/:playlistId/videos/:videoId")
    .post(verifyJWT, addVideosToPlaylist)
    .delete(verifyJWT, removeVideoFromPlaylist);

export default router;