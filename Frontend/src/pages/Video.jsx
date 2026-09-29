import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getVideoById } from "../api/video";
import { useLocation } from "react-router-dom";

import VideoPlayer from "../components/video/VideoPlayer";
import VideoInfo from "../components/video/VideoInfo";
import ChannelInfo from "../components/video/ChannelInfo";
import VideoActions from "../components/video/VideoActions";
import Description from "../components/video/Description";
import CommentSection from "../components/comments/CommentSection";
import RecommendedVideos from "../components/video/RecommendedVideos";
import WatchHeaderSkeleton from "../components/video/WatchHeaderSkeleton";
import RecommendedVideoSkeleton from "../components/video/RecommendedVideoSkeleton";
import CommentSkeleton from "../components/comments/CommentSkeleton";
import ErrorState from "../components/common/ErrorState";

function Video() {
  const { videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await getVideoById(videoId);
        setVideo(data);
      } catch (err) {
        console.log("Video API Error:", err);
        console.log("Response:", err.response);
        console.log("Response Data:", err.response?.data);

        setError("Failed to load video.");
      }
      finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);


  useEffect(() => {
    if (location.state?.uploaded) {
      alert("Video uploaded successfully!");
    }
  }, []);

  if (loading) {
    return (
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left */}
        <div className="space-y-6">
          <WatchHeaderSkeleton />

          <div className="space-y-6">
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        </div>

        {/* Right */}
        <aside className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <RecommendedVideoSkeleton key={index} />
          ))}
        </aside>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Video unavailable"
        description="The video may have been removed or is temporarily unavailable."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      {/* Left */}
      <div className="space-y-6">
        <VideoPlayer video={video} />

        <VideoInfo video={video} />

        <VideoActions video={video} />

        <ChannelInfo video={video} />

        <Description video={video} />

        <CommentSection videoId={videoId} />
      </div>

      {/* Right */}
      <aside>
        <RecommendedVideos currentVideoId={videoId} />
      </aside>
    </div>
  );
}

export default Video;