import { AlertTriangle, X } from "lucide-react";

function DeleteVideoModal({
    open,
    video,
    loading = false,
    onClose,
    onConfirm,
}) {
    if (!open || !video) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-9999
                flex
                items-center
                justify-center
                bg-black/70
                px-4
                backdrop-blur-sm
            "
            onClick={loading ? undefined : onClose}
        >
            <div
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#181818]
                    shadow-2xl
                "
                onClick={(e) =>
                    e.stopPropagation()
                }
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
                        py-4
                    "
                >
                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-white
                        "
                    >
                        Delete Video
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            rounded-full
                            p-2
                            text-zinc-400
                            transition
                            hover:bg-zinc-800
                            hover:text-white
                            disabled:opacity-50
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}

                <div className="p-5">
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500/10
                            text-red-500
                        "
                    >
                        <AlertTriangle
                            size={23}
                        />
                    </div>

                    <h3
                        className="
                            mt-4
                            text-base
                            font-semibold
                            text-white
                        "
                    >
                        Are you sure?
                    </h3>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-zinc-400
                        "
                    >
                        You're about to permanently
                        delete{" "}
                        <span className="font-medium text-zinc-200">
                            "{video.title}"
                        </span>
                        . This will remove the video
                        and its thumbnail permanently.
                    </p>

                    <p
                        className="
                            mt-3
                            text-xs
                            text-red-400
                        "
                    >
                        This action cannot be undone.
                    </p>
                </div>

                {/* Footer */}

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-zinc-800
                        px-5
                        py-4
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            rounded-full
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-zinc-300
                            transition
                            hover:bg-zinc-800
                            hover:text-white
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            rounded-full
                            bg-red-500
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-red-600
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete video"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteVideoModal;