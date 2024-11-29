FROM node:20-slim

WORKDIR /app

COPY atelier-2/backend-node/package.json ./

RUN npm i

COPY atelier-2/backend-node/. .

EXPOSE 3002

CMD ["npm", "run", "start"]
