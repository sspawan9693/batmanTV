import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { updateAccount } from "../api/user";
import { login } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { Camera, SquarePen } from "lucide-react";
import { useRef } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { changePassword } from "../api/user";

import PasswordInput from "../components/Profile/PasswordInput.jsx";
import { updateAvatar, updateCoverImage } from "../api/user";
import ImageCropModal from "../components/common/ImageCropModal";
import getCroppedImg from "../utils/cropImage";
import { Link } from "react-router-dom"

function Profile() {
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [editingInfo, setEditingInfo] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        old: false,
        next: false,
        confirm: false,
    });

    const [passwordLoading, setPasswordLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        username: user?.username || "",
        email: user?.email || "",
    });

    const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [croppingAvatar, setCroppingAvatar] = useState(true);

    const [coverImage, setCoverImage] = useState(null);
    const [coverModalOpen, setCoverModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                username: user.username,
                email: user.email,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const updatedUser = await updateAccount(formData);

            dispatch(login(updatedUser));

            alert("Profile updated successfully.");

        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswords((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handlePasswordSubmit = async () => {

        if (
            !passwords.oldPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {
            return alert("Fill all password fields.");
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            return alert("Passwords do not match.");
        }

        try {

            setPasswordLoading(true);

            await changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            });

            alert("Password changed successfully.");

            setPasswords({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to change password."
            );

        } finally {

            setPasswordLoading(false);

        }
    };

    const handleCoverSelect = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setCoverImage(URL.createObjectURL(file));

        setCoverModalOpen(true);
    };

    const handleCoverSave = async (file) => {
        try {

            setLoading(true);

            const updatedUser = await updateCoverImage(file);

            dispatch(login(updatedUser));

            setCoverModalOpen(false);

            setCoverImage(null);

        } catch (err) {

            console.error(err);

            alert("Cover upload failed");

        } finally {

            setLoading(false);

        }
    };

    const handleAvatarChange = async (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        // validation

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5 MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Invalid image.");
            return;
        }

        // instant preview

        setAvatarPreview(URL.createObjectURL(file));

        try {

            setAvatarUploading(true);

            const formData = new FormData();

            formData.append("avatar", file);

            const updatedUser = await updateAvatar(file);

            setAvatarPreview(updatedUser.avatar);

            dispatch(login(updatedUser));

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Avatar update failed."
            );

            setAvatarPreview(user.avatar);

        } finally {

            setAvatarUploading(false);

        }

    };

    const handleCropSave = async (file) => {
        try {

            setLoading(true);

            const updatedUser = await updateAvatar(file);

            dispatch(login(updatedUser));

            setShowCropModal(false);

            setSelectedImage(null);

        } catch (err) {

            console.error(err);

            alert("Avatar upload failed");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="mx-auto max-w-5xl py-8">


            <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files[0];

                    if (!file) return;

                    setCroppingAvatar(true);

                    setSelectedFile(file);
                    setSelectedImage(URL.createObjectURL(file));

                    setShowCropModal(true);
                }}
            />

            <input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                hidden
                onChange={handleCoverSelect}

            />

            {/* Cover */}

            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">

                {/* Cover */}
                <div className="group relative h-60 bg-zinc-900">

                    <img
                        src={user?.coverImage}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />

                    <button
                        onClick={() => coverInputRef.current.click()}
                        className="
                absolute
                right-4
                top-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-black/70
                opacity-0
                transition-all
                duration-300
                group-hover:opacity-100
                hover:bg-red-600
            "
                    >
                        <Camera size={18} />
                    </button>

                </div>

                {/* Profile */}
                <div className="relative px-8 pb-8">

                    {/* Avatar */}
                    <div className="relative -mt-16 h-32 w-32">

                        <img
                            src={avatarPreview}
                            alt={user?.fullName}
                            className="
                    h-32
                    w-32
                    rounded-full
                    border-4
                    border-[#111111]
                    object-cover
                "
                        />

                        <button
                            disabled={avatarUploading}
                            onClick={() => avatarInputRef.current.click()}
                            className="
                    absolute
                    bottom-2
                    right-2
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-black/80
                    transition
                    hover:bg-red-600
                    disabled:opacity-50
                "
                        >
                            {avatarUploading ? "..." : <Camera size={18} />}
                        </button>

                    </div>

                    {/* Info */}
                    <div
                        className="
                mt-6
                flex
                flex-col
                gap-6
                md:flex-row
                md:items-center
                md:justify-between
            "
                    >

                        {/* Left */}
                        <div>

                            <h2 className="text-3xl font-bold text-white">
                                {user?.fullName}
                            </h2>

                            <p className="mt-1 text-zinc-400">
                                @{user?.username}
                            </p>

                        </div>

                        {/* Right */}
                        <div className="flex flex-wrap gap-3">

                            <Link
                                to={`/channel/${user?.username}`}
                                className="
                        rounded-full
                        border
                        border-zinc-700
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        transition
                        hover:bg-zinc-800
                    "
                            >
                                My Channel
                            </Link>

                            <Link
                                to="/dashboard"
                                className="
                        rounded-full
                        bg-red-600
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        transition
                        hover:bg-red-700
                    "
                            >
                                Dashboard
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            <section
                className="
                    mt-8
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#111111]
                    p-8
                "
            >
                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-sm text-zinc-400">
                            Update your personal details.
                        </p>
                    </div>

                    {!editingInfo && (
                        <button
                            onClick={() => setEditingInfo(true)}
                            className="
                                rounded-full
                                border
                                border-zinc-700
                                p-3
                                transition
                                hover:border-red-600
                                hover:bg-red-600/10
                            "
                        >
                            <SquarePen size={18} />
                        </button>
                    )}

                </div>
                <div className="mt-8 space-y-6">

                    {/* Full Name */}

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Full Name
                        </label>

                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            readOnly={!editingInfo}
                            className={`
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                transition
                                ${editingInfo
                                    ? "border-red-600 bg-[#181818]"
                                    : "border-zinc-800 bg-[#151515] text-zinc-400 cursor-default"
                                }
                            `}
                        />
                    </div>

                    {/* Username */}

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Username
                        </label>

                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            readOnly={!editingInfo}
                            className={`
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    outline-none
                                    transition
                                    ${editingInfo
                                    ? "border-red-600 bg-[#181818]"
                                    : "border-zinc-800 bg-[#151515] text-zinc-400 cursor-default"
                                }
                            `}
                        />
                    </div>

                    {/* Email */}

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Email
                        </label>

                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly={!editingInfo}
                            className={`
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    outline-none
                                    transition
                                    ${editingInfo
                                    ? "border-red-600 bg-[#181818]"
                                    : "border-zinc-800 bg-[#151515] text-zinc-400 cursor-default"
                                }
                            `}
                        />
                    </div>

                    <div className="flex justify-end gap-3">

                        {editingInfo && (
                            <>
                                <button
                                    onClick={() => {
                                        setEditingInfo(false);

                                        setFormData({
                                            fullName: user.fullName,
                                            username: user.username,
                                            email: user.email,
                                        });
                                    }}
                                    className="
                                        rounded-full
                                        border
                                        border-zinc-700
                                        px-6
                                        py-3
                                        transition
                                        hover:bg-zinc-800
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={async () => {
                                        await handleSave();
                                        setEditingInfo(false);
                                    }}
                                    disabled={loading}
                                    className="
                                        rounded-full
                                        bg-red-600
                                        px-8
                                        py-3
                                        font-semibold
                                        transition
                                        hover:bg-red-700
                                        disabled:opacity-50
                                    "
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        )}

                    </div>

                </div>
            </section>

            <section
                className="
                    mt-8
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#111111]
                    p-8
                "
            >

                <div className="flex items-center gap-3">

                    <LockKeyhole size={22} />

                    <div>

                        <h2 className="text-xl font-semibold">
                            Security
                        </h2>

                        <p className="text-sm text-zinc-400">
                            Change your account password.
                        </p>

                    </div>

                </div>

                <div className="mt-8 space-y-5">

                    {/* Current */}

                    <PasswordInput
                        label="Current Password"
                        name="oldPassword"
                        value={passwords.oldPassword}
                        show={showPassword.old}
                        toggle={() =>
                            setShowPassword((prev) => ({
                                ...prev,
                                old: !prev.old,
                            }))
                        }
                        onChange={handlePasswordChange}
                    />

                    {/* New */}

                    <PasswordInput
                        label="New Password"
                        name="newPassword"
                        value={passwords.newPassword}
                        show={showPassword.next}
                        toggle={() =>
                            setShowPassword((prev) => ({
                                ...prev,
                                next: !prev.next,
                            }))
                        }
                        onChange={handlePasswordChange}
                    />

                    {/* Confirm */}

                    <PasswordInput
                        label="Confirm Password"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        show={showPassword.confirm}
                        toggle={() =>
                            setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                            }))
                        }
                        onChange={handlePasswordChange}
                    />

                    <div className="flex justify-end">

                        <button
                            disabled={passwordLoading}
                            onClick={handlePasswordSubmit}
                            className="
                                rounded-full
                                bg-red-600
                                px-8
                                py-3
                                font-semibold
                                transition
                                hover:bg-red-700
                                disabled:opacity-50
                            "
                        >
                            {passwordLoading
                                ? "Changing..."
                                : "Change Password"}
                        </button>

                    </div>

                </div>

            </section>

            {showCropModal && (
                <ImageCropModal
                    image={selectedImage}
                    aspect={1}
                    onCancel={() => {
                        setShowCropModal(false);
                        setSelectedImage(null);
                    }}
                    onSave={handleCropSave}
                />
            )}

            {coverModalOpen && (
                <ImageCropModal
                    image={coverImage}
                    aspect={16 / 9}
                    onCancel={() => {
                        setCoverModalOpen(false);
                        setCoverImage(null);
                    }}
                    onSave={handleCoverSave}
                />
            )}

        </div>
    );
}

export default Profile;