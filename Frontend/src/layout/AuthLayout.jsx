import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-[#0f0f0f]">
      <Outlet />
    </div>
  );
}

export default AuthLayout;