FROM maven:3.8.4-openjdk-17-slim AS build
LABEL authors="mejri"

COPY atelier-1/discovery/src /home/app/src
COPY atelier-1/discovery/pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

FROM openjdk:17-slim
COPY --from=build /home/app/target/discovery-0.0.1-SNAPSHOT.jar /usr/local/lib/discovery.jar

EXPOSE 8761
ENTRYPOINT ["java","-Dspring.profiles.active=docker","-jar","/usr/local/lib/discovery.jar"]
