FROM maven:3.8.4-openjdk-17-slim AS build
LABEL authors="mejri"

COPY atelier-1/api-gateway/src /home/app/src
COPY atelier-1/api-gateway/pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

FROM openjdk:17-slim
COPY --from=build /home/app/target/api-gateway-0.0.1-SNAPSHOT.jar /usr/local/lib/api-gateway.jar

EXPOSE 8080
ENTRYPOINT ["java","-Dspring.profiles.active=docker","-jar","/usr/local/lib/api-gateway.jar"]
