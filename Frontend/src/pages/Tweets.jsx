import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
    Heart,
    MessageCircle,
    Sparkles,
    Users,
    TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

import {
    getAllTweets,
    createTweet,
    updateTweet,
    deleteTweet,
} from "../api/tweet";

import TweetCard from "../components/tweet/TweetCard";
import TweetComposer from "../components/tweet/TweetComposer";
import TweetModal from "../components/tweet/TweetModal";
import ConfirmModal from "../components/common/ConfirmModal";

function Tweets() {
    const user = useSelector(
        (state) => state.auth.user
    );

    const [tweets, setTweets] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [posting, setPosting] =
        useState(false);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [editingTweet, setEditingTweet] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedTweet, setSelectedTweet] =
        useState(null);

    const fetchTweets = async () => {
        try {
            setLoading(true);

            const data =
                await getAllTweets(
                    1,
                    10
                );

            setTweets(
                data.docs || []
            );
        } catch (error) {
            console.error(
                "Failed to fetch tweets:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    /* ================= CREATE ================= */

    const handleCreateTweet = (
        newTweet
    ) => {
        setTweets((prev) => [
            newTweet,
            ...prev,
        ]);
    };

    /* ================= EDIT ================= */

    const handleEdit = (
        tweet
    ) => {
        setEditingTweet(tweet);
        setModalOpen(true);
    };

    const handleUpdateTweet = async (
        updatedContent
    ) => {
        if (!editingTweet)
            return;

        try {
            setPosting(true);

            const updatedTweet =
                await updateTweet(
                    editingTweet._id,
                    updatedContent
                );

            setTweets((prev) =>
                prev.map((tweet) =>
                    tweet._id ===
                        editingTweet._id
                        ? {
                            ...tweet,
                            content:
                                updatedTweet.content,
                            updatedAt:
                                updatedTweet.updatedAt,
                        }
                        : tweet
                )
            );

            setModalOpen(false);
            setEditingTweet(null);
        } catch (error) {
            console.error(
                "Failed to update tweet:",
                error
            );
        } finally {
            setPosting(false);
        }
    };

    /* ================= DELETE ================= */

    const handleDeleteClick = (
        tweet
    ) => {
        setSelectedTweet(tweet);
        setDeleteOpen(true);
    };

    const handleDeleteTweet =
        async () => {
            if (!selectedTweet)
                return;

            try {
                await deleteTweet(
                    selectedTweet._id
                );

                setTweets((prev) =>
                    prev.filter(
                        (tweet) =>
                            tweet._id !==
                            selectedTweet._id
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to delete tweet:",
                    error
                );
            } finally {
                setDeleteOpen(false);
                setSelectedTweet(null);
            }
        };

    return (
        <div className="min-h-screen w-full">

            {/* ================= HERO ================= */}

            <div className="mx-auto max-w-6xl">

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                    }}
                    className="
                        relative
                        mb-6
                        overflow-hidden
                        rounded-3xl
                        border
                        border-zinc-800
                        bg-linear-to-br
                        from-zinc-900
                        via-[#111111]
                        to-black
                        p-7
                        shadow-2xl
                    "
                >

                    {/* Background glow */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-20
                            -top-24
                            h-72
                            w-72
                            rounded-full
                            bg-red-600/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            left-1/3
                            h-64
                            w-64
                            rounded-full
                            bg-purple-600/5
                            blur-3xl
                        "
                    />

                    <div className="relative">

                        <div className="flex items-start justify-between gap-6">

                            <div>

                                <div
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        gap-2
                                        text-red-500
                                    "
                                >
                                    <Sparkles
                                        size={17}
                                        fill="currentColor"
                                    />

                                    <span
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-[0.2em]
                                        "
                                    >
                                        Community
                                    </span>
                                </div>

                                <h1
                                    className="
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        text-white
                                        sm:text-4xl
                                    "
                                >
                                    BatmanTV
                                    <span className="text-zinc-500">
                                        {" "}Community
                                    </span>
                                </h1>

                                <p
                                    className="
                                        mt-3
                                        max-w-xl
                                        text-sm
                                        leading-6
                                        text-zinc-400
                                    "
                                >
                                    Share your thoughts,
                                    talk about videos,
                                    and connect with
                                    the BatmanTV community.
                                </p>

                            </div>

                            <div
                                className="
                                    hidden
                                    h-14
                                    w-14
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-red-500/20
                                    bg-red-500/10
                                    sm:flex
                                "
                            >
                                <Heart
                                    size={25}
                                    className="text-red-500"
                                    fill="currentColor"
                                />
                            </div>

                        </div>

                        {/* Mini stats */}

                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-zinc-800
                                    bg-black/30
                                    px-4
                                    py-2
                                    text-xs
                                    text-zinc-400
                                "
                            >
                                <MessageCircle
                                    size={14}
                                />

                                {tweets.length}{" "}
                                posts
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-zinc-800
                                    bg-black/30
                                    px-4
                                    py-2
                                    text-xs
                                    text-zinc-400
                                "
                            >
                                <Users
                                    size={14}
                                />

                                Community feed
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-zinc-800
                                    bg-black/30
                                    px-4
                                    py-2
                                    text-xs
                                    text-zinc-400
                                "
                            >
                                <TrendingUp
                                    size={14}
                                />

                                Live updates
                            </div>

                        </div>

                    </div>

                </motion.section>

                {/* ================= CONTENT GRID ================= */}

                <div
                    className="
                        grid
                        gap-6
                        lg:grid-cols-[minmax(0,1fr)_280px]
                    "
                >

                    {/* ================= FEED ================= */}

                    <section
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-[#0f0f0f]
                            shadow-xl
                        "
                    >

                        {/* Feed header */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-zinc-800
                                px-6
                                py-4
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    Community Feed
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-zinc-600
                                    "
                                >
                                    Latest conversations
                                </p>

                            </div>

                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-zinc-900
                                "
                            >
                                <MessageCircle
                                    size={15}
                                    className="text-zinc-500"
                                />
                            </div>

                        </div>

                        {/* Composer */}

                        {user && (
                            <TweetComposer
                                onTweetCreated={
                                    handleCreateTweet
                                }
                            />
                        )}

                        {/* ================= FEED ================= */}

                        {loading ? (

                            <div className="divide-y divide-zinc-800/60">

                                {[1, 2, 3, 4].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="
                                                flex
                                                gap-4
                                                px-6
                                                py-6
                                            "
                                        >

                                            <div
                                                className="
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    animate-pulse
                                                    rounded-full
                                                    bg-zinc-800
                                                "
                                            />

                                            <div
                                                className="
                                                    flex
                                                    flex-1
                                                    flex-col
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        h-4
                                                        w-44
                                                        animate-pulse
                                                        rounded
                                                        bg-zinc-800
                                                    "
                                                />

                                                <div
                                                    className="
                                                        h-4
                                                        w-full
                                                        animate-pulse
                                                        rounded
                                                        bg-zinc-800
                                                    "
                                                />

                                                <div
                                                    className="
                                                        h-4
                                                        w-3/5
                                                        animate-pulse
                                                        rounded
                                                        bg-zinc-800
                                                    "
                                                />

                                                <div
                                                    className="
                                                        mt-2
                                                        h-7
                                                        w-48
                                                        animate-pulse
                                                        rounded-full
                                                        bg-zinc-800
                                                    "
                                                />

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                        ) : tweets.length === 0 ? (

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.98,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                className="
                                    flex
                                    min-h-105
                                    flex-col
                                    items-center
                                    justify-center
                                    px-6
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
                                        rounded-3xl
                                        border
                                        border-zinc-800
                                        bg-zinc-900
                                        shadow-xl
                                    "
                                >
                                    <MessageCircle
                                        size={30}
                                        className="text-zinc-600"
                                    />
                                </div>

                                <h2
                                    className="
                                        mt-6
                                        text-xl
                                        font-semibold
                                        text-white
                                    "
                                >
                                    The conversation
                                    starts here.
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        max-w-sm
                                        text-sm
                                        leading-6
                                        text-zinc-500
                                    "
                                >
                                    No posts yet.
                                    Share something
                                    with the BatmanTV
                                    community and
                                    start the
                                    conversation.
                                </p>

                            </motion.div>

                        ) : (

                            <div>
                                {tweets.map(
                                    (
                                        tweet,
                                        index
                                    ) => (
                                        <TweetCard
                                            key={
                                                tweet._id
                                            }
                                            tweet={
                                                tweet
                                            }
                                            index={
                                                index
                                            }
                                            onEdit={
                                                handleEdit
                                            }
                                            onDelete={
                                                handleDeleteClick
                                            }
                                        />
                                    )
                                )}
                            </div>

                        )}

                    </section>

                    {/* ================= RIGHT SIDEBAR ================= */}

                    <aside
                        className="
                            hidden
                            space-y-4
                            lg:block
                        "
                    >

                        {/* Community card */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.4,
                                delay: 0.1,
                            }}
                            className="
                                rounded-2xl
                                border
                                border-zinc-800
                                bg-[#0f0f0f]
                                p-5
                            "
                        >

                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-red-500/10
                                    "
                                >
                                    <Users
                                        size={15}
                                        className="text-red-500"
                                    />
                                </div>

                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    Community
                                </h3>

                            </div>

                            <p
                                className="
                                    text-sm
                                    leading-6
                                    text-zinc-500
                                "
                            >
                                A place for BatmanTV
                                viewers to share
                                thoughts and discuss
                                their favorite
                                content.
                            </p>

                        </motion.div>

                        {/* Stats */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.4,
                                delay: 0.18,
                            }}
                            className="
                                rounded-2xl
                                border
                                border-zinc-800
                                bg-[#0f0f0f]
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-zinc-600
                                "
                            >
                                Feed stats
                            </p>

                            <div
                                className="
                                    mt-4
                                    space-y-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <span className="text-sm text-zinc-500">
                                        Posts
                                    </span>

                                    <span className="font-semibold text-white">
                                        {tweets.length}
                                    </span>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <span className="text-sm text-zinc-500">
                                        Status
                                    </span>

                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-xs
                                            text-emerald-400
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-emerald-400
                                            "
                                        />
                                        Active
                                    </span>
                                </div>

                            </div>

                        </motion.div>

                        {/* Tip */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.4,
                                delay: 0.26,
                            }}
                            className="
                                rounded-2xl
                                border
                                border-zinc-800
                                bg-linear-to-br
                                from-red-500/5
                                to-transparent
                                p-5
                            "
                        >

                            <Sparkles
                                size={17}
                                className="text-red-500"
                            />

                            <h3
                                className="
                                    mt-3
                                    text-sm
                                    font-semibold
                                    text-white
                                "
                            >
                                Keep it interesting
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    leading-5
                                    text-zinc-600
                                "
                            >
                                Share opinions,
                                discoveries, and
                                things worth talking
                                about.
                            </p>

                        </motion.div>

                    </aside>

                </div>

            </div>

            {/* ================= EDIT MODAL ================= */}

            <TweetModal
                open={modalOpen}
                mode="edit"
                initialContent={
                    editingTweet?.content ||
                    ""
                }
                loading={posting}
                onClose={() => {
                    if (posting) return;

                    setModalOpen(false);
                    setEditingTweet(null);
                }}
                onSubmit={
                    handleUpdateTweet
                }
            />

            {/* ================= DELETE MODAL ================= */}

            <ConfirmModal
                open={deleteOpen}
                title="Delete Tweet"
                description={
                    `Delete "${selectedTweet?.content}"? This action cannot be undone.`
                }
                onCancel={() => {
                    setDeleteOpen(false);
                    setSelectedTweet(null);
                }}
                onConfirm={
                    handleDeleteTweet
                }
            />

        </div>
    );
}

export default Tweets;