export default function StatusBadge({ status }) {
  const styles = {
    UP: "bg-emerald-400/10 text-emerald-300",
    DOWN: "bg-red-400/10 text-red-300",
    Active: "bg-emerald-400/10 text-emerald-300",
    Inactive: "bg-zinc-700 text-zinc-300",
    "Not checked": "bg-zinc-700 text-zinc-300",
  };

  const className =
    styles[status] || "bg-zinc-700 text-zinc-300";

  const dotColor =
    status === "UP" || status === "Active"
      ? "bg-emerald-400"
      : status === "DOWN"
        ? "bg-red-400"
        : "bg-zinc-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotColor}`}
      />
      {status}
    </span>
  );
}