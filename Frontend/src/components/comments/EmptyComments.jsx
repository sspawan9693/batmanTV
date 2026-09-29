import { MessageCircle } from "lucide-react";

function EmptyComments() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-zinc-800
        py-16
        text-center
      "
    >
      <MessageCircle
        size={46}
        className="mb-4 text-zinc-600"
      />

      <h3 className="text-lg font-semibold text-white">
        No comments yet
      </h3>

      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        Be the first person to share your thoughts about this video.
      </p>
    </div>
  );
}

export default EmptyComments;