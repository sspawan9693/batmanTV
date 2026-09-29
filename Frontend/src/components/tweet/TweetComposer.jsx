import { useState } from "react";
import { useSelector } from "react-redux";
import {
    Send,
    Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import { createTweet } from "../../api/tweet";

function TweetComposer({
    onTweetCreated,
}) {
    const user = useSelector(
        (state) => state.auth.user
    );

    const [content, setContent] =
        useState("");

    const [posting, setPosting] =
        useState(false);

    const MAX_LENGTH = 280;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedContent =
            content.trim();

        if (
            !trimmedContent ||
            posting
        ) {
            return;
        }

        try {
            setPosting(true);

            const newTweet =
                await createTweet(
                    trimmedContent
                );

            setContent("");

            onTweetCreated?.(
                newTweet
            );
        } catch (error) {
            console.error(
                "Failed to create tweet:",
                error
            );
        } finally {
            setPosting(false);
        }
    };

    return (
        <motion.form
            initial={{
                opacity: 0,
                y: -8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
            }}
            onSubmit={handleSubmit}
            className="
                relative
                overflow-hidden
                border-b
                border-zinc-800/70
                bg-linear-to-br
                from-zinc-900/70
                via-[#111111]
                to-[#0d0d0d]
                px-6
                py-6
            "
        >

            {/* Decorative glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-20
                    h-48
                    w-48
                    rounded-full
                    bg-red-600/10
                    blur-3xl
                "
            />

            <div className="relative flex gap-4">

                {/* Avatar */}

                <img
                    src={
                        user?.avatar ||
                        "https://ui-avatars.com/api/?name=User&background=27272a&color=fff"
                    }
                    alt={
                        user?.fullName ||
                        "User"
                    }
                    className="
                        h-11
                        w-11
                        shrink-0
                        rounded-full
                        object-cover
                        ring-2
                        ring-zinc-800
                    "
                />

                <div className="min-w-0 flex-1">

                    {/* Label */}

                    <div className="mb-3 flex items-center gap-2">

                        <Sparkles
                            size={15}
                            className="text-red-500"
                        />

                        <span
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-widest
                                text-zinc-500
                            "
                        >
                            Share something
                        </span>

                    </div>

                    {/* Input */}

                    <textarea
                        value={content}
                        onChange={(e) => {
                            if (
                                e.target.value
                                    .length <=
                                MAX_LENGTH
                            ) {
                                setContent(
                                    e.target.value
                                );
                            }
                        }}
                        placeholder="What's on your mind?"
                        rows={3}
                        className="
                            w-full
                            resize-none
                            bg-transparent
                            text-[16px]
                            leading-7
                            text-zinc-100
                            outline-none
                            placeholder:text-zinc-600
                        "
                    />

                    {/* Footer */}

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            justify-between
                            border-t
                            border-zinc-800/70
                            pt-4
                        "
                    >

                        <span
                            className={`
                                text-xs
                                ${content.length >
                                    250
                                    ? "text-red-400"
                                    : "text-zinc-600"
                                }
                            `}
                        >
                            {content.length}/
                            {MAX_LENGTH}
                        </span>

                        <motion.button
                            whileHover={{
                                scale:
                                    content.trim()
                                        ? 1.03
                                        : 1,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            type="submit"
                            disabled={
                                !content.trim() ||
                                posting
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-black
                                shadow-lg
                                shadow-black/20
                                transition-all
                                duration-200
                                hover:bg-zinc-200
                                disabled:cursor-not-allowed
                                disabled:opacity-35
                            "
                        >
                            <Send size={15} />

                            {posting
                                ? "Posting..."
                                : "Post"}
                        </motion.button>

                    </div>

                </div>

            </div>
        </motion.form>
    );
}

export default TweetComposer;