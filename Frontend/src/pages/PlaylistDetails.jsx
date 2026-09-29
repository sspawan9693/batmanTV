// pages/PlaylistDetails.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    MoreVertical,
    Pencil,
    Trash2,
    ListVideo,
    Play,
    Share2,
} from "lucide-react";

import { getPlaylistById } from "../api/playlist";
import {
    updatePlaylist,
    deletePlaylist,
    removeVideosFromPlaylist,
} from "../api/playlist";

import DropdownMenu from "../components/common/DropdownMenu";
import ConfirmModal from "../components/common/ConfirmModal";
import PlaylistModal from "../components/playlist/PlaylistModal";

import { formatViews } from "../utils/formatViews";
import { timeAgo } from "../utils/timeAgo";
import { formatDuration } from "../utils/formatDuration";

function PlaylistDetails() {
    const { playlistId } = useParams();
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedVideo, setSelectedVideo] = useState(null);
    const [deleteVideoOpen, setDeleteVideoOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [deletePlaylistOpen, setDeletePlaylistOpen] =
        useState(false);

    const fetchPlaylist = async () => {
        try {
            setLoading(true);

            const data = await getPlaylistById(playlistId);

            setPlaylist(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, [playlistId]);

    // =========================
    // REMOVE VIDEO
    // =========================

    const handleRemoveVideo = async () => {
        if (!selectedVideo) return;

        try {
            await removeVideosFromPlaylist(
                playlist._id,
                selectedVideo._id
            );

            setPlaylist((prev) => ({
                ...prev,

                videos: prev.videos.filter(
                    (video) => video._id !== selectedVideo._id
                ),

                totalVideos: Math.max(
                    0,
                    prev.totalVideos - 1
                ),
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setDeleteVideoOpen(false);
            setSelectedVideo(null);
        }
    };

    // =========================
    // UPDATE PLAYLIST
    // =========================

    const handleUpdatePlaylist = async (formData) => {
        try {
            setSaving(true);

            await updatePlaylist(
                playlist._id,
                formData
            );

            await fetchPlaylist();

            setModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE PLAYLIST
    // =========================

    const handleDeletePlaylist = async () => {
        try {
            await deletePlaylist(playlist._id);

            navigate("/playlists");
        } catch (error) {
            console.error(error);
        } finally {
            setDeletePlaylistOpen(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-zinc-400">
                Loading playlist...
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-zinc-400">
                Playlist not found.
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

            {/* ========================================= */}
            {/* PLAYLIST HEADER */}
            {/* ========================================= */}

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

                {/* ================= LEFT ================= */}

                <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-90">

                    {/* Thumbnail */}

                    <div className="overflow-hidden rounded-2xl bg-zinc-900">
                        <img
                            src={
                                playlist.videos?.[0]?.thumbnail ||
                                "https://placehold.co/1280x720/18181b/ffffff?text=Playlist"
                            }
                            alt={playlist.name}
                            className="
                                aspect-video
                                w-full
                                object-cover
                            "
                        />
                    </div>

                    {/* Playlist Information */}

                    <div className="mt-5">

                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            {playlist.name}
                        </h1>

                        {/* Metadata */}

                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">

                            <span>
                                {playlist.totalVideos} videos
                            </span>

                            <span className="text-zinc-600">
                                •
                            </span>

                            <span>
                                Updated {timeAgo(playlist.updatedAt)}
                            </span>

                        </div>

                        {/* Description */}

                        {playlist.description && (
                            <p
                                className="
                                    mt-4
                                    whitespace-pre-line
                                    text-sm
                                    leading-6
                                    text-zinc-400
                                "
                            >
                                {playlist.description}
                            </p>
                        )}

                    </div>

                    {/* Actions */}

                    <div className="mt-6 flex items-center gap-2">

                        {/* Play All */}

                        <button
                            className="
                                flex
                                h-11
                                items-center
                                gap-2
                                rounded-full
                                bg-white
                                px-5
                                text-sm
                                font-semibold
                                text-black
                                transition
                                hover:bg-zinc-200
                            "
                        >
                            <Play
                                size={17}
                                fill="black"
                            />

                            Play All
                        </button>

                        {/* Share */}

                        <button
                            className="
                                flex
                                h-11
                                items-center
                                gap-2
                                rounded-full
                                bg-[#272727]
                                px-5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-[#333333]
                            "
                        >
                            <Share2 size={17} />

                            Share
                        </button>

                        {/* More */}

                        <DropdownMenu
                            trigger={
                                <button
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-zinc-400
                                        transition
                                        hover:bg-[#272727]
                                        hover:text-white
                                    "
                                >
                                    <MoreVertical size={20} />
                                </button>
                            }
                            items={[
                                {
                                    label: "Edit Playlist",
                                    icon: Pencil,
                                    onClick: () =>
                                        setModalOpen(true),
                                },
                                {
                                    label: "Delete Playlist",
                                    icon: Trash2,
                                    danger: true,
                                    onClick: () =>
                                        setDeletePlaylistOpen(true),
                                },
                            ]}
                        />

                    </div>

                </div>

                {/* ================= RIGHT ================= */}

                <div className="min-w-0 flex-1">

                    {playlist.videos?.length ? (

                        <div className="space-y-1">

                            {playlist.videos.map(
                                (video, index) => (

                                    <div
                                        key={video._id}
                                        className="
                                            group
                                            flex
                                            gap-3
                                            rounded-xl
                                            p-2
                                            transition
                                            hover:bg-[#1a1a1a]
                                            sm:gap-4
                                            sm:p-3
                                        "
                                    >

                                        {/* Number */}

                                        <div
                                            className="
                                                hidden
                                                w-6
                                                shrink-0
                                                items-center
                                                justify-center
                                                text-sm
                                                text-zinc-500
                                                sm:flex
                                            "
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Thumbnail */}

                                        <Link
                                            to={`/watch/${video._id}`}
                                            className="
                                                relative
                                                aspect-video
                                                w-40
                                                shrink-0
                                                overflow-hidden
                                                rounded-lg
                                                bg-zinc-900
                                                sm:w-52
                                                md:w-56
                                            "
                                        >

                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                loading="lazy"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition
                                                    duration-300
                                                    group-hover:scale-105
                                                "
                                            />

                                            {/* Duration */}

                                            <span
                                                className="
                                                    absolute
                                                    bottom-1.5
                                                    right-1.5
                                                    rounded
                                                    bg-black/85
                                                    px-1.5
                                                    py-0.5
                                                    text-[11px]
                                                    font-medium
                                                    text-white
                                                "
                                            >
                                                {formatDuration(
                                                    video.duration
                                                )}
                                            </span>

                                        </Link>

                                        {/* Video Information */}

                                        <div className="min-w-0 flex-1 py-0.5">

                                            <Link
                                                to={`/watch/${video._id}`}
                                            >
                                                <h3
                                                    className="
                                                        line-clamp-2
                                                        text-[15px]
                                                        font-semibold
                                                        leading-5
                                                        text-white
                                                        transition
                                                        group-hover:text-zinc-200
                                                        sm:text-base
                                                    "
                                                >
                                                    {video.title}
                                                </h3>
                                            </Link>

                                            {/* Username */}

                                            {video.owner?.username && (
                                                <Link
                                                    to={`/channel/${video.owner.username}`}
                                                    className="
                                                        mt-1.5
                                                        block
                                                        w-fit
                                                        text-sm
                                                        text-zinc-400
                                                        transition
                                                        hover:text-white
                                                    "
                                                >
                                                    {video.owner.username}
                                                </Link>
                                            )}

                                            {/* Description */}

                                            {video.description && (
                                                <p
                                                    className="
                                                        mt-1
                                                        hidden
                                                        line-clamp-2
                                                        text-sm
                                                        leading-5
                                                        text-zinc-500
                                                        md:block
                                                    "
                                                >
                                                    {video.description}
                                                </p>
                                            )}

                                            {/* Stats */}

                                            <div
                                                className="
                                                    mt-1.5
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-1.5
                                                    text-xs
                                                    text-zinc-500
                                                "
                                            >

                                                <span>
                                                    {formatViews(
                                                        video.views
                                                    )}{" "}
                                                    views
                                                </span>

                                                <span>
                                                    •
                                                </span>

                                                <span>
                                                    {timeAgo(
                                                        video.createdAt
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                        {/* Video Menu */}

                                        <div
                                            className="shrink-0"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >

                                            <DropdownMenu
                                                trigger={
                                                    <button
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            text-zinc-500
                                                            transition
                                                            hover:bg-zinc-800
                                                            hover:text-white
                                                        "
                                                    >
                                                        <MoreVertical
                                                            size={18}
                                                        />
                                                    </button>
                                                }
                                                items={[
                                                    {
                                                        label: "Share",
                                                        icon: Share2,
                                                        onClick: () => {
                                                            console.log(
                                                                "share"
                                                            );
                                                        },
                                                    },
                                                    {
                                                        label:
                                                            "Remove Video",
                                                        icon: Trash2,
                                                        danger: true,
                                                        onClick: () => {
                                                            setSelectedVideo(
                                                                video
                                                            );

                                                            setDeleteVideoOpen(
                                                                true
                                                            );
                                                        },
                                                    },
                                                ]}
                                            />

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    ) : (

                        /* Empty Playlist */

                        <div
                            className="
                                flex
                                min-h-100
                                flex-col
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-dashed
                                border-zinc-800
                                bg-[#111111]
                                px-6
                                text-center
                            "
                        >

                            <ListVideo
                                size={42}
                                className="text-zinc-600"
                            />

                            <h2 className="mt-5 text-xl font-semibold text-white">
                                No videos yet
                            </h2>

                            <p className="mt-2 text-sm text-zinc-500">
                                Add videos to this playlist and they'll appear here.
                            </p>

                        </div>

                    )}

                </div>

            </div>

            {/* ========================================= */}
            {/* REMOVE VIDEO MODAL */}
            {/* ========================================= */}

            <ConfirmModal
                open={deleteVideoOpen}
                title="Remove Video"
                description={`Remove "${selectedVideo?.title}" from this playlist?`}
                onCancel={() => {
                    setDeleteVideoOpen(false);
                    setSelectedVideo(null);
                }}
                onConfirm={handleRemoveVideo}
            />

            {/* ========================================= */}
            {/* DELETE PLAYLIST MODAL */}
            {/* ========================================= */}

            <ConfirmModal
                open={deletePlaylistOpen}
                title="Delete Playlist"
                description={`Delete "${playlist?.name}"? This action cannot be undone.`}
                onCancel={() =>
                    setDeletePlaylistOpen(false)
                }
                onConfirm={handleDeletePlaylist}
            />

            {/* ========================================= */}
            {/* EDIT PLAYLIST MODAL */}
            {/* ========================================= */}

            <PlaylistModal
                open={modalOpen}
                mode="edit"
                initialData={playlist}
                loading={saving}
                onClose={() =>
                    setModalOpen(false)
                }
                onSubmit={handleUpdatePlaylist}
            />

        </div>
    );
}

export default PlaylistDetails;