FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 9000

# Modo desarrollo: arranca API + admin desde el código fuente (sin build de
# producción). El build de producción de Medusa v2 requiere instalar dentro de
# .medusa/server, lento en esta máquina; para correr local/demo, develop alcanza.
CMD ["npm", "run", "dev"]
