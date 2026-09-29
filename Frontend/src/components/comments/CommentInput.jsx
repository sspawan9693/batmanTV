import { useState } from "react";
import { addComment } from "../../api/comment";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ShieldQuestion } from "lucide-react";

function CommentInput({ videoId, onCommentPosted }) {
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const textareaRef = useRef(null);

  if (!user) {
    return (
      <div className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800">
          <ShieldQuestion size={22} className="text-zinc-300" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-white">
            Join the conversation
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            Sign in to like videos, leave comments and interact with the BatmanTV community.
          </p>

          <Link
            to="/login"
            className="
            mt-4
            inline-flex
            rounded-full
            bg-white
            px-5
            py-2
            text-sm
            font-semibold
            text-black
            transition
            hover:bg-zinc-200
          "
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      setPosting(true);

      await addComment(videoId, comment);

      setComment("");

      textareaRef.current.style.height = "auto";

      onCommentPosted();

      textareaRef.current.focus();
    } catch (err) {
      console.error(err)
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <img
        src={user?.avatar}
        alt={user?.fullName}
        onError={(e) => {
          e.target.src =
            "https://ui-avatars.com/api/?name=User&background=27272a&color=fff";
        }}
        className="h-11 w-11 rounded-full object-cover shrink-0"
      />

      <div className="flex-1">
        <textarea
          ref={textareaRef}
          rows={1}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);

            textareaRef.current.style.height = "0px";
            textareaRef.current.style.height =
              textareaRef.current.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              if (!posting && comment.trim()) {
                handleSubmit();
              }
            }
          }}
          placeholder="Add a comment..."
          className="
                w-full
                resize-none
                border-b
                border-zinc-700
                bg-transparent
                pb-2
                text-white
                placeholder:text-zinc-500
                outline-none
                transition-colors
                focus:border-white
              "
        />


        {comment.trim() && (
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => {
                setComment("");

                textareaRef.current.style.height = "auto";
              }}
              className="
              rounded-full
              px-5
              py-2
              text-sm
              font-medium
              text-zinc-300
              transition
              hover:bg-zinc-800
            "
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!comment.trim() || posting}
              className="
              rounded-full
              bg-white
              px-5
              py-2
              text-sm
              font-semibold
              text-black
              transition
              enabled:hover:bg-zinc-200
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            >
              {posting ? "Posting..." : "Comment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentInput;