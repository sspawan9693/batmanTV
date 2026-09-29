import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import batlogo from "../assets/batlogo.png";
import { loginUser } from "../api/auth";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const credentials = formData.identifier.includes("@")
        ? {
          email: formData.identifier,
          password: formData.password,
        }
        : {
          username: formData.identifier,
          password: formData.password,
        };

      const response = await loginUser(credentials);

      dispatch(login(response.user));

      navigate("/", { replace: true });

      console.log("User stored in Redux:", response.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email: "demo@batmantv.com",
        password: "demo123",
      });

      dispatch(login(response.user));

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Demo login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#181818] p-10">
        {/* Logo */}

        <div className="flex flex-col items-center mb-10">
          <img
            src={batlogo}
            alt="BatmanTV"
            className="w-20 h-20 object-contain"
          />

          <h1 className="mt-5 text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-zinc-400">
            Sign in to continue to BatmanTV
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Email or Username
            </label>

            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-[#121212]
                px-4
                py-3.5
                text-white
                placeholder:text-zinc-500
                outline-none
                transition
                focus:border-red-600
              "
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-[#121212]
                px-4
                py-3.5
                text-white
                placeholder:text-zinc-500
                outline-none
                transition
                focus:border-red-600
              "
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-red-600
              py-3.5
              font-semibold
              text-white
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:bg-red-400
            "
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500">OR</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="
    w-full
    rounded-xl
    border
    border-zinc-700
    bg-zinc-900
    py-3.5
    font-semibold
    text-white
    transition
    hover:bg-zinc-800
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
          >
            Continue as Demo User
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-red-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;