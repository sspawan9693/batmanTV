import { useEffect, useState } from "react";
import { getAllVideos } from "../../api/video";
import VideoCard from "./VideoCard";

function RecommendedVideos({ currentVideoId }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getAllVideos();

        const filtered = data.filter(
          (video) => video._id !== currentVideoId
        );

        setVideos(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideos();
  }, [currentVideoId]);

  return (

    <div className="space-y-2">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Recommended
      </h2>
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          variant="compact"
        />
      ))}
    </div>
  );
}

export default RecommendedVideos;