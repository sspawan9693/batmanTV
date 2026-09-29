import VideoSkeleton from "./VideoSkeleton";

function SkeletonGrid() {
  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
        gap-x-6
        gap-y-10
      "
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <VideoSkeleton key={index} />
      ))}
    </div>
  );
}

export default SkeletonGrid;