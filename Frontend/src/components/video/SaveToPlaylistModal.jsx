import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { useSelector } from "react-redux";

import {
    getUserPlaylists,
    addVideosToPlaylist,
    removeVideosFromPlaylist,
} from "../../api/playlist";

function SaveToPlaylistModal({
    open,
    onClose,
    video,
}) {
    const user = useSelector((state) => state.auth.user);

    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {

        if (!open || !user?._id || !video?._id) return;

        const fetchPlaylists = async () => {

            try {

                setLoading(true);

                const data = await getUserPlaylists(user._id);

                const formatted = data.docs.map((playlist) => ({

                    ...playlist,

                    selected:
                        playlist.videos?.includes(video._id) || false,

                }));

                setPlaylists(formatted);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchPlaylists();

    }, [open, user, video]);

    if (!open) return null;

    const togglePlaylist = async (playlist) => {

        try {

            setSavingId(playlist._id);

            if (playlist.selected) {

                await removeVideosFromPlaylist(
                    playlist._id,
                    video._id
                );

            } else {

                await addVideosToPlaylist(
                    playlist._id,
                    video._id
                );

            }

            setPlaylists((prev) =>
                prev.map((item) =>
                    item._id === playlist._id
                        ? {
                            ...item,
                            selected: !item.selected,
                        }
                        : item
                )
            );

        } catch (error) {

            console.error(error);

        } finally {

            setSavingId(null);

        }

    };

    return (

        <div
            className="
                fixed
                inset-0
                z-999
                flex
                items-center
                justify-center
                bg-black/70
                backdrop-blur-sm
            "
        >

            <div
                className="
        w-full
        max-w-95
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-[#202020]
        shadow-2xl
    "
            >

                {/* Header */}

                <div
                    className="
flex
items-center
justify-between
border-b
border-zinc-800
px-5
py-3
"
                >

                    <h2 className="text-base font-semibold text-white">

                        Save to playlist

                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            rounded-full
                            p-2
                            transition
                            hover:bg-zinc-800
                        "
                    >

                        <X size={18} />

                    </button>

                </div>

                {/* Body */}

                <div
                    className="
                       scrollbar-thin
scrollbar-thumb-zinc-700
scrollbar-track-transparent
                    "
                >

                    {loading ? (

                        <div className="p-8 text-center text-zinc-400">

                            Loading playlists...

                        </div>

                    ) : playlists.length === 0 ? (

                        <div className="p-8 text-center">

                            <p className="text-white">

                                No playlists yet

                            </p>

                            <p className="mt-2 text-sm text-zinc-500">

                                Create your first playlist below.

                            </p>

                        </div>

                    ) : (

                        playlists.map((playlist, index) => (

                            <div key={playlist._id}>

                                <button
                                    disabled={savingId === playlist._id}
                                    onClick={() => togglePlaylist(playlist)}
                                    className="
                flex
                w-full
                items-center
                gap-3
                px-5
                py-2.5
                transition-colors
                hover:bg-zinc-800/70
                disabled:opacity-60
            "
                                >
                                    <div
                                        className={`
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded
                    border
                    ${playlist.selected
                                                ? "border-red-600 bg-red-600"
                                                : "border-zinc-500"
                                            }
                `}
                                    >
                                        {playlist.selected && (
                                            <Check
                                                size={12}
                                                strokeWidth={3}
                                                className="text-white"
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col items-start">
                                        <span className="truncate text-sm font-medium text-white">
                                            {playlist.name}
                                        </span>

                                        <span className="text-xs text-zinc-400">
                                            {playlist.totalVideos} videos
                                        </span>
                                    </div>
                                </button>

                                {/* Separator */}

                                {index !== playlists.length - 1 && (
                                    <div className="mx-5 border-b border-zinc-800" />
                                )}

                            </div>

                        ))

                    )}

                </div>

                {/* Footer */}

                <div
                    className="
border-t
border-zinc-800
p-3
"
                >

                    <button
                        onClick={() => {

                            // We'll connect this later

                        }}
                        className="
flex
w-full
items-center
justify-center
rounded-lg
py-2.5
text-sm
font-medium
text-blue-400
transition
hover:bg-zinc-800
hover:text-blue-300
"
                    >

                        + Create Playlist

                    </button>

                </div>

            </div>

        </div>

    );

}

export default SaveToPlaylistModal;