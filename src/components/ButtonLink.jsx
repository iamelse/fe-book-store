import { Link } from 'react-router-dom';

export default function LinkButton({
  text,
  to,
  variant = 'primary',
  className = '',
}) {
  const baseClasses = "px-5 py-2.5 rounded-lg font-medium transition flex justify-center items-center";

  const variants = {
    primary: "bg-[#3e6dc8] hover:bg-[#345ab0] text-white",
    secondary: "border border-[#3e6dc8] text-[#3e6dc8] hover:bg-[#e0e7ff]",
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <Link to={to} className={combinedClasses}>
      <span>{text}</span>
    </Link>
  );
}