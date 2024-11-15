# Use OpenJDK 17 as the base image
FROM openjdk:21

# Set working directory
WORKDIR /app

# Copy the JAR file of the Eureka server application
COPY target/service-discovery.jar service-discovery.jar

# Expose the Eureka server port (default is 8008, or adjust as per your configuration)
EXPOSE 8008

# Run the Eureka server
ENTRYPOINT ["java", "-jar", "/app/app.jar"]