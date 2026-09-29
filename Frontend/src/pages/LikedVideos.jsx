import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { getLikedVideos } from "../api/like";
import HistoryVideoCard from "../components/history/HistoryVideoCard";

function LikedVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                setLoading(true);

                const data = await getLikedVideos(1, 10);

                setVideos(data.docs || []);
            } catch (error) {
                console.error(
                    "Failed to fetch liked videos:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLikedVideos();
    }, []);

    if (loading) {
        return (
            <div className="w-full px-4 py-5 sm:px-5 lg:px-6">

                {/* Header Skeleton */}

                <div className="border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                h-10
                                w-10
                                animate-pulse
                                rounded-full
                                bg-zinc-800
                            "
                        />

                        <div className="space-y-2">
                            <div
                                className="
                                    h-6
                                    w-36
                                    animate-pulse
                                    rounded
                                    bg-zinc-800
                                "
                            />

                            <div
                                className="
                                    h-4
                                    w-44
                                    animate-pulse
                                    rounded
                                    bg-zinc-800
                                "
                            />
                        </div>

                    </div>
                </div>

                {/* Video Skeletons */}

                <div className="mt-4 space-y-2">

                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="
                                flex
                                gap-3
                                rounded-xl
                                p-1.5
                            "
                        >
                            <div
                                className="
                                    aspect-video
                                    w-60
                                    shrink-0
                                    animate-pulse
                                    rounded-xl
                                    bg-zinc-800
                                "
                            />

                            <div
                                className="
                                    flex
                                    min-w-0
                                    flex-1
                                    flex-col
                                    gap-3
                                    py-1
                                "
                            >
                                <div
                                    className="
                                        h-5
                                        w-3/4
                                        animate-pulse
                                        rounded
                                        bg-zinc-800
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-32
                                        animate-pulse
                                        rounded
                                        bg-zinc-800
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-48
                                        animate-pulse
                                        rounded
                                        bg-zinc-800
                                    "
                                />
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        );
    }

    return (
        <div className="w-full px-4 py-5 sm:px-5 lg:px-6">

            {/* Header */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-zinc-800
                    pb-4
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500/10
                    "
                >
                    <Heart
                        size={22}
                        className="text-red-500"
                        fill="currentColor"
                    />
                </div>

                <div>

                    <h1
                        className="
                            text-2xl
                            font-bold
                            leading-tight
                            text-white
                        "
                    >
                        Liked Videos
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        Videos you've liked
                    </p>

                </div>

            </div>

            {/* Content */}

            {videos.length === 0 ? (

                /* Empty State */

                <div
                    className="
                        flex
                        min-h-[50vh]
                        flex-col
                        items-center
                        justify-center
                        text-center
                    "
                >

                    <div
                        className="
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-full
                            bg-zinc-900
                        "
                    >
                        <Heart
                            size={36}
                            className="text-zinc-600"
                        />
                    </div>

                    <h2
                        className="
                            mt-5
                            text-xl
                            font-semibold
                            text-white
                        "
                    >
                        No liked videos yet
                    </h2>

                    <p
                        className="
                            mt-2
                            max-w-md
                            text-sm
                            text-zinc-500
                        "
                    >
                        Videos you like will appear here.
                    </p>

                </div>

            ) : (

                /* Videos */

                <div
                    className="
                        mt-4
                        w-full
                        space-y-2
                    "
                >
                    {videos.map((video) => (
                        <HistoryVideoCard
                            key={video._id}
                            video={video}
                            showMenu={false}
                        />
                    ))}
                </div>

            )}

        </div>
    );
}

export default LikedVideos;