FROM node:14 AS build

WORKDIR /app

COPY atelier-1/frontend .

RUN npm i

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]