import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
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
                  Masuk
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Masukkan email dan kata sandi Anda untuk masuk
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
                    Kata Sandi<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3e6dc8]/50 focus:outline-none dark:text-white"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                    Ingat saya
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[#3e6dc8] hover:text-[#345ba3]"
                  >
                    Lupa kata sandi?
                  </button>
                </div>

                {/* Submit */}
                <Button
                  text="Masuk"
                  type="submit"
                  className="w-full"
                  loading={loading}
                />
              </form>

              {/* Register */}
              <div className="mt-5 text-center text-sm text-gray-700 dark:text-gray-400">
                Belum punya akun?{" "}
                <span
                  className="text-[#3e6dc8] hover:underline cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Daftar
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
              Template Dashboard Admin Tailwind CSS Gratis & Open-Source
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}