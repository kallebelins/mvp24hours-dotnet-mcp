# Reorganização do MCP Mvp24Hours v1.0.2 - Lista de Tarefas

## Objetivo
Reorganizar o MCP para que cada arquitetura ou recurso forneça contexto completo e preciso, carregando documentação real dos arquivos `.md` em vez de conteúdo hardcoded.

---

## Problemas Identificados

1. **Documentação HARDCODED**: Tools como `database-advisor.ts`, `observability-setup.ts` têm conteúdo inline no TypeScript
2. **Interfaces incorretas**: O código hardcoded pode usar interfaces genéricas erradas
3. **Documentação não coberta**: Vários arquivos `.md` não são acessíveis via nenhuma tool
4. **Contexto fragmentado**: Quando alguém escolhe uma arquitetura (ex: CQRS), não recebe os recursos relacionados
5. **Falta de coesão**: Cada tool opera isoladamente sem fornecer o contexto completo

---

## Fase 1: Corrigir Tools Existentes para Usar Documentação Real

### 1.1 Atualizar `database-advisor.ts`
**Arquivo:** `src/tools/database-advisor.ts`
**Status:** ✅ Concluído

- [x] Importar `loadDoc`, `loadDocs`, `docExists` de `../utils/doc-loader.js`
- [x] Adicionar novos topics ao schema enum:
  - [x] `entity` → `database/use-entity.md`
  - [x] `context` → `database/use-context.md`
  - [x] `service` → `database/use-service.md`
  - [x] `efcore-advanced` → `database/efcore-advanced.md`
  - [x] `mongodb-advanced` → `database/mongodb-advanced.md`
- [x] Criar mapeamento `topicToFiles` para carregar docs reais:
  - [x] `relational` → `database/relational.md`
  - [x] `nosql` → `database/nosql.md`
  - [x] `repository` → `database/use-repository.md`
  - [x] `unit-of-work` → `database/use-unitofwork.md`
- [x] Substituir conteúdo hardcoded por `loadDocs()`
- [x] Adicionar Quick Reference com interfaces corretas
- [x] Adicionar seção de Related Topics

### 1.2 Atualizar `observability-setup.ts`
**Arquivo:** `src/tools/observability-setup.ts`
**Status:** ✅ Concluído

- [x] Importar `loadDoc`, `loadDocs`, `docExists` de `../utils/doc-loader.js`
- [x] Criar mapeamento de components para arquivos:
  - [x] `overview` → `observability/home.md`, `ai-context/observability-patterns.md`
  - [x] `logging` → `observability/logging.md`
  - [x] `tracing` → `observability/tracing.md`
  - [x] `metrics` → `observability/metrics.md`
  - [x] `exporters` → `observability/exporters.md`
  - [x] `migration` → `observability/migration.md`
- [x] Adicionar novos topics:
  - [x] `audit` → `cqrs/observability/audit.md`
  - [x] `cqrs-tracing` → `cqrs/observability/tracing.md`
  - [x] `cqrs-telemetry` → `cqrs/observability/telemetry.md`
- [x] Criar mapeamento de exporters para seções específicas
- [x] Substituir todo conteúdo hardcoded por `loadDocs()`
- [x] Adicionar Quick Reference com interfaces do Mvp24Hours
- [x] Adicionar seção de Related Topics

### 1.3 Atualizar `cqrs-guide.ts`
**Arquivo:** `src/tools/cqrs-guide.ts`
**Status:** ✅ Concluído

- [x] Adicionar topics faltantes ao schema enum:
  - [x] `mediator`
  - [x] `concepts-comparison`
  - [x] `integration-rabbitmq`
  - [x] `audit`
  - [x] `cqrs-tracing`
  - [x] `cqrs-telemetry`
- [x] Adicionar mapeamentos em `topicToFiles`:
  - [x] `mediator` → `cqrs/mediator.md`
  - [x] `concepts-comparison` → `cqrs/concepts-comparison.md`
  - [x] `integration-rabbitmq` → `cqrs/integration-rabbitmq.md` + `ai-context/messaging-patterns.md`
  - [x] `audit` → `cqrs/observability/audit.md`
  - [x] `cqrs-tracing` → `cqrs/observability/tracing.md`
  - [x] `cqrs-telemetry` → `cqrs/observability/telemetry.md`
- [x] Atualizar `relatedTopics` com novos topics
- [x] Atualizar `getTopicDescription()` com descrições dos novos topics
- [x] Atualizar `getAvailableTopicsMessage()` com novos topics na listagem

### 1.4 Atualizar `modernization-guide.ts`
**Arquivo:** `src/tools/modernization-guide.ts`
**Status:** ⏳ Pendente

- [ ] Adicionar features faltantes ao schema enum:
  - [ ] `channels`
  - [ ] `dotnet9-features`
  - [ ] `migration-guide`
  - [ ] `native-openapi`
  - [ ] `options-configuration`
  - [ ] `problem-details`
  - [ ] `source-generators`
- [ ] Criar/atualizar mapeamento para arquivos:
  - [ ] `channels` → `modernization/channels.md`
  - [ ] `dotnet9-features` → `modernization/dotnet9-features.md`
  - [ ] `migration-guide` → `modernization/migration-guide.md`
  - [ ] `native-openapi` → `modernization/native-openapi.md`
  - [ ] `options-configuration` → `modernization/options-configuration.md`
  - [ ] `problem-details` → `modernization/problem-details.md`
  - [ ] `source-generators` → `modernization/source-generators.md`
- [ ] Verificar se tool já usa `loadDocs()`, se não, implementar

### 1.5 Atualizar `infrastructure-guide.ts`
**Arquivo:** `src/tools/infrastructure-guide.ts`
**Status:** ⏳ Pendente

- [ ] Adicionar topics faltantes ao schema enum:
  - [ ] `caching-advanced`
  - [ ] `cronjob-advanced`
  - [ ] `cronjob-observability`
  - [ ] `cronjob-resilience`
- [ ] Criar/atualizar mapeamento para arquivos:
  - [ ] `caching-advanced` → `caching-advanced.md`
  - [ ] `cronjob-advanced` → `cronjob-advanced.md`
  - [ ] `cronjob-observability` → `cronjob-observability.md`
  - [ ] `cronjob-resilience` → `cronjob-resilience.md`
- [ ] Verificar mapeamentos existentes:
  - [ ] `pipeline` → `pipeline.md`
  - [ ] `caching` → `caching-advanced.md` (básico)
  - [ ] `webapi` → `webapi.md`
  - [ ] `webapi-advanced` → `webapi-advanced.md`
  - [ ] `cronjob` → `cronjob.md`
  - [ ] `application-services` → `application-services.md`

### 1.6 Atualizar `core-patterns.ts`
**Arquivo:** `src/tools/core-patterns.ts`
**Status:** ⏳ Pendente

- [ ] Adicionar topic faltante ao schema enum:
  - [ ] `infrastructure-abstractions`
- [ ] Adicionar mapeamento:
  - [ ] `infrastructure-abstractions` → `core/infrastructure-abstractions.md`
- [ ] Verificar se todos os outros topics estão mapeados:
  - [ ] `overview` → `core/home.md`
  - [ ] `guard-clauses` → `core/guard-clauses.md`
  - [ ] `value-objects` → `core/value-objects.md`
  - [ ] `strongly-typed-ids` → `core/strongly-typed-ids.md`
  - [ ] `functional-patterns` → `core/functional-patterns.md`
  - [ ] `smart-enums` → `core/smart-enums.md`
  - [ ] `entity-interfaces` → `core/entity-interfaces.md`
  - [ ] `exceptions` → `core/exceptions.md`

### 1.7 Atualizar `reference-guide.ts`
**Arquivo:** `src/tools/reference-guide.ts`
**Status:** ⏳ Pendente

- [ ] Adicionar topics faltantes ao schema enum:
  - [ ] `api-versioning`
  - [ ] `error-handling`
  - [ ] `telemetry`
- [ ] Criar/atualizar mapeamento para arquivos:
  - [ ] `api-versioning` → `ai-context/api-versioning-patterns.md`
  - [ ] `error-handling` → `ai-context/error-handling-patterns.md`
  - [ ] `telemetry` → `telemetry.md`
- [ ] Verificar mapeamentos existentes:
  - [ ] `mapping` → `mapping.md`
  - [ ] `validation` → `validation.md`
  - [ ] `specification` → `specification.md`
  - [ ] `documentation` → `documentation.md`
  - [ ] `migration` → `migration.md`

---

## Fase 2: Criar Tool de Contexto Combinado

### 2.1 Nova Tool: `build-context.ts`
**Arquivo:** `src/tools/build-context.ts`
**Status:** 🆕 Criar

- [ ] Criar arquivo `src/tools/build-context.ts`
- [ ] Definir schema com parâmetros:
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
- [ ] Implementar lógica de combinação de contexto:
  - [ ] Mapeamento de arquitetura para docs principais
  - [ ] Mapeamento de recursos para docs adicionais
  - [ ] Mapeamento de database_provider para configuração específica
- [ ] Criar `architectureContextMap`:
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
- [ ] Criar `resourceContextMap`:
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
- [ ] Implementar função `buildContext(args)`
- [ ] Adicionar seção "Next Steps" com tools relacionadas
- [ ] Exportar `buildContext` e `buildContextSchema`

---

## Fase 3: Melhorar `get-template.ts` para Contexto Completo

### 3.1 Adicionar Contexto Relacionado por Arquitetura
**Arquivo:** `src/tools/get-template.ts`
**Status:** ⏳ Pendente

- [ ] Criar mapeamento `templateContextMap` com docs relacionados por template
- [ ] Para template `cqrs`, carregar também:
  - [ ] `cqrs/commands.md`
  - [ ] `cqrs/queries.md`
  - [ ] `cqrs/behaviors.md`
  - [ ] `database/use-repository.md`
- [ ] Para template `event-driven`, carregar também:
  - [ ] `cqrs/domain-events.md`
  - [ ] `cqrs/integration-events.md`
  - [ ] `ai-context/messaging-patterns.md`
- [ ] Para template `ddd`, carregar também:
  - [ ] `core/value-objects.md`
  - [ ] `core/entity-interfaces.md`
  - [ ] `cqrs/domain-events.md`
- [ ] Para template `clean-architecture`, carregar também:
  - [ ] `core/entity-interfaces.md`
  - [ ] `cqrs/commands.md` (se usar CQRS)
- [ ] Atualizar função `getTemplate()` para usar `loadDocs()` com contexto
- [ ] Adicionar flag opcional `include_context: boolean` ao schema
- [ ] Remover templates inline (fallback) quando possível

---

## Fase 4: Atualizar `architecture-advisor.ts`

### 4.1 Carregar Documentação Real
**Arquivo:** `src/tools/architecture-advisor.ts`
**Status:** ⏳ Pendente

- [ ] Importar `loadDoc`, `loadDocs`, `docExists`
- [ ] Carregar `ai-context/decision-matrix.md` para matriz de decisão
- [ ] Carregar `ai-context/architecture-templates.md` para overview
- [ ] Substituir `getTemplateInfo()` hardcoded por docs reais quando disponíveis

### 4.2 Melhorar Recomendações
- [ ] Após recomendar arquitetura, incluir lista de recursos necessários
- [ ] Adicionar comando sugerido: `mvp24h_build_context({ architecture: "X", resources: [...] })`
- [ ] Incluir pacotes NuGet da documentação real
- [ ] Adicionar seção "Implementation Checklist"

---

## Fase 5: Registrar Nova Tool no `index.ts`

### 5.1 Atualizar `index.ts`
**Arquivo:** `src/index.ts`
**Status:** ⏳ Pendente

- [ ] Importar `buildContext` e `buildContextSchema` de `./tools/build-context.js`
- [ ] Adicionar tool na lista `ListToolsRequestSchema`:
  ```typescript
  {
    name: "mvp24h_build_context",
    description: `Builds complete context for implementing a .NET application.
  Combines architecture template with selected resources (database, caching, observability, etc.).
  Returns: Complete documentation for the chosen architecture and resources.`,
    inputSchema: buildContextSchema,
  }
  ```
- [ ] Adicionar case no switch de `CallToolRequestSchema`:
  ```typescript
  case "mvp24h_build_context":
    return { content: [{ type: "text", text: await buildContext(args) }] };
  ```

---

## Fase 6: Criar Documentação de Referência Rápida

### 6.1 Criar `quick-reference.md`
**Arquivo:** `docs/ai-context/quick-reference.md`
**Status:** 🆕 Criar

- [ ] Criar arquivo com estrutura:
  - [ ] Seção: CQRS/Mediator Interfaces
  - [ ] Seção: Repository Interfaces
  - [ ] Seção: Entity Base Classes
  - [ ] Seção: Business Result Types
  - [ ] Seção: Pipeline Interfaces
- [ ] Incluir tabela com colunas: Interface | Namespace | Descrição | Exemplo
- [ ] Adicionar exemplos mínimos de código para cada interface principal

### 6.2 Criar `nuget-packages.md`
**Arquivo:** `docs/ai-context/nuget-packages.md`
**Status:** 🆕 Criar

- [ ] Criar arquivo com lista completa de pacotes:
  - [ ] `Mvp24Hours.Core`
  - [ ] `Mvp24Hours.Application`
  - [ ] `Mvp24Hours.Infrastructure.Data.EFCore`
  - [ ] `Mvp24Hours.Infrastructure.Data.MongoDb`
  - [ ] `Mvp24Hours.Infrastructure.Caching.Redis`
  - [ ] `Mvp24Hours.Infrastructure.RabbitMQ`
  - [ ] `Mvp24Hours.Infrastructure.Pipe`
  - [ ] `Mvp24Hours.WebAPI`
- [ ] Para cada pacote incluir:
  - [ ] Descrição
  - [ ] Quando usar
  - [ ] Dependências
  - [ ] Versão mínima

---

## Fase 7: Testes e Validação

### 7.1 Testar CQRS Guide
- [ ] `mvp24h_cqrs_guide({ topic: "commands" })` - verificar `IMediatorCommand`
- [ ] `mvp24h_cqrs_guide({ topic: "mediator" })` - verificar novo topic
- [ ] `mvp24h_cqrs_guide({ topic: "integration-rabbitmq" })` - verificar novo topic
- [ ] `mvp24h_cqrs_guide({ topic: "audit" })` - verificar novo topic

### 7.2 Testar Database Advisor
- [ ] `mvp24h_database_advisor({ provider: "postgresql" })` - verificar docs reais
- [ ] `mvp24h_database_advisor({ patterns: ["repository", "unit-of-work"] })` - verificar padrões

### 7.3 Testar Observability Setup
- [ ] `mvp24h_observability_setup({ component: "logging" })` - verificar docs reais
- [ ] `mvp24h_observability_setup({ exporter: "jaeger" })` - verificar configuração

### 7.4 Testar Build Context (Nova Tool)
- [ ] `mvp24h_build_context({ architecture: "cqrs" })` - verificar contexto básico
- [ ] `mvp24h_build_context({ architecture: "cqrs", resources: ["database", "observability"] })` - verificar combinação
- [ ] `mvp24h_build_context({ architecture: "event-driven", resources: ["messaging"] })` - verificar event-driven

### 7.5 Testar Get Template com Contexto
- [ ] `mvp24h_get_template({ template_name: "cqrs" })` - verificar contexto completo
- [ ] `mvp24h_get_template({ template_name: "ddd" })` - verificar DDD com value objects

### 7.6 Testar Fluxo Completo
- [ ] Simular cenário: "Criar API com CQRS, PostgreSQL, Redis, Observability"
- [ ] Verificar se todas as informações necessárias são fornecidas
- [ ] Validar que não há informações conflitantes ou desatualizadas

---

## Fase 8: Build e Publicação

### 8.1 Build e Verificação
- [ ] Executar `npm run build`
- [ ] Verificar se compila sem erros
- [ ] Testar localmente com MCP inspector

### 8.2 Atualizar Versão
- [ ] Incrementar versão no `package.json` para `1.0.2`
- [ ] Criar/atualizar `CHANGELOG.md` com mudanças

### 8.3 Publicar
- [ ] `npm pack` para criar pacote
- [ ] Testar instalação local
- [ ] Publicar no npm (se aplicável)

---

## Mapeamento Completo de Documentação

### Arquivos `docs/ai-context/` (42 arquivos)

| Arquivo | Tool Responsável | Status |
|---------|------------------|--------|
| `ai-decision-matrix.md` | `ai-implementation` | ✅ |
| `ai-implementation-index.md` | `ai-implementation` | ✅ |
| `api-versioning-patterns.md` | `reference-guide` | ⏳ Adicionar |
| `architecture-templates.md` | `architecture-advisor` | ⏳ Carregar |
| `containerization-patterns.md` | `containerization-patterns` | ✅ |
| `database-patterns.md` | `database-advisor` | ⏳ Carregar |
| `decision-matrix.md` | `architecture-advisor` | ⏳ Carregar |
| `error-handling-patterns.md` | `reference-guide` | ⏳ Adicionar |
| `home.md` | `get-started` | ✅ |
| `messaging-patterns.md` | `messaging-patterns` | ✅ |
| `modernization-patterns.md` | `modernization-guide` | ✅ |
| `observability-patterns.md` | `observability-setup` | ✅ |
| `project-structure.md` | `get-template` | ✅ |
| `security-patterns.md` | `security-patterns` | ✅ |
| `structure-*.md` (3 arquivos) | `get-template` | ✅ |
| `template-*.md` (24 arquivos) | `get-template` | ✅ |
| `testing-patterns.md` | `testing-patterns` | ✅ |

### Arquivos `docs/cqrs/` (30+ arquivos)

| Arquivo | Tool Responsável | Status |
|---------|------------------|--------|
| `api-reference.md` | `cqrs-guide` | ✅ |
| `behaviors.md` | `cqrs-guide` | ✅ |
| `best-practices.md` | `cqrs-guide` | ✅ |
| `commands.md` | `cqrs-guide` | ✅ |
| `concepts-comparison.md` | `cqrs-guide` | ⏳ Adicionar |
| `domain-events.md` | `cqrs-guide` | ✅ |
| `event-sourcing/*.md` (5 arquivos) | `cqrs-guide` | ✅ |
| `extensibility.md` | `cqrs-guide` | ✅ |
| `getting-started.md` | `cqrs-guide` | ✅ |
| `home.md` | `cqrs-guide` | ✅ |
| `integration-caching.md` | `cqrs-guide` | ✅ |
| `integration-events.md` | `cqrs-guide` | ✅ |
| `integration-rabbitmq.md` | `cqrs-guide` | ⏳ Adicionar |
| `integration-repository.md` | `cqrs-guide` | ✅ |
| `integration-unitofwork.md` | `cqrs-guide` | ✅ |
| `mediator.md` | `cqrs-guide` | ⏳ Adicionar |
| `migration-mediatr.md` | `cqrs-guide` | ✅ |
| `multi-tenancy.md` | `cqrs-guide` | ✅ |
| `notifications.md` | `cqrs-guide` | ✅ |
| `observability/*.md` (3 arquivos) | `cqrs-guide` / `observability-setup` | ✅ (`observability-setup`) |
| `queries.md` | `cqrs-guide` | ✅ |
| `resilience/*.md` (4 arquivos) | `cqrs-guide` | ✅ |
| `saga/*.md` (3 arquivos) | `cqrs-guide` | ✅ |
| `scheduled-commands.md` | `cqrs-guide` | ✅ |
| `specifications.md` | `cqrs-guide` | ✅ |
| `validation-behavior.md` | `cqrs-guide` | ✅ |

### Arquivos `docs/database/` (9 arquivos)

| Arquivo | Tool Responsável | Status |
|---------|------------------|--------|
| `efcore-advanced.md` | `database-advisor` | ⏳ Adicionar |
| `mongodb-advanced.md` | `database-advisor` | ⏳ Adicionar |
| `nosql.md` | `database-advisor` | ⏳ Carregar |
| `relational.md` | `database-advisor` | ⏳ Carregar |
| `use-context.md` | `database-advisor` | ⏳ Adicionar |
| `use-entity.md` | `database-advisor` | ⏳ Adicionar |
| `use-repository.md` | `database-advisor` | ⏳ Carregar |
| `use-service.md` | `database-advisor` | ⏳ Adicionar |
| `use-unitofwork.md` | `database-advisor` | ⏳ Carregar |

### Arquivos `docs/observability/` (6 arquivos)

| Arquivo | Tool Responsável | Status |
|---------|------------------|--------|
| `exporters.md` | `observability-setup` | ✅ |
| `home.md` | `observability-setup` | ✅ |
| `logging.md` | `observability-setup` | ✅ |
| `metrics.md` | `observability-setup` | ✅ |
| `migration.md` | `observability-setup` | ✅ |
| `tracing.md` | `observability-setup` | ✅ |

### Arquivos `docs/modernization/` (17 arquivos)

| Arquivo | Tool Responsável | Status |
|---------|------------------|--------|
| `aspire.md` | `modernization-guide` | ✅ |
| `channels.md` | `modernization-guide` | ⏳ Adicionar |
| `dotnet9-features.md` | `modernization-guide` | ⏳ Adicionar |
| `generic-resilience.md` | `modernization-guide` | ✅ |
| `http-resilience.md` | `modernization-guide` | ✅ |
| `hybrid-cache.md` | `modernization-guide` | ✅ |
| `keyed-services.md` | `modernization-guide` | ✅ |
| `migration-guide.md` | `modernization-guide` | ⏳ Adicionar |
| `minimal-apis.md` | `modernization-guide` | ✅ |
| `native-openapi.md` | `modernization-guide` | ⏳ Adicionar |
| `options-configuration.md` | `modernization-guide` | ⏳ Adicionar |
| `output-caching.md` | `modernization-guide` | ✅ |
| `periodic-timer.md` | `modernization-guide` | ✅ |
| `problem-details.md` | `modernization-guide` | ⏳ Adicionar |
| `rate-limiting.md` | `modernization-guide` | ✅ |
| `source-generators.md` | `modernization-guide` | ⏳ Adicionar |
| `time-provider.md` | `modernization-guide` | ✅ |

### Arquivos `docs/core/` (9 arquivos)

| Arquivo | Tool Responsável | Status |
|---------|------------------|--------|
| `entity-interfaces.md` | `core-patterns` | ✅ |
| `exceptions.md` | `core-patterns` | ✅ |
| `functional-patterns.md` | `core-patterns` | ✅ |
| `guard-clauses.md` | `core-patterns` | ✅ |
| `home.md` | `core-patterns` | ✅ |
| `infrastructure-abstractions.md` | `core-patterns` | ⏳ Adicionar |
| `smart-enums.md` | `core-patterns` | ✅ |
| `strongly-typed-ids.md` | `core-patterns` | ✅ |
| `value-objects.md` | `core-patterns` | ✅ |

### Arquivos `docs/` (raiz - 15+ arquivos)

| Arquivo | Tool Responsável | Status |
|---------|------------------|--------|
| `application-services.md` | `infrastructure-guide` | ✅ |
| `broker-advanced.md` | `messaging-patterns` | ✅ |
| `broker.md` | `messaging-patterns` | ✅ |
| `caching-advanced.md` | `infrastructure-guide` | ⏳ Adicionar |
| `cronjob-advanced.md` | `infrastructure-guide` | ⏳ Adicionar |
| `cronjob-observability.md` | `infrastructure-guide` | ⏳ Adicionar |
| `cronjob-resilience.md` | `infrastructure-guide` | ⏳ Adicionar |
| `cronjob.md` | `infrastructure-guide` | ✅ |
| `documentation.md` | `reference-guide` | ✅ |
| `getting-started.md` | `get-started` | ✅ |
| `home.md` | `get-started` | ✅ |
| `logging.md` | `observability-setup` | ⏳ Verificar |
| `mapping.md` | `reference-guide` | ✅ |
| `migration.md` | `reference-guide` | ✅ |
| `pipeline.md` | `infrastructure-guide` | ✅ |
| `specification.md` | `reference-guide` | ✅ |
| `telemetry.md` | `reference-guide` | ⏳ Adicionar |
| `validation.md` | `reference-guide` | ✅ |
| `webapi-advanced.md` | `infrastructure-guide` | ✅ |
| `webapi.md` | `infrastructure-guide` | ✅ |

---

## Interfaces Corretas do Mvp24Hours (Referência Rápida)

### CQRS/Mediator (`Mvp24Hours.Infrastructure.Cqrs.Abstractions`)

| Interface | Descrição |
|-----------|-----------|
| `IMediatorCommand<TResponse>` | Comando com retorno |
| `IMediatorCommand` | Comando sem retorno (void) |
| `IMediatorCommandHandler<TCommand, TResponse>` | Handler de comando |
| `IMediatorQuery<TResponse>` | Query com retorno |
| `IMediatorQueryHandler<TQuery, TResponse>` | Handler de query |
| `IMediatorNotification` | Notificação in-process |
| `IMediatorNotificationHandler<TNotification>` | Handler de notificação |
| `IMediator` | Interface principal (ISender + IPublisher) |
| `ISender` | Envia commands/queries |
| `IPublisher` | Publica notificações |

### Repository (`Mvp24Hours.Core.Contract.Data`)

| Interface | Descrição |
|-----------|-----------|
| `IRepository<TEntity>` | Repository síncrono |
| `IRepositoryAsync<TEntity>` | Repository assíncrono |
| `IUnitOfWork` | Unit of Work síncrono |
| `IUnitOfWorkAsync` | Unit of Work assíncrono |

### Entidades (`Mvp24Hours.Core.Entities`)

| Classe | Descrição |
|--------|-----------|
| `EntityBase<TKey>` | Entidade base com ID tipado |
| `EntityBase` | Entidade base com ID int |

### Business Result (`Mvp24Hours.Core.Contract.ValueObjects.Logic`)

| Interface | Descrição |
|-----------|-----------|
| `IBusinessResult<T>` | Resultado de operação |
| `IPagingResult<T>` | Resultado paginado |

---

## Próxima Ação

**Iniciar pela Fase 1.1**: Atualizar `database-advisor.ts` para carregar documentação real.

```bash
# Verificar arquivos de database disponíveis
ls docs/database/
```

Arquivos disponíveis:
- `efcore-advanced.md`
- `mongodb-advanced.md`
- `nosql.md`
- `relational.md`
- `use-context.md`
- `use-entity.md`
- `use-repository.md`
- `use-service.md`
- `use-unitofwork.md`
