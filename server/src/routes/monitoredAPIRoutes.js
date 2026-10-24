import express from "express";
import {
  createMonitoredAPI,
  getMonitoredAPIs,
  getMonitoredAPIById,
  updateMonitoredAPI,
  deleteMonitoredAPI
} from "../controllers/monitoredAPIController.js";

const router = express.Router();

router.post("/", createMonitoredAPI);
router.get("/", getMonitoredAPIs);
router.get("/:id", getMonitoredAPIById);
router.patch("/:id", updateMonitoredAPI);
router.delete("/:id",deleteMonitoredAPI);

export default router;
