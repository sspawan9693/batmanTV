import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function TweetModal({
    open,
    mode = "create",
    initialContent = "",
    loading = false,
    onClose,
    onSubmit,
}) {
    const [content, setContent] = useState("");

    useEffect(() => {
        if (open) {
            setContent(initialContent || "");
        }
    }, [open, initialContent]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        await onSubmit(content.trim());
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="
                        fixed
                        inset-0
                        z-9999
                        flex
                        items-center
                        justify-center
                        bg-black/70
                        px-4
                        backdrop-blur-md
                    "
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                >
                    <motion.div
                        className="
                            w-full
                            max-w-lg
                            overflow-hidden
                            rounded-2xl
                            border
                            border-zinc-700/70
                            bg-[#181818]
                            shadow-[0_20px_70px_rgba(0,0,0,0.55)]
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        initial={{
                            opacity: 0,
                            scale: 0.97,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.97,
                            y: 12,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                        }}
                    >
                        {/* Header */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-zinc-800/70
                                px-5
                                py-4
                            "
                        >
                            <h2
                                className="
                                    text-[16px]
                                    font-semibold
                                    text-white
                                "
                            >
                                {mode === "edit"
                                    ? "Edit Tweet"
                                    : "Create Tweet"}
                            </h2>

                            <button
                                type="button"
                                onClick={onClose}
                                className="
                                    rounded-full
                                    p-2
                                    text-zinc-500
                                    transition-all
                                    duration-200
                                    hover:bg-zinc-800
                                    hover:text-white
                                "
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}

                        <form onSubmit={handleSubmit}>
                            <div className="p-5">

                                <textarea
                                    value={content}
                                    onChange={(e) =>
                                        setContent(
                                            e.target.value
                                        )
                                    }
                                    autoFocus
                                    maxLength={500}
                                    rows={5}
                                    placeholder="What's happening?"
                                    className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border
                                        border-zinc-800
                                        bg-[#111111]
                                        p-4
                                        text-[15px]
                                        leading-6
                                        text-zinc-100
                                        outline-none
                                        placeholder:text-zinc-600
                                        transition
                                        focus:border-zinc-600
                                        focus:ring-1
                                        focus:ring-zinc-700
                                    "
                                />

                                <div
                                    className="
                                        mt-2
                                        text-right
                                        text-xs
                                        text-zinc-600
                                    "
                                >
                                    {content.length}/500
                                </div>

                            </div>

                            {/* Footer */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-2
                                    border-t
                                    border-zinc-800/70
                                    px-5
                                    py-4
                                "
                            >
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="
                                        rounded-full
                                        px-5
                                        py-2
                                        text-sm
                                        font-medium
                                        text-zinc-400
                                        transition-all
                                        duration-200
                                        hover:bg-zinc-800
                                        hover:text-white
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        !content.trim()
                                    }
                                    className="
                                        rounded-full
                                        bg-white
                                        px-5
                                        py-2
                                        text-sm
                                        font-semibold
                                        text-black
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        hover:bg-zinc-200
                                        active:scale-95
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    {loading
                                        ? "Saving..."
                                        : mode === "edit"
                                            ? "Save changes"
                                            : "Tweet"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default TweetModal;