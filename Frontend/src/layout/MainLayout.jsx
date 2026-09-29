import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-black text-white">

            <Navbar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex pt-16">
                <Sidebar isSidebarOpen={isSidebarOpen} />

                <main
                    className={`
                        flex-1
                        p-6
                        transition-all
                        duration-300
                        ${isSidebarOpen ? "ml-64" : "ml-20"}
                    `}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
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
                                y: -4,
                            }}
                            transition={{
                                duration: 0.22,
                                ease: "easeOut",
                            }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;