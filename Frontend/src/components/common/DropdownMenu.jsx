import { useEffect, useRef, useState } from "react";
import Portal from "./Portal";

function DropdownMenu({
    items = [],
    trigger,
}) {
    const [open, setOpen] = useState(false);

    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    useEffect(() => {
        const handleOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "click",
            handleOutside
        );

        return () =>
            document.removeEventListener(
                "click",
                handleOutside
            );
    }, []);

    useEffect(() => {
        if (!open) return;

        const updatePosition = () => {
            const rect =
                triggerRef.current.getBoundingClientRect();

            setPosition({
                top: rect.bottom + 8,
                left: rect.right,
            });
        };

        window.addEventListener(
            "scroll",
            updatePosition,
            true
        );

        window.addEventListener(
            "resize",
            updatePosition
        );

        return () => {
            window.removeEventListener(
                "scroll",
                updatePosition,
                true
            );

            window.removeEventListener(
                "resize",
                updatePosition
            );
        };
    }, [open]);

    return (
        <div
            ref={menuRef}
            className="inline-flex"
        >
            <div
                ref={triggerRef}
                onClick={(e) => {

                    e.preventDefault();
                    e.stopPropagation();

                    if (!open) {

                        const rect =
                            triggerRef.current.getBoundingClientRect();

                        setPosition({
                            top: rect.bottom + 8,
                            left: rect.right,
                        });

                    }

                    setOpen((prev) => !prev);

                }}
                className="inline-flex cursor-pointer"
            >
                {trigger}
            </div>

            {open && (
                <Portal>
                    <div
                        style={{
                            position: "fixed",
                            top: position.top,
                            left: position.left,
                            transform: "translateX(-100%)",
                        }}
                        className="
                            z-9999
                            w-44
                            overflow-hidden
                            rounded-xl
                            border
                            border-zinc-700
                            bg-[#1a1a1a]
                            shadow-2xl
                        "
                    >
                        {items.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        setOpen(false);
                                        item.onClick?.();
                                    }}
                                    className={`
                                        flex
                                        w-full
                                        items-center
                                        gap-2
                                        px-3
                                        py-2.5
                                        text-sm
                                        transition
                                        ${item.danger
                                            ? "text-red-500 hover:bg-red-500/10"
                                            : "hover:bg-zinc-800"
                                        }
                                    `}
                                >
                                    <Icon size={17} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </Portal>
            )}
        </div>
    );
}

export default DropdownMenu;