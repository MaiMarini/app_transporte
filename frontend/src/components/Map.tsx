import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { estimateRide } from "../services/rideService";

interface MapProps {
  origin?: string;
  destination?: string;
}

const Map: React.FC<MapProps> = ({ origin, destination }) => {
  const [directions, setDirections] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Função para carregar o script do Google Maps
  const loadGoogleMapsScript = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/maps/script");
      const data = await response.json();
      const scriptUrl = data.url;

      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      // Marca o script como carregado
      script.onload = () => setScriptLoaded(true);

      document.head.appendChild(script);
    } catch (err) {
      console.error("Erro ao carregar o script do Google Maps:", err);
      setError("Não foi possível carregar o mapa.");
    }
  };

  useEffect(() => {
    // Carregar o script do Google Maps
    loadGoogleMapsScript();
  }, []);

  // Função para geocodificar os endereços
  const geocodeAddress = (
    address: string,
    callback: (latLng: google.maps.LatLng | null) => void
  ) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const location = results[0].geometry.location;
        callback(location);
      } else {
        setError("Não foi possível geocodificar o endereço.");
        callback(null);
      }
    });
  };

  // Função para buscar a rota
  const fetchDirections = async () => {
    if (!origin || !destination) {
      setError("Origem e destino são obrigatórios!");
      return;
    }

    try {
      // Geocodificar origem e destino para obter as coordenadas
      geocodeAddress(origin, (originLocation) => {
        if (!originLocation) {
          setError("Erro ao geocodificar a origem.");
          return;
        }

        geocodeAddress(destination, (destinationLocation) => {
          if (!destinationLocation) {
            setError("Erro ao geocodificar o destino.");
            return;
          }

          // Solicita a rota
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: originLocation,
              destination: destinationLocation,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);
                setError(null);
              } else {
                setError("Não foi possível calcular a rota.");
              }
            }
          );
        });
      });
    } catch (err) {
      console.error("Erro ao buscar rota:", err);
      setError("Não foi possível calcular a rota. Tente novamente.");
    }
  };

  // Quando o script for carregado e as coordenadas forem fornecidas, buscar a rota
  useEffect(() => {
    if (scriptLoaded && origin && destination) {
      fetchDirections();
    }
  }, [origin, destination, scriptLoaded]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div id="map" style={{ width: "100%", height: "500px" }}>
        {scriptLoaded && (
          <GoogleMap
            id="map"
            mapContainerStyle={{ width: "100%", height: "500px" }}
            // Coordenadas padrão (São Paulo)
            center={{ lat: -23.55052, lng: -46.633308 }}
            zoom={12}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default Map;
