function CommentSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse">
      {/* Avatar */}
      <div className="h-11 w-11 shrink-0 rounded-full bg-zinc-800" />

      {/* Content */}
      <div className="flex-1">
        {/* Username */}
        <div className="h-4 w-32 rounded bg-zinc-800" />

        {/* Comment */}
        <div className="mt-3 h-4 w-full rounded bg-zinc-800" />
        <div className="mt-2 h-4 w-10/12 rounded bg-zinc-800" />

        {/* Actions */}
        <div className="mt-4 flex gap-6">
          <div className="h-3 w-14 rounded bg-zinc-800" />
          <div className="h-3 w-14 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export default CommentSkeleton;