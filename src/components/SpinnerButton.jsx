export default function SpinnerButton({ size = "md" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-6 h-6 border-4",
  };

  return (
    <div
      className={`${sizes[size]} border-t-transparent border-current rounded-full animate-spin`}
    />
  );
}