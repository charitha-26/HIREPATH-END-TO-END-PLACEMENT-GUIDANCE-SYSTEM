# Use lightweight Java runtime
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy jar file
COPY target/hirepath-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render/Heroku will override anyway)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java","-jar","app.jar"]
