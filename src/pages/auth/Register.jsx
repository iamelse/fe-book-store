import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input"; // <-- pakai komponen Input

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
                <Input
                  label="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />

                {/* Email */}
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="info@gmail.com"
                  required
                />

                {/* Password */}
                <Input
                  label="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  isPassword
                />

                {/* Confirm Password */}
                <Input
                  label="Confirm Password"
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  isPassword
                />

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