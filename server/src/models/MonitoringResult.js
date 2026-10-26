
import mongoose from "mongoose";

const monitoringResultSchema = new mongoose.Schema(
  {
    monitoredAPI: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonitoredAPI",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["UP", "DOWN"],
      required: true,
    },

    statusCode: {
      type: Number,
      default: null,
    },

    responseTime: {
      type: Number,
      required: true,
      min: 0,
    },

    error: {
      type: String,
      default: null,
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MonitoringResult = mongoose.model(
  "MonitoringResult",
  monitoringResultSchema
);

export default MonitoringResult;
