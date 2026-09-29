import { Link } from "react-router-dom";
import { Upload, LayoutDashboard } from "lucide-react";

function DashboardHeader() {
    return (
        <div
            className="
                flex
                flex-col
                gap-4
                border-b
                border-zinc-800
                px-5
                py-6
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            {/* Left */}

            <div className="flex items-center gap-3">

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-500/10
                    "
                >
                    <LayoutDashboard
                        size={20}
                        className="text-red-500"
                    />
                </div>

                <div>
                    <h1
                        className="
                            text-xl
                            font-bold
                            tracking-tight
                            text-white
                        "
                    >
                        Channel Dashboard
                    </h1>

                    <p
                        className="
                            mt-0.5
                            text-sm
                            text-zinc-500
                        "
                    >
                        Manage your channel and track its performance
                    </p>
                </div>

            </div>

            {/* Upload */}

            <Link
                to="/upload"
                className="
                    inline-flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-black
                    transition-all
                    duration-200
                    hover:bg-zinc-200
                    active:scale-95
                "
            >
                <Upload size={16} />

                Upload Video
            </Link>

        </div>
    );
}

export default DashboardHeader;