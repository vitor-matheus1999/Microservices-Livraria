# Workflow Deploy Local - Padrão para Microserviços

## Padrão Mínimo

Para cada microserviço, crie o arquivo `.github/workflows/deploy-local.yml` (ou `deploy.yml`) com:

```yaml
name: Deploy Local

on:
  push:
    branches:
      - main

concurrency:
  group: deploy-{MICROSERVICE_NAME}
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: [self-hosted, linux, docker, {MICROSERVICE_NAME}]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build e recreate
        run: |
          docker compose build --no-cache
          docker compose up -d --force-recreate

      - name: Healthcheck basico
        run: docker compose ps
```

Substitua `{MICROSERVICE_NAME}` pelos valores específicos:
- `ms-pedidos` (para o microserviço de pedidos)
- `notification-service` (para o serviço de notificações)
- `payment-service` (para o serviço de pagamentos)

### 3. Boas Práticas

- **Credenciais Sensíveis**: Use GitHub Secrets em `Settings > Secrets and variables > Actions` para variáveis sensiveis (tokens, chaves API, etc.)
- **Docker Compose**: Certifique-se de que `docker-compose.yml` existe no diretório raiz do repositório
- **Runner Dedicado**: O runner self-hosted deve estar registrado com os labels apropriados (linux, docker, e o nome do microserviço)
- **Sem Webhook Local**: Este fluxo não requer exposição de webhooks HTTP locais


### 4. Estrutura de Repositório Esperada  

```
{microservice-repo}/
├── .github/
│   └── workflows/
│       └── deploy-local.yml
├── docker-compose.yml
├── Dockerfile
├── src/
└── ...
```

## Exemplo: ms-pedidos ✅

O workflow em `.github/workflows/deploy.yml` deste repositório já foi simplificado e segue exatamente o padrão mínimo:
- ✅ Trigger na branch `main`
- ✅ Runner dedicado com label `ms-pedidos`
- ✅ Build com `docker compose build --no-cache`
- ✅ Deploy com `docker compose up -d --force-recreate`
- ✅ Health check básico com `docker compose ps`
- ✅ Concurrency control (`deploy-ms-pedidos`)


## Referências
- [GitHub Actions - Self Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Concurrency in GitHub Actions](https://docs.github.com/en/actions/using-jobs/using-concurrency)