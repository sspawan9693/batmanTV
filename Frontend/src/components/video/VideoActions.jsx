import { useState } from "react";
import { useSelector } from "react-redux";
import {
    ThumbsUp,
    ThumbsDown,
    Share2,
    Bookmark,
} from "lucide-react";

import { toggleVideoLike } from "../../api/like";
import ShareModal from "../common/ShareModal";
import SaveToPlaylistModal from "../video/SaveToPlaylistModal";

function VideoActions({ video }) {
    const user = useSelector((state) => state.auth.user);

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(video.likesCount || 0);
    const [shareOpen, setShareOpen] = useState(false);
    const [savePlaylistOpen, setSavePlaylistOpen] = useState(false);

    const buttonClass = `
        flex
        items-center
        gap-2
        rounded-full
        border
        border-zinc-800
        bg-[#161616]
        px-5
        py-2.5
        text-sm
        font-medium
        text-zinc-200
        transition-all
        duration-200
        hover:bg-zinc-800
        hover:border-zinc-700
        hover:-translate-y-0.5
        active:scale-95
    `;

    const handleLike = async () => {
        if (!user) {
            alert("Please login to like videos ❤️");
            return;
        }

        try {
            const res = await toggleVideoLike(video._id);

            setLiked(res.isLiked);

            setLikes((prev) =>
                res.isLiked
                    ? prev + 1
                    : Math.max(prev - 1, 0)
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <section className="flex flex-wrap gap-3">

                {/* Like */}

                <button
                    onClick={handleLike}
                    className={`${buttonClass} ${
                        liked
                            ? "border-white bg-white text-black"
                            : ""
                    }`}
                >
                    <ThumbsUp
                        size={18}
                        className={`transition-all duration-200 ${
                            liked
                                ? "scale-110 fill-red-500 text-red-500"
                                : "text-zinc-200"
                        }`}
                    />

                    <span
                        className={`transition-colors duration-200 ${
                            liked
                                ? "text-red-500"
                                : "text-zinc-200"
                        }`}
                    >
                        {likes}
                    </span>
                </button>

                {/* Dislike */}

                <button className={buttonClass}>
                    <ThumbsDown size={18} />
                    <span>Dislike</span>
                </button>

                {/* Share */}

                <button
                    onClick={() => setShareOpen(true)}
                    className={buttonClass}
                >
                    <Share2 size={18} />
                    <span>Share</span>
                </button>

                {/* Save */}

                <button
                    onClick={() => setSavePlaylistOpen(true)}
                    className={buttonClass}
                >
                    <Bookmark size={18} />
                    <span>Save</span>
                </button>

            </section>

            {/* Share Modal */}

            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                url={window.location.href}
            />

            {/* Save to Playlist Modal */}

            <SaveToPlaylistModal
                open={savePlaylistOpen}
                onClose={() => setSavePlaylistOpen(false)}
                video={video}
            />
        </>
    );
}

export default VideoActions;