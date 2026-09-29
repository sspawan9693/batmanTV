import { NavLink } from "react-router-dom";

import {
  House,
  History,
  Heart,
  LayoutDashboard,
  Bird,
  ListVideo,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: House,
  },
  {
    name: "Liked Videos",
    path: "/liked-videos",
    icon: Heart,
  },
  {
    name: "Playlists",
    path: "/playlists",
    icon: ListVideo,
  },
  {
    name: "Tweets",
    path: "/tweets",
    icon: Bird,
  },
  {
    name: "History",
    path: "/history",
    icon: History,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
];

function Sidebar({ isSidebarOpen }) {
  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen ? 256 : 80,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="
        fixed
        left-0
        top-16
        z-30
        h-[calc(100vh-64px)]
        overflow-y-auto
        overflow-x-visible
        bg-[#0f0f0f]
        py-4
        scrollbar-hide
      "
    >
      <nav className="flex flex-col gap-1 px-3">

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
            >
              {({ isActive }) => (
                <motion.div
                  initial={false}
                  whileHover={{
                    x: 4,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className={`
                    group
                    relative
                    flex
                    h-11
                    cursor-pointer
                    select-none
                    items-center
                    rounded-xl
                    px-4
                    ${
                      isSidebarOpen
                        ? "gap-5"
                        : "justify-center"
                    }
                    ${
                      isActive
                        ? "bg-[#272727] font-semibold text-white"
                        : "text-zinc-300 hover:bg-[#272727] hover:text-white"
                    }
                  `}
                >

                  {/* ACTIVE INDICATOR */}

                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          scaleY: 0,
                        }}
                        animate={{
                          opacity: 1,
                          scaleY: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scaleY: 0,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="
                          absolute
                          left-0
                          h-6
                          w-1
                          origin-center
                          rounded-r-full
                          bg-white
                        "
                      />
                    )}
                  </AnimatePresence>

                  {/* ICON */}

                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    }}
                    className="shrink-0"
                  >
                    <Icon
                      size={22}
                      strokeWidth={2.2}
                    />
                  </motion.div>

                  {/* LABEL */}

                  <AnimatePresence initial={false}>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          width: 0,
                          x: -8,
                        }}
                        animate={{
                          opacity: 1,
                          width: "auto",
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          width: 0,
                          x: -8,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="
                          overflow-hidden
                          whitespace-nowrap
                          text-[15px]
                          tracking-wide
                        "
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* COLLAPSED TOOLTIP */}

                  <AnimatePresence>
                    {!isSidebarOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          x: -5,
                        }}
                        whileHover={{
                          opacity: 1,
                          x: 5,
                        }}
                        className="
                          pointer-events-none
                          absolute
                          left-16
                          z-50
                          whitespace-nowrap
                          rounded-md
                          bg-[#272727]
                          px-3
                          py-2
                          text-sm
                          text-white
                          shadow-lg
                        "
                      >
                        {item.name}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* COPYRIGHT */}

      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 8,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="
              absolute
              bottom-4
              left-0
              right-0
              text-center
              pointer-events-none
            "
          >
            <span className="text-xs text-zinc-600">
              © Sharma28
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.aside>
  );
}

export default Sidebar;