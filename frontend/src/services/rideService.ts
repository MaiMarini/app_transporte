import api from "./api";

// Estimar uma viagem
export const estimateRide = async (
  customerId: string,
  origin: string,
  destination: string
) => {
  const response = await api.post("/ride/estimate", {
    customer_id: customerId,
    origin,
    destination,
  });
  return response.data;
};

// Confirmar uma viagem
export const confirmRide = async (rideDetails: any) => {
  const response = await api.patch("/ride/confirm", rideDetails);
  return response.data;
};

// Obter histórico de viagens
export const getRides = async (customerId: string) => {
  const response = await api.get(`/ride/${customerId}`);
  return response.data;
};
