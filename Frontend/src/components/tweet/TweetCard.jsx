import { useState } from "react";
import { useSelector } from "react-redux";

import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Pencil,
    Trash2,
    Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import { timeAgo } from "../../utils/timeAgo";
import { toggleTweetLike } from "../../api/like";
import DropdownMenu from "../common/DropdownMenu";

function TweetCard({
    tweet,
    onEdit,
    onDelete,
}) {
    const user = useSelector(
        (state) => state.auth.user
    );

    const [liked, setLiked] = useState(false);

    const [likes, setLikes] = useState(
        tweet.likesCount || 0
    );

    const isOwner =
        user?._id === tweet.owner?._id;

    const handleLike = async () => {
        if (!user) return;

        try {
            const response =
                await toggleTweetLike(tweet._id);

            setLiked(response.isLiked);

            setLikes((prev) =>
                response.isLiked
                    ? prev + 1
                    : Math.max(prev - 1, 0)
            );
        } catch (error) {
            console.error(
                "Failed to toggle tweet like:",
                error
            );
        }
    };

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
                ease: "easeOut",
            }}
            whileHover={{
                backgroundColor:
                    "rgba(255,255,255,0.018)",
            }}
            className="
                group
                relative
                border-b
                border-zinc-800/70
                px-6
                py-6
                transition-colors
                duration-200
            "
        >
            {/* Subtle left accent */}

            <div
                className="
                    absolute
                    left-0
                    top-6
                    h-10
                    w-0.5
                    rounded-r-full
                    bg-transparent
                    transition-all
                    duration-300
                    group-hover:bg-red-500/70
                "
            />

            <div className="flex gap-4">

                {/* Avatar */}

                <motion.div
                    whileHover={{
                        scale: 1.05,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="shrink-0"
                >
                    <img
                        src={
                            tweet.owner?.avatar ||
                            "https://ui-avatars.com/api/?name=User&background=27272a&color=fff"
                        }
                        alt={
                            tweet.owner?.fullName ||
                            "User"
                        }
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://ui-avatars.com/api/?name=User&background=27272a&color=fff";
                        }}
                        className="
                            h-11
                            w-11
                            rounded-full
                            object-cover
                            ring-2
                            ring-zinc-800
                            transition-all
                            duration-300
                            group-hover:ring-zinc-700
                        "
                    />
                </motion.div>

                {/* Main content */}

                <div className="min-w-0 flex-1">

                    {/* Header */}

                    <div className="flex items-start gap-3">

                        <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">

                                <span
                                    className="
                                        max-w-52
                                        truncate
                                        text-[15px]
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {tweet.owner?.fullName}
                                </span>

                                <span
                                    className="
                                        max-w-40
                                        truncate
                                        text-[14px]
                                        text-zinc-500
                                    "
                                >
                                    @{tweet.owner?.username}
                                </span>

                                <span className="text-zinc-700">
                                    ·
                                </span>

                                <span
                                    className="
                                        text-[13px]
                                        text-zinc-500
                                    "
                                >
                                    {timeAgo(
                                        tweet.createdAt
                                    )}
                                </span>

                            </div>

                        </div>

                        {/* Owner menu */}

                        {isOwner && (
                            <div className="ml-auto shrink-0">

                                <DropdownMenu
                                    trigger={
                                        <motion.div
                                            whileTap={{
                                                scale: 0.9,
                                            }}
                                            className="
                                                rounded-full
                                                p-2
                                                text-zinc-600
                                                transition-all
                                                duration-200
                                                hover:bg-zinc-800
                                                hover:text-zinc-200
                                            "
                                        >
                                            <MoreHorizontal
                                                size={18}
                                            />
                                        </motion.div>
                                    }
                                    items={[
                                        {
                                            label: "Edit Tweet",
                                            icon: Pencil,
                                            onClick: () =>
                                                onEdit?.(
                                                    tweet
                                                ),
                                        },
                                        {
                                            label: "Delete Tweet",
                                            icon: Trash2,
                                            danger: true,
                                            onClick: () =>
                                                onDelete?.(
                                                    tweet
                                                ),
                                        },
                                    ]}
                                />

                            </div>
                        )}

                    </div>

                    {/* Content */}

                    <p
                        className="
                            mt-3
                            whitespace-pre-wrap
                            wrap-break-word
                            text-[15px]
                            leading-7
                            text-zinc-200
                        "
                    >
                        {tweet.content}
                    </p>

                    {/* Actions */}

                    <div
                        className="
                            mt-5
                            flex
                            max-w-md
                            items-center
                            justify-between
                        "
                    >

                        {/* Reply */}

                        <motion.button
                            whileTap={{
                                scale: 0.92,
                            }}
                            type="button"
                            className="
                                group/action
                                flex
                                items-center
                                gap-2
                                rounded-full
                                px-3
                                py-2
                                text-zinc-500
                                transition-all
                                duration-200
                                hover:bg-blue-500/10
                                hover:text-blue-400
                            "
                        >
                            <MessageCircle
                                size={18}
                                strokeWidth={1.8}
                            />

                            <span className="text-xs">
                                Reply
                            </span>
                        </motion.button>

                        {/* Like */}

                        <motion.button
                            whileTap={{
                                scale: 0.88,
                            }}
                            type="button"
                            onClick={handleLike}
                            className={`
                                flex
                                items-center
                                gap-2
                                rounded-full
                                px-3
                                py-2
                                transition-all
                                duration-200
                                ${liked
                                    ? "bg-red-500/10 text-red-500"
                                    : "text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                                }
                            `}
                        >
                            <motion.div
                                animate={
                                    liked
                                        ? {
                                            scale: [
                                                1,
                                                1.3,
                                                1,
                                            ],
                                        }
                                        : {
                                            scale: 1,
                                        }
                                }
                                transition={{
                                    duration: 0.25,
                                }}
                            >
                                <Heart
                                    size={18}
                                    strokeWidth={1.8}
                                    fill={
                                        liked
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                            </motion.div>

                            {likes > 0 && (
                                <span className="text-xs">
                                    {likes}
                                </span>
                            )}
                        </motion.button>

                        {/* Share */}

                        <motion.button
                            whileTap={{
                                scale: 0.92,
                            }}
                            type="button"
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                px-3
                                py-2
                                text-zinc-500
                                transition-all
                                duration-200
                                hover:bg-emerald-500/10
                                hover:text-emerald-400
                            "
                        >
                            <Share2
                                size={18}
                                strokeWidth={1.8}
                            />

                            <span className="text-xs">
                                Share
                            </span>
                        </motion.button>

                    </div>

                </div>

            </div>
        </motion.article>
    );
}

export default TweetCard;