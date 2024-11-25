import db from "./database"; // Importando a conexão com o banco de dados

const seedDatabase = async () => {
  try {
    // Espera a resolução da promessa e obtém a instância do banco de dados
    const dbInstance = await db;

    // Criar tabela de motoristas (se não existir)
    await dbInstance.run(`
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
    await dbInstance.run(`
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
    const insertDriver = await dbInstance.prepare(`
      INSERT INTO drivers (name, description, vehicle, rating, price_per_km, min_distance)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Inserindo motoristas
    await insertDriver.run(
      "Homer Simpson",
      "Motorista camarada",
      "Plymouth Valiant 1973",
      2,
      2.5,
      1
    );
    await insertDriver.run(
      "Dominic Toretto",
      "Motorista rápido e furioso",
      "Dodge Charger R/T",
      4.5,
      5.0,
      5
    );
    await insertDriver.run(
      "James Bond",
      "Agente secreto",
      "Aston Martin DB5",
      5,
      10.0,
      10
    );

    // Finalizando a declaração de inserção
    await insertDriver.finalize();

    console.log("Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
  } finally {
    // Fechar a conexão com o banco de dados
    const dbInstance = await db; // Novamente esperando pela resolução
    await dbInstance.close();
  }
};

// Chama a função de seed
seedDatabase();
