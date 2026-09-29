function StatCard({
    title,
    value,
    icon: Icon,
    description,
}) {
    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-950/60
                p-5
                transition-all
                duration-300
                hover:border-zinc-700
                hover:bg-zinc-900/60
            "
        >
            {/* Subtle glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8
                    h-24
                    w-24
                    rounded-full
                    bg-white/2.5
                    blur-2xl
                    transition
                    duration-300
                    group-hover:bg-white/5
                "
            />

            {/* Top */}

            <div
                className="
                    relative
                    flex
                    items-center
                    justify-between
                "
            >
                <p
                    className="
                        text-sm
                        font-medium
                        text-zinc-500
                    "
                >
                    {title}
                </p>

                <div
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-zinc-900
                        text-zinc-400
                        transition
                        duration-300
                        group-hover:text-white
                    "
                >
                    {Icon && <Icon size={18} />}
                </div>
            </div>

            {/* Value */}

            <div className="relative mt-4">
                <p
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-white
                    "
                >
                    {value}
                </p>

                {description && (
                    <p
                        className="
                            mt-1
                            text-xs
                            text-zinc-600
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

export default StatCard;