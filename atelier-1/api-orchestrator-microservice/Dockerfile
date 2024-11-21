FROM maven:3.8.4-openjdk-17-slim AS build
LABEL authors="mejri"

COPY api-common /home/api-common
RUN mvn -f /home/api-common/pom.xml clean install

COPY api-orchestrator-microservice/src /home/app/src
COPY api-orchestrator-microservice/pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

FROM openjdk:17-slim
COPY --from=build /home/app/target/api-orchestrator-microservice-0.0.1-SNAPSHOT.jar /usr/local/lib/api-orchestrator-microservice.jar

EXPOSE 8089
ENTRYPOINT ["java","-Dspring.profiles.active=docker","-jar","/usr/local/lib/api-orchestrator-microservice.jar"]
