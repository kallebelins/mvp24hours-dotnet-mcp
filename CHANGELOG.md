# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Placeholder for future changes

---

## [1.0.2] - 2026-01-15

### Added

#### New Tool: `mvp24h_build_context`
- Complete context builder for implementing .NET applications
- Combines architecture template with selected resources (database, caching, observability, messaging, security, testing, containerization)
- Supports 9 architecture patterns: CQRS, Event-Driven, Clean Architecture, DDD, Hexagonal, Minimal API, Simple N-Layers, Complex N-Layers, Microservices
- Includes implementation checklist and related tools suggestions
- Key interfaces reference for each architecture

#### New Documentation
- `docs/ai-context/quick-reference.md` - Complete interface reference for Mvp24Hours
- `docs/ai-context/nuget-packages.md` - NuGet packages guide with installation and configuration
- `docs/infrastructure-base.md` - Mvp24Hours.Infrastructure base package documentation
- `docs/caching-redis.md` - Redis caching with HybridCache L2 layer

### Changed

#### Tools Now Load Real Documentation
All tools now load documentation from `.md` files instead of hardcoded content:

- **database-advisor.ts**
  - Added topics: `entity`, `context`, `service`, `efcore-advanced`, `mongodb-advanced`
  - Loads from `docs/database/*.md`
  - Quick Reference with correct interfaces
  - Related Topics section

- **observability-setup.ts**
  - Added topics: `audit`, `cqrs-tracing`, `cqrs-telemetry`
  - Loads from `docs/observability/*.md` and `docs/cqrs/observability/*.md`
  - Exporter-specific configuration

- **cqrs-guide.ts**
  - Added topics: `mediator`, `concepts-comparison`, `integration-rabbitmq`, `audit`, `cqrs-tracing`, `cqrs-telemetry`
  - 28 total topics available
  - Related Topics for cross-referencing

- **modernization-guide.ts**
  - Added features: `channels`, `dotnet9-features`, `migration-guide`, `options-configuration`
  - Category-based organization (resilience, caching, time, di, api, communication, cloud, migration)
  - Loads from `docs/modernization/*.md`

- **infrastructure-guide.ts**
  - Added topics: `infrastructure-base`, `caching-redis`, `caching-advanced`, `cronjob-advanced`, `cronjob-observability`, `cronjob-resilience`
  - Complete coverage of all infrastructure packages

- **core-patterns.ts**
  - Added topic: `infrastructure-abstractions`
  - Loads from `docs/core/*.md`

- **reference-guide.ts**
  - Added topics: `api-versioning`, `error-handling`, `telemetry`
  - Loads from `docs/*.md` and `docs/ai-context/*.md`

- **architecture-advisor.ts**
  - Loads real documentation from `ai-context/decision-matrix.md` and `ai-context/architecture-templates.md`
  - Implementation checklist for each architecture
  - Suggested `mvp24h_build_context` command

- **get-template.ts**
  - Added `include_context` flag (default: true)
  - Loads related documentation for each template:
    - CQRS: commands, queries, behaviors, repository, unit-of-work
    - DDD: value-objects, entity-interfaces, domain-events, strongly-typed-ids, guard-clauses
    - Event-Driven: domain-events, integration-events, messaging-patterns, inbox-outbox
    - Microservices: messaging, integration-events, circuit-breaker, retry, containerization
  - Suggested next steps per template

- **security-patterns.ts**
  - Expanded `secrets-management` topic
  - Added AWS Secrets Manager support
  - Enhanced Azure Key Vault with Managed Identity, Certificates, Caching

### Fixed
- Interfaces now use correct Mvp24Hours namespaces (`IMediatorCommand`, `IRepository`, etc.)
- Consistent documentation across all tools
- No conflicting information between tools

### Documentation
- Cobertura completa dos pacotes NuGet:
  - `Mvp24Hours.Core` (Abstrações, entidades, value objects, guards)
  - `Mvp24Hours.Infrastructure` (Infraestrutura base, HTTP, gerenciamento de segredos)
  - `Mvp24Hours.Application` (Serviços de aplicação, validação, transações)
  - `Mvp24Hours.Infrastructure.Caching` (Caching distribuído com HybridCache)
  - `Mvp24Hours.Infrastructure.Caching.Redis` (Extensões de cache específicas para Redis)
  - `Mvp24Hours.Infrastructure.Cqrs` (Padrão CQRS/Mediator)
  - `Mvp24Hours.Infrastructure.CronJob` (Agendamento de jobs em background)
  - `Mvp24Hours.Infrastructure.Data.EFCore` (Repositório com Entity Framework Core)
  - `Mvp24Hours.Infrastructure.Data.MongoDb` (Repositório para MongoDB)
  - `Mvp24Hours.Infrastructure.Pipe` (Padrão de pipeline)
  - `Mvp24Hours.Infrastructure.RabbitMQ` (Mensageria com RabbitMQ)
  - `Mvp24Hours.WebAPI` (Utilitários para Web API e Swagger)
---

## [1.0.0] - 2024-01-13

### Added

#### Core MCP Server
- MCP Server implementation using `@modelcontextprotocol/sdk`
- Intelligent documentation routing for AI agents
- Support for Cursor IDE and Claude Desktop

#### Tools
- `mvp24h_get_started` - Framework overview and quick start guide
- `mvp24h_architecture_advisor` - Architecture recommendation based on project requirements
- `mvp24h_database_advisor` - Database selection and configuration patterns
- `mvp24h_cqrs_guide` - CQRS/Mediator implementation patterns
- `mvp24h_ai_implementation` - AI approach selection (Semantic Kernel, SK Graph, Agent Framework)
- `mvp24h_modernization_guide` - .NET 9 features and migration patterns
- `mvp24h_observability_setup` - OpenTelemetry configuration
- `mvp24h_messaging_patterns` - Async messaging (RabbitMQ, Channels)
- `mvp24h_core_patterns` - Core module patterns (Guard Clauses, Value Objects)
- `mvp24h_infrastructure_guide` - Pipeline, Caching, WebAPI, CronJob patterns
- `mvp24h_reference_guide` - Mapping, Validation, Specification patterns
- `mvp24h_get_template` - Template code retrieval
- `mvp24h_security_patterns` - Security implementation patterns
- `mvp24h_testing_patterns` - Testing strategies and patterns
- `mvp24h_containerization_patterns` - Docker and container patterns

#### Documentation
- Complete documentation for all architecture templates
- AI context documentation for intelligent routing
- Modernization guides for .NET 9
- Database configuration guides (SQL Server, PostgreSQL, MongoDB, Redis)

#### Community
- MIT License
- Contributing guidelines
- Code of Conduct
- Issue and PR templates
- GitHub Actions CI/CD workflows

### Security
- No known vulnerabilities

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.2 | 2026-01-15 | Real documentation loading, new build-context tool, complete NuGet coverage |
| 1.0.0 | 2024-01-13 | Initial release with core MCP tools |

---

## Upgrade Guide

### Upgrading to 1.0.2

This version is fully backward compatible with 1.0.0. The main changes are:

1. **New tool available**: Use `mvp24h_build_context` to get complete context for your architecture
2. **Enhanced documentation**: All tools now return more comprehensive documentation
3. **New topics**: Several tools have new topics available - check the tool descriptions

No breaking changes. Simply update your package:

```bash
npm update mvp24hours-dotnet-mcp
```

### Upgrading to 1.0.0

This is the initial release. No upgrade steps required.

---

## Contributors

Thanks to all contributors who helped make this release possible!

- [@kallebelins](https://github.com/kallebelins) - Project creator and maintainer

---

[Unreleased]: https://github.com/kallebelins/mvp24hours-dotnet-mcp/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/kallebelins/mvp24hours-dotnet-mcp/compare/v1.0.0...v1.0.2
[1.0.0]: https://github.com/kallebelins/mvp24hours-dotnet-mcp/releases/tag/v1.0.0
