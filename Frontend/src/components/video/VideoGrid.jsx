// components/video/VideoGrid.jsx

import VideoCard from "./VideoCard";

function VideoGrid({ videos = [] }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
        gap-x-6
        gap-y-10
        w-full
    "
    >
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

export default VideoGrid;