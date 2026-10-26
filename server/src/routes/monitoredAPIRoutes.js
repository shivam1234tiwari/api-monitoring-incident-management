import express from "express";
import {
  createMonitoredAPI,
  getMonitoredAPIs,
  getMonitoredAPIById,
  updateMonitoredAPI,
  deleteMonitoredAPI
} from "../controllers/monitoredAPIController.js";
import { runHealthCheck , getMonitoringHistory} from "../controllers/healthCheckController.js";


const router = express.Router();


router.post("/:id/health-check", runHealthCheck);
router.post("/", createMonitoredAPI);
router.get("/", getMonitoredAPIs);
router.get("/:id", getMonitoredAPIById);

router.get("/:id/history", getMonitoringHistory);

router.patch("/:id", updateMonitoredAPI);
router.delete("/:id",deleteMonitoredAPI);

export default router;
