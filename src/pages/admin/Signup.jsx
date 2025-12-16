import { useEffect } from "react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImg from "../../images/Illustration.png";
import login4 from "../../images/login4.png";
import login5 from "../../images/login5.png";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "user",
    password: "",
    confirm: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Inside your component
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 3000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Update the carousel images with dynamic opacity
  const imageClasses = (index) =>
    `absolute inset-0 flex items-center justify-center p-12 transition-all duration-1000 ease-in-out ${
      currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
    }`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    if (
      !form.name ||
      !form.username ||
      !form.email ||
      !form.role ||
      !form.password ||
      !form.confirm
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!form.agree) {
      toast.error("You must agree to the terms and privacy policy.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          username: form.username,
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }
      );
      console.log(response.data.user);
      toast.success("Signup successful!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-white">
      {/* Left: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24">
        {/* Glassmorphism Container */}
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#9dd945] to-[#7ab82e] flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-[#9dd945]/20">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2 text-center">
              Join us and start your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex col-2 gap-4 w-full">
              {/* Full Name */}
              <div className="space-y-2 w-full">
                <label className="block text-gray-700 text-sm font-semibold">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-[#9dd945] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9dd945] focus:border-transparent transition-all bg-white hover:bg-gray-50"
                    placeholder="Jiangyu"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2 w-full">
                <label className="block text-gray-700 text-sm font-semibold">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-[#9dd945] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9dd945] focus:border-transparent transition-all bg-white hover:bg-gray-50"
                    placeholder="johnkevine4362"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex col-2 gap-4 w-full">
              {/* Email */}
              <div className="space-y-2 w-full">
                <label className="block text-gray-700 text-sm font-semibold">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-[#9dd945] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9dd945] focus:border-transparent transition-all bg-white hover:bg-gray-50"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2 w-full">
                <label className="block text-gray-700 text-sm font-semibold">
                  Role
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-[#9dd945] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9dd945] focus:border-transparent transition-all bg-white hover:bg-gray-50 appearance-none"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex col-2 gap-4 w-full">
              {/* Password */}
              <div className="space-y-2 w-full">
                <label className="block text-gray-700 text-sm font-semibold">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-[#9dd945] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9dd945] focus:border-transparent transition-all bg-white hover:bg-gray-50"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 w-full">
                <label className="block text-gray-700 text-sm font-semibold">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-[#9dd945] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9dd945] focus:border-transparent transition-all bg-white hover:bg-gray-50"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="h-5 w-5 text-[#9dd945] focus:ring-2 focus:ring-[#9dd945] border-gray-300 rounded transition-colors cursor-pointer mt-1"
                required
              />
              <span className="text-sm text-gray-600">
                By creating an account you agree to the{" "}
                <a
                  href="#"
                  className="text-[#9dd945] hover:text-[#7ab82e] font-medium"
                >
                  terms of use
                </a>{" "}
                and our{" "}
                <a
                  href="#"
                  className="text-[#9dd945] hover:text-[#7ab82e] font-medium"
                >
                  privacy policy
                </a>
                .
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#9dd945] to-[#7ab82e] hover:from-[#8bcf3a] hover:to-[#6aa827] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-[#9dd945]/30 hover:shadow-xl hover:shadow-[#9dd945]/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-[#9dd945] hover:text-[#7ab82e] font-semibold transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Image Carousel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* Carousel Container - Use same image imports as login page */}
        <div className="relative w-full h-full">
          {/* Image 1 */}
          <div className={imageClasses(0)}>
            <div className="relative max-w-3xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#9dd945]/10 to-[#7ab82e]/10 rounded-3xl blur-xl"></div>
              <img
                src={loginImg}
                alt="Welcome to Our Community"
                className="relative w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Join Our Growing Community
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect with thousands of users and enhance your productivity
                </p>
              </div>
            </div>
          </div>

          {/* Image 2 */}
          <div className={imageClasses(1)}>
            <div className="relative max-w-[700px]">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#9dd945]/10 to-[#7ab82e]/10 rounded-3xl blur-xl"></div>
              <img
                src={login4}
                alt="Start Your Journey"
                className="relative w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Start Your Journey Today
                </h3>
                <p className="text-gray-600 text-sm">
                  Get access to powerful tools and features from day one
                </p>
              </div>
            </div>
          </div>

          {/* Image 3 */}
          <div className={imageClasses(2)}>
            <div className="relative max-w-[700px]">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#9dd945]/10 to-[#7ab82e]/10 rounded-3xl blur-xl"></div>
              <img
                src={login5}
                alt="Secure Your Future"
                className="relative w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Secure Your Digital Future
                </h3>
                <p className="text-gray-600 text-sm">
                  Your data is protected with enterprise-grade security
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          <button className="w-3 h-3 rounded-full bg-[#9dd945] transition-all duration-300"></button>
          <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300"></button>
          <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300"></button>
        </div>

        {/* Timer Progress Bar */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#9dd945] rounded-full animate-carousel-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
