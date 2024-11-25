import { Router } from "express";
import {
  estimateRide,
  confirmRide,
  getRides,
} from "../controllers/rideController";

const router = Router();

// Endpoints
router.post("/ride/estimate", estimateRide);
router.patch("/ride/confirm", confirmRide);
router.get("/ride/:customer_id", getRides);

export default router;
