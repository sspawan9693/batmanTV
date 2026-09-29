function RecommendedVideoSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      {/* Thumbnail */}
      <div className="h-24 w-44 rounded-xl bg-zinc-800" />

      {/* Info */}
      <div className="flex-1">
        <div className="h-4 w-full rounded bg-zinc-800" />

        <div className="mt-3 h-3 w-2/3 rounded bg-zinc-800" />

        <div className="mt-2 h-3 w-1/2 rounded bg-zinc-800" />
      </div>
    </div>
  );
}

export default RecommendedVideoSkeleton;