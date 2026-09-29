// pages/Home.jsx

import { useEffect, useState } from "react";
import VideoGrid from "../components/video/VideoGrid";
import api from "../api/axios";
import SkeletonGrid from "../components/video/SkeletonGrid";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/videos");

        console.log(response.data.data.docs);
        setVideos(response.data.data.docs);

      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      {loading ? (
        <SkeletonGrid />
      ) : videos.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-5 text-6xl">🎬</div>

          <h2 className="text-2xl font-semibold text-white">
            No videos found
          </h2>

          <p className="mt-2 max-w-md text-zinc-400">
            There aren't any videos available right now.
            Check back later or upload your first video.
          </p>
        </div>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}

export default Home;