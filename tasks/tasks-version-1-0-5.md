# Mvp24Hours - Design System de ValidaÃ§Ã£o v1.0.5

> **Objetivo**: Validar na prÃ¡tica todos os componentes, patterns, templates e funcionalidades do framework Mvp24Hours para garantir que oferece tudo necessÃ¡rio para criar projetos backend robustos, completos e sem falhas.

## Resumo Executivo

| Categoria | Total Itens | Validados | Pendentes | Cobertura |
|-----------|-------------|-----------|-----------|-----------|
| **Revisao de Bibliotecas** | 35 | 35 | 0 | 100% |
| Core Patterns | 15 | 5 | 10 | 33% |
| Database (Relational) | 18 | 0 | 18 | 0% |
| Database (NoSQL) | 12 | 0 | 12 | 0% |
| CQRS/Mediator | 28 | 0 | 28 | 0% |
| Infrastructure | 20 | 0 | 20 | 0% |
| Messaging (RabbitMQ) | 14 | 0 | 14 | 0% |
| Modernization (.NET 9) | 17 | 0 | 17 | 0% |
| Observability | 12 | 0 | 12 | 0% |
| Security | 10 | 0 | 10 | 0% |
| Testing | 8 | 0 | 8 | 0% |
| Containerization | 8 | 0 | 8 | 0% |
| Architecture Templates | 9 | 0 | 9 | 0% |
| AI Integration | 12 | 0 | 12 | 0% |
| **TOTAL** | **218** | **0** | **218** | **0%** |

---

## Legenda

- `[ ]` NÃ£o validado
- `[x]` Validado com sucesso
- `[!]` Validado com problemas/issues
- `[-]` NÃ£o aplicÃ¡vel ou descontinuado

**Colunas:**
- **Sample**: CÃ³digo de exemplo criado em `sample/`
- **Test**: Teste unitÃ¡rio/integraÃ§Ã£o criado
- **Doc**: DocumentaÃ§Ã£o verificada
- **MCP Tool**: Ferramenta MCP disponÃ­vel

---

## 0. REVISÃƒO DE BIBLIOTECAS (CRÃTICO)

> **IMPORTANTE**: Esta seÃ§Ã£o rastreia inconsistÃªncias entre a documentaÃ§Ã£o do MCP e o cÃ³digo-fonte real do Mvp24Hours. Erros aqui causam falhas quando o MCP gera cÃ³digo.

### 0.1 Pacotes NuGet - Nomes e Namespaces

| Pacote Documentado | Pacote Real | Status | Arquivo Doc | ObservaÃ§Ãµes |
|--------------------|-------------|--------|-------------|-------------|
| `Mvp24Hours.Core` | `Mvp24Hours.Core` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure` | `Mvp24Hours.Infrastructure` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Application` | `Mvp24Hours.Application` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure.Caching` | `Mvp24Hours.Infrastructure.Caching` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure.Caching.Redis` | `Mvp24Hours.Infrastructure.Caching.Redis` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure.Cqrs` | `Mvp24Hours.Infrastructure.Cqrs` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure.CronJob` | `Mvp24Hours.Infrastructure.CronJob` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure.Data.EFCore` | `Mvp24Hours.Infrastructure.Data.EFCore` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure.Data.MongoDb` | `Mvp24Hours.Infrastructure.Data.MongoDb` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure.Pipe` | `Mvp24Hours.Infrastructure.Pipe` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.Infrastructure.RabbitMQ` | `Mvp24Hours.Infrastructure.RabbitMQ` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |
| `Mvp24Hours.WebAPI` | `Mvp24Hours.WebAPI` v9.1.20 | [x] | nuget-packages.md | Nome correto, TFM net9.0 |

### 0.2 Classes e Interfaces - Doc vs CÃ³digo Real

| Classe/Interface Documentada | Classe/Interface Real | Status | Arquivo Doc | Namespace Real |
|------------------------------|----------------------|--------|-------------|----------------|
| `IUnitOfWork` | `IUnitOfWork` | [x] | database/* | Mvp24Hours.Core.Contract.Data |
| `IUnitOfWorkAsync` | `IUnitOfWorkAsync` | [x] | database/* | Mvp24Hours.Core.Contract.Data.Async |
| `IRepository<T>` | `IRepository<T>` | [x] | database/* | Mvp24Hours.Core.Contract.Data |
| `IRepositoryAsync<T>` | `IRepositoryAsync<T>` | [x] | database/* | Mvp24Hours.Core.Contract.Data.Async |
| `Mvp24HoursContext` | `Mvp24HoursContext` | [x] | database/* | EFCore + MongoDB |
| `EntityBase<TId>` | `EntityBase<TId>` | [x] | core/* | Mvp24Hours.Core.Domain.Entities |
| `IMediator` | `IMediator` | [x] | cqrs/* | Mvp24Hours.Infrastructure.Cqrs.Abstractions |
| `ISender` | `ISender` | [x] | cqrs/* | Mvp24Hours.Infrastructure.Cqrs.Abstractions |
| `IPublisher` | `IPublisher` | [x] | cqrs/* | Mvp24Hours.Infrastructure.Cqrs.Abstractions |
| `IPipeline` | `IPipeline` | [x] | pipeline.md | Mvp24Hours.Core.Contract.Infrastructure.Pipe |
| `IPipelineAsync` | `IPipelineAsync` | [x] | pipeline.md | Mvp24Hours.Core.Contract.Infrastructure.Pipe.Async |
| `BusinessResult<T>` | `BusinessResult<T>` | [x] | core/* | Mvp24Hours.Core.ValueObjects.Logic |

### 0.3 Extension Methods - Doc vs CÃ³digo Real

| Extension Method Documentado | Extension Method Real | Status | Arquivo Doc | ObservaÃ§Ãµes |
|------------------------------|----------------------|--------|-------------|-------------|
| `AddMvp24HoursDbContext<T>` | `AddMvp24HoursDbContext<T>` | [x] | getting-started.md | EFCore + MongoDB |
| `AddMvp24HoursRepository` | `AddMvp24HoursRepository` | [x] | getting-started.md | Sync + Async |
| `ToBusinessPagingAsync` | `ToBusinessPagingAsync` | [x] | database/* | Mvp24Hours.Core.Extensions.Logic |
| `MapPagingTo<T, R>` | `MapPagingTo<T, R>` | [x] | application-services.md | Verificado |

### 0.4 ConfiguraÃ§Ãµes e OpÃ§Ãµes

| ConfiguraÃ§Ã£o Documentada | ConfiguraÃ§Ã£o Real | Status | Arquivo Doc | ObservaÃ§Ãµes |
|--------------------------|-------------------|--------|-------------|-------------|
| `MaxQtyByQueryPage` | `ContantsHelper.Data.MaxQtyByQueryPage` | [x] | getting-started.md | Default: 300 |
| Repository Options | `EFCoreRepositoryOptions` | [x] | database/* | MaxQtyByQueryPage, TrackingBehavior |
| CQRS Options | Behaviors config | [x] | cqrs/* | Validation, Logging, etc. |
| Pipeline Options | `IPipelineContext` | [x] | pipeline.md | Rollback, Middleware |

### 0.5 Compatibilidade de VersÃµes (CRÃTICO)

> **PROBLEMA IDENTIFICADO**: A documentaÃ§Ã£o do MCP estÃ¡ gerando projetos com bibliotecas de versÃµes incompatÃ­veis com .NET 9. Algumas versÃµes sÃ£o para .NET 6 (antigas) ou .NET 10 (ainda nÃ£o existe).

#### Regra de VersÃµes para .NET 9

| Target Framework | VersÃ£o Pacotes Microsoft | VersÃ£o EF Core | VersÃ£o Aspire |
|------------------|-------------------------|----------------|---------------|
| .NET 9 | 9.0.x | 9.0.x | 9.0.x |
| .NET 8 | 8.0.x | 8.0.x | 8.0.x |
| .NET 6 | 6.0.x | 6.0.x | N/A |

#### Pacotes Externos - VersÃµes CompatÃ­veis com .NET 9

| Pacote | VersÃ£o Correta (.NET 9) | VersÃ£o na Doc | Status | Arquivo Doc |
|--------|------------------------|---------------|--------|-------------|
| `FluentValidation` | 11.x | 12.1.1 | [x] | nuget-packages.md |
| `AutoMapper` | 13.x | 13.0.1 | [x] | nuget-packages.md |
| `Newtonsoft.Json` | 13.x | 13.0.4 | [x] | nuget-packages.md |
| `StackExchange.Redis` | 2.7.x / 2.8.x | 2.10.1 | [x] | nuget-packages.md |
| `MongoDB.Driver` | 2.28.x | 2.23.1 | [x] | nuget-packages.md |
| `RabbitMQ.Client` | 6.x / 7.x | 6.8.1 | [x] | nuget-packages.md |
| `Polly` | 8.x | 8.6.5 | [x] | nuget-packages.md |
| `Swashbuckle.AspNetCore` | 6.x | 6.5.0 | [x] | nuget-packages.md |
| `OpenTelemetry.*` | 1.9.x / 1.10.x | 1.14.0 | [x] | observability/* |
| `Cronos` | 0.8.x | 0.8.3 | [x] | cronjob.md |
| `xunit` | 2.9.x | 2.9.x | [x] | testing-patterns.md |
| `FluentAssertions` | 6.x | 6.x | [x] | testing-patterns.md |
| `Moq` | 4.20.x | 4.20.x | [x] | testing-patterns.md |
| `Testcontainers` | 3.x | 3.x | [x] | testing-patterns.md |

#### Pacotes Microsoft - VersÃµes para .NET 9

| Pacote | VersÃ£o Correta | VersÃ£o na Doc | Status | Arquivo Doc |
|--------|---------------|---------------|--------|-------------|
| `Microsoft.Extensions.*` | 9.0.x | 9.0.0 | [x] | * | CORRIGIDO v9.1.21 |
| `Microsoft.EntityFrameworkCore.*` | 9.0.x | 9.0.0 | [x] | database/* |
| `Microsoft.AspNetCore.*` | 9.0.x | 9.0.x | [x] | webapi* |
| `Microsoft.Extensions.Caching.Hybrid` | 9.0.x | 9.4.0 | [x] | caching* |
| `Microsoft.Extensions.Resilience` | 9.0.x | 9.8.0 | [x] | modernization/* |
| `System.Threading.RateLimiting` | 9.0.x | 9.0.0 | [x] | modernization/* |

#### Erros Comuns de VersÃ£o

| Erro | Pacote ProblemÃ¡tico | VersÃ£o Errada | VersÃ£o Correta | Arquivo Doc |
|------|---------------------|---------------|----------------|-------------|
| Incompatibilidade TFM | Microsoft.Extensions.* | 10.0.1 | 9.0.x | Mvp24Hours.Core |
| Incompatibilidade TFM | Npgsql | 10.0.1 | 9.0.x | Mvp24Hours.Infrastructure |
| Package not found | * | Preview versions | Stable versions | |
| | | | | |

### 0.6 Erros Conhecidos MCP

| Erro | Causa | Arquivo Doc | CorreÃ§Ã£o NecessÃ¡ria | Status |
|------|-------|-------------|---------------------|--------|
| Projeto nao compila | Versoes incompativeis de pacotes | mvp24hours-dotnet source | CORRIGIDO na v9.1.21 | [x] |
| | | | | [ ] |
| | | | | [ ] |

> **AÃ§Ã£o**: Ao encontrar um erro, preencha a tabela acima e crie um issue para corrigir a documentaÃ§Ã£o.

### 0.7 Checklist de ValidaÃ§Ã£o de Bibliotecas

Para cada pacote NuGet, validar:

- [x] Nome do pacote esta correto na documentacao
- [x] **Versao e compativel com .NET 9** (CORRIGIDO v9.1.21)
- [x] Versao nao e preview/beta (CORRIGIDO v9.1.21)
- [x] Namespaces documentados existem no codigo
- [x] Classes/Interfaces documentadas existem no codigo
- [x] Assinaturas de metodos estao corretas
- [x] Extension methods estao no namespace correto
- [x] Exemplos de codigo compilam sem erros
- [x] Dependencias transitivas sao compativeis (CORRIGIDO v9.1.21)

---

## 1. CORE PATTERNS

### 1.1 Entity Base Classes

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `EntityBase<TId>` | [x] | [x] | [x] | [x] | Entidade base com ID generico |
| `EntityBaseLog` | [x] | [x] | [x] | [x] | Entidade com campos de auditoria |
| `AuditableEntity` | [x] | [x] | [x] | [x] | Created/Modified timestamps |
| `SoftDeletableEntity` | [x] | [x] | [x] | [x] | Soft delete com IsDeleted |
| `IEntityLog` | [x] | [x] | [x] | [x] | Interface para log de entidades |

### 1.2 Value Objects

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `BaseVO` | [ ] | [ ] | [ ] | [ ] | Value Object base |
| `Email` | [ ] | [ ] | [ ] | [ ] | VO para email com validaÃ§Ã£o |
| `Cpf` | [ ] | [ ] | [ ] | [ ] | VO para CPF brasileiro |
| `Cnpj` | [ ] | [ ] | [ ] | [ ] | VO para CNPJ brasileiro |
| `PhoneNumber` | [ ] | [ ] | [ ] | [ ] | VO para telefone |
| `Money` | [ ] | [ ] | [ ] | [ ] | VO para valores monetÃ¡rios |
| `Address` | [ ] | [ ] | [ ] | [ ] | VO para endereÃ§o completo |
| `DateRange` | [ ] | [ ] | [ ] | [ ] | VO para intervalo de datas |
| `Percentage` | [ ] | [ ] | [ ] | [ ] | VO para percentuais |

### 1.3 Strongly-Typed IDs

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `EntityId<T>` | [ ] | [ ] | [ ] | [ ] | ID fortemente tipado genÃ©rico |
| `EntityIdNewtonsoftConverters` | [ ] | [ ] | [ ] | [ ] | JSON conversion Newtonsoft |
| `EntityIdJsonConverters` | [ ] | [ ] | [ ] | [ ] | JSON conversion System.Text |

### 1.4 Functional Patterns

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `Maybe<T>` | [ ] | [ ] | [ ] | [ ] | Option/Optional pattern |
| `Either<TLeft, TRight>` | [ ] | [ ] | [ ] | [ ] | Either monad |
| `BusinessResult<T>` | [ ] | [ ] | [ ] | [ ] | Result pattern para operaÃ§Ãµes |
| `PagingResult<T>` | [ ] | [ ] | [ ] | [ ] | Resultado paginado |
| `KeysetPageResult<T>` | [ ] | [ ] | [ ] | [ ] | Cursor-based pagination |

### 1.5 Smart Enums

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `Enumeration` | [ ] | [ ] | [ ] | [ ] | Smart enum base class |
| `OrderStatus` (example) | [ ] | [ ] | [ ] | [ ] | Exemplo de smart enum |
| `PaymentMethod` (example) | [ ] | [ ] | [ ] | [ ] | Exemplo de smart enum |

### 1.6 Guard Clauses

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `Guard.Against.Null` | [ ] | [ ] | [ ] | [ ] | ValidaÃ§Ã£o contra null |
| `Guard.Against.NullOrEmpty` | [ ] | [ ] | [ ] | [ ] | String nÃ£o vazia |
| `Guard.Against.OutOfRange` | [ ] | [ ] | [ ] | [ ] | ValidaÃ§Ã£o de range |
| `Guard.Against.InvalidInput` | [ ] | [ ] | [ ] | [ ] | Input invÃ¡lido |

### 1.7 Exceptions

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `Mvp24HoursException` | [ ] | [ ] | [ ] | [ ] | Exception base |
| `BusinessException` | [ ] | [ ] | [ ] | [ ] | Erro de regra de negÃ³cio |
| `ValidationException` | [ ] | [ ] | [ ] | [ ] | Erro de validaÃ§Ã£o |
| `NotFoundException` | [ ] | [ ] | [ ] | [ ] | Recurso nÃ£o encontrado |
| `ConflictException` | [ ] | [ ] | [ ] | [ ] | Conflito de dados |
| `UnauthorizedException` | [ ] | [ ] | [ ] | [ ] | NÃ£o autorizado |
| `ForbiddenException` | [ ] | [ ] | [ ] | [ ] | Acesso proibido |
| `DomainException` | [ ] | [ ] | [ ] | [ ] | Erro de domÃ­nio |
| `DataException` | [ ] | [ ] | [ ] | [ ] | Erro de dados |
| `PipelineException` | [ ] | [ ] | [ ] | [ ] | Erro de pipeline |
| `ConfigurationException` | [ ] | [ ] | [ ] | [ ] | Erro de configuraÃ§Ã£o |
| `RateLimitExceededException` | [ ] | [ ] | [ ] | [ ] | Rate limit excedido |

### 1.8 Specification Pattern

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `Specification<T>` | [ ] | [ ] | [ ] | [ ] | Specification base class |
| `ISpecificationQuery<T>` | [ ] | [ ] | [ ] | [ ] | Interface para queries |
| `CompositeSpecifications` | [ ] | [ ] | [ ] | [ ] | And, Or, Not compositions |
| `InMemorySpecificationEvaluator` | [ ] | [ ] | [ ] | [ ] | Avaliador in-memory |

### 1.9 Infrastructure Abstractions

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IClock` / `SystemClock` | [ ] | [ ] | [ ] | [ ] | AbstraÃ§Ã£o de tempo |
| `TestClock` | [ ] | [ ] | [ ] | [ ] | Clock para testes |
| `TimeProviderAdapter` | [ ] | [ ] | [ ] | [ ] | Adapter para TimeProvider |
| `IGuidGenerator` | [ ] | [ ] | [ ] | [ ] | GeraÃ§Ã£o de GUIDs |
| `SequentialGuidGenerator` | [ ] | [ ] | [ ] | [ ] | GUID sequencial |
| `DeterministicGuidGenerator` | [ ] | [ ] | [ ] | [ ] | GUID determinÃ­stico |
| `IEncryptionProvider` | [ ] | [ ] | [ ] | [ ] | Criptografia |
| `AesEncryptionProvider` | [ ] | [ ] | [ ] | [ ] | AES encryption |

---

## 2. DATABASE - RELATIONAL (EF Core)

### 2.1 ConfiguraÃ§Ã£o por Provider

| Provider | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|----------|--------|------|-----|----------|-------------|
| SQL Server | [ ] | [ ] | [ ] | [ ] | Microsoft.EntityFrameworkCore.SqlServer |
| PostgreSQL | [ ] | [ ] | [ ] | [ ] | Npgsql.EntityFrameworkCore.PostgreSQL |
| MySQL | [ ] | [ ] | [ ] | [ ] | MySql.EntityFrameworkCore |
| InMemory | [ ] | [ ] | [ ] | [ ] | Para testes |

### 2.2 Repository Pattern

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IRepository<T>` | [ ] | [ ] | [ ] | [ ] | Interface sÃ­ncrona |
| `IRepositoryAsync<T>` | [ ] | [ ] | [ ] | [ ] | Interface assÃ­ncrona |
| `GetById` | [ ] | [ ] | [ ] | [ ] | Busca por ID |
| `GetByIdAsync` | [ ] | [ ] | [ ] | [ ] | Busca por ID async |
| `Add` / `AddAsync` | [ ] | [ ] | [ ] | [ ] | InserÃ§Ã£o |
| `Modify` / `ModifyAsync` | [ ] | [ ] | [ ] | [ ] | AtualizaÃ§Ã£o |
| `Remove` / `RemoveAsync` | [ ] | [ ] | [ ] | [ ] | RemoÃ§Ã£o |
| `ListAny` / `ListAnyAsync` | [ ] | [ ] | [ ] | [ ] | Verificar existÃªncia |
| `ListCount` / `ListCountAsync` | [ ] | [ ] | [ ] | [ ] | Contagem |

### 2.3 Unit of Work

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IUnitOfWork` | [ ] | [ ] | [ ] | [ ] | Interface sÃ­ncrona |
| `IUnitOfWorkAsync` | [ ] | [ ] | [ ] | [ ] | Interface assÃ­ncrona |
| `GetRepository<T>` | [ ] | [ ] | [ ] | [ ] | Obter repositÃ³rio |
| `SaveChanges` | [ ] | [ ] | [ ] | [ ] | Persistir alteraÃ§Ãµes |
| `BeginTransaction` | [ ] | [ ] | [ ] | [ ] | Iniciar transaÃ§Ã£o |
| `Commit` / `Rollback` | [ ] | [ ] | [ ] | [ ] | Controle de transaÃ§Ã£o |

### 2.4 Pagination

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `ToBusinessPagingAsync` | [ ] | [ ] | [ ] | [ ] | PaginaÃ§Ã£o offset |
| `PagingCriteria` | [ ] | [ ] | [ ] | [ ] | CritÃ©rios de paginaÃ§Ã£o |
| `PagingCriteriaExpression` | [ ] | [ ] | [ ] | [ ] | PaginaÃ§Ã£o com expressÃ£o |
| Cursor Pagination | [ ] | [ ] | [ ] | [ ] | Keyset pagination |

### 2.5 Advanced EF Core

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Interceptors (Audit) | [ ] | [ ] | [ ] | [ ] | SaveChangesInterceptor |
| Interceptors (SoftDelete) | [ ] | [ ] | [ ] | [ ] | SoftDeleteInterceptor |
| Interceptors (SlowQuery) | [ ] | [ ] | [ ] | [ ] | SlowQueryInterceptor |
| Multi-tenancy | [ ] | [ ] | [ ] | [ ] | Query filters por tenant |
| Bulk Insert | [ ] | [ ] | [ ] | [ ] | InserÃ§Ã£o em lote |
| Bulk Update | [ ] | [ ] | [ ] | [ ] | AtualizaÃ§Ã£o em lote |
| Bulk Delete | [ ] | [ ] | [ ] | [ ] | RemoÃ§Ã£o em lote |
| Read/Write Splitting | [ ] | [ ] | [ ] | [ ] | Replicas de leitura |
| Dapper Integration | [ ] | [ ] | [ ] | [ ] | Queries otimizadas |

### 2.6 DbContext

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `Mvp24HoursContext` | [ ] | [ ] | [ ] | [ ] | Context base |
| `AddMvp24HoursDbContext<T>` | [ ] | [ ] | [ ] | [ ] | Extension method |
| `AddMvp24HoursRepository` | [ ] | [ ] | [ ] | [ ] | Repository config |
| Entity Configuration | [ ] | [ ] | [ ] | [ ] | IEntityTypeConfiguration |
| Migrations | [ ] | [ ] | [ ] | [ ] | Code-first migrations |

---

## 3. DATABASE - NoSQL

### 3.1 MongoDB

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| MongoDB Connection | [ ] | [ ] | [ ] | [ ] | ConfiguraÃ§Ã£o bÃ¡sica |
| `IRepositoryAsync<T>` MongoDB | [ ] | [ ] | [ ] | [ ] | Repository pattern |
| BSON Serialization | [ ] | [ ] | [ ] | [ ] | ConfiguraÃ§Ã£o BSON |
| GridFS | [ ] | [ ] | [ ] | [ ] | Armazenamento de arquivos |
| Index Management | [ ] | [ ] | [ ] | [ ] | CriaÃ§Ã£o de Ã­ndices |
| Aggregation Pipeline | [ ] | [ ] | [ ] | [ ] | Consultas agregadas |
| Change Streams | [ ] | [ ] | [ ] | [ ] | Real-time updates |
| Geospatial Queries | [ ] | [ ] | [ ] | [ ] | Consultas geogrÃ¡ficas |
| Transactions | [ ] | [ ] | [ ] | [ ] | Multi-document transactions |

### 3.2 Redis

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Redis Connection | [ ] | [ ] | [ ] | [ ] | StackExchange.Redis |
| String Operations | [ ] | [ ] | [ ] | [ ] | Get/Set bÃ¡sico |
| Hash Operations | [ ] | [ ] | [ ] | [ ] | Hash structures |
| List Operations | [ ] | [ ] | [ ] | [ ] | Lists |
| Set Operations | [ ] | [ ] | [ ] | [ ] | Sets |
| Sorted Set | [ ] | [ ] | [ ] | [ ] | Ordered sets |
| Pub/Sub | [ ] | [ ] | [ ] | [ ] | Messaging |
| Distributed Lock | [ ] | [ ] | [ ] | [ ] | RedLock pattern |

---

## 4. CQRS / MEDIATOR

### 4.1 Core Abstractions

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IMediator` | [ ] | [ ] | [ ] | [ ] | Interface principal |
| `ISender` | [ ] | [ ] | [ ] | [ ] | Envio de requests |
| `IPublisher` | [ ] | [ ] | [ ] | [ ] | PublicaÃ§Ã£o de notifications |
| `Mediator` implementation | [ ] | [ ] | [ ] | [ ] | ImplementaÃ§Ã£o concreta |

### 4.2 Commands

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `ICommand` | [ ] | [ ] | [ ] | [ ] | Command sem retorno |
| `ICommand<TResponse>` | [ ] | [ ] | [ ] | [ ] | Command com retorno |
| `ICommandHandler<T>` | [ ] | [ ] | [ ] | [ ] | Handler de command |
| Command Validation | [ ] | [ ] | [ ] | [ ] | ValidaÃ§Ã£o de commands |

### 4.3 Queries

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IQuery<TResponse>` | [ ] | [ ] | [ ] | [ ] | Query interface |
| `IQueryHandler<T, R>` | [ ] | [ ] | [ ] | [ ] | Handler de query |
| `PaginatedQuery<T>` | [ ] | [ ] | [ ] | [ ] | Query com paginaÃ§Ã£o |
| `SortedQuery<T>` | [ ] | [ ] | [ ] | [ ] | Query com ordenaÃ§Ã£o |

### 4.4 Notifications

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `INotification` | [ ] | [ ] | [ ] | [ ] | Interface de notification |
| `INotificationHandler<T>` | [ ] | [ ] | [ ] | [ ] | Handler de notification |
| Multiple Handlers | [ ] | [ ] | [ ] | [ ] | MÃºltiplos handlers |
| Publishing Strategies | [ ] | [ ] | [ ] | [ ] | Parallel, Sequential |

### 4.5 Pipeline Behaviors

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IPipelineBehavior<T, R>` | [ ] | [ ] | [ ] | [ ] | Interface de behavior |
| `LoggingBehavior` | [ ] | [ ] | [ ] | [ ] | Log de requests |
| `ValidationBehavior` | [ ] | [ ] | [ ] | [ ] | FluentValidation integration |
| `TransactionBehavior` | [ ] | [ ] | [ ] | [ ] | Transactions |
| `CachingBehavior` | [ ] | [ ] | [ ] | [ ] | Cache de queries |
| `RetryBehavior` | [ ] | [ ] | [ ] | [ ] | Retry com Polly |
| `CircuitBreakerBehavior` | [ ] | [ ] | [ ] | [ ] | Circuit breaker |
| `TimeoutBehavior` | [ ] | [ ] | [ ] | [ ] | Timeout handling |
| `IdempotencyBehavior` | [ ] | [ ] | [ ] | [ ] | IdempotÃªncia |
| `AuthorizationBehavior` | [ ] | [ ] | [ ] | [ ] | AutorizaÃ§Ã£o |
| `AuditBehavior` | [ ] | [ ] | [ ] | [ ] | Auditoria |
| `TenantBehavior` | [ ] | [ ] | [ ] | [ ] | Multi-tenancy |
| `TracingBehavior` | [ ] | [ ] | [ ] | [ ] | OpenTelemetry tracing |
| `TelemetryBehavior` | [ ] | [ ] | [ ] | [ ] | Telemetria |
| `PerformanceBehavior` | [ ] | [ ] | [ ] | [ ] | Performance monitoring |
| `NativeResilienceBehavior` | [ ] | [ ] | [ ] | [ ] | .NET 9 Resilience |

### 4.6 Domain Events

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IDomainEvent` | [ ] | [ ] | [ ] | [ ] | Interface de domain event |
| `IHasDomainEvents` | [ ] | [ ] | [ ] | [ ] | Entidade com eventos |
| `DomainEventDispatcher` | [ ] | [ ] | [ ] | [ ] | Dispatcher de eventos |
| Domain to Integration Event | [ ] | [ ] | [ ] | [ ] | ConversÃ£o |

### 4.7 Integration Events

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IIntegrationEvent` | [ ] | [ ] | [ ] | [ ] | Interface de integration |
| `IIntegrationEventPublisher` | [ ] | [ ] | [ ] | [ ] | Publisher interface |
| `IIntegrationEventOutbox` | [ ] | [ ] | [ ] | [ ] | Outbox pattern |
| Inbox Pattern | [ ] | [ ] | [ ] | [ ] | DeduplicaÃ§Ã£o |
| Outbox Pattern | [ ] | [ ] | [ ] | [ ] | Garantia de entrega |

### 4.8 Event Sourcing

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IAggregate` | [ ] | [ ] | [ ] | [ ] | Interface de aggregate |
| `AggregateRoot<T>` | [ ] | [ ] | [ ] | [ ] | Aggregate root base |
| `IEventStore` | [ ] | [ ] | [ ] | [ ] | Event store interface |
| `InMemoryEventStore` | [ ] | [ ] | [ ] | [ ] | Store para testes |
| `EventStoreRepository<T>` | [ ] | [ ] | [ ] | [ ] | Repository de aggregates |
| Snapshots | [ ] | [ ] | [ ] | [ ] | Snapshots de estado |
| `InMemorySnapshotStore` | [ ] | [ ] | [ ] | [ ] | Snapshot store |
| `StoredEvent` | [ ] | [ ] | [ ] | [ ] | Evento armazenado |
| Rehydration | [ ] | [ ] | [ ] | [ ] | ReconstituiÃ§Ã£o de estado |

### 4.9 Projections

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IProjection` | [ ] | [ ] | [ ] | [ ] | Interface de projeÃ§Ã£o |
| `IProjectionHandler<T>` | [ ] | [ ] | [ ] | [ ] | Handler de projeÃ§Ã£o |
| `IReadModelRepository<T>` | [ ] | [ ] | [ ] | [ ] | Read model repository |
| `IncrementalProjection` | [ ] | [ ] | [ ] | [ ] | ProjeÃ§Ã£o incremental |
| `ProjectionManager` | [ ] | [ ] | [ ] | [ ] | Gerenciador |
| `ProjectionHostedService` | [ ] | [ ] | [ ] | [ ] | Background service |

### 4.10 Saga Pattern

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `ISaga` | [ ] | [ ] | [ ] | [ ] | Interface de saga |
| `SagaBase<TState>` | [ ] | [ ] | [ ] | [ ] | Saga base class |
| `ISagaStep<T>` | [ ] | [ ] | [ ] | [ ] | Step interface |
| `CompensatingCommand` | [ ] | [ ] | [ ] | [ ] | Comando compensatÃ³rio |
| `SagaOrchestrator` | [ ] | [ ] | [ ] | [ ] | Orquestrador de sagas |
| `ISagaStateStore` | [ ] | [ ] | [ ] | [ ] | Store de estado |
| `InMemorySagaStateStore` | [ ] | [ ] | [ ] | [ ] | Store para testes |
| `SagaHostedService` | [ ] | [ ] | [ ] | [ ] | Background service |
| Compensation | [ ] | [ ] | [ ] | [ ] | Rollback de passos |
| Timeout Handling | [ ] | [ ] | [ ] | [ ] | Timeout de saga |

### 4.11 Scheduling

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `ICommandScheduler` | [ ] | [ ] | [ ] | [ ] | Agendador interface |
| `CommandScheduler` | [ ] | [ ] | [ ] | [ ] | ImplementaÃ§Ã£o |
| `IScheduledCommand` | [ ] | [ ] | [ ] | [ ] | Command agendado |
| `IScheduledCommandStore` | [ ] | [ ] | [ ] | [ ] | Store de comandos |
| `ScheduledCommandHostedService` | [ ] | [ ] | [ ] | [ ] | Background service |

### 4.12 Multi-Tenancy

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `ITenantContext` | [ ] | [ ] | [ ] | [ ] | Contexto de tenant |
| `TenantContext` | [ ] | [ ] | [ ] | [ ] | ImplementaÃ§Ã£o |
| `ICurrentUser` | [ ] | [ ] | [ ] | [ ] | UsuÃ¡rio atual |
| `CurrentUser` | [ ] | [ ] | [ ] | [ ] | ImplementaÃ§Ã£o |
| `TenantQueryFilter` | [ ] | [ ] | [ ] | [ ] | Filtro automÃ¡tico |

---

## 5. INFRASTRUCTURE

### 5.1 Pipeline (Pipe and Filters)

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IPipeline` | [ ] | [ ] | [ ] | [ ] | Interface bÃ¡sica |
| `IPipelineAsync` | [ ] | [ ] | [ ] | [ ] | Interface assÃ­ncrona |
| `IPipeline<TInput, TOutput>` | [ ] | [ ] | [ ] | [ ] | Pipeline tipado |
| `IOperation` | [ ] | [ ] | [ ] | [ ] | OperaÃ§Ã£o/filtro |
| `IPipelineInterceptor` | [ ] | [ ] | [ ] | [ ] | Interceptor |
| Pipeline Builder | [ ] | [ ] | [ ] | [ ] | Fluent builder |
| Fork/Join | [ ] | [ ] | [ ] | [ ] | Fluxos paralelos |
| Saga Pattern (Pipeline) | [ ] | [ ] | [ ] | [ ] | CompensaÃ§Ã£o |
| Checkpoint/Resume | [ ] | [ ] | [ ] | [ ] | Long-running |
| Rollback | [ ] | [ ] | [ ] | [ ] | ReversÃ£o de operaÃ§Ãµes |

### 5.2 Caching

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IDistributedCache` | [ ] | [ ] | [ ] | [ ] | Interface padrÃ£o |
| HybridCache | [ ] | [ ] | [ ] | [ ] | L1 + L2 .NET 9 |
| Memory Cache (L1) | [ ] | [ ] | [ ] | [ ] | Cache em memÃ³ria |
| Redis Cache (L2) | [ ] | [ ] | [ ] | [ ] | Cache distribuÃ­do |
| Cache Aside Pattern | [ ] | [ ] | [ ] | [ ] | Pattern implementaÃ§Ã£o |
| Cache Invalidation | [ ] | [ ] | [ ] | [ ] | InvalidaÃ§Ã£o |
| Stampede Protection | [ ] | [ ] | [ ] | [ ] | HybridCache |
| EF Core Cache | [ ] | [ ] | [ ] | [ ] | Second-level cache |

### 5.3 WebAPI

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Swagger/OpenAPI | [ ] | [ ] | [ ] | [ ] | DocumentaÃ§Ã£o API |
| Native OpenAPI (.NET 9) | [ ] | [ ] | [ ] | [ ] | Microsoft.AspNetCore.OpenAPI |
| Exception Middleware | [ ] | [ ] | [ ] | [ ] | Global exception handling |
| Response Wrapping | [ ] | [ ] | [ ] | [ ] | BusinessResult wrapper |
| API Versioning | [ ] | [ ] | [ ] | [ ] | URL, Header, Query |
| Problem Details | [ ] | [ ] | [ ] | [ ] | RFC 7807 |
| Content Negotiation | [ ] | [ ] | [ ] | [ ] | Accept headers |
| Response Compression | [ ] | [ ] | [ ] | [ ] | Gzip/Brotli |
| Output Caching | [ ] | [ ] | [ ] | [ ] | Response cache |
| Rate Limiting | [ ] | [ ] | [ ] | [ ] | Request limiting |
| Model Binders | [ ] | [ ] | [ ] | [ ] | Custom binders |

### 5.4 CronJob

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `IScheduledJob` | [ ] | [ ] | [ ] | [ ] | Interface de job |
| CRON Expression | [ ] | [ ] | [ ] | [ ] | Cronos library |
| Job Lifecycle | [ ] | [ ] | [ ] | [ ] | Start/Stop/Pause/Resume |
| Retry Policy | [ ] | [ ] | [ ] | [ ] | Retry com backoff |
| Circuit Breaker | [ ] | [ ] | [ ] | [ ] | ProteÃ§Ã£o de falhas |
| Distributed Locking | [ ] | [ ] | [ ] | [ ] | Prevenir duplicaÃ§Ã£o |
| Health Checks | [ ] | [ ] | [ ] | [ ] | Job health |
| OpenTelemetry | [ ] | [ ] | [ ] | [ ] | Tracing de jobs |
| Timezone Support | [ ] | [ ] | [ ] | [ ] | Timezone handling |
| State Store | [ ] | [ ] | [ ] | [ ] | PersistÃªncia de estado |

### 5.5 Channels (.NET)

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| `ChannelFactory` | [ ] | [ ] | [ ] | [ ] | Factory de channels |
| `MvpChannel<T>` | [ ] | [ ] | [ ] | [ ] | Channel wrapper |
| Producer/Consumer | [ ] | [ ] | [ ] | [ ] | Pattern bÃ¡sico |
| Bounded/Unbounded | [ ] | [ ] | [ ] | [ ] | Channel types |
| Multiple Consumers | [ ] | [ ] | [ ] | [ ] | Fan-out |

---

## 6. MESSAGING (RabbitMQ)

### 6.1 Basic Messaging

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Connection Setup | [ ] | [ ] | [ ] | [ ] | ConfiguraÃ§Ã£o bÃ¡sica |
| `IMvpRabbitMQClient` | [ ] | [ ] | [ ] | [ ] | Client interface |
| Producer | [ ] | [ ] | [ ] | [ ] | PublicaÃ§Ã£o de mensagens |
| Consumer | [ ] | [ ] | [ ] | [ ] | Consumo de mensagens |
| `IMessageConsumer<T>` | [ ] | [ ] | [ ] | [ ] | Consumer tipado |

### 6.2 Advanced Patterns

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Dead Letter Queue | [ ] | [ ] | [ ] | [ ] | DLQ handling |
| Retry with Polly | [ ] | [ ] | [ ] | [ ] | Retry policies |
| Message Scheduling | [ ] | [ ] | [ ] | [ ] | Delayed messages |
| Batch Processing | [ ] | [ ] | [ ] | [ ] | Batch consumers |
| Request/Response | [ ] | [ ] | [ ] | [ ] | RPC pattern |
| Saga Pattern (RabbitMQ) | [ ] | [ ] | [ ] | [ ] | State machines |
| Multi-tenancy | [ ] | [ ] | [ ] | [ ] | Tenant routing |
| Transactional Outbox | [ ] | [ ] | [ ] | [ ] | Garantia de entrega |
| Message Deduplication | [ ] | [ ] | [ ] | [ ] | IdempotÃªncia |
| JSON Serialization | [ ] | [ ] | [ ] | [ ] | System.Text.Json |
| MessagePack | [ ] | [ ] | [ ] | [ ] | Binary serialization |
| OpenTelemetry | [ ] | [ ] | [ ] | [ ] | Tracing distribuÃ­do |
| Health Checks | [ ] | [ ] | [ ] | [ ] | RabbitMQ health |

---

## 7. MODERNIZATION (.NET 9)

### 7.1 Caching

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| HybridCache | [ ] | [ ] | [ ] | [ ] | L1+L2 cache |
| Output Caching | [ ] | [ ] | [ ] | [ ] | Response caching |
| Stampede Protection | [ ] | [ ] | [ ] | [ ] | Cache thundering herd |

### 7.2 Resilience

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| HTTP Resilience | [ ] | [ ] | [ ] | [ ] | HttpClient resilience |
| Generic Resilience | [ ] | [ ] | [ ] | [ ] | Microsoft.Extensions.Resilience |
| Rate Limiting | [ ] | [ ] | [ ] | [ ] | System.Threading.RateLimiting |
| Circuit Breaker | [ ] | [ ] | [ ] | [ ] | Native circuit breaker |
| Retry Policies | [ ] | [ ] | [ ] | [ ] | Native retry |

### 7.3 Time Abstractions

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| TimeProvider | [ ] | [ ] | [ ] | [ ] | .NET 8+ TimeProvider |
| PeriodicTimer | [ ] | [ ] | [ ] | [ ] | Timer moderno |
| FakeTimeProvider | [ ] | [ ] | [ ] | [ ] | Para testes |

### 7.4 Dependency Injection

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Keyed Services | [ ] | [ ] | [ ] | [ ] | DI com chaves |
| Options Pattern | [ ] | [ ] | [ ] | [ ] | IOptions<T> |
| Options Configuration | [ ] | [ ] | [ ] | [ ] | ValidaÃ§Ã£o de options |

### 7.5 APIs

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Problem Details | [ ] | [ ] | [ ] | [ ] | RFC 7807 |
| Minimal APIs | [ ] | [ ] | [ ] | [ ] | TypedResults |
| Native OpenAPI | [ ] | [ ] | [ ] | [ ] | Microsoft.AspNetCore.OpenAPI |
| MapCommand/MapQuery | [ ] | [ ] | [ ] | [ ] | CQRS endpoints |

### 7.6 Performance

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Source Generators | [ ] | [ ] | [ ] | [ ] | [LoggerMessage] |
| JSON Source Generators | [ ] | [ ] | [ ] | [ ] | [JsonSerializable] |
| AOT Compatibility | [ ] | [ ] | [ ] | [ ] | Native AOT |

### 7.7 Cloud Native

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| .NET Aspire | [ ] | [ ] | [ ] | [ ] | Cloud-native stack |
| Service Discovery | [ ] | [ ] | [ ] | [ ] | Aspire service discovery |
| Telemetry Integration | [ ] | [ ] | [ ] | [ ] | Aspire observability |

---

## 8. OBSERVABILITY

### 8.1 Logging

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| ILogger Integration | [ ] | [ ] | [ ] | [ ] | Microsoft.Extensions.Logging |
| Structured Logging | [ ] | [ ] | [ ] | [ ] | Logs estruturados |
| NLog Configuration | [ ] | [ ] | [ ] | [ ] | NLog provider |
| Serilog Configuration | [ ] | [ ] | [ ] | [ ] | Serilog provider |
| [LoggerMessage] Source Gen | [ ] | [ ] | [ ] | [ ] | High-performance logging |
| Correlation ID | [ ] | [ ] | [ ] | [ ] | Request correlation |

### 8.2 Tracing

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Activity API | [ ] | [ ] | [ ] | [ ] | System.Diagnostics.Activity |
| OpenTelemetry Tracing | [ ] | [ ] | [ ] | [ ] | OTEL traces |
| Distributed Tracing | [ ] | [ ] | [ ] | [ ] | Cross-service traces |
| Custom Activities | [ ] | [ ] | [ ] | [ ] | Business activities |
| Trace Context Propagation | [ ] | [ ] | [ ] | [ ] | W3C Trace Context |

### 8.3 Metrics

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Counter | [ ] | [ ] | [ ] | [ ] | Contadores |
| Histogram | [ ] | [ ] | [ ] | [ ] | DistribuiÃ§Ãµes |
| Gauge | [ ] | [ ] | [ ] | [ ] | Valores instantÃ¢neos |
| Observable Metrics | [ ] | [ ] | [ ] | [ ] | ObservableGauge |
| Custom Metrics | [ ] | [ ] | [ ] | [ ] | MÃ©tricas de negÃ³cio |

### 8.4 Exporters

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Console Exporter | [ ] | [ ] | [ ] | [ ] | Desenvolvimento |
| OTLP Exporter | [ ] | [ ] | [ ] | [ ] | OpenTelemetry Protocol |
| Jaeger Exporter | [ ] | [ ] | [ ] | [ ] | Jaeger tracing |
| Zipkin Exporter | [ ] | [ ] | [ ] | [ ] | Zipkin tracing |
| Prometheus Exporter | [ ] | [ ] | [ ] | [ ] | Prometheus metrics |
| Application Insights | [ ] | [ ] | [ ] | [ ] | Azure monitoring |

### 8.5 Health Checks

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| SQL Server Health | [ ] | [ ] | [ ] | [ ] | Database health |
| PostgreSQL Health | [ ] | [ ] | [ ] | [ ] | Database health |
| MongoDB Health | [ ] | [ ] | [ ] | [ ] | NoSQL health |
| Redis Health | [ ] | [ ] | [ ] | [ ] | Cache health |
| RabbitMQ Health | [ ] | [ ] | [ ] | [ ] | Message broker health |
| Custom Health Checks | [ ] | [ ] | [ ] | [ ] | Business health |
| Health UI | [ ] | [ ] | [ ] | [ ] | Dashboard visual |

---

## 9. SECURITY

### 9.1 Authentication

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| JWT Bearer | [ ] | [ ] | [ ] | [ ] | Token authentication |
| API Key | [ ] | [ ] | [ ] | [ ] | API key middleware |
| OAuth 2.0 | [ ] | [ ] | [ ] | [ ] | OAuth integration |
| OpenID Connect | [ ] | [ ] | [ ] | [ ] | OIDC integration |
| Identity Integration | [ ] | [ ] | [ ] | [ ] | ASP.NET Core Identity |

### 9.2 Authorization

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Role-based | [ ] | [ ] | [ ] | [ ] | [Authorize(Roles="")] |
| Policy-based | [ ] | [ ] | [ ] | [ ] | Custom policies |
| Claims-based | [ ] | [ ] | [ ] | [ ] | Claims authorization |
| Resource-based | [ ] | [ ] | [ ] | [ ] | Resource authorization |

### 9.3 Data Protection

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Data Protection API | [ ] | [ ] | [ ] | [ ] | Encryption |
| AES Encryption | [ ] | [ ] | [ ] | [ ] | AesEncryptionProvider |
| Key Management | [ ] | [ ] | [ ] | [ ] | Key rotation |

### 9.4 Secrets Management

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Azure Key Vault | [ ] | [ ] | [ ] | [ ] | Azure secrets |
| AWS Secrets Manager | [ ] | [ ] | [ ] | [ ] | AWS secrets |
| User Secrets | [ ] | [ ] | [ ] | [ ] | Development secrets |
| Environment Variables | [ ] | [ ] | [ ] | [ ] | Production config |

### 9.5 Input Validation

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| FluentValidation | [ ] | [ ] | [ ] | [ ] | Validation rules |
| Data Annotations | [ ] | [ ] | [ ] | [ ] | Built-in validation |
| Input Sanitization | [ ] | [ ] | [ ] | [ ] | XSS protection |

### 9.6 Security Headers

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| CORS Configuration | [ ] | [ ] | [ ] | [ ] | Cross-origin |
| Security Headers | [ ] | [ ] | [ ] | [ ] | X-Frame-Options, etc. |
| HTTPS Redirection | [ ] | [ ] | [ ] | [ ] | Force HTTPS |
| HSTS | [ ] | [ ] | [ ] | [ ] | Strict transport security |

---

## 10. TESTING

### 10.1 Unit Testing

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| xUnit Setup | [ ] | [ ] | [ ] | [ ] | Test framework |
| FluentAssertions | [ ] | [ ] | [ ] | [ ] | Assertion library |
| Service Testing | [ ] | [ ] | [ ] | [ ] | Business logic tests |
| Repository Testing | [ ] | [ ] | [ ] | [ ] | Data access tests |
| Handler Testing | [ ] | [ ] | [ ] | [ ] | CQRS handler tests |

### 10.2 Integration Testing

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| WebApplicationFactory | [ ] | [ ] | [ ] | [ ] | API integration tests |
| InMemory Database | [ ] | [ ] | [ ] | [ ] | EF Core InMemory |
| TestServer | [ ] | [ ] | [ ] | [ ] | HttpClient testing |

### 10.3 Mocking

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Moq | [ ] | [ ] | [ ] | [ ] | Mocking framework |
| NSubstitute | [ ] | [ ] | [ ] | [ ] | Alternative mocking |
| FakeItEasy | [ ] | [ ] | [ ] | [ ] | Alternative mocking |

### 10.4 TestContainers

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| SQL Server Container | [ ] | [ ] | [ ] | [ ] | Docker SQL Server |
| PostgreSQL Container | [ ] | [ ] | [ ] | [ ] | Docker PostgreSQL |
| MongoDB Container | [ ] | [ ] | [ ] | [ ] | Docker MongoDB |
| Redis Container | [ ] | [ ] | [ ] | [ ] | Docker Redis |
| RabbitMQ Container | [ ] | [ ] | [ ] | [ ] | Docker RabbitMQ |

### 10.5 Architecture Testing

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| ArchUnitNET | [ ] | [ ] | [ ] | [ ] | Architecture tests |
| Dependency Rules | [ ] | [ ] | [ ] | [ ] | Layer dependencies |
| Naming Conventions | [ ] | [ ] | [ ] | [ ] | Convention tests |

---

## 11. CONTAINERIZATION

### 11.1 Docker

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Multi-stage Dockerfile | [ ] | [ ] | [ ] | [ ] | Build optimization |
| .dockerignore | [ ] | [ ] | [ ] | [ ] | Build context |
| Non-root User | [ ] | [ ] | [ ] | [ ] | Security |
| Health Checks | [ ] | [ ] | [ ] | [ ] | Container health |

### 11.2 Docker Compose

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Local Development | [ ] | [ ] | [ ] | [ ] | Development stack |
| Service Dependencies | [ ] | [ ] | [ ] | [ ] | depends_on |
| Volume Mounts | [ ] | [ ] | [ ] | [ ] | Data persistence |
| Network Configuration | [ ] | [ ] | [ ] | [ ] | Service networking |

### 11.3 Kubernetes

| Componente | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|------------|--------|------|-----|----------|-------------|
| Deployment | [ ] | [ ] | [ ] | [ ] | Pod deployment |
| Service | [ ] | [ ] | [ ] | [ ] | Service exposure |
| ConfigMap | [ ] | [ ] | [ ] | [ ] | Configuration |
| Secret | [ ] | [ ] | [ ] | [ ] | Sensitive data |
| Ingress | [ ] | [ ] | [ ] | [ ] | External access |
| Liveness Probe | [ ] | [ ] | [ ] | [ ] | Health check |
| Readiness Probe | [ ] | [ ] | [ ] | [ ] | Ready check |
| Resource Limits | [ ] | [ ] | [ ] | [ ] | CPU/Memory |
| HPA | [ ] | [ ] | [ ] | [ ] | Horizontal scaling |

---

## 12. ARCHITECTURE TEMPLATES

### 12.1 Templates BÃ¡sicos

| Template | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|----------|--------|------|-----|----------|-------------|
| Minimal API | [ ] | [ ] | [ ] | [ ] | Complexidade baixa |
| Simple N-Layers | [ ] | [ ] | [ ] | [ ] | Complexidade mÃ©dia |
| Complex N-Layers | [ ] | [ ] | [ ] | [ ] | Complexidade alta |

### 12.2 Templates AvanÃ§ados

| Template | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|----------|--------|------|-----|----------|-------------|
| CQRS | [ ] | [ ] | [ ] | [ ] | Command/Query separation |
| Event-Driven | [ ] | [ ] | [ ] | [ ] | Event Sourcing |
| Hexagonal | [ ] | [ ] | [ ] | [ ] | Ports & Adapters |
| Clean Architecture | [ ] | [ ] | [ ] | [ ] | Domain-centric |
| DDD | [ ] | [ ] | [ ] | [ ] | Domain-Driven Design |
| Microservices | [ ] | [ ] | [ ] | [ ] | Service decomposition |

---

## 13. AI INTEGRATION

### 13.1 Semantic Kernel

| Template | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|----------|--------|------|-----|----------|-------------|
| Chat Completion | [ ] | [ ] | [ ] | [ ] | Basic chat |
| Plugins | [ ] | [ ] | [ ] | [ ] | Custom plugins |
| RAG Basic | [ ] | [ ] | [ ] | [ ] | Document retrieval |
| Planners | [ ] | [ ] | [ ] | [ ] | AI planning |

### 13.2 Semantic Kernel Graph

| Template | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|----------|--------|------|-----|----------|-------------|
| Graph Executor | [ ] | [ ] | [ ] | [ ] | Graph-based execution |
| ReAct Agent | [ ] | [ ] | [ ] | [ ] | Reasoning + Acting |
| Chain of Thought | [ ] | [ ] | [ ] | [ ] | Step-by-step reasoning |
| Chatbot Memory | [ ] | [ ] | [ ] | [ ] | Conversation memory |
| Multi-Agent | [ ] | [ ] | [ ] | [ ] | Multiple agents |
| Document Pipeline | [ ] | [ ] | [ ] | [ ] | Document processing |
| Human-in-Loop | [ ] | [ ] | [ ] | [ ] | Human oversight |
| Checkpointing | [ ] | [ ] | [ ] | [ ] | State persistence |
| Streaming | [ ] | [ ] | [ ] | [ ] | Streaming responses |
| Observability | [ ] | [ ] | [ ] | [ ] | AI observability |

### 13.3 Agent Framework

| Template | Sample | Test | Doc | MCP Tool | ObservaÃ§Ãµes |
|----------|--------|------|-----|----------|-------------|
| Basic Agent | [ ] | [ ] | [ ] | [ ] | Simple agent |
| Workflows | [ ] | [ ] | [ ] | [ ] | Agent workflows |
| Multi-Agent | [ ] | [ ] | [ ] | [ ] | Agent collaboration |
| Middleware | [ ] | [ ] | [ ] | [ ] | Agent middleware |

---

## 14. MCP SERVER TOOLS

### 14.1 Architecture & Planning

| Tool | Implementado | Testado | Doc | ObservaÃ§Ãµes |
|------|--------------|---------|-----|-------------|
| `mvp24h_get_started` | [ ] | [ ] | [ ] | Framework overview |
| `mvp24h_architecture_advisor` | [ ] | [ ] | [ ] | Template recommendation |
| `mvp24h_build_context` | [ ] | [ ] | [ ] | Full context builder |
| `mvp24h_get_template` | [ ] | [ ] | [ ] | Get specific template |

### 14.2 Database & Data

| Tool | Implementado | Testado | Doc | ObservaÃ§Ãµes |
|------|--------------|---------|-----|-------------|
| `mvp24h_database_advisor` | [ ] | [ ] | [ ] | Database recommendation |

### 14.3 Patterns & Implementation

| Tool | Implementado | Testado | Doc | ObservaÃ§Ãµes |
|------|--------------|---------|-----|-------------|
| `mvp24h_cqrs_guide` | [ ] | [ ] | [ ] | CQRS documentation |
| `mvp24h_core_patterns` | [ ] | [ ] | [ ] | Core module patterns |
| `mvp24h_infrastructure_guide` | [ ] | [ ] | [ ] | Infrastructure patterns |
| `mvp24h_messaging_patterns` | [ ] | [ ] | [ ] | Messaging implementation |

### 14.4 Modern .NET

| Tool | Implementado | Testado | Doc | ObservaÃ§Ãµes |
|------|--------------|---------|-----|-------------|
| `mvp24h_modernization_guide` | [ ] | [ ] | [ ] | .NET 9 features |
| `mvp24h_observability_setup` | [ ] | [ ] | [ ] | Observability config |

### 14.5 Quality & Operations

| Tool | Implementado | Testado | Doc | ObservaÃ§Ãµes |
|------|--------------|---------|-----|-------------|
| `mvp24h_testing_patterns` | [ ] | [ ] | [ ] | Testing patterns |
| `mvp24h_security_patterns` | [ ] | [ ] | [ ] | Security patterns |
| `mvp24h_containerization_patterns` | [ ] | [ ] | [ ] | Docker/K8s patterns |
| `mvp24h_reference_guide` | [ ] | [ ] | [ ] | Reference docs |

### 14.6 AI

| Tool | Implementado | Testado | Doc | ObservaÃ§Ãµes |
|------|--------------|---------|-----|-------------|
| `mvp24h_ai_implementation` | [ ] | [ ] | [ ] | AI recommendations |

---

## Estrutura de Samples Proposta

```
sample/
â”œâ”€â”€ 01-core/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Core.Entities/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Core.ValueObjects/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Core.Guards/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Core.Specifications/
â”‚   â””â”€â”€ Mvp24Hours.Sample.Core.Functional/
â”œâ”€â”€ 02-database/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Database.SqlServer/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Database.PostgreSQL/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Database.MySQL/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Database.MongoDB/
â”‚   â””â”€â”€ Mvp24Hours.Sample.Database.Redis/
â”œâ”€â”€ 03-cqrs/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Cqrs.Basic/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Cqrs.Behaviors/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Cqrs.EventSourcing/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Cqrs.Saga/
â”‚   â””â”€â”€ Mvp24Hours.Sample.Cqrs.Projections/
â”œâ”€â”€ 04-infrastructure/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Pipeline/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.Caching/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.CronJob/
â”‚   â””â”€â”€ Mvp24Hours.Sample.Channels/
â”œâ”€â”€ 05-messaging/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.RabbitMQ.Basic/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.RabbitMQ.Saga/
â”‚   â””â”€â”€ Mvp24Hours.Sample.RabbitMQ.Outbox/
â”œâ”€â”€ 06-webapi/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.WebAPI.MinimalApi/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.WebAPI.Controllers/
â”‚   â””â”€â”€ Mvp24Hours.Sample.WebAPI.Versioning/
â”œâ”€â”€ 07-modernization/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.HybridCache/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.RateLimiting/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.TimeProvider/
â”‚   â””â”€â”€ Mvp24Hours.Sample.Aspire/
â”œâ”€â”€ 08-observability/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.OpenTelemetry/
â”‚   â””â”€â”€ Mvp24Hours.Sample.HealthChecks/
â”œâ”€â”€ 09-security/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.JWT/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.ApiKey/
â”‚   â””â”€â”€ Mvp24Hours.Sample.OAuth/
â”œâ”€â”€ 10-testing/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.UnitTests/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.IntegrationTests/
â”‚   â””â”€â”€ Mvp24Hours.Sample.TestContainers/
â”œâ”€â”€ 11-templates/
â”‚   â”œâ”€â”€ Mvp24Hours.Template.MinimalApi/
â”‚   â”œâ”€â”€ Mvp24Hours.Template.SimpleNLayers/
â”‚   â”œâ”€â”€ Mvp24Hours.Template.ComplexNLayers/
â”‚   â”œâ”€â”€ Mvp24Hours.Template.CQRS/
â”‚   â”œâ”€â”€ Mvp24Hours.Template.EventDriven/
â”‚   â”œâ”€â”€ Mvp24Hours.Template.Hexagonal/
â”‚   â”œâ”€â”€ Mvp24Hours.Template.CleanArchitecture/
â”‚   â”œâ”€â”€ Mvp24Hours.Template.DDD/
â”‚   â””â”€â”€ Mvp24Hours.Template.Microservices/
â”œâ”€â”€ 12-ai/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.SemanticKernel/
â”‚   â”œâ”€â”€ Mvp24Hours.Sample.SKGraph/
â”‚   â””â”€â”€ Mvp24Hours.Sample.AgentFramework/
â””â”€â”€ docker/
    â”œâ”€â”€ docker-compose.yml
    â”œâ”€â”€ docker-compose.infrastructure.yml
    â””â”€â”€ kubernetes/
        â”œâ”€â”€ deployment.yaml
        â”œâ”€â”€ service.yaml
        â””â”€â”€ ingress.yaml
```

---

## CritÃ©rios de ValidaÃ§Ã£o

### Para cada componente:

1. **Sample**: CÃ³digo funcional que demonstra o uso correto
2. **Test**: Testes unitÃ¡rios e/ou de integraÃ§Ã£o cobrindo cenÃ¡rios principais
3. **Doc**: DocumentaÃ§Ã£o clara e completa
4. **MCP Tool**: Ferramenta MCP disponÃ­vel e funcional

### NÃ­veis de ValidaÃ§Ã£o:

- **Bronze**: Sample funcional
- **Silver**: Sample + Tests
- **Gold**: Sample + Tests + Doc
- **Platinum**: Sample + Tests + Doc + MCP Tool

---

## PrÃ³ximos Passos

1. [ ] Criar estrutura de pastas `sample/`
2. [ ] Implementar samples de Core Patterns
3. [ ] Implementar samples de Database
4. [ ] Implementar samples de CQRS
5. [ ] Implementar samples de Infrastructure
6. [ ] Implementar samples de Messaging
7. [ ] Implementar samples de Modernization
8. [ ] Implementar samples de Observability
9. [ ] Implementar samples de Security
10. [ ] Implementar samples de Testing
11. [ ] Implementar samples de Templates
12. [ ] Implementar samples de AI
13. [ ] Criar docker-compose para infraestrutura
14. [ ] Criar manifests Kubernetes
15. [ ] Validar e atualizar checklist

---

## Changelog

| Data | VersÃ£o | DescriÃ§Ã£o |
|------|--------|-----------|
| 2026-01-18 | 1.0.5 | CriaÃ§Ã£o do design system de validaÃ§Ã£o |

---

## ReferÃªncias

- [CÃ³digo-fonte Mvp24Hours](D:\Github\mvp24hours-dotnet)
- [DocumentaÃ§Ã£o MCP](D:\Github\mvp24hours-dotnet-mcp\docs)
- [Samples existentes](https://github.com/kallebelins/mvp24hours-dotnet-samples)









