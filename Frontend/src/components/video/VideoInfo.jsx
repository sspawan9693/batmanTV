import { formatViews } from "../../utils/formatViews";
import { timeAgo } from "../../utils/timeAgo";

function VideoInfo({ video }) {
  if (!video) return null;

  return (
    <section className="space-y-3">
      {/* Title */}
      <h1
        className="
          text-2xl
          font-semibold
          leading-snug
          text-white
        "
      >
        {video.title}
      </h1>

      {/* Stats */}
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
          text-sm
          text-zinc-400
        "
      >
        <span>{formatViews(video.views)} views</span>

        <span>•</span>

        <span>{timeAgo(video.createdAt)}</span>
      </div>
    </section>
  );
}

export default VideoInfo;