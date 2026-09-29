import { useEffect, useState } from "react";
import {
    Eye,
    Users,
    Heart,
    Video,
    Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../api/axios";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import DashboardVideoRow from "../components/dashboard/DashboardVideoRow";
import EditVideoModal from "../components/dashboard/EditVideoModal";
import DeleteVideoModal from "../components/dashboard/DeleteVideoModal";

function Dashboard() {
    const [stats, setStats] = useState({
        totalVideos: 0,
        totalViews: 0,
        totalSubscribers: 0,
        totalLikes: 0,
    });

    const [videos, setVideos] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editOpen, setEditOpen] = useState(false);
    const [editingVideo, setEditingVideo] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);
    const [deletingVideo, setDeletingVideo] =
        useState(null);

    const [actionLoading, setActionLoading] =
        useState(false);

    /* ================= FETCH DASHBOARD ================= */

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const [statsResponse, videosResponse] =
                await Promise.all([
                    api.get("/dashboard/stats"),
                    api.get(
                        "/dashboard/videos?page=1&limit=20"
                    ),
                ]);

            setStats(statsResponse.data.data);

            setVideos(
                videosResponse.data.data.docs || []
            );
        } catch (error) {
            console.error(
                "Failed to fetch dashboard:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    /* ================= EDIT ================= */

    const handleEdit = (video) => {
        setEditingVideo(video);
        setEditOpen(true);
    };

    const handleUpdateVideo = async (formData) => {
        if (!editingVideo) return;

        try {
            setActionLoading(true);

            const response = await api.patch(
                `/videos/${editingVideo._id}`,
                formData
            );

            const updatedVideo =
                response.data.data;

            setVideos((prev) =>
                prev.map((video) =>
                    video._id === editingVideo._id
                        ? {
                            ...video,
                            ...updatedVideo,
                        }
                        : video
                )
            );

            setEditOpen(false);
            setEditingVideo(null);
        } catch (error) {
            console.error(
                "Failed to update video:",
                error
            );
        } finally {
            setActionLoading(false);
        }
    };

    /* ================= DELETE ================= */

    const handleDeleteClick = (video) => {
        setDeletingVideo(video);
        setDeleteOpen(true);
    };

    const handleDeleteVideo = async () => {
        if (!deletingVideo) return;

        try {
            setActionLoading(true);

            await api.delete(
                `/videos/${deletingVideo._id}`
            );

            setVideos((prev) =>
                prev.filter(
                    (video) =>
                        video._id !==
                        deletingVideo._id
                )
            );

            setStats((prev) => ({
                ...prev,
                totalVideos: Math.max(
                    prev.totalVideos - 1,
                    0
                ),
            }));

            setDeleteOpen(false);
            setDeletingVideo(null);
        } catch (error) {
            console.error(
                "Failed to delete video:",
                error
            );
        } finally {
            setActionLoading(false);
        }
    };

    /* ================= PUBLISH ================= */

    const handleTogglePublish = async (video) => {
        try {
            setActionLoading(true);

            const response = await api.patch(
                `/videos/${video._id}/toggle-publish`
            );

            const updatedVideo =
                response.data.data;

            setVideos((prev) =>
                prev.map((item) =>
                    item._id === video._id
                        ? {
                            ...item,
                            isPublished:
                                updatedVideo.isPublished,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to update publish status:",
                error
            );
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div
            className="
                mx-auto
                min-h-screen
                w-full
                max-w-6xl
                border-x
                border-zinc-800
            "
        >
            {/* Header */}

            <DashboardHeader />

            {/* Analytics */}

            <section className="px-5 py-6">
                <div className="mb-4">
                    <h2
                        className="
                            text-base
                            font-semibold
                            text-white
                        "
                    >
                        Channel Analytics
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-zinc-500
                        "
                    >
                        Overview of your channel's
                        performance
                    </p>
                </div>

                {loading ? (
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >
                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="
                                        h-32
                                        animate-pulse
                                        rounded-2xl
                                        border
                                        border-zinc-800
                                        bg-zinc-900/50
                                    "
                                />
                            )
                        )}
                    </div>
                ) : (
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >
                        <StatCard
                            title="Total Views"
                            value={stats.totalViews.toLocaleString()}
                            icon={Eye}
                            description="Across all videos"
                        />

                        <StatCard
                            title="Subscribers"
                            value={stats.totalSubscribers.toLocaleString()}
                            icon={Users}
                            description="Current subscribers"
                        />

                        <StatCard
                            title="Total Likes"
                            value={stats.totalLikes.toLocaleString()}
                            icon={Heart}
                            description="Likes on your videos"
                        />

                        <StatCard
                            title="Videos"
                            value={stats.totalVideos.toLocaleString()}
                            icon={Video}
                            description="Videos uploaded"
                        />
                    </div>
                )}
            </section>

            {/* Videos */}

            <section
                className="
                    border-t
                    border-zinc-800
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-5
                        py-5
                    "
                >
                    <div>
                        <h2
                            className="
                                text-base
                                font-semibold
                                text-white
                            "
                        >
                            Your Videos
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-zinc-500
                            "
                        >
                            Manage your uploaded videos
                        </p>
                    </div>

                    <Link
                        to="/upload"
                        className="
                            hidden
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-zinc-800
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-zinc-300
                            transition
                            hover:border-zinc-700
                            hover:bg-zinc-900
                            hover:text-white
                            sm:flex
                        "
                    >
                        <Upload size={15} />

                        Upload
                    </Link>
                </div>

                {/* Loading */}

                {loading ? (
                    <div className="divide-y divide-zinc-800">
                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="
                                        flex
                                        gap-4
                                        px-5
                                        py-4
                                    "
                                >
                                    <div
                                        className="
                                            h-20
                                            w-36
                                            shrink-0
                                            animate-pulse
                                            rounded-lg
                                            bg-zinc-900
                                        "
                                    />

                                    <div
                                        className="
                                            flex
                                            flex-1
                                            flex-col
                                            gap-3
                                        "
                                    >
                                        <div
                                            className="
                                                h-4
                                                w-2/3
                                                animate-pulse
                                                rounded
                                                bg-zinc-900
                                            "
                                        />

                                        <div
                                            className="
                                                h-3
                                                w-1/3
                                                animate-pulse
                                                rounded
                                                bg-zinc-900
                                            "
                                        />

                                        <div
                                            className="
                                                h-5
                                                w-20
                                                animate-pulse
                                                rounded-full
                                                bg-zinc-900
                                            "
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : videos.length === 0 ? (
                    /* Empty */

                    <div
                        className="
                            flex
                            min-h-[40vh]
                            flex-col
                            items-center
                            justify-center
                            border-t
                            border-zinc-800
                            px-5
                            text-center
                        "
                    >
                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-zinc-900
                                text-zinc-500
                            "
                        >
                            <Video size={25} />
                        </div>

                        <h3
                            className="
                                mt-4
                                text-base
                                font-semibold
                                text-white
                            "
                        >
                            No videos yet
                        </h3>

                        <p
                            className="
                                mt-1
                                max-w-sm
                                text-sm
                                text-zinc-500
                            "
                        >
                            Upload your first video to
                            start building your channel.
                        </p>

                        <Link
                            to="/upload"
                            className="
                                mt-5
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-black
                                transition
                                hover:bg-zinc-200
                            "
                        >
                            <Upload size={15} />

                            Upload Video
                        </Link>
                    </div>
                ) : (
                    /* Video List */

                    <div
                        className="
                            border-t
                            border-zinc-800
                        "
                    >
                        {videos.map((video) => (
                            <DashboardVideoRow
                                key={video._id}
                                video={video}
                                onEdit={
                                    handleEdit
                                }
                                onDelete={
                                    handleDeleteClick
                                }
                                onTogglePublish={
                                    handleTogglePublish
                                }
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Edit Modal */}

            <EditVideoModal
                open={editOpen}
                video={editingVideo}
                loading={actionLoading}
                onClose={() => {
                    if (actionLoading) return;

                    setEditOpen(false);
                    setEditingVideo(null);
                }}
                onSubmit={handleUpdateVideo}
            />

            {/* Delete Modal */}

            <DeleteVideoModal
                open={deleteOpen}
                video={deletingVideo}
                loading={actionLoading}
                onClose={() => {
                    if (actionLoading) return;

                    setDeleteOpen(false);
                    setDeletingVideo(null);
                }}
                onConfirm={handleDeleteVideo}
            />
        </div>
    );
}

export default Dashboard;