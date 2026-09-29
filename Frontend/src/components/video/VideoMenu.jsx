import { MoreVertical, Share2, ListPlus } from "lucide-react";
import DropdownMenu from "../common/DropdownMenu";

function VideoMenu({
    onShare,
    onSaveToPlaylist,
    direction = "down",
}) {
    return (
        <DropdownMenu
            direction={direction}
            trigger={
                <button
                    className="
                        rounded-full
                        p-2
                        text-zinc-400
                        transition
                        hover:bg-zinc-800
                        hover:text-white
                    "
                >
                    <MoreVertical size={20} />
                </button>
            }
            items={[
                {
                    label: "Share",
                    icon: Share2,
                    onClick: onShare,
                },
                {
                    label: "Save to Playlist",
                    icon: ListPlus,
                    onClick: () => {
                        onSaveToPlaylist?.();
                    },
                },
            ]}
        />
    );
}

export default VideoMenu;