import React, { useState } from "react";
import { estimateRide, confirmRide } from "../services/rideService";
import Map from "./Map";

const EstimateRideForm: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [estimate, setEstimate] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await estimateRide(customerId, origin, destination);
      setEstimate(data);
      // Limpa qualquer erro anterior
      setError("");
    } catch (error) {
      console.error("Erro ao estimar a viagem:", error);
      setError("Erro ao estimar a viagem. Tente novamente.");
    }
  };

  const handleConfirm = async () => {
    if (!selectedDriver) {
      setError("Por favor, selecione um motorista.");
      return;
    }

    const rideDetails = {
      customer_id: customerId,
      origin,
      destination,
      distance: estimate.distance,
      duration: estimate.duration,
      driver: selectedDriver,
      value: selectedDriver.value,
    };

    try {
      // Chama a função para salvar a viagem
      await confirmRide(rideDetails);
      alert("Viagem confirmada com sucesso!");

      // Limpa os estados após a confirmação
      setEstimate(null);
      setCustomerId("");
      setOrigin("");
      setDestination("");
      setSelectedDriver(null);
      setEstimate(null);
      setError("");
    } catch (error) {
      console.error("Erro ao confirmar a viagem:", error);
      setError("Erro ao confirmar a viagem. Tente novamente.");
    }
  };

  return (
    <div>
      <div>
        <form className="container" onSubmit={handleSubmit}>
          <h3>Estimar Viagens</h3>
          <input
            type="text"
            placeholder="ID do Cliente"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Origem"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <button type="submit">Estimar viagem</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {estimate && (
        <div className="estimation-container">
          <h3>Estimativa</h3>
          <p>Distância: {estimate.distance} km</p>
          <p>Duração: {estimate.duration}</p>

          <Map origin={origin} destination={destination} />

          <div className="drivers-list">
            <h4>Motoristas Disponíveis:</h4>
            <ul>
              {estimate.options.map((driver: any) => (
                <li key={driver.id}>
                  <label>
                    <strong>{driver.name}</strong> - {driver.description} <br />
                    R$ {driver.value} <br />
                    <em>Rating:</em> {driver.review.comment}
                    <input
                      type="radio"
                      name="driver"
                      value={driver.id}
                      onChange={() => setSelectedDriver(driver)}
                    />
                    <button
                      className={`estimate-button ${
                        selectedDriver?.id === driver.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedDriver(driver)}
                    >
                      Escolher
                    </button>
                  </label>
                </li>
              ))}
            </ul>
            <button className="confirm-button" onClick={handleConfirm}>
              Confirmar Viagem
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default EstimateRideForm;
