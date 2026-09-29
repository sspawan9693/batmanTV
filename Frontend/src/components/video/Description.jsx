import { useState } from "react";
import { formatViews } from "../../utils/formatViews";
import { timeAgo } from "../../utils/timeAgo";

function Description({ video }) {
  const [expanded, setExpanded] = useState(false);

  if (!video) return null;

  return (
    <section
      className="
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
      <h3 className="mb-3 text-base font-semibold text-white">
        Description
      </h3>

      {/* Description */}
      <p
        className={`
          whitespace-pre-line
          text-[15px]
          leading-7
          text-zinc-300
          transition-all
          duration-300
          ${expanded
            ? ""
            : "line-clamp-3"
          }
        `}
      >
        {video.description}
      </p>

      {/* Toggle */}
      {video.description?.length > 180 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="
            mt-4
            text-sm
            font-semibold
            text-white
            transition
            hover:text-zinc-300
          "
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </section>
  );
}

export default Description;