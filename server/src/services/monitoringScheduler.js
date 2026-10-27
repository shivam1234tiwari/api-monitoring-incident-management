
import cron from "node-cron";
import MonitoredAPI from "../models/MonitoredAPI.js";
import { checkAPIHealth } from "./healthCheckService.js";
import MonitoringResult from "../models/MonitoringResult.js";

export const startMonitoringScheduler = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running scheduled API health checks...");

    try {
      const monitoredAPIs = await MonitoredAPI.find({
        isActive: true,
      });

      const now = Date.now();

      for (const api of monitoredAPIs) {
        const latestResult = await MonitoringResult.findOne({
          monitoredAPI: api._id,
        }).sort({ checkedAt: -1 });

        const intervalMs = (api.interval || 60) * 60 * 1000;

        const isDue =
          !latestResult ||
          now - new Date(latestResult.checkedAt).getTime() >= intervalMs;

        if (!isDue) {
          continue;
        }

        const result = await checkAPIHealth(api.url, api.method);

        await MonitoringResult.create({
          monitoredAPI: api._id,
          status: result.status,
          statusCode: result.statusCode,
          responseTime: result.responseTime,
          error: result.error ?? null,
          checkedAt: result.checkedAt,
        });

        console.log(
          `${api.name}: ${result.status} (${result.responseTime}ms)`
        );
      }
    } catch (error) {
      console.error("Scheduled monitoring failed:", error.message);
    }
  });

  console.log("Monitoring scheduler started.");
};
