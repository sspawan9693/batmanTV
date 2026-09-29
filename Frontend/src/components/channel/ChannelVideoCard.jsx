import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { timeAgo } from "../../utils/timeAgo";

function ChannelVideoCard({ video }) {
    return (
        <Link
            to={`/watch/${video._id}`}
            className="group"
        >
            {/* Thumbnail */}

            <div className="overflow-hidden rounded-lg">

                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="
                        aspect-video
                        w-full
                        object-cover
                        transition
                        duration-300
                        group-hover:scale-105
                    "
                />

            </div>

            {/* Info */}

            <div className="mt-3 text-[15px] font-semibold line-clamp-2">

                <h3
                    className="
                        line-clamp-2
                        font-semibold
                        text-white
                    "
                >
                    {video.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">

                    <Eye size={15} />

                    <span>
                        {video.views} views
                    </span>

                    <span>•</span>

                    <span>
                        {timeAgo(video.createdAt)}
                    </span>

                </div>

            </div>

        </Link>
    );
}

export default ChannelVideoCard;