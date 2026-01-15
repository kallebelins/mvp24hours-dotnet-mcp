# ReorganizaÃ§Ã£o do MCP Mvp24Hours v1.0.2 - Lista de Tarefas

## Objetivo
Reorganizar o MCP para que cada arquitetura ou recurso forneÃ§a contexto completo e preciso, carregando documentaÃ§Ã£o real dos arquivos `.md` em vez de conteÃºdo hardcoded.

---

## Problemas Identificados

1. **DocumentaÃ§Ã£o HARDCODED**: Tools como `database-advisor.ts`, `observability-setup.ts` tÃªm conteÃºdo inline no TypeScript
2. **Interfaces incorretas**: O cÃ³digo hardcoded pode usar interfaces genÃ©ricas erradas
3. **DocumentaÃ§Ã£o nÃ£o coberta**: VÃ¡rios arquivos `.md` nÃ£o sÃ£o acessÃ­veis via nenhuma tool
4. **Contexto fragmentado**: Quando alguÃ©m escolhe uma arquitetura (ex: CQRS), nÃ£o recebe os recursos relacionados
5. **Falta de coesÃ£o**: Cada tool opera isoladamente sem fornecer o contexto completo

---

## Fase 1: Corrigir Tools Existentes para Usar DocumentaÃ§Ã£o Real

### 1.1 Atualizar `database-advisor.ts`
**Arquivo:** `src/tools/database-advisor.ts`
**Status:** âœ… ConcluÃ­do

- [x] Importar `loadDoc`, `loadDocs`, `docExists` de `../utils/doc-loader.js`
- [x] Adicionar novos topics ao schema enum:
  - [x] `entity` â†’ `database/use-entity.md`
  - [x] `context` â†’ `database/use-context.md`
  - [x] `service` â†’ `database/use-service.md`
  - [x] `efcore-advanced` â†’ `database/efcore-advanced.md`
  - [x] `mongodb-advanced` â†’ `database/mongodb-advanced.md`
- [x] Criar mapeamento `topicToFiles` para carregar docs reais:
  - [x] `relational` â†’ `database/relational.md`
  - [x] `nosql` â†’ `database/nosql.md`
  - [x] `repository` â†’ `database/use-repository.md`
  - [x] `unit-of-work` â†’ `database/use-unitofwork.md`
- [x] Substituir conteÃºdo hardcoded por `loadDocs()`
- [x] Adicionar Quick Reference com interfaces corretas
- [x] Adicionar seÃ§Ã£o de Related Topics

### 1.2 Atualizar `observability-setup.ts`
**Arquivo:** `src/tools/observability-setup.ts`
**Status:** âœ… ConcluÃ­do

- [x] Importar `loadDoc`, `loadDocs`, `docExists` de `../utils/doc-loader.js`
- [x] Criar mapeamento de components para arquivos:
  - [x] `overview` â†’ `observability/home.md`, `ai-context/observability-patterns.md`
  - [x] `logging` â†’ `observability/logging.md`
  - [x] `tracing` â†’ `observability/tracing.md`
  - [x] `metrics` â†’ `observability/metrics.md`
  - [x] `exporters` â†’ `observability/exporters.md`
  - [x] `migration` â†’ `observability/migration.md`
- [x] Adicionar novos topics:
  - [x] `audit` â†’ `cqrs/observability/audit.md`
  - [x] `cqrs-tracing` â†’ `cqrs/observability/tracing.md`
  - [x] `cqrs-telemetry` â†’ `cqrs/observability/telemetry.md`
- [x] Criar mapeamento de exporters para seÃ§Ãµes especÃ­ficas
- [x] Substituir todo conteÃºdo hardcoded por `loadDocs()`
- [x] Adicionar Quick Reference com interfaces do Mvp24Hours
- [x] Adicionar seÃ§Ã£o de Related Topics

### 1.3 Atualizar `cqrs-guide.ts`
**Arquivo:** `src/tools/cqrs-guide.ts`
**Status:** âœ… ConcluÃ­do

- [x] Adicionar topics faltantes ao schema enum:
  - [x] `mediator`
  - [x] `concepts-comparison`
  - [x] `integration-rabbitmq`
  - [x] `audit`
  - [x] `cqrs-tracing`
  - [x] `cqrs-telemetry`
- [x] Adicionar mapeamentos em `topicToFiles`:
  - [x] `mediator` â†’ `cqrs/mediator.md`
  - [x] `concepts-comparison` â†’ `cqrs/concepts-comparison.md`
  - [x] `integration-rabbitmq` â†’ `cqrs/integration-rabbitmq.md` + `ai-context/messaging-patterns.md`
  - [x] `audit` â†’ `cqrs/observability/audit.md`
  - [x] `cqrs-tracing` â†’ `cqrs/observability/tracing.md`
  - [x] `cqrs-telemetry` â†’ `cqrs/observability/telemetry.md`
- [x] Atualizar `relatedTopics` com novos topics
- [x] Atualizar `getTopicDescription()` com descriÃ§Ãµes dos novos topics
- [x] Atualizar `getAvailableTopicsMessage()` com novos topics na listagem

### 1.4 Atualizar `modernization-guide.ts`
**Arquivo:** `src/tools/modernization-guide.ts`
**Status:** âœ… ConcluÃ­do

- [x] Importar `loadDoc`, `loadDocs`, `docExists` de `../utils/doc-loader.js`
- [x] Adicionar features faltantes ao schema enum:
  - [x] `channels` (jÃ¡ existia)
  - [x] `dotnet9-features`
  - [x] `migration-guide`
  - [x] `native-openapi` (jÃ¡ existia)
  - [x] `options-configuration`
  - [x] `problem-details` (jÃ¡ existia)
  - [x] `source-generators` (jÃ¡ existia)
- [x] Adicionar nova categoria `communication` para Channels
- [x] Criar mapeamento `featureToFiles` para carregar docs reais:
  - [x] `http-resilience` â†’ `modernization/http-resilience.md`
  - [x] `generic-resilience` â†’ `modernization/generic-resilience.md`
  - [x] `rate-limiting` â†’ `modernization/rate-limiting.md`
  - [x] `hybrid-cache` â†’ `modernization/hybrid-cache.md`
  - [x] `output-caching` â†’ `modernization/output-caching.md`
  - [x] `time-provider` â†’ `modernization/time-provider.md`
  - [x] `periodic-timer` â†’ `modernization/periodic-timer.md`
  - [x] `keyed-services` â†’ `modernization/keyed-services.md`
  - [x] `options-configuration` â†’ `modernization/options-configuration.md`
  - [x] `problem-details` â†’ `modernization/problem-details.md`
  - [x] `minimal-apis` â†’ `modernization/minimal-apis.md`
  - [x] `native-openapi` â†’ `modernization/native-openapi.md`
  - [x] `source-generators` â†’ `modernization/source-generators.md`
  - [x] `aspire` â†’ `modernization/aspire.md`
  - [x] `channels` â†’ `modernization/channels.md`
  - [x] `dotnet9-features` â†’ `modernization/dotnet9-features.md`
  - [x] `migration-guide` â†’ `modernization/migration-guide.md`
- [x] Criar mapeamento `categoryToFiles` para categorias
- [x] Substituir todo conteÃºdo hardcoded por `loadDocs()`
- [x] Adicionar `relatedTopics` para cross-referencing
- [x] Adicionar Quick Reference para features principais
- [x] Adicionar seÃ§Ã£o de Related Topics

### 1.5 Atualizar `infrastructure-guide.ts`
**Arquivo:** `src/tools/infrastructure-guide.ts`
**Status:** âœ… ConcluÃ­do

- [x] Importar `loadDoc`, `loadDocs`, `docExists` de `../utils/doc-loader.js`
- [x] Adicionar topics faltantes ao schema enum:
  - [x] `caching-advanced`
  - [x] `cronjob-advanced`
  - [x] `cronjob-observability`
  - [x] `cronjob-resilience`
- [x] Criar/atualizar mapeamento para arquivos:
  - [x] `caching-advanced` â†’ `caching-advanced.md`
  - [x] `cronjob-advanced` â†’ `cronjob-advanced.md`
  - [x] `cronjob-observability` â†’ `cronjob-observability.md`
  - [x] `cronjob-resilience` â†’ `cronjob-resilience.md`
- [x] Verificar mapeamentos existentes:
  - [x] `pipeline` â†’ `pipeline.md`
  - [x] `caching` â†’ `caching-advanced.md` (bÃ¡sico)
  - [x] `webapi` â†’ `webapi.md`
  - [x] `webapi-advanced` â†’ `webapi-advanced.md`
  - [x] `cronjob` â†’ `cronjob.md`
  - [x] `application-services` â†’ `application-services.md`
- [x] Criar mapeamento `topicToFiles` para carregar docs reais
- [x] Adicionar `relatedTopics` para cross-referencing
- [x] Adicionar Quick Reference para cada topic
- [x] Atualizar overview com todos os topics disponÃ­veis
- [x] Substituir todo conteÃºdo hardcoded por `loadDoc()`

### 1.6 Atualizar `core-patterns.ts`
**Arquivo:** `src/tools/core-patterns.ts`
**Status:** âœ… ConcluÃ­do

- [x] Importar `loadDoc`, `loadDocs`, `docExists` de `../utils/doc-loader.js`
- [x] Adicionar topic faltante ao schema enum:
  - [x] `infrastructure-abstractions`
- [x] Criar mapeamento `topicToFiles` para carregar docs reais:
  - [x] `overview` â†’ `core/home.md`
  - [x] `guard-clauses` â†’ `core/guard-clauses.md`
  - [x] `value-objects` â†’ `core/value-objects.md`
  - [x] `strongly-typed-ids` â†’ `core/strongly-typed-ids.md`
  - [x] `functional-patterns` â†’ `core/functional-patterns.md`
  - [x] `smart-enums` â†’ `core/smart-enums.md`
  - [x] `entity-interfaces` â†’ `core/entity-interfaces.md`
  - [x] `infrastructure` â†’ `core/infrastructure-abstractions.md` (alias)
  - [x] `infrastructure-abstractions` â†’ `core/infrastructure-abstractions.md`
  - [x] `exceptions` â†’ `core/exceptions.md`
- [x] Criar `relatedTopics` para cross-referencing
- [x] Adicionar Quick Reference para cada topic
- [x] Substituir todo conteÃºdo hardcoded por `loadDocs()`

### 1.7 Atualizar `reference-guide.ts`
**Arquivo:** `src/tools/reference-guide.ts`
**Status:** âœ… ConcluÃ­do

- [x] Importar `loadDoc`, `loadDocs`, `docExists` de `../utils/doc-loader.js`
- [x] Adicionar topics faltantes ao schema enum:
  - [x] `api-versioning`
  - [x] `error-handling`
  - [x] `telemetry`
- [x] Criar mapeamento `topicToFiles` para carregar docs reais:
  - [x] `overview` â†’ `home.md`
  - [x] `mapping` â†’ `mapping.md`
  - [x] `validation` â†’ `validation.md`
  - [x] `specification` â†’ `specification.md`
  - [x] `documentation` â†’ `documentation.md`
  - [x] `migration` â†’ `migration.md`
  - [x] `api-versioning` â†’ `ai-context/api-versioning-patterns.md`
  - [x] `error-handling` â†’ `ai-context/error-handling-patterns.md`
  - [x] `telemetry` â†’ `telemetry.md`
- [x] Criar `relatedTopics` para cross-referencing
- [x] Criar `topicDescriptions` para overview
- [x] Adicionar Quick Reference para cada topic
- [x] Substituir todo conteÃºdo hardcoded por `loadDocs()`

---

## Fase 2: Criar Tool de Contexto Combinado

### 2.1 Nova Tool: `build-context.ts`
**Arquivo:** `src/tools/build-context.ts`
**Status:** âœ… ConcluÃ­do

- [x] Criar arquivo `src/tools/build-context.ts`
- [x] Definir schema com parÃ¢metros:
  ```typescript
  {
    architecture: enum ["cqrs", "event-driven", "clean-architecture", "ddd", 
                        "hexagonal", "minimal-api", "simple-nlayers", 
                        "complex-nlayers", "microservices"],
    resources?: array ["database", "caching", "observability", "messaging", 
                       "security", "testing", "containerization"],
    database_provider?: enum ["postgresql", "sqlserver", "mysql", "mongodb", "redis"]
  }
  ```
- [x] Implementar lÃ³gica de combinaÃ§Ã£o de contexto:
  - [x] Mapeamento de arquitetura para docs principais
  - [x] Mapeamento de recursos para docs adicionais
  - [x] Mapeamento de database_provider para configuraÃ§Ã£o especÃ­fica
- [x] Criar `architectureContextMap`:
  ```typescript
  {
    "cqrs": [
      "ai-context/template-cqrs.md",
      "cqrs/commands.md",
      "cqrs/queries.md",
      "cqrs/behaviors.md",
      "database/use-repository.md",
      "database/use-unitofwork.md"
    ],
    "event-driven": [
      "ai-context/template-event-driven.md",
      "cqrs/domain-events.md",
      "cqrs/integration-events.md",
      "ai-context/messaging-patterns.md"
    ],
    // ... outros
  }
  ```
- [x] Criar `resourceContextMap`:
  ```typescript
  {
    "database": ["ai-context/database-patterns.md"],
    "caching": ["caching-advanced.md", "modernization/hybrid-cache.md"],
    "observability": ["ai-context/observability-patterns.md", "observability/logging.md", "observability/tracing.md"],
    "messaging": ["ai-context/messaging-patterns.md", "broker.md"],
    "security": ["ai-context/security-patterns.md"],
    "testing": ["ai-context/testing-patterns.md"],
    "containerization": ["ai-context/containerization-patterns.md"]
  }
  ```
- [x] Implementar funÃ§Ã£o `buildContext(args)`
- [x] Adicionar seÃ§Ã£o "Next Steps" com tools relacionadas
- [x] Exportar `buildContext` e `buildContextSchema`

---

## Fase 3: Melhorar `get-template.ts` para Contexto Completo

### 3.1 Adicionar Contexto Relacionado por Arquitetura
**Arquivo:** `src/tools/get-template.ts`
**Status:** âœ… ConcluÃ­do

- [x] Criar mapeamento `templateContextMap` com docs relacionados por template
- [x] Para template `cqrs`, carregar tambÃ©m:
  - [x] `cqrs/commands.md`
  - [x] `cqrs/queries.md`
  - [x] `cqrs/behaviors.md`
  - [x] `database/use-repository.md`
  - [x] `database/use-unitofwork.md`
- [x] Para template `event-driven`, carregar tambÃ©m:
  - [x] `cqrs/domain-events.md`
  - [x] `cqrs/integration-events.md`
  - [x] `ai-context/messaging-patterns.md`
  - [x] `cqrs/resilience/inbox-outbox.md`
- [x] Para template `ddd`, carregar tambÃ©m:
  - [x] `core/value-objects.md`
  - [x] `core/entity-interfaces.md`
  - [x] `cqrs/domain-events.md`
  - [x] `core/strongly-typed-ids.md`
  - [x] `core/guard-clauses.md`
- [x] Para template `clean-architecture`, carregar tambÃ©m:
  - [x] `core/entity-interfaces.md`
  - [x] `cqrs/commands.md`
  - [x] `cqrs/queries.md`
  - [x] `database/use-repository.md`
- [x] Para template `hexagonal`, carregar tambÃ©m:
  - [x] `core/entity-interfaces.md`
  - [x] `core/infrastructure-abstractions.md`
  - [x] `database/use-repository.md`
  - [x] `cqrs/commands.md`
- [x] Para template `microservices`, carregar tambÃ©m:
  - [x] `ai-context/messaging-patterns.md`
  - [x] `cqrs/integration-events.md`
  - [x] `cqrs/resilience/circuit-breaker.md`
  - [x] `cqrs/resilience/retry.md`
  - [x] `ai-context/containerization-patterns.md`
- [x] Atualizar funÃ§Ã£o `getTemplate()` para usar `loadDocs()` com contexto
- [x] Adicionar flag opcional `include_context: boolean` ao schema
- [x] Adicionar seÃ§Ã£o "Suggested Next Steps" por template
- [x] Manter templates inline (fallback) para casos onde doc nÃ£o existe

---

## Fase 4: Atualizar `architecture-advisor.ts`

### 4.1 Carregar DocumentaÃ§Ã£o Real
**Arquivo:** `src/tools/architecture-advisor.ts`
**Status:** âœ… ConcluÃ­do

- [x] Importar `loadDoc`, `loadDocs`, `docExists`
- [x] Carregar `ai-context/decision-matrix.md` para matriz de decisÃ£o
- [x] Carregar `ai-context/architecture-templates.md` para overview
- [x] Substituir `getTemplateInfo()` hardcoded por docs reais quando disponÃ­veis

### 4.2 Melhorar RecomendaÃ§Ãµes
**Status:** âœ… ConcluÃ­do

- [x] ApÃ³s recomendar arquitetura, incluir lista de recursos necessÃ¡rios
- [x] Adicionar comando sugerido: `mvp24h_build_context({ architecture: "X", resources: [...] })`
- [x] Incluir pacotes NuGet da documentaÃ§Ã£o real
- [x] Adicionar seÃ§Ã£o "Implementation Checklist"

---

## Fase 5: Registrar Nova Tool no `index.ts`

### 5.1 Atualizar `index.ts`
**Arquivo:** `src/index.ts`
**Status:** âœ… ConcluÃ­do

- [x] Importar `buildContext` e `buildContextSchema` de `./tools/build-context.js`
- [x] Adicionar tool na lista `ListToolsRequestSchema`:
  ```typescript
  {
    name: "mvp24h_build_context",
    description: `Builds complete context for implementing a .NET application.
  Combines architecture template with selected resources (database, caching, observability, etc.).
  Returns: Complete documentation for the chosen architecture and resources.`,
    inputSchema: buildContextSchema,
  }
  ```
- [x] Adicionar case no switch de `CallToolRequestSchema`:
  ```typescript
  case "mvp24h_build_context":
    return { content: [{ type: "text", text: await buildContext(args) }] };
  ```

---

## Fase 6: Criar DocumentaÃ§Ã£o de ReferÃªncia RÃ¡pida

### 6.1 Criar `quick-reference.md`
**Arquivo:** `docs/ai-context/quick-reference.md`
**Status:** âœ… ConcluÃ­do

- [x] Criar arquivo com estrutura:
  - [x] SeÃ§Ã£o: CQRS/Mediator Interfaces
  - [x] SeÃ§Ã£o: Repository Interfaces
  - [x] SeÃ§Ã£o: Entity Base Classes
  - [x] SeÃ§Ã£o: Business Result Types
  - [x] SeÃ§Ã£o: Pipeline Interfaces
  - [x] SeÃ§Ã£o: Infrastructure Abstractions
  - [x] SeÃ§Ã£o: Marker Interfaces
- [x] Incluir tabela com colunas: Interface | Namespace | DescriÃ§Ã£o | Exemplo
- [x] Adicionar exemplos mÃ­nimos de cÃ³digo para cada interface principal

### 6.2 Criar `nuget-packages.md`
**Arquivo:** `docs/ai-context/nuget-packages.md`
**Status:** âœ… ConcluÃ­do

- [x] Criar arquivo com lista completa de pacotes:
  - [x] `Mvp24Hours.Core`
  - [x] `Mvp24Hours.Application`
  - [x] `Mvp24Hours.Infrastructure.Data.EFCore`
  - [x] `Mvp24Hours.Infrastructure.Data.MongoDb`
  - [x] `Mvp24Hours.Infrastructure.Caching`
  - [x] `Mvp24Hours.Infrastructure.RabbitMQ`
  - [x] `Mvp24Hours.Infrastructure.Pipe`
  - [x] `Mvp24Hours.Infrastructure.Cqrs`
  - [x] `Mvp24Hours.Infrastructure.CronJob`
  - [x] `Mvp24Hours.WebAPI`
- [x] Para cada pacote incluir:
  - [x] DescriÃ§Ã£o
  - [x] Quando usar
  - [x] DependÃªncias
  - [x] VersÃ£o mÃ­nima
  - [x] ConfiguraÃ§Ã£o exemplo
- [x] Adicionado Quick Installation Guide para cada tipo de projeto
- [x] Adicionado Project File Reference (.csproj)

---

## Fase 6.3: Cobertura Completa de Pacotes NuGet

### 6.3.1 Adicionar topic `infrastructure-base` ao `infrastructure-guide.ts`
**Arquivo:** `src/tools/infrastructure-guide.ts`
**Status:** âœ… ConcluÃ­do
**Pacote:** `Mvp24Hours.Infrastructure`

- [x] Adicionar topic `infrastructure-base` ao schema enum
- [x] Criar documentaÃ§Ã£o `docs/infrastructure-base.md`
- [x] Cobrir features do pacote base:
    - [x] HTTP client factory com Polly resilience
    - [x] MessagePack serialization
    - [x] Scriban templates
    - [x] Redis connectivity base
    - [x] Health checks base
- [x] Adicionar mapeamento em `topicToFiles`
- [x] Adicionar Quick Reference

### 6.3.2 Adicionar topic `caching-redis` ao `infrastructure-guide.ts`
**Arquivo:** `src/tools/infrastructure-guide.ts`
**Status:** âœ… ConcluÃ­do
**Pacote:** `Mvp24Hours.Infrastructure.Caching.Redis`

- [x] Adicionar topic `caching-redis` ao schema enum
- [x] Criar documentaÃ§Ã£o `docs/caching-redis.md`
- [x] Cobrir features especÃ­ficos do Redis:
  - [x] Redis extensions
  - [x] ConfiguraÃ§Ã£o simplificada
  - [x] HybridCache L2 layer
- [x] Adicionar mapeamento em `topicToFiles`
- [x] Adicionar Quick Reference

### 6.3.3 Verificar topic `secrets-management` em `security-patterns.ts`
**Arquivo:** `src/tools/security-patterns.ts`
**Status:** âœ… ConcluÃ­do
**Pacote:** `Mvp24Hours.Infrastructure`

- [x] Verificar se topic `secrets-management` já existe (SIM, existe)
- [x] Verificar se cobre todos os features:
  - [x] Azure Key Vault integration (expandido com Managed Identity, Certificates, Caching)
  - [x] AWS Secrets Manager integration (ADICIONADO - completo)
  - [x] Configuração segura (Multi-cloud support)
- [x] Expandir documentação se necessário para alinhar com nuget-packages.md
  - [x] Adicionado Overview com pacotes
  - [x] Expandido Azure Key Vault com múltiplas credenciais
  - [x] Adicionado AWS Secrets Manager completo
  - [x] Adicionado Quick Reference table
  - [x] Adicionado Related Topics

### 6.3.4 Verificar Cobertura Completa de Pacotes
**Status:** â³ Pendente

Tabela de verificaÃ§Ã£o final:

| Pacote | Tool | Topic | Status |
|--------|------|-------|--------|
| `Mvp24Hours.Core` | `core-patterns` | overview, guards, etc. | âœ… |
| `Mvp24Hours.Infrastructure` | `infrastructure-guide` | `infrastructure-base` | âœ… |
| `Mvp24Hours.Application` | `infrastructure-guide` | `application-services` | âœ… |
| `Mvp24Hours.Infrastructure.Caching` | `infrastructure-guide` | `caching`, `caching-advanced` | âœ… |
| `Mvp24Hours.Infrastructure.Caching.Redis` | `infrastructure-guide` | `caching-redis` | âœ… |
| `Mvp24Hours.Infrastructure.Cqrs` | `cqrs-guide` | commands, queries, etc. | âœ… |
| `Mvp24Hours.Infrastructure.CronJob` | `infrastructure-guide` | `cronjob`, `cronjob-*` | âœ… |
| `Mvp24Hours.Infrastructure.Data.EFCore` | `database-advisor` | relational, efcore-advanced | âœ… |
| `Mvp24Hours.Infrastructure.Data.MongoDb` | `database-advisor` | nosql, mongodb-advanced | âœ… |
| `Mvp24Hours.Infrastructure.Pipe` | `infrastructure-guide` | `pipeline` | âœ… |
| `Mvp24Hours.Infrastructure.RabbitMQ` | `messaging-patterns` | rabbitmq, outbox | âœ… |
| `Mvp24Hours.WebAPI` | `infrastructure-guide` | `webapi`, `webapi-advanced` | âœ… |

---

## Fase 7: Testes e ValidaÃ§Ã£o

### 7.1 Testar CQRS Guide
- [ ] `mvp24h_cqrs_guide({ topic: "commands" })` - verificar `IMediatorCommand`
- [ ] `mvp24h_cqrs_guide({ topic: "mediator" })` - verificar novo topic
- [ ] `mvp24h_cqrs_guide({ topic: "integration-rabbitmq" })` - verificar novo topic
- [ ] `mvp24h_cqrs_guide({ topic: "audit" })` - verificar novo topic

### 7.2 Testar Database Advisor
- [ ] `mvp24h_database_advisor({ provider: "postgresql" })` - verificar docs reais
- [ ] `mvp24h_database_advisor({ patterns: ["repository", "unit-of-work"] })` - verificar padrÃµes

### 7.3 Testar Observability Setup
- [ ] `mvp24h_observability_setup({ component: "logging" })` - verificar docs reais
- [ ] `mvp24h_observability_setup({ exporter: "jaeger" })` - verificar configuraÃ§Ã£o

### 7.4 Testar Build Context (Nova Tool)
- [ ] `mvp24h_build_context({ architecture: "cqrs" })` - verificar contexto bÃ¡sico
- [ ] `mvp24h_build_context({ architecture: "cqrs", resources: ["database", "observability"] })` - verificar combinaÃ§Ã£o
- [ ] `mvp24h_build_context({ architecture: "event-driven", resources: ["messaging"] })` - verificar event-driven

### 7.5 Testar Get Template com Contexto
- [ ] `mvp24h_get_template({ template_name: "cqrs" })` - verificar contexto completo
- [ ] `mvp24h_get_template({ template_name: "ddd" })` - verificar DDD com value objects

### 7.6 Testar Fluxo Completo
- [ ] Simular cenÃ¡rio: "Criar API com CQRS, PostgreSQL, Redis, Observability"
- [ ] Verificar se todas as informaÃ§Ãµes necessÃ¡rias sÃ£o fornecidas
- [ ] Validar que nÃ£o hÃ¡ informaÃ§Ãµes conflitantes ou desatualizadas

---

## Fase 8: Build e PublicaÃ§Ã£o

### 8.1 Build e VerificaÃ§Ã£o
- [ ] Executar `npm run build`
- [ ] Verificar se compila sem erros
- [ ] Testar localmente com MCP inspector

### 8.2 Atualizar VersÃ£o
- [ ] Incrementar versÃ£o no `package.json` para `1.0.2`
- [ ] Criar/atualizar `CHANGELOG.md` com mudanÃ§as

### 8.3 Publicar
- [ ] `npm pack` para criar pacote
- [ ] Testar instalaÃ§Ã£o local
- [ ] Publicar no npm (se aplicÃ¡vel)

---

## Mapeamento Completo de DocumentaÃ§Ã£o

### Arquivos `docs/ai-context/` (42 arquivos)

| Arquivo | Tool ResponsÃ¡vel | Status |
|---------|------------------|--------|
| `ai-decision-matrix.md` | `ai-implementation` | âœ… |
| `ai-implementation-index.md` | `ai-implementation` | âœ… |
| `api-versioning-patterns.md` | `reference-guide` | âœ… |
| `architecture-templates.md` | `architecture-advisor` | âœ… |
| `containerization-patterns.md` | `containerization-patterns` | âœ… |
| `database-patterns.md` | `database-advisor` | â³ Carregar |
| `decision-matrix.md` | `architecture-advisor` | âœ… |
| `error-handling-patterns.md` | `reference-guide` | âœ… |
| `home.md` | `get-started` | âœ… |
| `messaging-patterns.md` | `messaging-patterns` | âœ… |
| `modernization-patterns.md` | `modernization-guide` | âœ… |
| `observability-patterns.md` | `observability-setup` | âœ… |
| `project-structure.md` | `get-template` | âœ… |
| `security-patterns.md` | `security-patterns` | âœ… |
| `structure-*.md` (3 arquivos) | `get-template` | âœ… |
| `template-*.md` (24 arquivos) | `get-template` | âœ… |
| `testing-patterns.md` | `testing-patterns` | âœ… |

### Arquivos `docs/cqrs/` (30+ arquivos)

| Arquivo | Tool ResponsÃ¡vel | Status |
|---------|------------------|--------|
| `api-reference.md` | `cqrs-guide` | âœ… |
| `behaviors.md` | `cqrs-guide` | âœ… |
| `best-practices.md` | `cqrs-guide` | âœ… |
| `commands.md` | `cqrs-guide` | âœ… |
| `concepts-comparison.md` | `cqrs-guide` | â³ Adicionar |
| `domain-events.md` | `cqrs-guide` | âœ… |
| `event-sourcing/*.md` (5 arquivos) | `cqrs-guide` | âœ… |
| `extensibility.md` | `cqrs-guide` | âœ… |
| `getting-started.md` | `cqrs-guide` | âœ… |
| `home.md` | `cqrs-guide` | âœ… |
| `integration-caching.md` | `cqrs-guide` | âœ… |
| `integration-events.md` | `cqrs-guide` | âœ… |
| `integration-rabbitmq.md` | `cqrs-guide` | â³ Adicionar |
| `integration-repository.md` | `cqrs-guide` | âœ… |
| `integration-unitofwork.md` | `cqrs-guide` | âœ… |
| `mediator.md` | `cqrs-guide` | â³ Adicionar |
| `migration-mediatr.md` | `cqrs-guide` | âœ… |
| `multi-tenancy.md` | `cqrs-guide` | âœ… |
| `notifications.md` | `cqrs-guide` | âœ… |
| `observability/*.md` (3 arquivos) | `cqrs-guide` / `observability-setup` | âœ… (`observability-setup`) |
| `queries.md` | `cqrs-guide` | âœ… |
| `resilience/*.md` (4 arquivos) | `cqrs-guide` | âœ… |
| `saga/*.md` (3 arquivos) | `cqrs-guide` | âœ… |
| `scheduled-commands.md` | `cqrs-guide` | âœ… |
| `specifications.md` | `cqrs-guide` | âœ… |
| `validation-behavior.md` | `cqrs-guide` | âœ… |

### Arquivos `docs/database/` (9 arquivos)

| Arquivo | Tool ResponsÃ¡vel | Status |
|---------|------------------|--------|
| `efcore-advanced.md` | `database-advisor` | â³ Adicionar |
| `mongodb-advanced.md` | `database-advisor` | â³ Adicionar |
| `nosql.md` | `database-advisor` | â³ Carregar |
| `relational.md` | `database-advisor` | â³ Carregar |
| `use-context.md` | `database-advisor` | â³ Adicionar |
| `use-entity.md` | `database-advisor` | â³ Adicionar |
| `use-repository.md` | `database-advisor` | â³ Carregar |
| `use-service.md` | `database-advisor` | â³ Adicionar |
| `use-unitofwork.md` | `database-advisor` | â³ Carregar |

### Arquivos `docs/observability/` (6 arquivos)

| Arquivo | Tool ResponsÃ¡vel | Status |
|---------|------------------|--------|
| `exporters.md` | `observability-setup` | âœ… |
| `home.md` | `observability-setup` | âœ… |
| `logging.md` | `observability-setup` | âœ… |
| `metrics.md` | `observability-setup` | âœ… |
| `migration.md` | `observability-setup` | âœ… |
| `tracing.md` | `observability-setup` | âœ… |

### Arquivos `docs/modernization/` (17 arquivos)

| Arquivo | Tool ResponsÃ¡vel | Status |
|---------|------------------|--------|
| `aspire.md` | `modernization-guide` | âœ… |
| `channels.md` | `modernization-guide` | â³ Adicionar |
| `dotnet9-features.md` | `modernization-guide` | â³ Adicionar |
| `generic-resilience.md` | `modernization-guide` | âœ… |
| `http-resilience.md` | `modernization-guide` | âœ… |
| `hybrid-cache.md` | `modernization-guide` | âœ… |
| `keyed-services.md` | `modernization-guide` | âœ… |
| `migration-guide.md` | `modernization-guide` | â³ Adicionar |
| `minimal-apis.md` | `modernization-guide` | âœ… |
| `native-openapi.md` | `modernization-guide` | â³ Adicionar |
| `options-configuration.md` | `modernization-guide` | â³ Adicionar |
| `output-caching.md` | `modernization-guide` | âœ… |
| `periodic-timer.md` | `modernization-guide` | âœ… |
| `problem-details.md` | `modernization-guide` | â³ Adicionar |
| `rate-limiting.md` | `modernization-guide` | âœ… |
| `source-generators.md` | `modernization-guide` | â³ Adicionar |
| `time-provider.md` | `modernization-guide` | âœ… |

### Arquivos `docs/core/` (9 arquivos)

| Arquivo | Tool ResponsÃ¡vel | Status |
|---------|------------------|--------|
| `entity-interfaces.md` | `core-patterns` | âœ… |
| `exceptions.md` | `core-patterns` | âœ… |
| `functional-patterns.md` | `core-patterns` | âœ… |
| `guard-clauses.md` | `core-patterns` | âœ… |
| `home.md` | `core-patterns` | âœ… |
| `infrastructure-abstractions.md` | `core-patterns` | âœ… |
| `smart-enums.md` | `core-patterns` | âœ… |
| `strongly-typed-ids.md` | `core-patterns` | âœ… |
| `value-objects.md` | `core-patterns` | âœ… |

### Arquivos `docs/` (raiz - 15+ arquivos)

| Arquivo | Tool ResponsÃ¡vel | Status |
|---------|------------------|--------|
| `application-services.md` | `infrastructure-guide` | âœ… |
| `broker-advanced.md` | `messaging-patterns` | âœ… |
| `broker.md` | `messaging-patterns` | âœ… |
| `caching-advanced.md` | `infrastructure-guide` | âœ… |
| `cronjob-advanced.md` | `infrastructure-guide` | âœ… |
| `cronjob-observability.md` | `infrastructure-guide` | âœ… |
| `cronjob-resilience.md` | `infrastructure-guide` | âœ… |
| `cronjob.md` | `infrastructure-guide` | âœ… |
| `documentation.md` | `reference-guide` | âœ… |
| `getting-started.md` | `get-started` | âœ… |
| `home.md` | `get-started` | âœ… |
| `logging.md` | `observability-setup` | â³ Verificar |
| `mapping.md` | `reference-guide` | âœ… |
| `migration.md` | `reference-guide` | âœ… |
| `pipeline.md` | `infrastructure-guide` | âœ… |
| `specification.md` | `reference-guide` | âœ… |
| `telemetry.md` | `reference-guide` | âœ… |
| `validation.md` | `reference-guide` | âœ… |
| `webapi-advanced.md` | `infrastructure-guide` | âœ… |
| `webapi.md` | `infrastructure-guide` | âœ… |

---

## Interfaces Corretas do Mvp24Hours (ReferÃªncia RÃ¡pida)

### CQRS/Mediator (`Mvp24Hours.Infrastructure.Cqrs.Abstractions`)

| Interface | DescriÃ§Ã£o |
|-----------|-----------|
| `IMediatorCommand<TResponse>` | Comando com retorno |
| `IMediatorCommand` | Comando sem retorno (void) |
| `IMediatorCommandHandler<TCommand, TResponse>` | Handler de comando |
| `IMediatorQuery<TResponse>` | Query com retorno |
| `IMediatorQueryHandler<TQuery, TResponse>` | Handler de query |
| `IMediatorNotification` | NotificaÃ§Ã£o in-process |
| `IMediatorNotificationHandler<TNotification>` | Handler de notificaÃ§Ã£o |
| `IMediator` | Interface principal (ISender + IPublisher) |
| `ISender` | Envia commands/queries |
| `IPublisher` | Publica notificaÃ§Ãµes |

### Repository (`Mvp24Hours.Core.Contract.Data`)

| Interface | DescriÃ§Ã£o |
|-----------|-----------|
| `IRepository<TEntity>` | Repository sÃ­ncrono |
| `IRepositoryAsync<TEntity>` | Repository assÃ­ncrono |
| `IUnitOfWork` | Unit of Work sÃ­ncrono |
| `IUnitOfWorkAsync` | Unit of Work assÃ­ncrono |

### Entidades (`Mvp24Hours.Core.Entities`)

| Classe | DescriÃ§Ã£o |
|--------|-----------|
| `EntityBase<TKey>` | Entidade base com ID tipado |
| `EntityBase` | Entidade base com ID int |

### Business Result (`Mvp24Hours.Core.Contract.ValueObjects.Logic`)

| Interface | DescriÃ§Ã£o |
|-----------|-----------|
| `IBusinessResult<T>` | Resultado de operaÃ§Ã£o |
| `IPagingResult<T>` | Resultado paginado |

---

## PrÃ³xima AÃ§Ã£o

**Iniciar pela Fase 1.1**: Atualizar `database-advisor.ts` para carregar documentaÃ§Ã£o real.

```bash
# Verificar arquivos de database disponÃ­veis
ls docs/database/
```

Arquivos disponÃ­veis:
- `efcore-advanced.md`
- `mongodb-advanced.md`
- `nosql.md`
- `relational.md`
- `use-context.md`
- `use-entity.md`
- `use-repository.md`
- `use-service.md`
- `use-unitofwork.md`

