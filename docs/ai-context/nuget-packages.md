# NuGet Packages Reference - Mvp24Hours

Complete reference of all NuGet packages in the Mvp24Hours framework.

## Package Overview

| Package | Purpose | Version |
|---------|---------|---------|
| `Mvp24Hours.Core` | Core abstractions, entities, value objects, guards | 9.1.x |
| `Mvp24Hours.Infrastructure` | Base infrastructure, HTTP, secrets management | 9.1.x |
| `Mvp24Hours.Application` | Application services, validation, transactions | 9.1.x |
| `Mvp24Hours.Infrastructure.Caching` | Distributed caching with HybridCache | 9.1.x |
| `Mvp24Hours.Infrastructure.Caching.Redis` | Redis-specific caching extensions | 9.1.x |
| `Mvp24Hours.Infrastructure.Cqrs` | CQRS/Mediator pattern | 9.1.x |
| `Mvp24Hours.Infrastructure.CronJob` | Background job scheduling | 9.1.x |
| `Mvp24Hours.Infrastructure.Data.EFCore` | Entity Framework Core repository | 9.1.x |
| `Mvp24Hours.Infrastructure.Data.MongoDb` | MongoDB repository | 9.1.x |
| `Mvp24Hours.Infrastructure.Pipe` | Pipeline pattern | 9.1.x |
| `Mvp24Hours.Infrastructure.RabbitMQ` | RabbitMQ messaging | 9.1.x |
| `Mvp24Hours.WebAPI` | Web API utilities, Swagger | 9.1.x |

**Target Framework:** .NET 9.0  
**Current Version:** 9.1.20

---

## Mvp24Hours.Core

Core module with abstractions, entities, and utilities.

```bash
dotnet add package Mvp24Hours.Core
```

**Features:** Entity base classes, Value Objects, Guard clauses, Strongly-typed IDs, Functional patterns (Maybe, Result), Smart enums, Exceptions, Infrastructure abstractions (IClock, IGuidGenerator), Business result types, OpenTelemetry, Rate limiting

**Dependencies:** AutoMapper 13.x, FluentValidation 12.x, Newtonsoft.Json 13.x, OpenTelemetry 1.x

---

## Mvp24Hours.Infrastructure

Base infrastructure with HTTP clients, secrets management, and utilities.

```bash
dotnet add package Mvp24Hours.Infrastructure
```

**Features:** HTTP client factory with Polly resilience, Memory caching, MessagePack serialization, Scriban templates, Redis connectivity, Azure Key Vault, AWS Secrets Manager, Health checks

**Dependencies:** Mvp24Hours.Core, Polly 8.x, StackExchange.Redis 2.x, MessagePack 2.x, Azure.Security.KeyVault.Secrets 4.x, AWSSDK.SecretsManager 4.x

---

## Mvp24Hours.Application

Application service layer with validation and transactions.

```bash
dotnet add package Mvp24Hours.Application
```

**Features:** Application service base classes, Validation pipelines, Transaction scope, Event publishing, Bulk operations, Pagination services, Specification pattern, Observability (audit, correlation, metrics)

**Dependencies:** Mvp24Hours.Core, Mvp24Hours.Infrastructure, Mvp24Hours.Infrastructure.Data.EFCore, AutoMapper 13.x, FluentValidation 12.x, EF Core 9.x

---

## Mvp24Hours.Infrastructure.Caching

Distributed caching with HybridCache support.

```bash
dotnet add package Mvp24Hours.Infrastructure.Caching
```

**Features:** HybridCache (.NET 9), Memory caching (L1), Redis caching (L2), Cache aside pattern, Cache invalidation, MessagePack serialization, Health checks, EF Core integration

**Dependencies:** Mvp24Hours.Core, Mvp24Hours.Infrastructure, Microsoft.Extensions.Caching.Hybrid 9.x, StackExchange.Redis

---

## Mvp24Hours.Infrastructure.Caching.Redis

Redis-specific caching extensions.

```bash
dotnet add package Mvp24Hours.Infrastructure.Caching.Redis
```

**Features:** Redis extensions, Simplified Redis configuration

**Dependencies:** Mvp24Hours.Infrastructure.Caching, StackExchange.Redis

---

## Mvp24Hours.Infrastructure.Cqrs

CQRS/Mediator pattern (MediatR replacement).

```bash
dotnet add package Mvp24Hours.Infrastructure.Cqrs
```

**Features:** IMediator, ISender, IPublisher, Commands/Queries, Notifications, Domain Events, Integration Events, Pipeline Behaviors (Logging, Validation, Transaction, Caching, Retry, Idempotency, Authorization), Streaming, Memory/Redis caching

**Dependencies:** Mvp24Hours.Core, FluentValidation 12.x, Microsoft.Extensions.Resilience 9.x

---

## Mvp24Hours.Infrastructure.CronJob

Background job scheduling with CRON expressions.

```bash
dotnet add package Mvp24Hours.Infrastructure.CronJob
```

**Features:** Cron scheduling (Cronos), Job lifecycle (start, stop, pause, resume), Resilience (retry, circuit breaker), OpenTelemetry, Health checks, Timezone support, State store

**Dependencies:** Mvp24Hours.Core, Mvp24Hours.Infrastructure, Cronos 0.8.x

---

## Mvp24Hours.Infrastructure.Data.EFCore

Entity Framework Core repository implementation.

```bash
dotnet add package Mvp24Hours.Infrastructure.Data.EFCore
```

**Features:** IRepository/IRepositoryAsync, IUnitOfWork/IUnitOfWorkAsync, Paging, Navigation loading, Transactions, Dapper support, Health checks, Resilience, In-memory for testing

**Dependencies:** Mvp24Hours.Core, Mvp24Hours.Infrastructure, EF Core 9.x

**Database packages (choose one):**
- SQL Server: `Microsoft.EntityFrameworkCore.SqlServer`
- PostgreSQL: `Npgsql.EntityFrameworkCore.PostgreSQL`
- MySQL: `MySql.EntityFrameworkCore`

---

## Mvp24Hours.Infrastructure.Data.MongoDb

MongoDB repository implementation.

```bash
dotnet add package Mvp24Hours.Infrastructure.Data.MongoDb
```

**Features:** MongoDB repository, Unit of work, BSON serialization, GridFS, Index management, Aggregation, Health checks, CQRS integration

**Dependencies:** Mvp24Hours.Core, Mvp24Hours.Infrastructure, Mvp24Hours.Infrastructure.Cqrs, MongoDB.Driver 2.x

---

## Mvp24Hours.Infrastructure.Pipe

Pipeline (Pipe and Filters) pattern.

```bash
dotnet add package Mvp24Hours.Infrastructure.Pipe
```

**Features:** Sync/async pipelines, Operations/filters, Interceptors, Rollback, Typed pipelines, Middleware, Fork/Join, Checkpoint/Resume, Resilience, OpenTelemetry, Channels

**Dependencies:** Mvp24Hours.Core, Mvp24Hours.Infrastructure, FluentValidation 12.x, Microsoft.Extensions.Resilience 9.x

---

## Mvp24Hours.Infrastructure.RabbitMQ

RabbitMQ messaging with advanced patterns.

```bash
dotnet add package Mvp24Hours.Infrastructure.RabbitMQ
```

**Features:** Producer/consumer, JSON/MessagePack, Dead letter queues, Retry with Polly, Saga pattern, Message scheduling, Batch processing, Request/response, Multi-tenancy, Transactional outbox, Deduplication, OpenTelemetry

**Dependencies:** Mvp24Hours.Core, Mvp24Hours.Infrastructure, Mvp24Hours.Infrastructure.Cqrs, RabbitMQ.Client 6.x, Polly 8.x

---

## Mvp24Hours.WebAPI

Web API utilities and middleware.

```bash
dotnet add package Mvp24Hours.WebAPI
```

**Features:** Swagger/OpenAPI, Native OpenAPI (.NET 9), Exception handling, Response wrapping, API versioning, Problem details, Content negotiation, Response compression/caching, Output caching (Redis), Rate limiting, Idempotency, Model binders

**Dependencies:** Mvp24Hours.Core, Mvp24Hours.Infrastructure, Mvp24Hours.Infrastructure.Cqrs, Swashbuckle.AspNetCore 6.x, Microsoft.AspNetCore.OpenApi 9.x

---

## Quick Installation Guide

### Minimal API

```bash
dotnet add package Mvp24Hours.Core
dotnet add package Mvp24Hours.WebAPI
```

### N-Layer with EF Core

```bash
dotnet add package Mvp24Hours.Core
dotnet add package Mvp24Hours.Infrastructure
dotnet add package Mvp24Hours.Application
dotnet add package Mvp24Hours.Infrastructure.Data.EFCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Mvp24Hours.WebAPI
```

### CQRS

```bash
dotnet add package Mvp24Hours.Core
dotnet add package Mvp24Hours.Infrastructure
dotnet add package Mvp24Hours.Infrastructure.Cqrs
dotnet add package Mvp24Hours.Infrastructure.Data.EFCore
dotnet add package Mvp24Hours.WebAPI
```

### Event-Driven

```bash
dotnet add package Mvp24Hours.Core
dotnet add package Mvp24Hours.Infrastructure
dotnet add package Mvp24Hours.Infrastructure.Cqrs
dotnet add package Mvp24Hours.Infrastructure.RabbitMQ
dotnet add package Mvp24Hours.Infrastructure.Data.EFCore
dotnet add package Mvp24Hours.WebAPI
```

### Microservices

```bash
dotnet add package Mvp24Hours.Core
dotnet add package Mvp24Hours.Infrastructure
dotnet add package Mvp24Hours.Infrastructure.Cqrs
dotnet add package Mvp24Hours.Infrastructure.RabbitMQ
dotnet add package Mvp24Hours.Infrastructure.Caching
dotnet add package Mvp24Hours.Infrastructure.Caching.Redis
dotnet add package Mvp24Hours.Infrastructure.Data.EFCore
dotnet add package Mvp24Hours.WebAPI
```

### MongoDB

```bash
dotnet add package Mvp24Hours.Core
dotnet add package Mvp24Hours.Infrastructure
dotnet add package Mvp24Hours.Infrastructure.Data.MongoDb
dotnet add package Mvp24Hours.WebAPI
```

### Background Jobs

```bash
dotnet add package Mvp24Hours.Core
dotnet add package Mvp24Hours.Infrastructure
dotnet add package Mvp24Hours.Infrastructure.CronJob
```

---

## Dependency Graph

```text
Mvp24Hours.Core (standalone)
+-- Mvp24Hours.Infrastructure
|   +-- Mvp24Hours.Application
|   |   +-- Mvp24Hours.Infrastructure.Data.EFCore
|   +-- Mvp24Hours.Infrastructure.Caching
|   |   +-- Mvp24Hours.Infrastructure.Caching.Redis
|   +-- Mvp24Hours.Infrastructure.CronJob
|   +-- Mvp24Hours.Infrastructure.Data.EFCore
|   +-- Mvp24Hours.Infrastructure.Data.MongoDb
|   |   +-- Mvp24Hours.Infrastructure.Cqrs
|   +-- Mvp24Hours.Infrastructure.Pipe
|   +-- Mvp24Hours.Infrastructure.RabbitMQ
|   |   +-- Mvp24Hours.Infrastructure.Cqrs
|   +-- Mvp24Hours.WebAPI
|       +-- Mvp24Hours.Infrastructure.Cqrs
+-- Mvp24Hours.Infrastructure.Cqrs (only Core dependency)
```

---

## Version Compatibility

| Mvp24Hours | .NET | EF Core |
|------------|------|---------|
| 9.1.x | .NET 9 | EF Core 9.x |
| 9.0.x | .NET 9 | EF Core 9.x |
| 8.x | .NET 6/7/8 | EF Core 6-8.x |

---

## See Also

- [Quick Reference](quick-reference.md)
- [Getting Started](../getting-started.md)
- [Architecture Templates](architecture-templates.md)
