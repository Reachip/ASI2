FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3002

CMD ["npm", "run", "start"]
