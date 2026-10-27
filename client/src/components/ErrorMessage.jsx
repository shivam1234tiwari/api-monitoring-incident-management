export default function ErrorMessage({
  message,
  onRetry,
}) {
  if (!message) return null;

  return (
    <div className="m-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
      <p className="font-semibold">
        Something went wrong
      </p>

      <p className="mt-1">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg border border-red-400/30 px-3 py-2 hover:bg-red-500/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}