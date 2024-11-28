"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Espera a resolução da promessa e obtém a instância do banco de dados
        const dbInstance = yield database_1.default;
        // Criar tabela de motoristas (se não existir)
        yield dbInstance.run(`
        CREATE TABLE IF NOT EXISTS drivers (
          id INTEGER PRIMARY KEY,
          name TEXT,
          description TEXT,
          vehicle TEXT,
          rating REAL,
          price_per_km REAL,
          min_distance REAL
        )
      `);
        // Criar tabela de histórico de viagens (se não existir)
        yield dbInstance.run(`
        CREATE TABLE IF NOT EXISTS rides (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id TEXT,
          origin TEXT,
          destination TEXT,
          distance REAL,
          duration TEXT,
          driver_id INTEGER,
          driver_name TEXT,
          value REAL,
          date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
        // Preparando a declaração para inserir motoristas
        const insertDriver = yield dbInstance.prepare(`
      INSERT INTO drivers (name, description, vehicle, rating, price_per_km, min_distance)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        // Inserindo motoristas
        yield insertDriver.run("Homer Simpson", "Motorista camarada", "Plymouth Valiant 1973", 2, 2.5, 1);
        yield insertDriver.run("Dominic Toretto", "Motorista rápido e furioso", "Dodge Charger R/T", 4.5, 5.0, 5);
        yield insertDriver.run("James Bond", "Agente secreto", "Aston Martin DB5", 5, 10.0, 10);
        // Finalizando a declaração de inserção
        yield insertDriver.finalize();
        console.log("Banco de dados inicializado com sucesso!");
    }
    catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
    }
    finally {
        // Fechar a conexão com o banco de dados
        const dbInstance = yield database_1.default;
        yield dbInstance.close();
    }
});
// Chama a função de seed
seedDatabase();
