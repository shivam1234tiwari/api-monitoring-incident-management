
import MonitoredAPI from "../models/MonitoredAPI.js";
import MonitoringResult from "../models/MonitoringResult.js";
import { checkAPIHealth } from "../services/healthCheckService.js";

export const runHealthCheck = async (req, res) => {
  try {
    const { id } = req.params;

    const monitoredAPI = await MonitoredAPI.findById(id);

    if (!monitoredAPI) {
      return res.status(404).json({
        success: false,
        message: "Monitored API not found",
      });
    }

    const result = await checkAPIHealth(
      monitoredAPI.url,
      monitoredAPI.method
    );

    const monitoringData = await MonitoringResult.create({
      monitoredAPI: monitoredAPI._id,
      status: result.status,
      statusCode: result.statusCode,
      responseTime: result.responseTime,
      error: result.error ?? null,
      checkedAt: result.checkedAt,
    });

    return res.status(200).json({
      success: true,
      message: "Health check completed and result saved",
      api: monitoredAPI.name,
      result: monitoringData,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid API ID",
      });
    }

    console.error("Health check controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to complete and save health check",
    });
  }
};


export const getMonitoringHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const monitoredAPI = await MonitoredAPI.findById(id);

    
if (!monitoredAPI.isActive) {
  return res.status(400).json({
    success: false,
    message: "This API is inactive and cannot be monitored",
  });
}


    const history = await MonitoringResult.find({
      monitoredAPI: monitoredAPI._id,
    }).sort({ checkedAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid API ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch monitoring history",
    });
  }
};
