FROM maven:3.8.4-openjdk-17-slim AS build
LABEL authors="mejri"

COPY atelier-1/api-common /home/api-common
RUN mvn -f /home/api-common/pom.xml clean install

COPY atelier-1/api-activemq-log/src /home/app/src
COPY atelier-1/api-activemq-log/pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

FROM openjdk:17-slim
COPY --from=build /home/app/target/api-activemq-log-0.0.1-SNAPSHOT.jar /usr/local/lib/api-activemq-log.jar

EXPOSE 8088
ENTRYPOINT ["java","-Dspring.profiles.active=docker","-jar","/usr/local/lib/api-activemq-log.jar"]
