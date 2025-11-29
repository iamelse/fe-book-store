export default function SpinnerButton({ size = 4 }) {
  return (
    <div
      className={`w-${size} h-${size} me-1 border-2 border-t-2 border-t-transparent border-current rounded-full animate-spin`}
    />
  );
}