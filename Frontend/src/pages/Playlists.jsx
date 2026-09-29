import { useEffect, useState, } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";

import PlaylistGrid from "../components/playlist/PlaylistGrid";
import PlaylistModal from "../components/playlist/PlaylistModal";

import ConfirmModal from "../components/common/ConfirmModal";
import {
    getUserPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
} from "../api/playlist";

function Playlists() {
    const user = useSelector((state) => state.auth.user);

    const [playlists, setPlaylists] = useState([]);

    // loading page
    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false); // modal create/edit
    // modal
    const [modalOpen, setModalOpen] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const [modalMode, setModalMode] = useState("create");

    const nameInputRef = useRef(null);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);

            const data = await getUserPlaylists(user._id);

            setPlaylists(data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchPlaylists();
        }
    }, [user]);

    const handleSubmit = async (formData) => {

        try {

            setSubmitting(true);

            if (modalMode === "create") {

                const newPlaylist = await createPlaylist(formData);

                setPlaylists((prev) => [
                    newPlaylist,
                    ...prev,
                ]);

            } else {

                const updatedPlaylist = await updatePlaylist(
                    selectedPlaylist._id,
                    formData
                );

                setPlaylists((prev) =>
                    prev.map((playlist) =>
                        playlist._id === updatedPlaylist._id
                            ? updatedPlaylist
                            : playlist
                    )
                );

            }

            setModalOpen(false);

            setSelectedPlaylist(null);

        } catch (error) {

            console.error(error);

            alert(
                modalMode === "create"
                    ? "Failed to create playlist."
                    : "Failed to update playlist."
            );

        } finally {

            setSubmitting(false);

        }

    };

    const handleDelete = async () => {

        if (!selectedPlaylist) return;

        try {

            setDeleting(true);

            await deletePlaylist(selectedPlaylist._id);

            setPlaylists((prev) =>
                prev.filter(
                    (playlist) =>
                        playlist._id !== selectedPlaylist._id
                )
            );

            setDeleteModalOpen(false);
            setSelectedPlaylist(null);

        } catch (error) {

            console.error(error);
            alert("Failed to delete playlist.");

        } finally {
            setDeleting(false);
        }

    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-6">

            {/* Header */}

            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-white">
                        My Playlists
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Organize your favorite videos into playlists.
                    </p>

                </div>

                <button
                    onClick={() => {
                        setModalMode("create");
                        setSelectedPlaylist(null);
                        setModalOpen(true);
                    }}
                    className="
                        rounded-full
                        bg-red-600
                        px-6
                        py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-red-700
                        active:scale-95
                    "
                >
                    + New Playlist
                </button>

            </div>

            <PlaylistGrid
                playlists={playlists}
                loading={loading}
                onDelete={(playlist) => {
                    setSelectedPlaylist(playlist);
                    setDeleteModalOpen(true);
                }}
                onEdit={(playlist) => {
                    setModalMode("edit");
                    setSelectedPlaylist(playlist);
                    setModalOpen(true);
                }}
                onCreate={() => {
                    setModalMode("create");
                    setSelectedPlaylist(null);
                    setModalOpen(true);
                }}
            />

            <PlaylistModal
                open={modalOpen}
                mode={modalMode}
                initialData={selectedPlaylist}
                loading={submitting}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedPlaylist(null);
                }}
                onSubmit={handleSubmit}
            />

            <ConfirmModal
                open={deleteModalOpen}
                title="Delete Playlist"
                description={`Are you sure you want to delete "${selectedPlaylist?.name}"? This action cannot be undone.`}
                loading={deleting}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setSelectedPlaylist(null);
                }}
                onConfirm={handleDelete}
            />

        </div>
    );
}

export default Playlists;