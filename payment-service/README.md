# payment-service

Microserviço Python que consome eventos `order.created` do RabbitMQ, simula um processamento de pagamento e publica o resultado como `payment.confirmed` ou `payment.failed`.

## Fluxo

```
order.created  →  [payment-service]  →  payment.confirmed
                                    └→  payment.failed
```

1. Consome `order.created` na fila `payment.process.order_created`
2. Escolhe aleatoriamente um método de pagamento (`pix`, `visa`, `master`, `elo`, `paypal`)
3. Simula aprovação (80%) ou recusa (20%)
4. Publica no exchange `orders.exchange` com `payment.confirmed` ou `payment.failed`
5. Os resultados ficam na fila `payment.process.payment_results`

## Como rodar

**Requisito:** Docker e Docker Compose instalados.

```bash
docker-compose up --build
```

A UI do RabbitMQ ficará disponível em http://localhost:15672 (usuário e senha: `guest`).

## Testando manualmente

Na UI do RabbitMQ: **Exchanges → orders.exchange → Publish message**

- Routing key: `order.created`
- Payload:

```json
{
  "orderId": "123",
  "customerEmail": "cliente@email.com",
  "amount": 120.50
}
```

Topologia criada automaticamente:

- Exchange: `orders.exchange` (topic)
- Fila de entrada: `payment.process.order_created` com binding `order.created`
- Fila de resultado: `payment.process.payment_results` com bindings `payment.confirmed` e `payment.failed`

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `RABBITMQ_URL` | `amqp://guest:guest@rabbitmq:5672` | Full AMQP connection URL |
| `RABBITMQ_EXCHANGE` | `orders.exchange` | Exchange name |
| `RABBITMQ_ROUTING_KEY` | `order.created` | Routing key this service binds to |

Copy `.env.example` to `.env` for local (non-Docker) development:

```bash
cp .env.example .env
# Edit RABBITMQ_URL to point to localhost if running RabbitMQ separately
```

---

## Stopping the system

```bash
docker-compose down
```
## Deploy via GitHub Actions

Workflow de deploy automático configurado para rodar em `push` na branch `main`.

**Arquivo:** `.github/workflows/deploy.yml`

**Comportamento:**
- Dispara automaticamente ao fazer push na `main`
- Roda em runner self-hosted com label `payment-service`
- Evita execuções simultâneas via concurrency
- Executa: `docker compose build --no-cache` e `docker compose up -d --force-recreate`
- Valida containers em execução com `docker compose ps`

**Pré-requisitos no runner:**
- Docker e Docker Compose instalados
- Runner configurado com labels: `[self-hosted, linux, docker, payment-service]`