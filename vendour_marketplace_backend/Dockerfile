# Build Stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Run Stage
FROM openjdk:17-jdk-slim
LABEL authors="BK_QA"

WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/Vendor-Marketplace-0.0.1-SNAPSHOT.jar .

EXPOSE 8081

# Run the Spring Boot application with profile
ENTRYPOINT ["java", "-jar", "/app/Vendor-Marketplace-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=${ACTIVE_PROFILE:-dev}"]