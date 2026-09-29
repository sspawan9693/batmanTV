import { TriangleAlert } from "lucide-react";

function ErrorState({
    title = "Something went wrong",
    description = "We couldn't load this content.",
    onRetry,
}) {
    return (
        <div className="flex min-h-[65vh] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900">
                <TriangleAlert
                    size={42}
                    className="text-red-500"
                />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-white">
                {title}
            </h2>

            <p className="mt-2 max-w-md text-zinc-400">
                {description}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="
            mt-8
            rounded-full
            bg-white
            px-6
            py-2.5
            font-semibold
            text-black
            transition
            hover:bg-zinc-200
          "
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorState;