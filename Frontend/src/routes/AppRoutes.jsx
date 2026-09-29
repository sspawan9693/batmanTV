import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Video from "../pages/Video";
import Channel from "../pages/Channel";
import Dashboard from "../pages/Dashboard";
import Playlists from "../pages/Playlists";
import History from "../pages/History";
import Tweets from "../pages/Tweets";
import LikedVideos from "../pages/LikedVideos";
import NotFound from "../pages/NotFound";
import UploadVideo from "../pages/UploadVideo";

import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";

import Profile from "../pages/Profile";
import PlaylistDetails from "../pages/PlaylistDetails";

function AppRoutes() {
    return (
        <Routes>

            {/* Main Application Layout */}
            <Route element={<MainLayout />}>

                {/* Public Pages */}

                <Route index element={<Home />} />

                <Route path="watch/:videoId" element={<Video />} />

                <Route path="channel/:username" element={<Channel />} />

                {/* Protected Pages */}

                <Route element={<ProtectedRoutes />}>

                    <Route path="dashboard" element={<Dashboard />} />

                    <Route path="upload" element={<UploadVideo />} />

                    <Route path="playlist/:playlistId" element={<PlaylistDetails />} />

                    <Route path="playlists" element={<Playlists />}/>
                    
                    <Route path="tweets" element={<Tweets />} />

                    <Route path="liked-videos" element={<LikedVideos />} />

                    <Route path="profile" element={<Profile />} />

                    <Route path="/history" element={<History />} />

                </Route>

            </Route>

            <Route element={<PublicRoutes />}>

                <Route element={<AuthLayout />}>

                    <Route path="login" element={<Login />} />

                    <Route path="register" element={<Register />} />

                </Route>

            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default AppRoutes;