
import express from "express";
import { createMonitoredAPI ,getMonitoredAPIs} from "../controllers/monitoredAPIController.js";

const router = express.Router();

router.post("/", createMonitoredAPI);
router.get("/", getMonitoredAPIs);

export default router;
