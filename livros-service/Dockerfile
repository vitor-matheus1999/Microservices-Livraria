# Dockerfile.dev
FROM eclipse-temurin:25-jdk-alpine

WORKDIR /app

# Instalar ferramentas
RUN apk add --no-cache curl bash

# Copiar arquivos do Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Expor portas
EXPOSE 8080 5005

ENV JAVA_OPTS="\
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 \
    -Dspring.devtools.restart.enabled=true"

ENV SPRING_PROFILE=prod

CMD ["sh", "-c", "./mvnw spring-boot:run -Dspring-boot.run.profiles=$SPRING_PROFILE -Dspring-boot.run.jvmArguments=\"$JAVA_OPTS\""]