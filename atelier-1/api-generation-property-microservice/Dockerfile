FROM maven:3.8.4-openjdk-17-slim AS build
LABEL authors="mejri"

COPY atelier-1/api-common /home/api-common
RUN mvn -f /home/api-common/pom.xml clean install

COPY atelier-1/api-generation-property-microservice/src /home/app/src
COPY atelier-1/api-generation-property-microservice/pom.xml /home/app

# Ajout du fichier jar et exécution de la commande install:install-file
COPY atelier-1/api-generation-property-microservice/src/main/resources/colorToproperties-1.1.2.jar /home/app/src/main/resources/colorToproperties-1.1.2.jar
RUN mvn install:install-file -Dfile=/home/app/src/main/resources/colorToproperties-1.1.2.jar -DgroupId=de.androidpit -DartifactId=colorToproperties -Dversion=1.1.2 -Dpackaging=jar -DgeneratePom=true

# Compilation et création du package
RUN mvn -f /home/app/pom.xml clean package

FROM openjdk:17-slim
COPY --from=build /home/app/target/api-generation-property-microservice-0.0.1-SNAPSHOT.jar /usr/local/lib/api-generation-property-microservice.jar

EXPOSE 8090
ENTRYPOINT ["java","-Dspring.profiles.active=docker","-jar","/usr/local/lib/api-generation-property-microservice.jar"]
