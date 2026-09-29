import {
    Clock3,
    ListVideo,
    Share2,
    Trash2,
} from "lucide-react";

import { useEffect, useRef } from "react";

function HistoryMenu({ onClose, video }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, [onClose]);

    const handleAction = (label) => {
        console.log(label, video);

        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="
                absolute
                right-0
                top-11
                z-50
                w-64
                overflow-hidden
                rounded-2xl
                border
                border-zinc-800
                bg-[#181818]
                shadow-2xl
            "
        >
            <button
                onClick={() => handleAction("Watch later")}
                className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-sm
                    transition
                    hover:bg-zinc-800
                "
            >
                <Clock3 size={18} />

                Save to Watch Later
            </button>

            <button
                onClick={() => handleAction("Playlist")}
                className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-sm
                    transition
                    hover:bg-zinc-800
                "
            >
                <ListVideo size={18} />

                Save to Playlist
            </button>

            <button
                onClick={() => handleAction("Share")}
                className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-sm
                    transition
                    hover:bg-zinc-800
                "
            >
                <Share2 size={18} />

                Share
            </button>

            <div className="border-t border-zinc-800" />

            <button
                onClick={() => handleAction("Remove")}
                className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-red-400
                    transition
                    hover:bg-zinc-800
                "
            >
                <Trash2 size={18} />

                Remove from History
            </button>
        </div>
    );
}

export default HistoryMenu;