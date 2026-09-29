import { ListVideo } from "lucide-react";
import PlaylistCard from "./PlaylistCard";

function PlaylistGrid({
    playlists = [],
    loading,
    onCreate,
    onDelete,
    onEdit,
}) {

    if (loading) {
        return (
            <div
                className="
                    grid
                    gap-6
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                "
            >
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="
                            animate-pulse
                            overflow-hidden
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-[#111111]
                        "
                    >
                        <div className="aspect-video bg-zinc-800" />

                        <div className="space-y-3 p-5">
                            <div className="h-5 w-2/3 rounded bg-zinc-800" />
                            <div className="h-4 w-full rounded bg-zinc-800" />
                            <div className="h-4 w-1/2 rounded bg-zinc-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!playlists.length) {
        return (
            <div
                className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-dashed
                    border-zinc-700
                    py-24
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
                    <ListVideo
                        size={38}
                        className="text-zinc-500"
                    />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-white">
                    No playlists yet
                </h2>

                <p className="mt-3 max-w-md text-zinc-400">
                    Create playlists to organize your favorite videos
                    and watch them anytime.
                </p>

                <button
                    onClick={onCreate}
                    className="
                        mt-8
                        rounded-full
                        bg-red-600
                        px-6
                        py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-red-700
                        active:scale-95
                    "
                >
                    Create Playlist
                </button>
            </div>
        );
    }

    return (
        <div
            className="
                grid
                gap-6
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            "
        >
            {playlists.map((playlist) => (
                <PlaylistCard
                    key={playlist._id}
                    playlist={playlist}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}

export default PlaylistGrid;