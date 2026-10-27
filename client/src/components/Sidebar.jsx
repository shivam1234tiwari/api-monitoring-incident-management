import {
  Activity,
  LayoutDashboard,
  Server,
  Clock3,
  Settings,
  Zap,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "#dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Monitored APIs",
    href: "#apis",
    icon: Server,
  },
  {
    label: "Monitoring History",
    href: "#history",
    icon: Clock3,
  },
  {
    label: "Settings",
    href: "#settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-zinc-800 bg-[#0d1423] p-5 md:flex">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-400 p-2 text-zinc-950">
          <Activity size={23} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            PulseMonitor
          </h1>
          <p className="text-xs text-zinc-500">
            API observability
          </p>
        </div>
      </div>

      {/* Navigation */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Workspace
      </p>

      <nav className="space-y-2">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const isDashboard = index === 0;

          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                isDashboard
                  ? "bg-emerald-400/10 font-medium text-emerald-300"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Scheduler Info */}
      <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-2 flex items-center gap-2 text-emerald-300">
          <Zap size={17} />
          <span className="text-sm font-semibold">
            Monitoring scheduler
          </span>
        </div>

        <p className="text-xs leading-5 text-zinc-500">
          Scheduled health checks run from your backend.
        </p>
      </div>
    </aside>
  );
}