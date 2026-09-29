import { useEffect, useState } from "react";

import { getVideoComments } from "../../api/comment";

import CommentInput from "./CommentInput";
import CommentCard from "./CommentCard";
import CommentSkeleton from "./CommentSkeleton";
import EmptyComments from "./EmptyComments";

function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const data = await getVideoComments(videoId);

      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <section className="mt-8">
      <h2 className="mb-6 text-xl font-semibold text-white">
        {comments.length} Comments
      </h2>

      <CommentInput
        videoId={videoId}
        onCommentPosted={fetchComments}
      />

      <div className="mt-8 space-y-6">
        {loading ? (
          <CommentSkeleton />
        ) : comments.length === 0 ? (
          <EmptyComments />
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onCommentUpdated={fetchComments}
              onCommentDeleted={fetchComments}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default CommentSection;