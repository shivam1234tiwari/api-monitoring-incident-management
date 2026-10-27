export default function StatCard({
  label,
  value,
  change,
  icon: Icon,
  trend = "up",
}) {
  const TrendIcon =
    trend === "up" ? "↗" : "↘";

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="mb-5 flex items-center justify-between gap-2">
        <p className="text-sm text-zinc-400">{label}</p>

        <div className="rounded-xl bg-zinc-800 p-2 text-emerald-300">
          {Icon && <Icon size={19} />}
        </div>
      </div>

      <p className="text-3xl font-bold tracking-tight">
        {value}
      </p>

      <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
        <span
          className={
            trend === "up"
              ? "text-emerald-400"
              : "text-red-400"
          }
        >
          {TrendIcon}
        </span>
        {change}
      </div>
    </article>
  );
}