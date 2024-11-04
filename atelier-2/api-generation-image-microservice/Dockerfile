# Utilisez l'image officielle Maven pour construire l'application
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

# Copiez les fichiers de configuration Maven
COPY ./api-card-microservice/pom.xml api-card-microservice/
COPY ./api-common/pom.xml api-common/

# Copiez les sources du projet
COPY ./api-card-microservice/src api-card-microservice/src
COPY ./api-common/src api-common/src

# Construisez et installez api-common
RUN mvn -f api-common/pom.xml clean install -DskipTests

# Construisez l'application avec Maven, incluant le package api-common
RUN mvn -pl api-common -f api-card-microservice/pom.xml clean package -DskipTests

# Utilisez l'image officielle OpenJDK pour exécuter l'application
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY --from=build /app/api-card-microservice/target/api-card-microservice-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
