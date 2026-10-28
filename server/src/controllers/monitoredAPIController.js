
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


export const getMonitoredAPIById = async (req, res) => {
  try {
    const { id } = req.params;

    const monitoredAPI = await MonitoredAPI.findById(id);

    if (!monitoredAPI) {
      return res.status(404).json({
        success: false,
        message: "Monitored API not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: monitoredAPI,
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
      message: "Failed to fetch monitored API",
    });
  }
};


export const updateMonitoredAPI = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = ["name", "url", "method", "interval", "isActive"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update",
      });
    }

    const monitoredAPI = await MonitoredAPI.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!monitoredAPI) {
      return res.status(404).json({
        success: false,
        message: "Monitored API not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Monitored API updated successfully",
      data: monitoredAPI,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update monitored API",
    });
  }
};


export const deleteMonitoredAPI = async (req, res) => {
  try {
    const { id } = req.params;

    const monitoredAPI = await MonitoredAPI.findByIdAndDelete(id);

    if (!monitoredAPI) {
      return res.status(404).json({
        success: false,
        message: "Monitored API not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Monitored API deleted successfully",
      data: monitoredAPI,
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
      message: "Failed to delete monitored API",
    });
  }
};

export const toggleMonitoredAPI = async (req, res) => {
  try {
    const api = await MonitoredAPI.findById(req.params.id);

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "Monitored API not found",
      });
    }

    api.isActive = !api.isActive;

    await api.save();

    return res.status(200).json({
      success: true,
      message: `API monitoring ${
        api.isActive ? "activated" : "deactivated"
      } successfully`,
      data: api,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update API monitoring status",
      error: error.message,
    });
  }
};