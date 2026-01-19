import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../context/authSlice";
import loginImg from "../../images/Illustration.png";
import login4 from "../../images/login4.png";
import login5 from "../../images/login5.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    gsap.from(".login-box", { opacity: 0, y: 50, duration: 1 });
  }, []);

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

    const staticCredentials = {
  email: "admin@gmail.com",
  password: "admin1122",
};


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      staticCredentials
    );

      const { token, user } = response.data;

      // ✅ Merge token with user and save as userInfo
      const userInfo = { ...user, token };

      // ✅ Store in Redux (will also store in localStorage via authSlice)
      dispatch(loginSuccess(userInfo));

      // ✅ Toast and redirect
      toast.success("Logged in successfully 🎉");
      console.log("Stored userInfo:", userInfo);

      navigate("/admin");

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-white">
      {/* Left: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-12 xl:px-16">
        {/* Glassmorphism Container */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
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
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2 text-center">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
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
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9dd945] focus:border-transparent transition-all bg-white hover:bg-gray-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 text-sm font-semibold">
                  Password
                </label>
              </div>
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
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9dd945] focus:border-transparent transition-all bg-white hover:bg-gray-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="text-right mt-1">
                <a
                  href="#"
                  className="text-sm text-[#9dd945] hover:text-[#7ab82e] font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-5 w-5 text-[#9dd945] focus:ring-2 focus:ring-[#9dd945] border-gray-300 rounded transition-colors cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm text-gray-700 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#9dd945] to-[#7ab82e] hover:from-[#8bcf3a] hover:to-[#6aa827] text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-[#9dd945]/30 hover:shadow-xl hover:shadow-[#9dd945]/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              Sign In
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#9dd945] hover:text-[#7ab82e] font-semibold transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Image Carousel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* Carousel Container */}
        <div className="relative w-full h-full">
          {/* Image 1 */}
          <div className={imageClasses(0)}>
            <div className="relative max-w-3xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#9dd945]/10 to-[#7ab82e]/10 rounded-3xl blur-xl"></div>
              <img
                src={loginImg}
                alt="Productivity Dashboard"
                className="relative w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Monitor your performance with comprehensive dashboards and
                  insights
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
                alt="Team Collaboration"
                className="relative w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Team Collaboration
                </h3>
                <p className="text-gray-600 text-sm">
                  Work seamlessly with your team using integrated collaboration
                  tools
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
                alt="Data Security"
                className="relative w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Enterprise Security
                </h3>
                <p className="text-gray-600 text-sm">
                  Your data is protected with bank-level encryption and security
                  protocols
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

export default Login;
