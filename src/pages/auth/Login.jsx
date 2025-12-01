import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // VALIDATION SCHEMA
  const schema = yup.object({
    email: yup.string().email("Email harus valid").required("Email wajib diisi"),
    password: yup
      .string()
      .required("Kata sandi wajib diisi")
  });

  // REACT HOOK FORM
  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  // WATCH VALUES
  const email = watch("email") || "";
  const password = watch("password") || "";

  // DEBOUNCE EMAIL
  useEffect(() => {
    if (!email) return;
    const t = setTimeout(() => trigger("email"), 300);
    return () => clearTimeout(t);
  }, [email]);

  // DEBOUNCE PASSWORD
  useEffect(() => {
    if (!password) return;
    const t = setTimeout(() => trigger("password"), 300);
    return () => clearTimeout(t);
  }, [password]);

  // CLEAR GLOBAL ERROR WHEN TYPING
  useEffect(() => {
    clearErrors("root");
  }, [email, password]);

  // SUBMIT HANDLER
  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);

      toast.success("Berhasil masuk!", {
        duration: 3500,
      });

      // delay sedikit biar toast kebaca
      setTimeout(() => navigate("/"), 500);

    } catch (err) {

      // 422 → field errors
      if (err.status === 422 && err.errors) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          setError(field, {
            type: "server",
            message: messages[0],
          });
        });
        return;
      }

      // 401 → invalid credentials
      if (err.status === 401) {
        setError("root", {
          type: "server",
          message: err.message || "Email atau kata sandi salah",
        });
        return;
      }

      // others
      setError("root", {
        type: "server",
        message: err.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center px-6">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl border rounded-4xl overflow-hidden bg-white">
        
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-16 flex flex-col justify-center">

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-5xl font-semibold text-gray-800 dark:text-white mb-3">
              Masuk
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400">
              Masukkan email dan kata sandi Anda untuk masuk
            </p>
          </div>

          {/* GLOBAL ERROR (401, server error, etc) */}
          {errors.root && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <AlertTriangle size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{errors.root.message}</span>
            </div>
          )}


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* EMAIL */}
            <div>
              <Input
                label="Email"
                required
                type="email"
                value={email}
                onChange={(e) => setValue("email", e.target.value)}
                placeholder="info@gmail.com"
                className={errors.email ? "border-red-500 border" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  * {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <Input
                label="Kata Sandi"
                required
                isPassword
                value={password}
                onChange={(e) => setValue("password", e.target.value)}
                placeholder="Masukkan kata sandi"
                className={errors.password ? "border-red-500 border" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  * {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-base">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[#3e6dc8] hover:text-[#345ba3]"
              >
                Lupa kata sandi?
              </button>
            </div>

            <Button
              text="Masuk"
              type="submit"
              className="w-full py-3"
              loading={isSubmitting}
            />
          </form>

          <div className="mt-8 text-center lg:text-left text-base text-gray-700 dark:text-gray-400">
            Belum punya akun?{" "}
            <span
              className="text-[#3e6dc8] hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Daftar
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img
            src="https://ebooks.gramedia.com/static/media/newsletter.f5fd66b0b358130156f2.png"
            alt="Login Illustration"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}