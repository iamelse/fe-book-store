import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Password and confirmation do not match");
      return;
    }

    try {
      const res = await register(name, email, password, passwordConfirmation);
      if (res.success) {
        setSuccess(res.message);
        navigate("/login");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
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
                  Create Account
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill in the form below to create your account.
                </p>
              </div>

              {/* ERROR / SUCCESS */}
              {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
              {success && <p className="text-green-500 text-sm text-center mb-3">{success}</p>}

              {/* REGISTER FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3e6dc8]/50 focus:outline-none dark:text-white"
                  />
                </div>

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
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={passwordConfirmation}
                    onChange={e => setPasswordConfirmation(e.target.value)}
                    required
                    className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3e6dc8]/50 focus:outline-none dark:text-white"
                  />
                </div>

                {/* Submit */}
                <Button
                  text="Register"
                  type="submit"
                  className="w-full"
                />
              </form>

              {/* Redirect to login */}
              <div className="mt-5 text-center text-sm text-gray-700 dark:text-gray-400">
                Already have an account?{" "}
                <span
                  className="text-[#3e6dc8] hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Decoration / Branding) */}
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