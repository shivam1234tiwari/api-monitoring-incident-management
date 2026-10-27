
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Globe,
  RefreshCw,
  Zap,
  Plus,
  ExternalLink,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import StatusBadge from "./components/StatusBadge";
import LoadingState from "./components/LoadingState";
import ErrorMessage from "./components/ErrorMessage";
import AddApiForm from "./components/AddApiForm";

import {
  getMonitoredAPIs,
  getMonitoringHistory,
  runHealthCheck,
} from "./api";

const getResponseData = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.apis)) return response.apis;
  return [];
};

const getApiId = (api) => api?._id || api?.id;

const getStatus = (result) => {
  const status = result?.status || result?.healthStatus;
  if (typeof status === "string") return status.toUpperCase();
  if (result?.success === true) return "UP";
  return "UNKNOWN";
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString();
};

const formatResponseTime = (value) => {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  return `${value} ms`;
};

export default function App() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [checkingId, setCheckingId] = useState(null);

  const fetchAPIs = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setRefreshing(true);
    }

    setPageError("");

    try {
      const response = await getMonitoredAPIs();
      const apiList = getResponseData(response);

      const apiWithHistory = await Promise.all(
        apiList.map(async (api) => {
          try {
            const historyResponse = await getMonitoringHistory(
              getApiId(api)
            );

            const history = getResponseData(historyResponse).sort(
              (a, b) =>
                new Date(b.checkedAt || b.createdAt || b.timestamp || 0) -
                new Date(a.checkedAt || a.createdAt || a.timestamp || 0)
            );

            return {
              ...api,
              history,
              latestResult: history[0] || api.latestResult || null,
            };
          } catch {
            return {
              ...api,
              history: [],
              latestResult: api.latestResult || null,
            };
          }
        })
      );

      setApis(apiWithHistory);
    } catch (error) {
      setPageError(error.message || "Failed to load monitored APIs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAPIs();
  }, [fetchAPIs]);

  const handleHealthCheck = async (api) => {
    const id = getApiId(api);

    if (!id) {
      setActionError("API ID not found.");
      return;
    }

    setCheckingId(id);
    setActionError("");

    try {
      await runHealthCheck(id);
      await fetchAPIs();
    } catch (error) {
      setActionError(error.message || "Health check failed.");
    } finally {
      setCheckingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = apis.length;

    const up = apis.filter(
      (api) => getStatus(api.latestResult) === "UP"
    ).length;

    const down = apis.filter(
      (api) => getStatus(api.latestResult) === "DOWN"
    ).length;

    const responseTimes = apis
      .map((api) => {
        const value =
          api.latestResult?.responseTime ??
          api.latestResult?.responseTimeMs;

        return Number(value);
      })
      .filter((value) => Number.isFinite(value) && value >= 0);

    const averageResponseTime = responseTimes.length
      ? Math.round(
          responseTimes.reduce((sum, value) => sum + value, 0) /
            responseTimes.length
        )
      : 0;

    return { total, up, down, averageResponseTime };
  }, [apis]);

  const allHistory = useMemo(() => {
    return apis
      .flatMap((api) =>
        (api.history || []).map((item) => ({
          ...item,
          apiName: api.name || api.url || "Unnamed API",
          apiId: getApiId(api),
        }))
      )
      .sort(
        (a, b) =>
          new Date(b.checkedAt || b.createdAt || b.timestamp || 0) -
          new Date(a.checkedAt || a.createdAt || a.timestamp || 0)
      )
      .slice(0, 20);
  }, [apis]);

  const handleApiCreated = async () => {
    await fetchAPIs();
  };

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      <Sidebar />

      <main className="min-h-screen px-5 py-7 md:ml-64 md:px-8 lg:px-10">
        {/* Dashboard header */}
        <header
          id="dashboard"
          className="mb-8 flex scroll-mt-6 flex-col justify-between gap-5 sm:flex-row sm:items-center"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-cyan-400">
              <Activity size={17} />
              API MONITORING PLATFORM
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Monitoring Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Monitor API availability and response performance.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              <Plus size={18} />
              Add API
            </button>

            <button
              onClick={() => fetchAPIs(true)}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </header>

        <ErrorMessage
          message={pageError}
          onRetry={() => fetchAPIs(true)}
        />

        {actionError && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{actionError}</span>
            <button
              onClick={() => setActionError("")}
              className="font-semibold hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats */}
        <section className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total APIs"
            value={stats.total}
            change="Registered endpoints"
            icon={Globe}
            trend="up"
          />

          <StatCard
            label="APIs Operational"
            value={stats.up}
            change="Latest status: UP"
            icon={ArrowUpRight}
            trend="up"
          />

          <StatCard
            label="APIs Down"
            value={stats.down}
            change="Latest status: DOWN"
            icon={ArrowDownRight}
            trend="down"
          />

          <StatCard
            label="Avg Response Time"
            value={`${stats.averageResponseTime} ms`}
            change="Based on latest results"
            icon={Clock3}
            trend="up"
          />
        </section>

        {/* Monitored APIs */}
        <section
          id="apis"
          className="mb-9 scroll-mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1423]"
        >
          <div className="flex flex-col justify-between gap-3 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Monitored APIs</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your registered endpoints and their latest health status.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 self-start rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 sm:self-auto"
            >
              <Plus size={16} />
              Add endpoint
            </button>
          </div>

          {loading ? (
            <div className="p-8">
              <LoadingState message="Loading monitored APIs..." />
            </div>
          ) : apis.length === 0 ? (
            <div className="p-10 text-center">
              <Globe className="mx-auto mb-3 text-slate-500" size={35} />
              <h3 className="font-semibold text-slate-200">
                No APIs registered yet
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Add your first API to start monitoring.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-5 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                + Add your first API
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-medium">API</th>
                    <th className="px-5 py-4 font-medium">Method</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Response</th>
                    <th className="px-5 py-4 font-medium">Interval</th>
                    <th className="px-5 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {apis.map((api) => {
                    const status = getStatus(api.latestResult);
                    const id = getApiId(api);
                    const active = api.active !== false &&
                      api.isActive !== false;

                    return (
                      <tr
                        key={id || api.url}
                        className="transition hover:bg-slate-900/50"
                      >
                        <td className="max-w-[280px] px-5 py-4">
                          <p className="truncate font-medium text-slate-100">
                            {api.name || "Unnamed API"}
                          </p>
                          <a
                            href={api.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 flex max-w-[260px] items-center gap-1 truncate text-xs text-slate-500 hover:text-cyan-400"
                            title={api.url}
                          >
                            <span className="truncate">{api.url}</span>
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-semibold">
                            {api.method || "GET"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {active ? (
                            <StatusBadge status={status} />
                          ) : (
                            <StatusBadge status="Inactive" />
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {formatResponseTime(
                            api.latestResult?.responseTime ??
                              api.latestResult?.responseTimeMs
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {api.interval ?? "—"} min
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleHealthCheck(api)}
                            disabled={
                              checkingId === id ||
                              !active ||
                              !id
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-cyan-500 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Zap
                              size={14}
                              className={
                                checkingId === id ? "animate-pulse" : ""
                              }
                            />
                            {checkingId === id
                              ? "Checking..."
                              : "Check now"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Monitoring History */}
        <section
          id="history"
          className="mb-9 scroll-mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1423]"
        >
          <div className="border-b border-slate-800 p-5">
            <h2 className="text-lg font-semibold">Monitoring History</h2>
            <p className="mt-1 text-sm text-slate-400">
              The latest recorded health checks across your APIs.
            </p>
          </div>

          {loading ? (
            <div className="p-8">
              <LoadingState message="Loading monitoring history..." />
            </div>
          ) : allHistory.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No monitoring history available yet. Run a health check to
              create the first record.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-medium">API</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Response Time</th>
                    <th className="px-5 py-4 font-medium">Checked At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {allHistory.map((item, index) => (
                    <tr
                      key={item._id || item.id || `${item.apiId}-${index}`}
                      className="hover:bg-slate-900/50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-200">
                        {item.apiName}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={getStatus(item)} />
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {formatResponseTime(
                          item.responseTime ?? item.responseTimeMs
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {formatDate(
                          item.checkedAt || item.createdAt || item.timestamp
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Settings */}
        <section
          id="settings"
          className="mb-8 scroll-mt-6 rounded-2xl border border-slate-800 bg-[#0d1423] p-5 sm:p-6"
        >
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="mt-1 text-sm text-slate-400">
            Current monitoring configuration.
          </p>

          <div className="mt-5 divide-y divide-slate-800">
            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Monitoring scheduler</p>
                <p className="mt-1 text-sm text-slate-500">
                  Scheduled checks are managed by the backend.
                </p>
              </div>
              <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Backend managed
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">API base URL</p>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {import.meta.env.VITE_API_BASE_URL ||
                    "http://localhost:5000/api"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium">Registered endpoints</p>
                <p className="mt-1 text-sm text-slate-500">
                  APIs currently loaded from the backend.
                </p>
              </div>
              <span className="text-xl font-bold text-cyan-400">
                {stats.total}
              </span>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
          API Monitoring Platform · Real-time endpoint visibility
        </footer>
      </main>

      {/* Add API modal */}
      {showAddForm && (
        <AddApiForm
          onClose={() => setShowAddForm(false)}
          onCreated={handleApiCreated}
        />
      )}
    </div>
  );
}
