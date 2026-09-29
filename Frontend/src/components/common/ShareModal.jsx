import { Copy, X } from "lucide-react";
import { useState } from "react";

function ShareModal({ open, onClose, url }) {
    const [copied, setCopied] = useState(false);

    if (!open) return null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-100
                flex
                items-center
                justify-center
                bg-black/70
                backdrop-blur-sm
                animate-in
                fade-in
                duration-200
            "
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                 className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#181818]
                    p-6
                    animate-in
                    zoom-in-95
                    duration-200
                "
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        Share Video
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-zinc-800"
                    >
                        <X size={18} />
                    </button>
                </div>

                <input
                    readOnly
                    value={url}
                    className="
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-900
            p-3
            text-sm
            text-zinc-300
          "
                />

                <button
                    onClick={handleCopy}
                    className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-white
            py-3
            font-semibold
            text-black
            hover:bg-zinc-200
          "
                >
                    <Copy size={18} />

                    {copied ? "Copied!" : "Copy Link"}
                </button>
            </div>
        </div>
    );
}

export default ShareModal;