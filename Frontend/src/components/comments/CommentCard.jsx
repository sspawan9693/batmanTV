import {
    ThumbsUp,
    MessageCircle,
    MoreVertical,
    Pencil,
    Trash2,
    X,
    Check,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useState } from "react";
import { updateComment, deleteComment } from "../../api/comment";
import { timeAgo } from "../../utils/timeAgo";
import ConfirmModal from "../common/ConfirmModal";
import { Link } from "react-router-dom";

function CommentCard({ comment, onCommentUpdated, onCommentDeleted, }) {

    const user = useSelector((state) => state.auth.user);

    const isOwner = user?._id === comment.owner._id;

    const [showMenu, setShowMenu] = useState(false);

    const [editing, setEditing] = useState(false);

    const [content, setContent] = useState(comment.content);

    const [loading, setLoading] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleUpdate = async () => {
        if (!content.trim()) return;

        try {
            setLoading(true);

            await updateComment(comment._id, content);

            setEditing(false);

            onCommentUpdated();
        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteComment(comment._id);

            setShowDeleteModal(false);

            onCommentDeleted();
        } catch (err) {
            console.error(err)
        }
    };
    return (
        <>
            <article className="flex gap-4">
                {/* Avatar */}
                <Link to={`/channel/${comment.owner.username}`}>
                    <img
                        src={comment.owner.avatar}
                        alt={comment.owner.fullName}
                        onError={(e) => {
                            e.target.src =
                                "https://ui-avatars.com/api/?name=User&background=27272a&color=fff";
                        }}
                        className="
                        h-11
                        w-11
                        rounded-full
                        object-cover
                        shrink-0
                        "
                    />
                </Link>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            to={`/channel/${comment.owner.username}`}
                            className="font-medium text-white hover:text-red-500 transition"
                        >
                            {comment.owner.username}
                        </Link>

                        <span className="text-sm text-zinc-500">
                            {timeAgo(comment.createdAt)}
                        </span>

                        <div className="ml-auto relative">
                            {isOwner && (
                                <>
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="rounded-full p-2 hover:bg-zinc-800"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {showMenu && (
                                        <div
                                            className="
                                                absolute
                                                right-0
                                                top-10
                                                w-40
                                                overflow-hidden
                                                rounded-xl
                                                border
                                                border-zinc-800
                                                bg-zinc-900
                                                shadow-xl
                                                z-50
                                            "
                                        >
                                            <button
                                                onClick={() => {
                                                    setEditing(true);
                                                    setShowMenu(false);
                                                }}
                                                className="flex w-full items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-2">
                        {editing ? (
                            <div className="mt-3">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={3}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-zinc-700
                                        bg-zinc-900
                                        p-3
                                        text-white
                                        outline-none
                                        focus:border-white
                                    "
                                />

                                <div className="mt-3 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            setContent(comment.content);
                                        }}
                                        className="rounded-full p-2 hover:bg-zinc-800"
                                    >
                                        <X size={18} />
                                    </button>

                                    <button
                                        onClick={handleUpdate}
                                        disabled={loading}
                                        className="
                                        rounded-full
                                        bg-white
                                        p-2
                                        text-black
                                        hover:bg-zinc-200
                                        "
                                    >
                                        <Check size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p
                                className="
                                mt-2
                                whitespace-pre-line
                                text-[15px]
                                leading-6
                                text-zinc-300
                                "
                            >
                                {comment.content}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-5">
                        <button
                            className="
                            flex
                            items-center  
                            gap-2
                            text-zinc-400
                            transition
                            hover:text-white
                            "
                        >
                            <ThumbsUp size={17} />

                            {comment.likesCount > 0 && (
                                <span className="text-sm">
                                    {comment.likesCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="
                            flex
                            items-center
                            gap-2
                            text-zinc-400
                            transition
                            hover:text-white
                            "
                        >
                            <MessageCircle size={17} />

                            <span className="text-sm">
                                Reply
                            </span>
                        </button>
                    </div>
                </div>
            </article>
            <ConfirmModal
                open={showDeleteModal}
                title="Delete Comment?"
                description="This action cannot be undone."
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />
        </>
    );
}

export default CommentCard;