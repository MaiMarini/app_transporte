import { Request, Response } from "express";
import dotenv from "dotenv";
import db from "../database/database";
import axios from "axios";
import { Driver } from "../models/ride";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Endpoint para estimar a viagem
export const estimateRide = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { customer_id, origin, destination } = req.body;

  // Validações de entrada
  if (!customer_id || !origin || !destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos.",
    });
  } else if (origin === destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "A origem e o destino não podem ser iguais.",
    });
  } else {
    try {
      // Chamada à API Google Maps para calcular a rota
      const routeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
          origin
        )}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_API_KEY}`
      );

      // Verificar se a resposta contém rotas
      const routes = routeResponse.data.routes;
      if (!routes || routes.length === 0) {
        res.status(400).json({
          error_code: "INVALID_ROUTE",
          error_description:
            "A rota não pôde ser calculada com os dados fornecidos." +
            JSON.stringify(routeResponse.data),
        });
      } else {
        // Extraindo a primeira rota e a primeira perna
        const route = routes[0];
        const legs = route.legs[0];
        if (!legs) {
          res.status(400).json({
            error_code: "INVALID_ROUTE",
            error_description:
              "A rota não pôde ser calculada com os dados fornecidos.",
          });
        } else {
          const distance = legs.distance.value / 1000;
          const duration = legs.duration.text;

          // Buscar motoristas disponíveis no banco de dados
          const dbInstance = await db;
          const rows = await dbInstance.all<Driver[]>(
            "SELECT id, name, description, vehicle, rating, price_per_km as pricePerKm FROM drivers WHERE min_distance <= ?",
            [distance]
          );
          console.log(rows);

          // Processar os motoristas encontrados
          const drivers = rows.map((driver) => ({
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.vehicle,
            review: {
              rating: driver.rating,
              comment: `Motorista avaliado com ${driver.rating} estrelas.`,
            },
            value: parseFloat((distance * driver.pricePerKm).toFixed(2)),
          }));
          console.log(drivers);

          // Retornar a resposta ao cliente com dados da viagem e motoristas disponíveis
          res.status(200).json({
            origin: {
              latitude: legs.start_location.lat,
              longitude: legs.start_location.lng,
            },
            destination: {
              latitude: legs.end_location.lat,
              longitude: legs.end_location.lng,
            },
            distance,
            duration,
            // Ordenar motoristas pelo valor
            options: drivers.sort((a, b) => a.value - b.value),
          });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error_code: "SERVER_ERROR",
        error_description: "Erro ao calcular a estimativa de viagem.",
      });
    }
  }
};

// Endpoint para confirmar a viagem
export const confirmRide = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    customer_id,
    origin,
    destination,
    distance,
    duration,
    driver,
    value,
  } = req.body;

  // Validações
  if (
    !customer_id ||
    !origin ||
    !destination ||
    !distance ||
    !duration ||
    !driver ||
    !value
  ) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos",
    });
    return;
  }

  if (origin === destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos",
    });
    return;
  }

  try {
    const dbInstance = await db;

    // Busca o motorista no banco
    const driverData = await dbInstance.get<Driver>(
      "SELECT * FROM drivers WHERE id = ?",
      [driver.id]
    );

    if (!driverData) {
      res.status(404).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista não encontrado",
      });
      return;
    }

    if (distance < driverData.minDistance) {
      res.status(406).json({
        error_code: "INVALID_DISTANCE",
        error_description: "Quilometragem inválida para o motorista ",
      });
      return;
    }

    // Insere a viagem no banco
    await dbInstance.run(
      `INSERT INTO rides (customer_id, origin, destination, distance, duration, driver_id, driver_name, value) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        origin,
        destination,
        distance,
        duration,
        driver.id,
        driver.name,
        value,
      ]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao salvar a viagem no banco de dados.",
    });
  }
};

// Endpoint para buscar as corridas
export const getRides = async (req: Request, res: Response): Promise<void> => {
  const { customer_id } = req.query;
  const { driver_name } = req.query;

  const customerIdStr = String(customer_id);
  if (!customerIdStr.trim()) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos",
    });
    return;
  }

  try {
    const dbInstance = await db;

    // Query para buscar viagens
    let query = `SELECT * FROM rides WHERE customer_id = ?`;
    const params: any[] = [customer_id];

    if (driver_name) {
      query += ` AND driver_name LIKE ?`;
      params.push(`%${driver_name}%`);
    }

    query += ` ORDER BY id DESC`;

    const rides = await dbInstance.all(query, params);

    if (!rides || rides.length === 0) {
      res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhum registro encontrado",
      });
      return;
    }

    res.status(200).json({
      customer_id,
      rides: rides.map((ride: any) => ({
        id: ride.id,
        date: ride.date,
        origin: ride.origin,
        destination: ride.destination,
        distance: ride.distance,
        duration: ride.duration,
        driver: {
          id: ride.driver_id,
          name: ride.driver_name,
        },
        value: ride.value,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao buscar viagens no banco de dados.",
    });
  }
};
