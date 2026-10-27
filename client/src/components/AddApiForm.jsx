
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { createMonitoredAPI } from "../api";

export default function AddApiForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    url: "",
    method: "GET",
    interval: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      new URL(form.url);
    } catch {
      setError("Please enter a valid API URL.");
      return;
    }

    setLoading(true);

    try {
      await createMonitoredAPI({
        ...form,
        interval: Number(form.interval),
        active: true,
      });

      await onCreated();
      onClose();
    } catch (err) {
      setError(err.message || "Unable to add API.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#101827] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Add Monitored API</h2>
            <p className="mt-1 text-sm text-slate-400">
              Register an endpoint to monitor.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              API Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Movie Booking API"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              API URL
            </label>
            <input
              name="url"
              type="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://example.com/api/health"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                HTTP Method
              </label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className={inputClass}
              >
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Interval (minutes)
              </label>
              <select
                name="interval"
                value={form.interval}
                onChange={handleChange}
                className={inputClass}
              >
                {[10, 15, 30, 60].map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} minutes
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              <Plus size={17} />
              {loading ? "Saving..." : "Save API"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
