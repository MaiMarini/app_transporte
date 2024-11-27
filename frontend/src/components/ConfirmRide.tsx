import React, { useState } from "react";
import { confirmRide } from "../services/rideService";

const ConfirmRide: React.FC = () => {
  const [rideDetails, setRideDetails] = useState<any>({
    customer_id: "",
    origin: "",
    destination: "",
    distance: "",
    duration: "",
    driver: { id: "", name: "" },
    value: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmRide(rideDetails);
      alert("Viagem confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar a viagem:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Confirmar Viagem</h2>
      {/* Campos para preencher os detalhes da viagem */}
      <button type="submit">Confirmar</button>
    </form>
  );
};

export default ConfirmRide;
