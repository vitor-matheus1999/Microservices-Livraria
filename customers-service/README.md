# 👥 Customers Service

Serviço de gerenciamento de clientes da arquitetura de microserviços Livraria. Responsável por criar, consultar e listar clientes com integração ao PostgreSQL.

## 🚀 Quick Start

### Pré-requisitos
- Docker & Docker Compose
- curl (ou Postman/Insomnia)

### Iniciar o serviço

```bash
docker compose up --build ms-customers
```

O serviço ficará disponível em: **http://localhost:9014**

---

## 📋 Endpoints Disponíveis

### 1️⃣ Criar Cliente (POST)

Cria um novo cliente no banco de dados.

**Endpoint:**
```
POST /api/customer
```

**Content-Type:**
```
application/json
```

**Request Body:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao.silva@email.com",
  "cpf": "123.456.789-00",
  "birthDate": "1990-05-15",
  "password": "senha@123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:9014/api/customer \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao.silva@email.com",
    "cpf": "123.456.789-00",
    "birthDate": "1990-05-15",
    "password": "senha@123"
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao.silva@email.com",
  "cpf": "123.456.789-00",
  "birthDate": "1990-05-15T00:00:00"
}
```

---

### 2️⃣ Buscar Cliente por ID (GET)

Recupera um cliente específico usando seu ID.

**Endpoint:**
```
GET /api/customer?id={id}
```

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | integer | ✅ | ID do cliente |

**cURL:**
```bash
curl -X GET "http://localhost:9014/api/customer?id=1"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao.silva@email.com",
  "cpf": "123.456.789-00",
  "birthDate": "1990-05-15T00:00:00"
}
```

**Response (404 Not Found):**
```
Quando o cliente com o ID informado não existe
```

---

### 3️⃣ Listar Clientes (Paginado) (GET)

Lista todos os clientes com suporte a paginação.

**Endpoint:**
```
GET /api/customer/list?pageNumber={page}&pageSize={size}
```

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `pageNumber` | integer | ✅ | Número da página (começa em 1) |
| `pageSize` | integer | ✅ | Quantidade de registros por página |

**cURL:**
```bash
# Primeira página, 10 registros por página
curl -X GET "http://localhost:9014/api/customer/list?pageNumber=1&pageSize=10"

# Segunda página, 5 registros por página
curl -X GET "http://localhost:9014/api/customer/list?pageNumber=2&pageSize=5"
```

**Response (200 OK):**
```json
{
  "pageNumber": 1,
  "pageSize": 10,
  "totalRecords": 25,
  "totalPages": 3,
  "data": [
    {
      "id": 1,
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao.silva@email.com",
      "cpf": "123.456.789-00",
      "birthDate": "1990-05-15T00:00:00"
    },
    {
      "id": 2,
      "firstName": "Maria",
      "lastName": "Santos",
      "email": "maria.santos@email.com",
      "cpf": "987.654.321-00",
      "birthDate": "1985-03-20T00:00:00"
    }
  ]
}
```

---

## 🔄 Guia Passo a Passo de Uso

### Cenário: Criar, Consultar e Listar Clientes

#### **Passo 1: Criar um novo cliente**

```bash
curl -X POST http://localhost:9014/api/customer \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Pedro",
    "lastName": "Oliveira",
    "email": "pedro.oliveira@email.com",
    "cpf": "111.222.333-44",
    "birthDate": "1992-07-10",
    "password": "Senha@Segura123"
  }'
```

**Esperado:** Cliente criado com ID = 1

#### **Passo 2: Consultar o cliente criado**

```bash
curl -X GET "http://localhost:9014/api/customer?id=1"
```

**Esperado:** Retorna os dados do cliente com ID 1

#### **Passo 3: Criar mais clientes (segundo cliente)**

```bash
curl -X POST http://localhost:9014/api/customer \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ana",
    "lastName": "Costa",
    "email": "ana.costa@email.com",
    "cpf": "555.666.777-88",
    "birthDate": "1995-11-25",
    "password": "Outra@Senha456"
  }'
```

#### **Passo 4: Criar terceiro cliente**

```bash
curl -X POST http://localhost:9014/api/customer \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Carlos",
    "lastName": "Ferreira",
    "email": "carlos.ferreira@email.com",
    "cpf": "999.888.777-66",
    "birthDate": "1988-01-05",
    "password": "Mais@Uma789"
  }'
```

#### **Passo 5: Listar clientes com paginação**

```bash
# Listar 10 clientes por página
curl -X GET "http://localhost:9014/api/customer/list?pageNumber=1&pageSize=10"

# Listar 2 clientes por página
curl -X GET "http://localhost:9014/api/customer/list?pageNumber=1&pageSize=2"
```

#### **Passo 6: Ir para próxima página**

```bash
curl -X GET "http://localhost:9014/api/customer/list?pageNumber=2&pageSize=2"
```

---

## 📊 Estrutura de Dados

### **CustomerRequestDTO** (Requisição)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `firstName` | string | ✅ | Primeiro nome do cliente |
| `lastName` | string | ✅ | Sobrenome do cliente |
| `email` | string | ✅ | Email (deve ser único) |
| `cpf` | string | ✅ | CPF (deve ser único) |
| `birthDate` | datetime | ❌ | Data de nascimento (formato: YYYY-MM-DD) |
| `password` | string | ✅ | Senha do cliente |

### **Customer** (Resposta)

Mesmos campos da request, mais o `id` gerado automaticamente pelo servidor.

---

## 🐳 Docker Compose Configuration

```yaml
ms-customers:
  container_name: ms-customers
  image: ms-customers
  build:
    context: ./customers-service/customers-service
    dockerfile: Dockerfile
  ports: 
    - "9014:9014"
  depends_on:
    - db-user
  networks:
    - arq-network
  environment:
    ConnectionStrings__DefaultConnection: "Host=db-user;Port=5432;Database=usuario;Username=postgres;Password=senha123"
    ASPNETCORE_URLS: "http://+:9014"
```

---

## 💾 Banco de Dados

**Tipo:** PostgreSQL 16  
**Database:** `usuario`  
**Username:** `postgres`  
**Password:** `senha123`  
**Host (Docker):** `db-user`  
**Port:** `5432`

### Conectar ao banco localmente:

```bash
psql -h localhost -p 5432 -U postgres -d usuario
```

### Listar tabelas:

```sql
\dt
```

### Ver estrutura da tabela Customers:

```sql
\d "Customers"
```

---

## 🔌 Integração com Keycloak

O serviço se integra com o Keycloak para autenticação centralizada.

**Keycloak URL (Docker):** `http://keycloak-service:8080`  
**Keycloak URL (Local):** `http://localhost:9015`  
**Admin Username:** `admin`  
**Admin Password:** `admin`

---

## 🛠️ Troubleshooting

### ❌ Erro: "Failed to connect to database"

**Solução:**
- Verifique se o container `db-user` está rodando:
  ```bash
  docker ps | grep postgres
  ```
- Confirme as variáveis de ambiente no docker-compose.yml
- Aguarde alguns segundos para o banco inicializar

### ❌ Erro: "Address already in use:9014"

**Solução:**
- Libere a porta 9014 ou mude a porta no docker-compose.yml
  ```yaml
  ports: 
    - "9015:9014"  # Usa porta 9015 localmente
  ```

### ❌ cURL retorna "Connection refused"

**Solução:**
- Verifique se o serviço está rodando:
  ```bash
  docker logs -f ms-customers
  ```
- Se não houver logs, o container não iniciou. Veja o erro completo.

### ❌ Erro: "Invalid Email"

**Solução:**
- Certifique-se que o email é válido (contém @)
- Use um email único em cada cliente

### ❌ Erro: "CPF already exists"

**Solução:**
- Cada CPF deve ser único
- Use um CPF diferente em cada requisição

---

## 📝 Visualizar Logs

Logs em tempo real:
```bash
docker logs -f ms-customers
```

Logs das últimas 100 linhas:
```bash
docker logs --tail=100 ms-customers
```

---

## 🚀 Comandos Docker Úteis

```bash
# Iniciar o serviço
docker compose up --build ms-customers

# Parar o serviço
docker compose down ms-customers

# Reiniciar o serviço
docker compose restart ms-customers

# Verificar status de todos os containers
docker ps

# Ver uso de recursos do container
docker stats ms-customers

# Executar comando dentro do container
docker exec -it ms-customers bash

# Remover o container e volumes
docker compose down -v ms-customers
```

---

## 📱 Testar com Postman

1. Abra o Postman
2. Crie uma nova requisição POST
3. URL: `http://localhost:9014/api/customer`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "birthDate": "1990-05-15",
  "password": "senha@123"
}
```
6. Clique em Send

---

## 🎯 Próximos Passos

- [ ] Adicionar autenticação JWT via Keycloak
- [ ] Implementar endpoints de atualização (PUT/PATCH)
- [ ] Implementar endpoint de exclusão (DELETE)
- [ ] Adicionar validações mais robustas
- [ ] Integrar com RabbitMQ para eventos
- [ ] Adicionar testes unitários
- [ ] Documentação OpenAPI/Swagger

---

## 📞 Suporte

Para reportar issues ou sugestões:
1. Abra uma issue no repositório GitHub
2. Descreva o problema detalhadamente
3. Inclua logs e exemplos de requisição que falharam

---

## 📄 Estrutura do Projeto

```
customers-service/
├── customers-service/
│   ├── Controllers/
│   │   └── CustomerController.cs
│   ├── Application/
│   │   ├── DTO/
│   │   │   └── CustomerRequestDTO.cs
│   │   └── Interfaces/
│   │       └── ICustomerService.cs
│   ├── Domain/
│   │   ├── Entities/
│   │   │   └── Customer.cs
│   │   └── Interfaces/
│   │       └── ICustomerRepository.cs
│   ├── Infrastructure/
│   │   ├── DbContextCustomers/
│   │   │   └── DbContextPostgre.cs
│   │   ├── Repository/
│   │   │   └── CustomerRepository.cs
│   │   └── Service/
│   │       └── CustomerService.cs
│   ├── Migrations/
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   └── Dockerfile
└── README.md
```

---

**Última atualização:** Março 2026  
**Versão:** 1.0.0  
**Status:** ✅ Produção
