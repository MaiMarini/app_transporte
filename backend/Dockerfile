# Use uma imagem oficial do Node.js
FROM node:18

# Instalar dependências de compilação para sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código para dentro do container
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Expõe a porta do servidor
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["npm", "start"]
