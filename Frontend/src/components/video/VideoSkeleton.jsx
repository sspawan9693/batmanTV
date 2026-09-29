function VideoSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Thumbnail */}
      <div className="aspect-video rounded-xl bg-zinc-800" />

      {/* Info */}
      <div className="mt-3 flex gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-800" />

        <div className="flex-1">
          <div className="h-4 w-11/12 rounded bg-zinc-800" />

          <div className="mt-2 h-4 w-8/12 rounded bg-zinc-800" />

          <div className="mt-3 h-3 w-6/12 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export default VideoSkeleton;