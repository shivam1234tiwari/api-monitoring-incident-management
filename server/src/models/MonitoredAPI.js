
import mongoose from "mongoose";

const monitoredAPISchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "API name is required"],
      trim: true,
    },

    url: {
      type: String,
      required: [true, "API URL is required"],
      trim: true,
    },

    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      default: "GET",
    },

    interval: {
      type: Number,
      default: 60,
      min: 10,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MonitoredAPI = mongoose.model(
  "MonitoredAPI",
  monitoredAPISchema
);

export default MonitoredAPI;
