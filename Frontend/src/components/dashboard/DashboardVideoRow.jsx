import { Link } from "react-router-dom";
import {
    MoreVertical,
    Eye,
    Heart,
    CalendarDays,
    Pencil,
    Trash2,
    EyeOff,
} from "lucide-react";

import { formatViews } from "../../utils/formatViews";
import { timeAgo } from "../../utils/timeAgo";
import { formatDuration } from "../../utils/formatDuration";

function DashboardVideoRow({
    video,
    onEdit,
    onDelete,
    onTogglePublish,
}) {
    const {
        _id,
        title,
        thumbnail,
        views,
        likesCount,
        duration,
        createdAt,
        isPublished,
    } = video;

    return (
        <div
            className="
                group
                flex
                gap-4
                border-b
                border-zinc-800/80
                px-4
                py-4
                transition-colors
                duration-200
                hover:bg-zinc-900/40
                sm:px-5
            "
        >
            {/* Thumbnail */}

            <Link
                to={`/watch/${_id}`}
                className="
                    relative
                    h-18
                    w-32
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    bg-zinc-900
                    sm:h-20
                    sm:w-36
                "
            >
                <img
                    src={thumbnail}
                    alt={title}
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                        e.currentTarget.src =
                            "https://placehold.co/640x360/18181b/ffffff?text=No+Thumbnail";
                    }}
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-300
                        group-hover:scale-105
                    "
                />

                {/* Duration */}

                <span
                    className="
                        absolute
                        bottom-1
                        right-1
                        rounded
                        bg-black/85
                        px-1.5
                        py-0.5
                        text-[10px]
                        font-medium
                        text-white
                    "
                >
                    {formatDuration(duration)}
                </span>
            </Link>

            {/* Details */}

            <div className="min-w-0 flex-1">
                <Link to={`/watch/${_id}`}>
                    <h3
                        className="
                            line-clamp-2
                            text-sm
                            font-semibold
                            leading-5
                            text-white
                            transition-colors
                            hover:text-zinc-300
                            sm:text-[15px]
                        "
                    >
                        {title}
                    </h3>
                </Link>

                {/* Stats */}

                <div
                    className="
                        mt-2
                        flex
                        flex-wrap
                        items-center
                        gap-x-3
                        gap-y-1
                        text-xs
                        text-zinc-500
                    "
                >
                    <span className="flex items-center gap-1">
                        <Eye size={13} />
                        {formatViews(views)}
                    </span>

                    <span className="flex items-center gap-1">
                        <Heart size={13} />
                        {likesCount || 0}
                    </span>

                    <span className="hidden items-center gap-1 sm:flex">
                        <CalendarDays size={13} />
                        {timeAgo(createdAt)}
                    </span>
                </div>

                {/* Publish Status */}

                <div className="mt-2">
                    <span
                        className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-2
                            py-0.5
                            text-[11px]
                            font-medium
                            ${isPublished
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-zinc-800 text-zinc-400"
                            }
                        `}
                    >
                        <span
                            className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${isPublished
                                    ? "bg-emerald-400"
                                    : "bg-zinc-500"
                                }
                            `}
                        />

                        {isPublished
                            ? "Published"
                            : "Unpublished"}
                    </span>
                </div>
            </div>

            {/* Actions */}

            <div className="relative shrink-0">
                <details className="group/menu relative">
                    <summary
                        className="
                            flex
                            cursor-pointer
                            list-none
                            items-center
                            justify-center
                            rounded-full
                            p-2
                            text-zinc-500
                            transition
                            hover:bg-zinc-800
                            hover:text-white
                            [&::-webkit-details-marker]:hidden
                        "
                    >
                        <MoreVertical size={18} />
                    </summary>

                    <div
                        className="
                            absolute
                            right-0
                            top-10
                            z-50
                            w-48
                            overflow-hidden
                            rounded-xl
                            border
                            border-zinc-800
                            bg-[#181818]
                            p-1
                            shadow-2xl
                        "
                    >
                        {/* Edit */}

                        <button
                            type="button"
                            onClick={() =>
                                onEdit?.(video)
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                text-zinc-300
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                            "
                        >
                            <Pencil size={16} />

                            Edit video
                        </button>

                        {/* Publish */}

                        <button
                            type="button"
                            onClick={() =>
                                onTogglePublish?.(video)
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                text-zinc-300
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                            "
                        >
                            {isPublished ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}

                            {isPublished
                                ? "Unpublish"
                                : "Publish"}
                        </button>

                        <div className="my-1 border-t border-zinc-800" />

                        {/* Delete */}

                        <button
                            type="button"
                            onClick={() =>
                                onDelete?.(video)
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                text-red-400
                                transition
                                hover:bg-red-500/10
                            "
                        >
                            <Trash2 size={16} />

                            Delete video
                        </button>
                    </div>
                </details>
            </div>
        </div>
    );
}

export default DashboardVideoRow;