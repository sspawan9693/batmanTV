import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

function PlaylistModal({
    open,
    onClose,
    onSubmit,
    loading,
    mode = "create",
    initialData = null,
}) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const nameInputRef = useRef(null);

    useEffect(() => {

        if (!open) return;

        if (mode === "edit" && initialData) {

            setName(initialData.name || "");
            setDescription(initialData.description || "");

        } else {

            setName("");
            setDescription("");

        }

        setTimeout(() => {
            nameInputRef.current?.focus();
        }, 0);

    }, [open, mode, initialData]);

    useEffect(() => {

        if (!open) return;

        const handleKeyDown = (e) => {

            if (loading) return;

            if (e.key === "Escape") {

                onClose();

            }

        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

    }, [open, loading, onClose]);

    if (!open) return null;

    const handleSubmit = () => {

        if (!name.trim()) return;

        onSubmit({
            name,
            description,
        });

    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full
                    max-w-lg
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-[#111111]
                    p-8
                "
            >

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-semibold text-white">
                            {mode === "edit"
                                ? "Edit Playlist"
                                : "Create Playlist"}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            {mode === "edit"
                                ? "Update your playlist details."
                                : "Organize your favorite videos."}
                        </p>

                    </div>

                    <button
                        onClick={() => {
                            if (loading) return;
                            onClose();
                        }}
                        className="
                            rounded-full
                            p-2
                            transition
                            hover:bg-zinc-800
                        "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Inputs */}

                <div className="mt-8 space-y-5">

                    <div>

                        <label className="mb-2 block text-sm text-zinc-300">
                            Playlist Name
                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            ref={nameInputRef}
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit();
                                }

                            }}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-zinc-700
                                bg-[#181818]
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-red-600
                            "
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm text-zinc-300">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-zinc-700
                                bg-[#181818]
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-red-600
                            "
                        />

                    </div>

                </div>

                {/* Footer */}

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={() => {
                            if (loading) return;
                            onClose();
                        }}
                        className="
                            rounded-full
                            border
                            border-zinc-700
                            px-5
                            py-2.5
                            transition
                            hover:bg-zinc-800
                        "
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading || !name.trim()}
                        onClick={handleSubmit}
                        className="
                            rounded-full
                            bg-red-600
                            px-6
                            py-2.5
                            font-medium
                            transition
                            hover:bg-red-700
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            active:scale-95
                            duration-200
                        "
                    >
                        {loading
                            ? (
                                mode === "edit"
                                    ? "Saving..."
                                    : "Creating..."
                            )
                            : (
                                mode === "edit"
                                    ? "Save Changes"
                                    : "Create"
                            )}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default PlaylistModal;