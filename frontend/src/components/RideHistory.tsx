import React, { useState } from "react";
import { getRides } from "../services/rideService";

const RideHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState(""); // ID do cliente
  const [rides, setRides] = useState<any[]>([]); // Lista de viagens
  const [showHistory, setShowHistory] = useState(false); // Controla a exibição do histórico

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
    setShowHistory(true); // Altera o estado para exibir o histórico
    fetchRides(); // Carrega as viagens
  };

  return (
    <div>
      <input
        type="text"
        placeholder="ID do Cliente"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      />
      <button onClick={handleShowHistory}>Exibir Histórico</button>

      {/* Exibe o histórico de viagens se showHistory for true */}
      {showHistory && (
        <div>
          <h2>Histórico de Viagens</h2>
          <ul>
            {rides.length > 0 ? (
              rides.map((ride: any) => (
                <li key={ride.id}>
                  {ride.origin} → {ride.destination} - R$ {ride.value}
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
