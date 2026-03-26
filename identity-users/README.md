# Identity Service

Servidor de identidade e gerenciamento de usuários de uma loja de livros virtual.

## Tecnologias

- Java 17 + Spring Boot 4.0.3
- PostgreSQL 16
- Keycloak (OAuth2 / JWT)
- Swagger UI (SpringDoc 3.0.2)

---

## Como Rodar

### Suba o Docker (PostgreSQL + Keycloak)

Suba os containers:

```bash
docker-compose up -d
```

---

### Via Swagger

```
http://localhost:8080/swagger-ui.html
```

---

## Endpoints

| Método | Endpoint    | Descrição                        |
|--------|-------------|----------------------------------|
| POST   | /usuarios   | Cadastra usuário (sem token)     |
| GET    | /usuarios   | Lista usuários (requer token)    |