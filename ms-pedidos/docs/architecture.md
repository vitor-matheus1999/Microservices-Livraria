# Arquitetura de Camadas

Este servico segue uma estrutura simples inspirada em clean architecture/layered architecture:

1. Controller: recebe HTTP, valida entrada e chama o service.
2. Service: aplica regra de negocio e orquestra o fluxo.
3. Repository: faz operacoes de persistencia no PostgreSQL.
4. Database: camada de infraestrutura conectada via TypeORM.

Fluxo principal:

Controller -> Service -> Repository -> Database
