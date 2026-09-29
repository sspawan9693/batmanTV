// components/video/VideoCard.jsx

import { Link, useNavigate } from "react-router-dom";
import { formatViews } from "../../utils/formatViews";
import { timeAgo } from "../../utils/timeAgo";
import { formatDuration } from "../../utils/formatDuration";
import { useState } from "react";
import VideoMenu from "./VideoMenu";
import SaveToPlaylistModal from "../video/SaveToPlaylistModal";
import { motion } from "framer-motion";

function VideoCard({ video, variant = "grid" }) {
  const isCompact = variant === "compact";

  const [playlistModalOpen, setPlaylistModalOpen] =
    useState(false);

  const {
    _id,
    thumbnail,
    duration,
    title,
    views,
    createdAt,
  } = video;

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      whileHover={{
        y: -2,
      }}
      className={
        isCompact
          ? `
                group
                flex
                gap-3
                rounded-xl
                p-2
                transition-all
                duration-300
                hover:bg-zinc-900
            `
          : `
                group
                flex
                flex-col
                will-change-transform
                rounded-2xl
                p-2
                -m-2
                transition-all
                duration-300
                hover:bg-neutral-900/70
            `
      }
    >
      {/* Thumbnail */}

      <Link
        to={`/watch/${_id}`}
        className={
          isCompact
            ? `
                            relative
                            w-44
                            aspect-video
                            shrink-0
                            overflow-hidden
                            rounded-xl
                            bg-neutral-800
                        `
            : `
                            relative
                            aspect-video
                            overflow-hidden
                            rounded-xl
                            bg-neutral-800
                        `
        }
      >
        <img
          loading="lazy"
          src={thumbnail}
          alt={title}
          draggable={false}
          onError={(e) => {
            e.target.src =
              "https://placehold.co/1280x720/18181b/ffffff?text=No+Thumbnail";
          }}
          className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                        select-none
                    "
        />

        <span
          className="
                        absolute
                        bottom-1.5
                        right-1.5
                        rounded-md
                        bg-black/85
                        backdrop-blur-sm
                        px-1
                        py-0.5
                        text-xs
                        font-medium
                        text-white
                    "
        >
          {formatDuration(duration)}
        </span>
      </Link>

      {/* GRID */}

      {!isCompact && (
        <div className="mt-3 flex gap-3">

          {/* Avatar */}

          <img
            loading="lazy"
            src={video.owner?.avatar}
            alt={video.owner?.fullName}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/channel/${video.owner?.username}`)
            }}
            onError={(e) => {
              e.target.src =
                "https://ui-avatars.com/api/?name=User&background=27272a&color=fff";
            }}
            className="
                            h-10
                            w-10
                            shrink-0
                            cursor-pointer
                            rounded-full
                            object-cover
                            ring-2
                            ring-transparent
                            transition-all
                            duration-300
                            hover:scale-105
                            hover:ring-red-600
                        "
          />

          {/* Right */}

          <div className="flex flex-1 justify-between gap-3">

            <div className="min-w-0">

              <Link to={`/watch/${_id}`}>

                <h3
                  className="
                                        line-clamp-2
                                        text-[16px]
                                        font-semibold
                                        leading-5
                                        text-white
                                        hover:text-zinc-200
                                    "
                >
                  {title}
                </h3>

              </Link>

              <p
                onClick={() =>
                  navigate(`/channel/${video.owner?.username}`)
                }
                className="
                                    mt-1
                                    w-fit
                                    cursor-pointer
                                    text-sm
                                    text-zinc-400
                                    transition
                                    hover:text-white
                                "
              >
                {video.owner?.username}
              </p>

              <span className="text-sm text-zinc-500">
                {formatViews(views)} views •{" "}
                {timeAgo(createdAt)}
              </span>

            </div>

            <VideoMenu
              onShare={() => {
                console.log("Share");
              }}
              onSaveToPlaylist={() => {
                setPlaylistModalOpen(true);
              }}
            />

          </div>

        </div>
      )}

      {/* COMPACT */}

      {isCompact && (
        <div className="flex flex-1 justify-between gap-3">

          <div className="min-w-0 flex-1">

            <Link to={`/watch/${_id}`}>

              <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-white">
                {title}
              </h3>

            </Link>

            <p
              onClick={() =>
                navigate(`/channel/${video.owner?.username}`)
              }
              className="
                                mt-2
                                w-fit
                                cursor-pointer
                                text-sm
                                text-zinc-400
                                transition
                                hover:text-white
                            "
            >
              {video.owner?.username}
            </p>

            <p className="text-sm text-zinc-500">
              {formatViews(views)} views
            </p>

            <p className="text-sm text-zinc-500">
              {timeAgo(createdAt)}
            </p>

          </div>

          <VideoMenu
            onShare={() => {
              console.log("Share");
            }}
            onSaveToPlaylist={() => {
              setPlaylistModalOpen(true);
            }}
          />

        </div>
      )}

      <SaveToPlaylistModal
        open={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        video={video}
      />
    </motion.div>
  );
}

export default VideoCard;