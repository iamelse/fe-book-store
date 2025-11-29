import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SelectInput({
  label,
  value,
  onChange,
  options = [],        // array of { label, value }
  placeholder = "Select Option",
  required = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onChange && onChange(e);
  };

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative z-20 bg-transparent">
        <select
          value={value}
          onChange={handleChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-[#3e6dc8] focus:border-[#3e6dc8] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 appearance-none ${
            value ? "text-gray-800 dark:text-white/90" : ""
          }`}
        >
          <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <span
          className={`pointer-events-none absolute top-1/2 right-4 z-30 -translate-y-1/2 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isFocused ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown size={20} />
        </span>
      </div>
    </div>
  );
}