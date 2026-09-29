import {
    Upload,
    ImagePlus,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { uploadVideo } from "../api/video";
import { useNavigate } from "react-router-dom";


function UploadVideo() {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const videoInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoDuration, setVideoDuration] = useState("");
    const isFormValid =
        videoFile &&
        thumbnail &&
        formData.title.trim() &&
        formData.description.trim();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (
            !videoFile ||
            !thumbnail ||
            !formData.title.trim() ||
            !formData.description.trim()
        ) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            setError("");

            const data = new FormData();

            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("videoFile", videoFile);
            data.append("thumbnail", thumbnail);

            const uploadedVideo = await uploadVideo(
                data,
                (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    setUploadProgress(percent);
                }
            );

            navigate(`/watch/${uploadedVideo._id}`, {
                state: {
                    uploaded: true,
                },
            });

        } catch (err) {
            console.log(err);
            console.log(err.response);
            console.log(err.response?.data);
            setError(
                err.response?.data?.message ||
                "Video upload failed."
            );
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    useEffect(() => {
        const hasUnsavedChanges =
            videoFile ||
            thumbnail ||
            formData.title ||
            formData.description;

        const handleBeforeUnload = (e) => {
            if (!hasUnsavedChanges || uploading) return;

            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () =>
            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            );
    }, [videoFile, thumbnail, formData, uploading]);

    return (
        <div className="mx-auto max-w-5xl py-8">

            {/* Header */}

            <input
                disabled={uploading}
                ref={videoInputRef}
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files[0];

                    if (!file) return;

                    setVideoFile(file);

                    const video = document.createElement("video");

                    video.preload = "metadata";

                    video.onloadedmetadata = () => {

                        const duration = video.duration;

                        const minutes = Math.floor(duration / 60);

                        const seconds = Math.floor(duration % 60);

                        setVideoDuration(
                            `${minutes}:${seconds.toString().padStart(2, "0")}`
                        );

                        URL.revokeObjectURL(video.src);
                    };

                    video.src = URL.createObjectURL(file);
                }}
            />

            <input
                disabled={uploading}
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    if (e.target.files[0]) {
                        setThumbnail(e.target.files[0]);
                    }
                }}
            />

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">
                    Upload Video
                </h1>

                <p className="mt-2 text-zinc-400">
                    Share your story with the BatmanTV community.
                </p>
            </div>

            <div
                className={`
                    space-y-8
                    transition-all
                    duration-300
                    ${uploading ? "pointer-events-none opacity-70" : ""}
                `}
            >

                {/* Video Upload */}

                <section
                    onClick={() => videoInputRef.current.click()}
                    className="
                        rounded-2xl
                        border-2
                        border-dashed
                        border-zinc-700
                        bg-[#111111]
                        p-12
                        transition
                        hover:border-zinc-500
                        cursor-pointer
                    "
                >
                    <div className="flex flex-col items-center text-center">

                        <div
                            className="
                                flex
                                h-20
                                w-20
                                items-center
                                justify-center
                                rounded-full
                                bg-zinc-800
                            "
                        >
                            <Upload size={34} />
                        </div>

                        {videoFile ? (
                            <>
                                <h2 className="mt-6 text-xl font-semibold">
                                    {videoFile.name}
                                </h2>

                                <p className="mt-2 text-zinc-400">
                                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>

                                <button
                                    disabled={uploading}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        videoInputRef.current.click();
                                    }}
                                    className="
                                        mt-7
                                        rounded-full
                                        bg-white
                                        px-6
                                        py-3
                                        font-semibold
                                        text-black
                                        hover:bg-zinc-200
                                    "
                                >
                                    Change Video
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="mt-6 text-xl font-semibold">
                                    Upload your video
                                </h2>

                                <p className="mt-2 max-w-md text-zinc-400">
                                    Drag & drop your video here or click below.
                                </p>

                                <button
                                    disabled={uploading}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        videoInputRef.current.click();
                                    }}
                                    className="
                                        mt-7
                                        rounded-full
                                        bg-white
                                        px-6
                                        py-3
                                        font-semibold
                                        text-black
                                        hover:bg-zinc-200
                                    "
                                >
                                    Choose Video
                                </button>
                            </>
                        )}

                    </div>
                </section>

                {videoFile && (
                    <div
                        className="
            mt-6
            rounded-xl
            border
            border-zinc-800
            bg-[#181818]
            p-5
        "
                    >
                        <h3 className="font-semibold text-white">
                            Video Details
                        </h3>

                        <div className="mt-4 space-y-3 text-sm">

                            <div className="flex justify-between">
                                <span className="text-zinc-500">
                                    Filename
                                </span>

                                <span className="text-white">
                                    {videoFile.name}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-zinc-500">
                                    Size
                                </span>

                                <span className="text-white">
                                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-zinc-500">
                                    Duration
                                </span>

                                <span className="text-white">
                                    {videoDuration}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-zinc-500">
                                    Format
                                </span>

                                <span className="text-white">
                                    {videoFile.type}
                                </span>
                            </div>

                        </div>
                    </div>
                )}

                {/* Thumbnail */}

                <section
                    onClick={() => thumbnailInputRef.current.click()}
                    className="
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-[#111111]
                        p-8
                        transition
                        hover:border-zinc-700
                    "
                >
                    <div className="flex items-center gap-5">

                        <div
                            className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-xl
                                bg-zinc-800
                            "
                        >
                            <ImagePlus size={28} />
                        </div>

                        <div>

                            <h3 className="font-semibold">
                                Thumbnail
                            </h3>

                            <p className="mt-1 text-sm text-zinc-400">
                                Upload a custom thumbnail.
                            </p>

                        </div>

                    </div>

                    <div className="mt-6">

                        {thumbnail ? (
                            <>
                                <div className="mt-6">

                                    <img
                                        src={URL.createObjectURL(thumbnail)}
                                        alt="Thumbnail"
                                        className="
                                            aspect-video
                                            w-full
                                            rounded-xl
                                            object-cover
                                            border
                                            border-zinc-700
                                        "
                                    />

                                    <p className="mt-3 text-sm text-zinc-400">
                                        {thumbnail.name}
                                    </p>

                                </div>

                                <button
                                    disabled={uploading}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        thumbnailInputRef.current.click();
                                    }}
                                    className="
                                        mt-5
                                        rounded-full
                                        border
                                        border-zinc-700
                                        px-5
                                        py-2.5
                                        transition
                                        hover:bg-zinc-800
                                    "
                                >
                                    Change Thumbnail
                                </button>
                            </>
                        ) : (
                            <button
                                disabled={uploading}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    thumbnailInputRef.current.click();
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
                                Choose Thumbnail
                            </button>
                        )}

                    </div>

                </section>

                {/* Details */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-[#111111]
                        p-8
                    "
                >

                    <div>

                        <label className="mb-2 block text-sm text-zinc-300">
                            Title
                        </label>

                        <input
                            disabled={uploading}
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
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
                            placeholder="Give your video a title"
                        />

                    </div>

                    <div className="mt-6">

                        <label className="mb-2 block text-sm text-zinc-300">
                            Description
                        </label>

                        <textarea
                            disabled={uploading}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
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
                            placeholder="Tell viewers about your video..."
                        />

                    </div>

                </section>
                {!isFormValid && (
                    <p className="mb-5 text-sm text-zinc-500">
                        Fill all required fields to publish your video.
                    </p>
                )}

                {/* Publish */}

                {uploading ? (
                    <div
                        className="
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-[#111111]
                            p-6
                        "
                    >
                        <div className="flex items-start justify-between">

                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Uploading video...
                                </h3>

                                <p className="mt-1 text-sm text-zinc-400">
                                    Please don't close this page while your video is uploading.
                                </p>
                            </div>

                            <span className="text-lg font-bold text-red-500">
                                {uploadProgress}%
                            </span>

                        </div>

                        <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">

                            <div
                                className="h-full rounded-full bg-red-600 transition-all duration-300"
                                style={{
                                    width: `${uploadProgress}%`,
                                }}
                            />

                        </div>

                        <div className="mt-6 flex justify-end">

                            <button
                                disabled
                                className="
                    rounded-full
                    border
                    border-zinc-700
                    px-5
                    py-2
                    text-sm
                    text-zinc-500
                    cursor-not-allowed
                "
                            >
                                Cancel Upload
                            </button>

                        </div>
                    </div>
                ) : (
                    <div className="flex justify-end">

                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || uploading}
                            className={`
                                    rounded-full
                                    px-8
                                    py-3
                                    font-semibold
                                    transition

                                    ${isFormValid
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-zinc-700 cursor-not-allowed text-zinc-400"
                                }
                            `}
                        >
                            Publish Video
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
}

export default UploadVideo;