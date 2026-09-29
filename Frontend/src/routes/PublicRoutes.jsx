import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoutes = () => {
    const {
        isAuthenticated,
        authLoading,
    } = useSelector((state) => state.auth);

    // Wait until authentication restoration is complete
    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
            </div>
        );
    }

    return !isAuthenticated
        ? <Outlet />
        : <Navigate to="/" replace />;
};

export default PublicRoutes;