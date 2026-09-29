import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getChannel } from "../api/channel";
import { useSelector } from "react-redux";
import ChannelHeader from "../components/channel/ChannelHeader";
import ChannelVideos from "../components/channel/ChannelVideos";

function Channel() {
  const { username } = useParams();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const data = await getChannel(username);

        setChannel(data);
      } catch (err) {
        setError("Failed to load channel.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [username]);


  const user = useSelector((state) => state.auth.user);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const isOwner =
    user?.username === channel.username;


  return (
    <div>
      <div className="space-y-8">

        <ChannelHeader
          channel={channel}
          isOwner={isOwner}
        />

        <ChannelVideos
          videos={channel.videos}
        />

      </div>
    </div>
  );
}

export default Channel;