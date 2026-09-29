import { useEffect, useState } from "react";
import { Image, Upload, X } from "lucide-react";

function EditVideoModal({
    open,
    video,
    loading = false,
    onClose,
    onSubmit,
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (open && video) {
            setTitle(video.title || "");
            setDescription(video.description || "");
            setThumbnail(null);
            setPreview(video.thumbnail || "");
        }
    }, [open, video]);

    useEffect(() => {
        if (!thumbnail) return;

        const objectUrl = URL.createObjectURL(
            thumbnail
        );

        setPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [thumbnail]);

    if (!open || !video) return null;

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setThumbnail(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        const formData = new FormData();

        formData.append(
            "title",
            title.trim()
        );

        if (description.trim()) {
            formData.append(
                "description",
                description.trim()
            );
        }

        if (thumbnail) {
            formData.append(
                "thumbnail",
                thumbnail
            );
        }

        await onSubmit(formData);
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-9999
                flex
                items-center
                justify-center
                bg-black/70
                px-4
                py-6
                backdrop-blur-sm
            "
            onClick={onClose}
        >
            <div
                className="
                    flex
                    max-h-[90vh]
                    w-full
                    max-w-2xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#181818]
                    shadow-2xl
                "
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                {/* Header */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-zinc-800
                        px-5
                        py-4
                    "
                >
                    <div>
                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-white
                            "
                        >
                            Edit Video
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-zinc-500
                            "
                        >
                            Update your video's details
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            rounded-full
                            p-2
                            text-zinc-400
                            transition
                            hover:bg-zinc-800
                            hover:text-white
                            disabled:opacity-50
                        "
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* Body */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                    "
                >
                    <div
                        className="
                            flex-1
                            space-y-5
                            overflow-y-auto
                            p-5
                        "
                    >
                        {/* Thumbnail */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-zinc-300
                                "
                            >
                                Thumbnail
                            </label>

                            <label
                                className="
                                    group
                                    relative
                                    block
                                    aspect-video
                                    cursor-pointer
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-zinc-900
                                "
                            >
                                <img
                                    src={preview}
                                    alt="Video thumbnail"
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition
                                        duration-300
                                        group-hover:scale-[1.02]
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        bg-black/50
                                        opacity-0
                                        transition
                                        group-hover:opacity-100
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-white
                                            text-black
                                        "
                                    >
                                        <Upload
                                            size={18}
                                        />
                                    </div>

                                    <span
                                        className="
                                            mt-2
                                            text-sm
                                            font-medium
                                            text-white
                                        "
                                    >
                                        Change thumbnail
                                    </span>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleThumbnailChange
                                    }
                                    className="hidden"
                                />
                            </label>

                            <p
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-1.5
                                    text-xs
                                    text-zinc-600
                                "
                            >
                                <Image size={13} />

                                Select an image to replace
                                the current thumbnail.
                            </p>
                        </div>

                        {/* Title */}

                        <div>
                            <label
                                htmlFor="video-title"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-zinc-300
                                "
                            >
                                Title
                            </label>

                            <input
                                id="video-title"
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                maxLength={150}
                                placeholder="Enter video title"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-[#111111]
                                    px-4
                                    py-3
                                    text-sm
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-zinc-600
                                    focus:border-zinc-600
                                "
                            />

                            <div
                                className="
                                    mt-1.5
                                    text-right
                                    text-xs
                                    text-zinc-600
                                "
                            >
                                {title.length}/150
                            </div>
                        </div>

                        {/* Description */}

                        <div>
                            <label
                                htmlFor="video-description"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-zinc-300
                                "
                            >
                                Description
                            </label>

                            <textarea
                                id="video-description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                maxLength={5000}
                                rows={6}
                                placeholder="Tell viewers about your video..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-[#111111]
                                    px-4
                                    py-3
                                    text-sm
                                    leading-6
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-zinc-600
                                    focus:border-zinc-600
                                "
                            />

                            <div
                                className="
                                    mt-1.5
                                    text-right
                                    text-xs
                                    text-zinc-600
                                "
                            >
                                {description.length}/5000
                            </div>
                        </div>
                    </div>

                    {/* Footer */}

                    <div
                        className="
                            flex
                            shrink-0
                            justify-end
                            gap-3
                            border-t
                            border-zinc-800
                            px-5
                            py-4
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                rounded-full
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-zinc-300
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !title.trim()
                            }
                            className="
                                rounded-full
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-black
                                transition
                                hover:bg-zinc-200
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditVideoModal;