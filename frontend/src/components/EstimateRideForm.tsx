import React, { useState } from "react";
import { estimateRide, confirmRide } from "../services/rideService";
import Map from "./Map";

const EstimateRideForm: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [estimate, setEstimate] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null); // Armazenar motorista selecionado
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await estimateRide(customerId, origin, destination);
      setEstimate(data);
      setError(""); // Limpa qualquer erro anterior
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
      await confirmRide(rideDetails); // Chama a função para salvar a viagem
      alert("Viagem confirmada com sucesso!");
      setEstimate(null); // Limpa a estimativa após confirmação
    } catch (error) {
      console.error("Erro ao confirmar a viagem:", error);
      setError("Erro ao confirmar a viagem. Tente novamente.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Estimar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {estimate && (
        <div>
          <h3>Estimativa</h3>
          <p>Distância: {estimate.distance} km</p>
          <p>Duração: {estimate.duration}</p>
          <Map origin={origin} destination={destination} />
          <h4>Motoristas Disponíveis:</h4>
          <ul>
            {estimate.options.map((driver: any) => (
              <li key={driver.id}>
                <label>
                  <input
                    type="radio"
                    name="driver"
                    value={driver.id}
                    onChange={() => setSelectedDriver(driver)}
                  />
                  <strong>{driver.name}</strong> - {driver.description} <br />{" "}
                  R$ {driver.value} - <br />
                  <em>Rating:</em> {driver.review.comment}
                  <br />{" "}
                </label>
              </li>
            ))}
          </ul>

          <button onClick={handleConfirm}>Confirmar Viagem</button>
        </div>
      )}
    </div>
  );
};
export default EstimateRideForm;
