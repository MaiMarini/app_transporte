# Usar a imagem base do Node.js
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e o package-lock.json para instalar as dependências
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todos os arquivos do frontend para o container
COPY . .

# Build da aplicação React
RUN npm run build

# Usar uma imagem do Nginx para servir o frontend
FROM nginx:alpine

# Copiar os arquivos da build para o diretório do Nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Expor a porta 80 para o frontend
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
