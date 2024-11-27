import React, { useState } from "react";
import { getRides } from "../services/rideService";

const RideHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [rides, setRides] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Função para carregar o histórico de viagens
  const fetchRides = async () => {
    try {
      const data = await getRides(customerId);
      setRides(data.rides);
    } catch (error) {
      console.error("Erro ao buscar histórico de viagens:", error);
    }
  };

  // Função para exibir o histórico ao clicar no botão
  const handleShowHistory = () => {
    if (!customerId.trim()) {
      alert("Por favor, insira um ID de cliente.");
      return;
    }
    setShowHistory(true);
    fetchRides();
  };

  return (
    <div className="history-container">
      <h3>Histórico de Viagens</h3>
      <div className="history-input-container">
        <input
          type="text"
          placeholder="ID do Cliente"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <button onClick={handleShowHistory}>Exibir Histórico</button>
      </div>

      {/* Exibe o histórico de viagens se showHistory for true */}
      {showHistory && (
        <div className="history-container">
          <ul>
            {rides.length > 0 ? (
              rides.map((ride: any) => (
                <li key={ride.id}>
                  <strong>
                    {ride.origin} → {ride.destination}
                  </strong>{" "}
                  - R$ {ride.value}
                </li>
              ))
            ) : (
              <li>Nenhuma viagem encontrada.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RideHistory;
