import { Search, Upload, Bell, Menu } from "lucide-react";
import logo from "../../assets/batlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";

import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../api/auth";

import { motion, AnimatePresence } from "framer-motion";

function Navbar({
    isSidebarOpen,
    setIsSidebarOpen,
}) {
    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const iconButtonClass = `
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        transition-colors
        duration-200
        hover:bg-[#272727]
    `;

    const menuItemClass = `
        w-full
        px-4
        py-3
        text-left
        transition-colors
        duration-200
        hover:bg-zinc-800
    `;

    const handleLogout = async () => {
        try {
            await logoutUser();

            dispatch(logout());

            setShowMenu(false);

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowMenu(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    return (
        <header
            className="
                fixed
                left-0
                right-0
                top-0
                z-50
                h-16
                border-b
                border-zinc-800
                bg-[#0f0f0f]
            "
        >
            <div
                className="
                    grid
                    h-full
                    grid-cols-[260px_1fr_220px]
                    items-center
                    px-5
                "
            >

                {/* LEFT */}

                <div className="flex items-center gap-3">

                    <motion.button
                        onClick={() =>
                            setIsSidebarOpen(
                                (prev) => !prev
                            )
                        }
                        whileHover={{
                            scale: 1.08,
                        }}
                        whileTap={{
                            scale: 0.9,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                        }}
                        className={iconButtonClass}
                    >
                        <motion.div
                            animate={{
                                rotate: isSidebarOpen
                                    ? 0
                                    : 180,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                        >
                            <Menu size={22} />
                        </motion.div>
                    </motion.button>

                    <Link to="/">

                        <motion.img
                            src={logo}
                            alt="BatmanTV"
                            draggable={false}
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                            }}
                            className="
                                h-10
                                cursor-pointer
                                select-none
                                object-contain
                            "
                        />

                    </Link>

                </div>

                {/* CENTER */}

                <div className="flex justify-center">

                    <div className="flex w-full max-w-175">

                        <input
                            type="text"
                            placeholder="Search"
                            className="
                                peer
                                h-10
                                flex-1
                                rounded-l-full
                                border
                                border-zinc-700
                                bg-[#121212]
                                pl-6
                                pr-4
                                text-[15px]
                                text-white
                                outline-none
                                placeholder:text-zinc-500
                                transition-all
                                duration-200
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        />

                        <motion.button
                            whileTap={{
                                scale: 0.95,
                            }}
                            className="
                                flex
                                h-10
                                w-16
                                items-center
                                justify-center
                                rounded-r-full
                                border
                                border-l-0
                                border-zinc-700
                                bg-[#222222]
                                transition-colors
                                duration-200
                                hover:bg-[#303030]
                                peer-focus:border-blue-500
                                peer-focus:text-blue-400
                            "
                        >
                            <Search size={22} />
                        </motion.button>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex items-center justify-end gap-3">

                    {/* Upload */}

                    <motion.button
                        onClick={() =>
                            navigate("/upload")
                        }
                        whileHover={{
                            scale: 1.08,
                        }}
                        whileTap={{
                            scale: 0.9,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                        }}
                        className={iconButtonClass}
                    >
                        <Upload size={22} />
                    </motion.button>

                    {/* Notification */}

                    <motion.button
                        whileHover={{
                            scale: 1.08,
                        }}
                        whileTap={{
                            scale: 0.9,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                        }}
                        className={iconButtonClass}
                    >
                        <Bell size={22} />
                    </motion.button>

                    {/* USER */}

                    {isAuthenticated ? (

                        <div
                            className="relative"
                            ref={menuRef}
                        >

                            <motion.img
                                src={user.avatar}
                                alt={user.fullName}
                                onClick={() =>
                                    setShowMenu(
                                        (prev) => !prev
                                    )
                                }
                                whileHover={{
                                    scale: 1.08,
                                }}
                                whileTap={{
                                    scale: 0.92,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                }}
                                className="
                                    h-9
                                    w-9
                                    cursor-pointer
                                    select-none
                                    rounded-full
                                    object-cover
                                    ring-offset-2
                                    ring-offset-[#0f0f0f]
                                    hover:ring-2
                                    hover:ring-zinc-400
                                "
                            />

                            <AnimatePresence>
                                {showMenu && (

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -8,
                                            scale: 0.96,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -8,
                                            scale: 0.96,
                                        }}
                                        transition={{
                                            duration: 0.18,
                                            ease: "easeOut",
                                        }}
                                        className="
                                            absolute
                                            right-0
                                            mt-3
                                            w-72
                                            origin-top-right
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-zinc-800
                                            bg-[#212121]
                                            shadow-[0_12px_40px_rgba(0,0,0,0.45)]
                                        "
                                    >

                                        {/* USER INFO */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                border-b
                                                border-zinc-800
                                                p-4
                                            "
                                        >

                                            <img
                                                src={user.avatar}
                                                alt={user.fullName}
                                                className="
                                                    h-11
                                                    w-11
                                                    rounded-full
                                                    object-cover
                                                "
                                            />

                                            <div className="min-w-0">

                                                <h3 className="
                                                    text-[15px]
                                                    font-semibold
                                                    text-white
                                                ">
                                                    {user.fullName}
                                                </h3>

                                                <p className="
                                                    truncate
                                                    text-[13px]
                                                    text-zinc-400
                                                ">
                                                    {user.email}
                                                </p>

                                            </div>

                                        </div>

                                        {/* PROFILE */}

                                        <Link to="/profile">

                                            <motion.button
                                                whileHover={{
                                                    x: 3,
                                                }}
                                                className={`${menuItemClass} text-white`}
                                            >
                                                My Profile
                                            </motion.button>

                                        </Link>

                                        {/* LOGOUT */}

                                        <motion.button
                                            onClick={handleLogout}
                                            whileHover={{
                                                x: 3,
                                            }}
                                            className={`${menuItemClass} text-red-400`}
                                        >
                                            Logout
                                        </motion.button>

                                    </motion.div>

                                )}
                            </AnimatePresence>

                        </div>

                    ) : (

                        <Link
                            to="/login"
                            className="
                                flex
                                h-10
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-blue-500
                                px-5
                                font-medium
                                text-blue-500
                                transition-colors
                                duration-200
                                hover:bg-blue-500/10
                            "
                        >
                            Sign In
                        </Link>

                    )}

                </div>

            </div>
        </header>
    );
}

export default Navbar;