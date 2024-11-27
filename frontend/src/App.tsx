import React, { useState } from "react";
import EstimateRideForm from "./components/EstimateRideForm";
import ConfirmRide from "./components/ConfirmRide";
import RideHistory from "./components/RideHistory";

const App: React.FC = () => {
  const [view, setView] = useState<"estimate" | "confirm" | "history">(
    "estimate"
  );

  return (
    <div>
      <h1>App de Transporte</h1>
      <div>
        <p>Exibir histórico de corridas</p>
        <button onClick={() => setView("history")}>Histórico de Viagens</button>
        <p></p>
        <p>Estimar corrida</p>
      </div>
      {view === "estimate" && <EstimateRideForm />}
      {view === "confirm" && <ConfirmRide />}
      {view === "history" && <RideHistory />}
    </div>
  );
};

export default App;
