import React from "react";
import "./styles/App.css"; // Importe o arquivo CSS
import EstimateRideForm from "./components/EstimateRideForm";
import RideHistory from "./components/RideHistory";

const App: React.FC = () => {
  return (
    <div className="container">
      <header>
        <h1>Bem-vindo ao App de Transporte</h1>
      </header>

      <EstimateRideForm />
      <RideHistory />
    </div>
  );
};

export default App;
