import { LoaderCircle } from "lucide-react";

export default function LoadingState({
  message = "Loading...",
}) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-zinc-400">
      <LoaderCircle size={18} className="animate-spin" />
      {message}
    </div>
  );
}