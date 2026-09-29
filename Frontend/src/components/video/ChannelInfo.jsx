import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  toggleSubscription,
  getChannelSubscribers,
} from "../../api/subscription";

function ChannelInfo({ video }) {
  const user = useSelector((state) => state.auth.user);

  const [subscriberCount, setSubscriberCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const data = await getChannelSubscribers(video.owner._id);

        setSubscriberCount(data.length);

        if (user) {
          const alreadySubscribed = data.some(
            (sub) => sub._id === user._id
          );

          setSubscribed(alreadySubscribed);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (video) {
      fetchSubscribers();
    }
  }, [video, user]);

  if (!video) return null;

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please login to subscribe.");
      return;
    }

    try {
      const res = await toggleSubscription(video.owner._id);

      setSubscribed(res.isSubscribed);

      setSubscriberCount((prev) =>
        res.isSubscribed ? prev + 1 : Math.max(prev - 1, 0)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section
      className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-zinc-800
        bg-[#111111]
        p-5
        transition-all
        duration-300
        hover:border-zinc-700
      "
    >
      <div className="flex items-center gap-4">
        <Link to={`/channel/${video.owner.username}`}>
          <img
            src={video.owner.avatar}
            alt={video.owner.fullName}
            className="
              h-14
              w-14
              rounded-full
              object-cover
              ring-2
              ring-zinc-800
              transition
              hover:ring-red-500
            "
          />
        </Link>

        <div>
          <Link
            to={`/channel/${video.owner.username}`}
            className="block"
          >
            <h3 className="text-lg font-semibold text-white transition hover:text-red-500">
              {video.owner.fullName}
            </h3>

            <p className="text-sm text-zinc-400 transition hover:text-zinc-200">
              @{video.owner.username}
            </p>
          </Link>

          <p className="mt-1 text-xs text-zinc-500">
            {subscriberCount} subscribers
          </p>
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        className={`
          rounded-full
          px-6
          py-2.5
          text-sm
          font-semibold
          transition-all
          duration-200
          active:scale-95
          ${subscribed
            ? "bg-zinc-700 text-white hover:bg-zinc-600"
            : "bg-white text-black hover:bg-zinc-200"
          }
        `}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </section>
  );
}

export default ChannelInfo;