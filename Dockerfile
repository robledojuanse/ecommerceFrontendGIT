# Stage 1: Build - Usamos una imagen ligera de Node
FROM node:20-alpine AS build-stage
WORKDIR /app

# Copiamos archivos de dependencias primero para aprovechar el cache de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Production - Servidor web ultra rápido
FROM nginx:stable-alpine

# Copiamos el resultado del build de la etapa anterior
# IMPORTANTE: Revisa en tu carpeta 'dist' el nombre exacto de la subcarpeta
# Generalmente es 'dist/frontend/browser' en versiones nuevas de Angular
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html

# Copiamos una configuración básica de Nginx para manejar rutas de Angular (SPA)
RUN printf 'server { \n\
    listen 80; \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html index.htm; \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]