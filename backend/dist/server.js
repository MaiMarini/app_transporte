"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
// Carregar variáveis de ambiente do arquivo .env
dotenv_1.default.config();
// Configurações do servidor
const PORT = process.env.PORT || 8080;
const DATABASE_PATH = process.env.DATABASE_PATH || "./database.sqlite";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
console.log(`Servidor rodando na porta ${PORT}`);
console.log(`Banco de dados localizado em ${DATABASE_PATH}`);
// Inicializar o aplicativo Express
const app = (0, express_1.default)();
// Habilitar CORS
app.use((0, cors_1.default)());
// Middleware para processar JSON
app.use(express_1.default.json());
// Rotas
app.use("/api", index_1.default);
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
