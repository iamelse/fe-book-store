import { Link } from 'react-router-dom';

export default function LinkButton({
  text,
  to,
  variant = 'primary',
  className = '',
  disabled = false, // tambah prop disabled
}) {
  const baseClasses = "rounded-lg font-medium transition flex justify-center items-center";

  const variants = {
    primary: "bg-[#3e6dc8] hover:bg-[#345ab0] text-white px-4 py-2",
    secondary: "border border-[#3e6dc8] text-[#3e6dc8] hover:bg-[#e0e7ff] px-4 py-2",
    pagination: "border border-gray-300 text-gray-700 hover:bg-gray-100 px-2 py-2",
    disabled: "bg-gray-200 cursor-not-allowed text-gray-400 px-2 py-2",
  };

  const combinedClasses = `${baseClasses} ${disabled ? variants.disabled : variants[variant]} ${className}`;

  return (
    <Link
      to={disabled ? "#" : to}
      className={combinedClasses}
      onClick={e => disabled && e.preventDefault()}
    >
      <span>{text}</span>
    </Link>
  );
}