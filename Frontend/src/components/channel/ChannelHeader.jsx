import { Link } from "react-router-dom";
import { useState } from "react";
import { toggleSubscription } from "../../api/subscription";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

function ChannelHeader({ channel, isOwner }) {


    const [subscribed, setSubscribed] = useState(
        channel.isSubscribed
    );

    const [subscriberCount, setSubscriberCount] = useState(
        channel.subscribersCount
    );

    const [loading, setLoading] = useState(false);

    const handleSubscription = async () => {
        try {
            setLoading(true);

            const data = await toggleSubscription(channel._id);

            if (data.isSubscribed) {
                setSubscribed(true);
                setSubscriberCount((prev) => prev + 1);
            } else {
                setSubscribed(false);
                setSubscriberCount((prev) => prev - 1);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSubscribed(channel.isSubscribed);
        setSubscriberCount(channel.subscribersCount);
    }, [channel]);
    return (
        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">

            {/* Cover */}

            <div className="h-48 w-full bg-zinc-900">
                <img
                    src={channel.coverImage}
                    alt={channel.fullName}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Profile */}

            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center">

                {/* Avatar */}

                <img
                    src={channel.avatar}
                    alt={channel.fullName}
                    className="
                        h-28
                        w-28
                        rounded-full
                        border-4
                        border-[#111111]
                        object-cover
                        shadow-xl
                    "
                />

                {/* Details */}

                <div className="flex-1">

                    <h1 className="text-3xl font-bold">
                        {channel.fullName}
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        @{channel.username}
                    </p>

                    <p className="mt-3 text-sm text-zinc-500">
                        {subscriberCount} subscribers • {channel.videosCount} videos
                    </p>

                </div>

                {/* Action */}

                {isOwner ? (
                    <div className="flex gap-3">

                        <Link
                            to="/dashboard"
                            className="
                                rounded-full
                                border
                                border-zinc-700
                                px-6
                                py-3
                                transition
                                hover:bg-zinc-800
                            "
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/upload"
                            className="
                                rounded-full
                                bg-red-600
                                px-6
                                py-3
                                font-semibold
                                transition
                                hover:bg-red-700
                            "
                        >
                            Upload Video
                        </Link>

                    </div>
                ) : (
                    <button
                        onClick={handleSubscription}
                        disabled={loading}
                        className={`
                            flex items-center justify-center gap-2
                            rounded-full
                            px-5
                            py-2.5
                            font-semibold
                            transition
                            disabled:cursor-not-allowed
                            ${subscribed
                                ? "bg-zinc-800 text-white hover:bg-zinc-700"
                                : "bg-white text-black hover:bg-zinc-200"
                            }
                        `}
                    >
                        {loading && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}

                        {subscribed ? "Subscribed" : "Subscribe"}
                    </button>
                )}

            </div>

        </section>
    );
}

export default ChannelHeader;