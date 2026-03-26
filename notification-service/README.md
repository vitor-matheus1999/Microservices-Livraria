# payment-result-consumer

Microservico em Node.js (20+) para consumir mensagens do RabbitMQ e simular geracao de payload de e-mail para resultado de pagamento.

## Tecnologias

- Node.js 20+
- amqplib
- pino
- dotenv
- Docker / Docker Compose

## Estrutura

```txt
src/
  config/
    rabbit.js
  consumers/
    paymentResultConsumer.js
  services/
    emailTemplateService.js
  utils/
    logger.js
  index.js
```

## Variaveis de ambiente

Copie `.env.example` para `.env` e ajuste se necessario.

```env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_EXCHANGE=payment.events
PAYMENT_RESULT_QUEUE=payment.process.payment_results
LOG_LEVEL=info
```

## Subindo o ambiente

```bash
docker compose up --build
```

Os containers deste projeto sao conectados na rede Docker compartilhada `microservices-network`, permitindo comunicacao com outros projetos em containers na mesma rede.

RabbitMQ Management UI:

- URL: http://localhost:15672
- Usuario: `guest`
- Senha: `guest`

## Importante sobre a exchange

Este consumidor **nao cria exchange**. A exchange deve existir previamente no RabbitMQ, conforme requisito.

Se estiver testando localmente, crie a exchange manualmente (exemplo usando `rabbitmqadmin` dentro do container):

```bash
docker exec -it payment-rabbitmq rabbitmqadmin declare exchange name=payment.events type=topic durable=true
```

## Enviando mensagens de teste

Payload esperado:

```json
{
  "orderId": "12345",
  "paymentMethod": "pix",
  "status": "confirmed",
  "processedAt": "2026-03-15T10:30:00+00:00"
}
```

### Mensagem de pagamento confirmado

```bash
docker exec -it payment-rabbitmq rabbitmqadmin publish \
  exchange=payment.events \
  routing_key=payment.confirmed \
  payload='{"orderId":"12345","paymentMethod":"pix","status":"confirmed","processedAt":"2026-03-15T10:30:00+00:00"}'
```

### Mensagem de pagamento falho

```bash
docker exec -it payment-rabbitmq rabbitmqadmin publish \
  exchange=payment.events \
  routing_key=payment.failed \
  payload='{"orderId":"12345","paymentMethod":"credit_card","status":"failed","processedAt":"2026-03-15T10:35:00+00:00"}'
```

## Fluxo implementado

1. Conecta ao RabbitMQ via `RABBITMQ_URL`.
2. Declara a fila `payment.process.payment_results`.
3. Cria bindings da fila para:
   - `payment.confirmed`
   - `payment.failed`
4. Inicia consumo da fila.
5. Identifica routing key da mensagem.
6. Monta payload de e-mail conforme o tipo do resultado.
7. Loga o payload em nivel INFO.
8. Executa ack da mensagem.

## Regra de consistencia do evento

- Para `payment.confirmed`, o campo `status` deve ser `confirmed`.
- Para `payment.failed`, o campo `status` deve ser `failed`.
- Se houver divergencia entre `routingKey` e `status`, a mensagem sera considerada invalida e o erro sera logado.

## Exemplo de log

```txt
{"level":30,"time":"2026-03-15T12:00:00.000Z","msg":"Email payload gerado","routingKey":"payment.confirmed","emailPayload":{"orderId":"12345","paymentMethod":"pix","status":"confirmed","processedAt":"2026-03-15T10:30:00+00:00","assunto":"Pagamento confirmado","mensagem":"Seu pagamento foi realizado com sucesso para a ordem numero 12345 via pix. Processado em 2026-03-15T10:30:00+00:00"},"prettyPayload":"{\n  \"orderId\": \"12345\",\n  \"paymentMethod\": \"pix\",\n  \"status\": \"confirmed\",\n  \"processedAt\": \"2026-03-15T10:30:00+00:00\",\n  \"assunto\": \"Pagamento confirmado\",\n  \"mensagem\": \"Seu pagamento foi realizado com sucesso para a ordem numero 12345 via pix. Processado em 2026-03-15T10:30:00+00:00\"\n}"}
```


