import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configurações do servidor
const PORT = process.env.PORT || 8080;
const DATABASE_PATH = process.env.DATABASE_PATH || "./database.sqlite";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

console.log(`Servidor rodando na porta ${PORT}`);
console.log(`Banco de dados localizado em ${DATABASE_PATH}`);

// Inicializar o aplicativo Express
const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para processar JSON
app.use(express.json());

// Rotas
app.use("/api", router);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
