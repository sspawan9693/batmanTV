import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";
import {
    Play,
    ListVideo,
    Pencil,
    Trash2,
    MoreVertical,
} from "lucide-react";

import DropdownMenu from "../common/DropdownMenu";

function PlaylistCard({
    playlist,
    onDelete,
    onEdit,
}) {
    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-zinc-800
                bg-[#111111]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-zinc-700
                hover:bg-[#161616]
            "
        >

            {/* Dropdown */}

            <div
                className="
                    absolute
                    right-3
                    top-3
                    z-30
                "
            >
                <DropdownMenu
                    direction="down"
                    trigger={
                        <button
                            type="button"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-black/10
                                text-white
                                backdrop-blur-md
                                transition
                                hover:bg-white/10
                            "
                        >
                            <MoreVertical size={20} />
                        </button>
                    }
                    items={[
                        {
                            label: "Edit Playlist",
                            icon: Pencil,
                            onClick: () => onEdit?.(playlist),
                        },
                        {
                            label: "Delete Playlist",
                            icon: Trash2,
                            danger: true,
                            onClick: () => onDelete?.(playlist),
                        },
                    ]}
                />
            </div>

            {/* Card Link */}

            <Link
                to={`/playlist/${playlist._id}`}
                className="block"
            >

                {/* Thumbnail */}

                <div
                    className="
                        relative
                        aspect-video
                        overflow-hidden
                        bg-zinc-900
                    "
                >

                    <img
                        src={
                            playlist.thumbnail ||
                            "https://placehold.co/1280x720/18181b/ffffff?text=Playlist"
                        }
                        alt={playlist.name}
                        draggable={false}
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://placehold.co/1280x720/18181b/ffffff?text=Playlist";
                        }}
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                        "
                    />

                    {/* Overlay */}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-black/20
                            transition
                            group-hover:bg-black/35
                        "
                    />

                    {/* Play Icon */}

                    <div
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            opacity-0
                            transition-all
                            duration-300
                            group-hover:opacity-100
                        "
                    >
                        <div
                            className="
                                rounded-full
                                bg-black/70
                                p-4
                                backdrop-blur
                            "
                        >
                            <Play
                                size={28}
                                fill="white"
                                className="text-white"
                            />
                        </div>
                    </div>

                    {/* Video Count */}

                    <div
                        className="
                            absolute
                            bottom-3
                            right-3
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-black/80
                            px-2.5
                            py-1.5
                            text-xs
                            font-medium
                            text-white
                        "
                    >
                        <ListVideo size={14} />

                        {playlist.totalVideos || 0}
                    </div>

                </div>

                {/* Details */}

                <div className="space-y-2.5 p-5">

                    {/* Title */}

                    <h2
                        className="
                            line-clamp-1
                            pr-8
                            text-lg
                            font-semibold
                            leading-6
                            text-white
                        "
                    >
                        {playlist.name}
                    </h2>

                    {/* Description */}

                    {playlist.description && (
                        <p
                            className="
                                line-clamp-2
                                text-sm
                                leading-5
                                text-zinc-400
                            "
                        >
                            {playlist.description}
                        </p>
                    )}

                    {/* Metadata */}

                    <div
                        className="
                            pt-1
                            text-sm
                            text-zinc-500
                        "
                    >
                        {playlist.totalVideos || 0} videos
                        {" • "}
                        Updated {timeAgo(playlist.updatedAt)}
                    </div>

                </div>

            </Link>

        </div>
    );
}

export default PlaylistCard;