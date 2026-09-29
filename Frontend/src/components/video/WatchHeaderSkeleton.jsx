function WatchHeaderSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Video Player */}
            <div className="aspect-video rounded-2xl bg-zinc-800" />

            {/* Title */}
            <div className="mt-6 h-7 w-3/4 rounded bg-zinc-800" />


            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
                <div className="h-10 w-28 rounded-full bg-zinc-800" />
                <div className="h-10 w-28 rounded-full bg-zinc-800" />
                <div className="h-10 w-24 rounded-full bg-zinc-800" />
            </div>

            {/* Channel + Buttons */}
            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-zinc-800" />

                    <div>
                        <div className="h-4 w-36 rounded bg-zinc-800" />
                        <div className="mt-3 h-3 w-24 rounded bg-zinc-800" />
                    </div>
                </div>

                <div className="h-10 w-32 rounded-full bg-zinc-800" />
            </div>

            {/* Description */}
            <div className="mt-6 rounded-2xl bg-zinc-800 p-6">
                <div className="h-4 w-24 rounded bg-zinc-700" />
                <div className="mt-5 h-4 w-full rounded bg-zinc-700" />
                <div className="mt-3 h-4 w-11/12 rounded bg-zinc-700" />
                <div className="mt-3 h-4 w-9/12 rounded bg-zinc-700" />
            </div>
        </div>
    );
}

export default WatchHeaderSkeleton;