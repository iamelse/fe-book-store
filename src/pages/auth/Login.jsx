import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="relative z-1 bg-white dark:bg-gray-900">
      <div className="relative flex h-screen w-full flex-col justify-center lg:flex-row dark:bg-gray-900">

        {/* LEFT SIDE (FORM) */}
        <div className="flex w-full flex-1 flex-col lg:w-1/2">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6">
            <div>
              <div className="mb-6 sm:mb-8">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="info@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3e6dc8]/50 focus:outline-none dark:text-white"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3e6dc8]/50 focus:outline-none dark:text-white"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                    >
                      {showPassword ? (
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M4.638 3.577a.708.708 0 0 0-1.06 0 .708.708 0 0 0 0 1.06l1.276 1.276C3.746 6.842 2.894 8.064 2.415 9.459c-.054.158-.054.329 0 .486 1.08 3.15 4.067 5.416 7.585 5.416 1.255 0 2.442-.288 3.5-.802l1.863 1.863a.75.75 0 1 0 1.06-1.06L4.638 3.577Z" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 4.043C6.482 4.043 3.495 6.309 2.415 9.459a.743.743 0 0 0 0 .486C3.495 13.096 6.482 15.362 10 15.362c3.518 0 6.505-2.266 7.585-5.416a.743.743 0 0 0 0-.486C16.505 6.309 13.518 4.043 10 4.043Zm0 9.819a3.118 3.118 0 1 1 0-6.236 3.118 3.118 0 0 1 0 6.236Z" />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-700 dark:text-gray-400">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#3e6dc8] focus:ring-[#3e6dc8]"
                    />
                    Keep me logged in
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[#3e6dc8] hover:text-[#345ba3]"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="bg-[#3e6dc8] hover:bg-[#345ba3] flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition"
                >
                  Sign In
                </button>
              </form>

              {/* Register */}
              <div className="mt-5 text-center text-sm text-gray-700 dark:text-gray-400">
                Don't have an account?{" "}
                <span
                  className="text-[#3e6dc8] hover:underline cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Decoration / branding) */}
        <div className="bg-[#3e6dc8] hidden lg:flex w-1/2 items-center justify-center relative">
          <div className="text-center text-white px-8 max-w-xs">
            <img
              src="/logo.svg"
              alt="Logo"
              className="mx-auto mb-4 w-16 h-16"
            />
            <p className="text-white/90">
              Free and Open-Source Tailwind CSS Admin Dashboard Template
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}