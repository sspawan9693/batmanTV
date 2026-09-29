import ChannelVideoCard from "./ChannelVideoCard";

function ChannelVideos({ videos }) {

    if (!videos.length) {
        return (
            <div
                className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#111111]
                    py-24
                    text-center
                "
            >
                <h2 className="text-2xl font-semibold">
                    No videos yet
                </h2>

                <p className="mt-3 text-zinc-400">
                    This channel hasn't uploaded anything.
                </p>
            </div>
        );
    }

    return (
        <section>

            <h2 className="mb-6 text-2xl font-bold">
                Videos
            </h2>

            <div
                className="
                    grid
                    gap-6
                    sm:grid-cols-2
                    lg:grid-cols-3
                "
            >
                {videos.map((video) => (
                    <ChannelVideoCard
                        key={video._id}
                        video={video}
                    />
                ))}
            </div>

        </section>
    );
}

export default ChannelVideos;