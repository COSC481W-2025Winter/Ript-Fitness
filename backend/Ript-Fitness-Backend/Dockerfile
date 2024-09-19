FROM openjdk:17-jdk-slim


WORKDIR /app/ript

# Copy the jar file from your local machine to the container
COPY target/Ript-Fitness-Backend-0.0.1-SNAPSHOT.jar /app/ript/app.jar

COPY .env /app/ript/.env

# Expose the port that the application runs on
EXPOSE 8080

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/ript/app.jar"]
