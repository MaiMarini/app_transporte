"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rideController_1 = require("../controllers/rideController");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
// Endpoints de ride
router.post("/ride/estimate", rideController_1.estimateRide);
router.patch("/ride/confirm", rideController_1.confirmRide);
router.get("/ride/:customer_id", rideController_1.getRides);
// Rota para fornecer o script do Google Maps
router.get("/maps/script", (req, res) => {
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
exports.default = router;
