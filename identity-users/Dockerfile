# =====================================================
# Stage 1: Build
# =====================================================
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
# Copy Gradle wrapper and config first (better layer caching)
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
# Give execution permission to Gradle wrapper
RUN chmod +x gradlew
# Download dependencies
RUN ./gradlew dependencies --no-daemon
# Copy source and build
COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test
# =====================================================
# Stage 2: Runtime
# =====================================================
FROM eclipse-temurin:17-jre AS runtime
# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring
WORKDIR /app
# Copy the built JAR from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar
# Change ownership
RUN chown spring:spring app.jar
USER spring
# Expose the default Spring Boot port
EXPOSE 8080

ENV SPRING_PROFILE=prod

ENV JAVA_OPTS="-XX:+UseG1GC"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=$SPRING_PROFILE -jar app.jar"]