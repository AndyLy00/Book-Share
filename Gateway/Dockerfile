# Step 1: Use an official Java 19 runtime as the base image
FROM openjdk:21

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the packaged jar file into the container
COPY target/truck-gateway-0.0.1-SNAPSHOT.jar /app/app.jar

# Step 4: Expose the port your application runs on
EXPOSE 9898

# Step 5: Define the command to run the app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]