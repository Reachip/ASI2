FROM node:14 as build

WORKDIR /app

COPY atelier-1/frontend .

# Définir les variables d'environnement avant la construction
ARG REACT_APP_API_BACKEND_URL
ARG REACT_APP_API_BACKEND_WS_URL
ARG REACT_APP_NODE_URL

# Définir des valeurs par défaut pour ces variables si elles ne sont pas passées
ENV REACT_APP_API_BACKEND_URL=${REACT_APP_API_BACKEND_URL:-http://api-backend:8080}
ENV REACT_APP_API_BACKEND_WS_URL=${REACT_APP_API_BACKEND_WS_URL:-ws://api-backend:8088}
ENV REACT_APP_NODE_URL=${REACT_APP_NODE_URL:-http://backend-node:3002}

RUN npm i

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]