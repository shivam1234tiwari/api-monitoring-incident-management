
import MonitoredAPI from "../models/MonitoredAPI.js";

export const createMonitoredAPI = async (req, res) => {
  try {
    const { name, url, method, interval } = req.body;

    const monitoredAPI = await MonitoredAPI.create({
      name,
      url,
      method,
      interval,
    });

    return res.status(201).json({
      success: true,
      message: "API added for monitoring successfully",
      data: monitoredAPI,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getMonitoredAPIs = async (req, res) => {
  try {
    const monitoredAPIs = await MonitoredAPI.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: monitoredAPIs.length,
      data: monitoredAPIs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch monitored APIs",
    });
  }
};
