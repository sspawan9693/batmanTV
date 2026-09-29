import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MoreVertical } from "lucide-react";

import { formatViews } from "../../utils/formatViews";
import { timeAgo } from "../../utils/timeAgo";

import HistoryMenu from "./HistoryMenu";

function HistoryVideoCard({ video, showMenu = true }) {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleWatch = () => {
        navigate(`/watch/${video._id}`);
    };

    const handleChannel = (e) => {
        e.stopPropagation();
        navigate(`/channel/${video.owner.username}`);
    };

    return (
        <article
            className="
                group
                relative
                flex
                gap-4
                rounded-xl
                p-2
                transition
                hover:bg-zinc-900
            "
        >
            {/* Thumbnail */}

            <div
                onClick={handleWatch}
                className="
                    relative
                    w-70
                    shrink-0
                    cursor-pointer
                    overflow-hidden
                    rounded-xl
                    aspect-video
                    bg-zinc-800
                "
            >
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="
                        h-full
                        w-full
                        object-cover
                    "
                />
            </div>

            {/* Right Side */}

            <div className="flex min-w-0 flex-1 justify-between gap-4">

                {/* Content */}

                <div
                    className="
                        min-w-0
                        cursor-pointer
                    "
                    onClick={handleWatch}
                >
                    {/* Title */}

                    <h3
                        className="
                            line-clamp-2
                            text-lg
                            font-semibold
                            leading-6
                            text-white
                        "
                    >
                        {video.title}
                    </h3>

                    {/* Channel */}

                    <div className="mt-3 flex items-center gap-2">

                        <img
                            src={video.owner.avatar}
                            alt={video.owner.fullName}
                            onClick={handleChannel}
                            className="
                                h-5
                                w-5
                                shrink-0
                                cursor-pointer
                                rounded-full
                                object-cover
                            "
                        />

                        <button
                            onClick={handleChannel}
                            className="
                                text-sm
                                text-zinc-300
                                transition
                                hover:text-white
                            "
                        >
                            {video.owner.username}
                        </button>

                    </div>

                    {/* Views + Date */}

                    <p className="mt-2 text-sm text-zinc-500">
                        {formatViews(video.views)} views •{" "}
                        {timeAgo(video.createdAt)}
                    </p>

                    {/* Description */}

                    {video.description && (
                        <p
                            className="
                                mt-3
                                line-clamp-2
                                text-sm
                                leading-6
                                text-zinc-400
                            "
                        >
                            {video.description}
                        </p>
                    )}

                </div>

                {/* Menu */}

                {showMenu && (
                    <div className="relative shrink-0">

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen((prev) => !prev);
                            }}
                            className="
                                rounded-full
                                p-2
                                text-zinc-400
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                            "
                        >
                            <MoreVertical size={20} />
                        </button>

                        {menuOpen && (
                            <HistoryMenu
                                onClose={() => setMenuOpen(false)}
                                video={video}
                            />
                        )}

                    </div>
                )}

            </div>

        </article>
    );
}

export default HistoryVideoCard;