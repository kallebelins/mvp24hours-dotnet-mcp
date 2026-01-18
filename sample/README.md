# Mvp24Hours - Samples de Validação

Este diretório contém todos os samples necessários para validar os componentes do framework Mvp24Hours.

## Estrutura

```
sample/
├── 01-core/           # Core patterns (Entities, VOs, Guards, Specs)
├── 02-database/       # Database providers (SQL Server, PostgreSQL, MySQL, MongoDB, Redis)
├── 03-cqrs/           # CQRS/Mediator (Commands, Queries, Events, Sagas)
├── 04-infrastructure/ # Infrastructure (Pipeline, Caching, CronJob, Channels)
├── 05-messaging/      # Messaging (RabbitMQ)
├── 06-webapi/         # WebAPI (Minimal API, Controllers, Versioning)
├── 07-modernization/  # .NET 9 features (HybridCache, RateLimiting, TimeProvider)
├── 08-observability/  # Observability (OpenTelemetry, Health Checks)
├── 09-security/       # Security (JWT, API Key, OAuth)
├── 10-testing/        # Testing patterns (Unit, Integration, TestContainers)
├── 11-templates/      # Architecture templates
├── 12-ai/             # AI Integration (Semantic Kernel, Agents)
└── docker/            # Docker e Kubernetes configs
```

## Pré-requisitos

- .NET 9 SDK
- Docker e Docker Compose
- Visual Studio 2022 ou VS Code com extensões C#

## Iniciando a Infraestrutura

```bash
# Subir todos os serviços de infraestrutura
cd docker
docker-compose up -d

# Verificar status
docker-compose ps
```

## Executando os Samples

Cada pasta contém um README específico com instruções detalhadas.

### Exemplo: Core Patterns

```bash
cd 01-core
dotnet build
dotnet test
```

## Validação

Após executar cada sample, atualize o checklist em `tasks/tasks-version-1-0-5.md` marcando os itens validados.

## Contribuição

1. Escolha um item não validado do checklist
2. Crie o sample correspondente
3. Adicione testes
4. Atualize a documentação
5. Marque como validado no checklist
