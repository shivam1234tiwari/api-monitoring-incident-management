
import cron from "node-cron";
import MonitoredAPI from "../models/MonitoredAPI.js";
import { checkAPIHealth } from "./healthCheckService.js";
import MonitoringResult from "../models/MonitoringResult.js";

let isMonitoringRunning = false;

export const startMonitoringScheduler = () => {
  cron.schedule("* * * * *", async () => {
    if (isMonitoringRunning) {
      console.log("Previous monitoring cycle is still running.");
      return;
    }

    isMonitoringRunning = true;

    try {
      console.log("Running scheduled API health checks...");

      const monitoredAPIs = await MonitoredAPI.find({
        isActive: true,
      });

      for (const api of monitoredAPIs) {
        try {
          const latestResult = await MonitoringResult.findOne({
            monitoredAPI: api._id,
          }).sort({ checkedAt: -1 });

          const intervalMinutes = api.interval || 60;
          const intervalMs = intervalMinutes * 60 * 1000;

          const lastCheckedAt = latestResult
            ? new Date(latestResult.checkedAt).getTime()
            : 0;

          if (Date.now() - lastCheckedAt < intervalMs) {
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
        } catch (error) {
          console.error(
            `Monitoring failed for ${api.name}:`,
            error.message
          );
        }
      }
    } catch (error) {
      console.error("Scheduled monitoring failed:", error.message);
    } finally {
      isMonitoringRunning = false;
    }
  });

  console.log("Monitoring scheduler started.");
};
