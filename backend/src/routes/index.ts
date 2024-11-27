import { Request, Response, Router } from "express";
import {
  estimateRide,
  confirmRide,
  getRides,
} from "../controllers/rideController";

import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Endpoints de ride
router.post("/ride/estimate", estimateRide);
router.patch("/ride/confirm", confirmRide);
router.get("/ride/:customer_id", getRides);

// Rota para fornecer o script do Google Maps
router.get("/maps/script", (req: Request, res: Response): void => {
  const googleMapsApiKey = process.env.GOOGLE_API_KEY;

  if (!googleMapsApiKey) {
    res
      .status(500)
      .json({ error: "Chave da API do Google Maps não configurada." });
    return;
  }

  const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
  res.json({ url: scriptUrl });
});

export default router;
