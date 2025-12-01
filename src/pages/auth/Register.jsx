import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  const schema = yup.object({
    name: yup.string().required("Nama wajib diisi"),
    email: yup.string().email("Email harus valid").required("Email wajib diisi"),
    password: yup
      .string()
      .required("Kata sandi wajib diisi")
      .min(6, "Kata sandi minimal 6 karakter"),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Konfirmasi kata sandi tidak cocok")
      .required("Konfirmasi kata sandi wajib diisi"),
  });

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

  const name = watch("name") || "";
  const email = watch("email") || "";
  const password = watch("password") || "";
  const passwordConfirmation = watch("passwordConfirmation") || "";

  const debounce = (field, value) => {
    if (!value) return;
    const t = setTimeout(() => trigger(field), 250);
    return () => clearTimeout(t);
  };

  useEffect(() => debounce("name", name), [name]);
  useEffect(() => debounce("email", email), [email]);
  useEffect(() => debounce("password", password), [password]);
  useEffect(() => debounce("passwordConfirmation", passwordConfirmation), [
    passwordConfirmation,
  ]);

  useEffect(() => {
    clearErrors("root");
  }, [name, email, password, passwordConfirmation]);

  // ⬇️ HANDLE SUCCESS + COUNTDOWN
  useEffect(() => {
    if (!successMessage) return;

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c === 1) {
          navigate("/login");
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [successMessage]);

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(
        data.name,
        data.email,
        data.password,
        data.passwordConfirmation
      );

      // SUCCESS
      if (res.success) {
        setSuccessMessage("Pendaftaran berhasil!");

        toast.success("Akun berhasil dibuat!", {
          duration: 3500,
        });
        return;
      }

      // 422 FIELD ERROR
      if (res.status === 422 && res.errors) {
        let hadFieldError = false;

        Object.entries(res.errors).forEach(([field, messages]) => {
          hadFieldError = true;
          setError(field, {
            type: "server",
            message: messages[0],
          });
        });

        if (hadFieldError) return;
      }

      // OTHER ERROR (401, 500, dll)
      setError("root", {
        type: "server",
        message: res.message || "Terjadi kesalahan",
      });

    } catch (err) {
      // CATCH: ERROR NETWORK ATAU EXCEPTION TIDAK TERDUGA
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
              Daftar
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400">
              Buat akun baru untuk melanjutkan
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
              <CheckCircle2 size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">
                {successMessage} • Mengalihkan dalam {countdown} detik…
              </span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {!successMessage && errors.root && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <AlertTriangle size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{errors.root.message}</span>
            </div>
          )}

          {/* FORM */}
          {!successMessage && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* NAME */}
              <div>
                <Input
                  label="Nama"
                  required
                  value={name}
                  onChange={(e) => setValue("name", e.target.value)}
                  placeholder="Nama lengkap"
                  className={errors.name ? "border-red-500 border" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">* {errors.name.message}</p>
                )}
              </div>

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
                  <p className="text-red-500 text-xs mt-1">* {errors.email.message}</p>
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
                  <p className="text-red-500 text-xs mt-1">* {errors.password.message}</p>
                )}
              </div>

              {/* CONFIRM */}
              <div>
                <Input
                  label="Konfirmasi Kata Sandi"
                  required
                  isPassword
                  value={passwordConfirmation}
                  onChange={(e) =>
                    setValue("passwordConfirmation", e.target.value)
                  }
                  placeholder="Ulangi kata sandi"
                  className={errors.passwordConfirmation ? "border-red-500 border" : ""}
                />
                {errors.passwordConfirmation && (
                  <p className="text-red-500 text-xs mt-1">
                    * {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>

              <Button
                text="Daftar"
                type="submit"
                className="w-full py-3"
                loading={isSubmitting}
              />
            </form>
          )}

          {/* FOOTER */}
          {!successMessage && (
            <div className="mt-8 text-center lg:text-left text-base text-gray-700 dark:text-gray-400">
              Sudah punya akun?{" "}
              <span
                className="text-[#3e6dc8] hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Masuk
              </span>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img
            src="https://ebooks.gramedia.com/static/media/newsletter.f5fd66b0b358130156f2.png"
            alt="Register Illustration"
            className="object-cover h-full w-full"
          />
        </div>

      </div>
    </div>
  );
}