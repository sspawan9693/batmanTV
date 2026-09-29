import { useEffect, useState } from "react";

import { getWatchHistory } from "../api/history";
import { groupHistory } from "../utils/groupHistory";

import HistoryVideoCard from "../components/history/HistoryVideoCard";

function History() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getWatchHistory();
                setVideos(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!videos.length) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold">
                    No watch history
                </h2>

                <p className="mt-2 text-zinc-500">
                    Videos you watch will appear here.
                </p>
            </div>
        );
    }

    const groupedVideos = groupHistory(videos);

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">

            {/* Header */}

            <div className="mb-10">

                <h1 className="text-3xl font-bold">
                    Watch History
                </h1>

                <p className="mt-2 text-zinc-400">
                    Videos you've watched recently.
                </p>

            </div>

            {/* Timeline */}

            <div className="space-y-12">

                {groupedVideos.map(([section, videos]) => (

                    <section key={section}>

                        <h2
                            className="
                                mb-6
                                border-b
                                border-zinc-800
                                pb-3
                                text-xl
                                font-semibold
                            "
                        >
                            {section}
                        </h2>

                        <div className="space-y-3">

                            {videos.map((video) => (

                                <HistoryVideoCard
                                    key={video._id}
                                    video={video}
                                />

                            ))}

                        </div>

                    </section>

                ))}

            </div>

        </div>
    );
}

export default History;