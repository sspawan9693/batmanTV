import { useRef } from "react";
import Cropper from "react-cropper";

import {
    RotateCcw,
    RotateCw,
    RotateCcwSquare,
    Check,
    X,
} from "lucide-react";

function ImageCropModal({
    image,
    aspect = 1,
    onCancel,
    onSave,
}) {

    const cropperRef = useRef(null);

    const rotateLeft = () => {
        cropperRef.current?.cropper.rotate(-90);
    };

    const rotateRight = () => {
        cropperRef.current?.cropper.rotate(90);
    };

    const reset = () => {
        cropperRef.current?.cropper.reset();
    };

    const handleSave = () => {
        const cropper = cropperRef.current?.cropper;

        if (!cropper) return;

        const canvas = cropper.getCroppedCanvas({
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
        });

        canvas.toBlob((blob) => {

            const file = new File(
                [blob],
                "cropped-image.jpg",
                {
                    type: "image/jpeg",
                }
            );

            onSave(file);

        }, "image/jpeg");
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-999
                flex
                items-center
                justify-center
                bg-black/80
                backdrop-blur-sm
            "
        >
            <div
                className="
                    w-212.5
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#181818]
                    p-6
                "
            >
                <h2 className="mb-5 text-xl font-semibold">
                    Crop Image
                </h2>

                <Cropper
                    ref={cropperRef}
                    src={image}
                    style={{
                        height: 500,
                        width: "100%",
                    }}
                    aspectRatio={aspect}
                    viewMode={1}
                    dragMode="move"
                    guides={true}
                    center={true}
                    background={false}
                    responsive={true}
                    autoCropArea={0.9}
                    checkOrientation={false}
                    movable={true}
                    zoomable={true}
                    scalable={false}
                    rotatable={true}
                    cropBoxMovable={true}
                    cropBoxResizable={true}
                />

                <div className="mt-6 flex items-center justify-between">

                    <div className="flex gap-3">

                        <button
                            onClick={rotateLeft}
                            className="
                                rounded-full
                                border
                                border-zinc-700
                                p-3
                                hover:bg-zinc-800
                            "
                        >
                            <RotateCcw size={18}/>
                        </button>

                        <button
                            onClick={rotateRight}
                            className="
                                rounded-full
                                border
                                border-zinc-700
                                p-3
                                hover:bg-zinc-800
                            "
                        >
                            <RotateCw size={18}/>
                        </button>

                        <button
                            onClick={reset}
                            className="
                                rounded-full
                                border
                                border-zinc-700
                                p-3
                                hover:bg-zinc-800
                            "
                        >
                            <RotateCcwSquare size={18}/>
                        </button>

                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={onCancel}
                            className="
                                rounded-full
                                border
                                border-zinc-700
                                px-5
                                py-2.5
                                hover:bg-zinc-800
                            "
                        >
                            <X size={18}/>
                        </button>

                        <button
                            onClick={handleSave}
                            className="
                                rounded-full
                                bg-red-600
                                px-5
                                py-2.5
                                hover:bg-red-700
                            "
                        >
                            <Check size={18}/>
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ImageCropModal;