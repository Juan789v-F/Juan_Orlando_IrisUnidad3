# Usar imagen oficial de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código fuente
COPY . .

# Crear archivo .env con valores por defecto si no existe
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

# Información del contenedor
LABEL maintainer="Juan Daniel Flores Espinoza"
LABEL description="Aplicación web de tecnologías de información con seguridad y servicios web"
LABEL version="1.0.0"