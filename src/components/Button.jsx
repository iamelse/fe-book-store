import SpinnerButton from './SpinnerButton';

export default function Button({
  text,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  size = "sm",
  type = "button",
}) {
  const baseClasses =
    "px-5 py-2.5 rounded-lg font-medium transition flex justify-center items-center gap-2";

  const variants = {
    primary: "bg-[#3e6dc8] hover:bg-[#345ab0] text-white",
    secondary: "border border-[#3e6dc8] text-[#3e6dc8] hover:bg-[#e0e7ff]",
    "danger-outline": "border border-red-500 text-red-500 hover:bg-red-50",
  };

  const combinedClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${className}
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <SpinnerButton size={size} />
          <span>Loading...</span>
        </div>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
}