import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import batlogo from "../assets/batlogo.png";
import { registerUser } from "../api/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    coverImage: null,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.avatar) {
      setError("Avatar is required.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", formData.avatar);

      if (formData.coverImage) {
        data.append("coverImage", formData.coverImage);
      }

      await registerUser(data);

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed."
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
            alt="BatmanTV Logo"
            className="w-20 h-20 object-contain"
          />

          <h1 className="mt-5 text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-zinc-400">
            Join BatmanTV and start sharing videos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Full Name
            </label>

            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-zinc-700 bg-[#121212] px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:border-red-600"
            />
          </div>

          {/* Username */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Username
            </label>

            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              placeholder="Choose a username"
              className="w-full rounded-xl border border-zinc-700 bg-[#121212] px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:border-red-600"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Email
            </label>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-zinc-700 bg-[#121212] px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:border-red-600"
            />
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Password
            </label>

            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Create a password"
              className="w-full rounded-xl border border-zinc-700 bg-[#121212] px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:border-red-600"
            />
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Confirm Password
            </label>

            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-zinc-700 bg-[#121212] px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:border-red-600"
            />
          </div>

          {/* Avatar */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Avatar
            </label>

            <input
              name="avatar"
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-zinc-700 bg-[#121212] px-4 py-3 text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:px-4 file:py-2 file:text-white file:cursor-pointer hover:file:bg-red-700"
            />
          </div>

          {/* Cover Image */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Cover Image (Optional)
            </label>

            <input
              name="coverImage"
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-zinc-700 bg-[#121212] px-4 py-3 text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-700
               file:px-4 file:py-2 file:text-white file:cursor-pointer hover:file:bg-red-700"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-500">
              {success}
            </p>
          )}

          {/* Button */}

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-red-600 py-3.5 font-semibold text-white transition hover:bg-red-700"
          >

            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="mt-8 text-center text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-red-500 hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;