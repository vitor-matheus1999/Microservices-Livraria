# Guia Docker Compose

Este guia explica como subir e gerenciar um ambiente containerizado utilizando Docker Compose.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0+)

Para verificar as instalações:
```bash
docker --version
docker compose version
```

Dentro da pasta do projeto realize o comanhdo 
```bash
docker compose up -d
```
E os serviços inclusos irão ser criados no docker
