import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  isPassword = false,
  iconRight = null,       // ikon tambahan di kanan
  onIconClick = null,     // event klik ikon
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // Jika password dan ada iconRight, sisakan space untuk keduanya
  const paddingRightClass = isPassword || iconRight ? "pr-11" : "";

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border border-gray-300 shadow-xs dark:border-gray-700 bg-transparent px-4 py-2.5 ${paddingRightClass} text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3e6dc8] focus:border-[#3e6dc8] dark:text-white`}
        />

        {/* Password toggle */}
        {isPassword && (
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        )}

        {/* Right icon */}
        {!isPassword && iconRight && (
          <span
            onClick={onIconClick}
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
          >
            {iconRight}
          </span>
        )}
      </div>
    </div>
  );
}