import { Plyr } from "plyr-react";

function VideoPlayer({ video }) {
  if (!video) return null;

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-black
        shadow-xl
        transition-all
        duration-300
        hover:border-zinc-700
      "
    >
      <Plyr
        source={{
          type: "video",
          title: video.title,
          poster: video.thumbnail,
          sources: [
            {
              src: video.videoFile,
              type: "video/mp4",
            },
          ],
        }}
        options={{
          autoplay: false,

          clickToPlay: true,

          ratio: "16:9",

          keyboard: {
            focused: true,
            global: true,
          },

          settings: ["speed"],

          speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 2],
          },

          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "pip",
            "fullscreen",
          ],
        }}

        crossorigin="anonymous"

        playsInline

        disablePictureInPicture={false}
      />
    </div>
  );
}

export default VideoPlayer;