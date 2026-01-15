/**
 * Build Context Tool
 * 
 * Builds complete context for implementing a .NET application.
 * Combines architecture template with selected resources (database, caching, observability, etc.).
 * Loads documentation from actual markdown files.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

export const buildContextSchema = {
  type: "object" as const,
  properties: {
    architecture: {
      type: "string",
      enum: [
        "cqrs",
        "event-driven",
        "clean-architecture",
        "ddd",
        "hexagonal",
        "minimal-api",
        "simple-nlayers",
        "complex-nlayers",
        "microservices"
      ],
      description: "Architecture pattern to use as the foundation",
    },
    resources: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "database",
          "caching",
          "observability",
          "messaging",
          "security",
          "testing",
          "containerization"
        ],
      },
      description: "Optional resources to include (database, caching, observability, messaging, security, testing, containerization)",
    },
    database_provider: {
      type: "string",
      enum: ["postgresql", "sqlserver", "mysql", "mongodb", "redis"],
      description: "Optional specific database provider for configuration",
    },
  },
  required: ["architecture"],
};

interface BuildContextArgs {
  architecture: string;
  resources?: string[];
  database_provider?: string;
}

// Mapping of architectures to their main documentation files
const architectureContextMap: Record<string, string[]> = {
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
  "clean-architecture": [
    "ai-context/template-clean-architecture.md",
    "core/entity-interfaces.md",
    "database/use-repository.md",
    "database/use-unitofwork.md"
  ],
  "ddd": [
    "ai-context/template-ddd.md",
    "core/value-objects.md",
    "core/entity-interfaces.md",
    "cqrs/domain-events.md",
    "database/use-repository.md"
  ],
  "hexagonal": [
    "ai-context/template-hexagonal.md",
    "core/entity-interfaces.md",
    "database/use-repository.md"
  ],
  "minimal-api": [
    "ai-context/structure-minimal-api.md",
    "modernization/minimal-apis.md",
    "webapi.md"
  ],
  "simple-nlayers": [
    "ai-context/structure-simple-nlayers.md",
    "database/use-repository.md",
    "application-services.md"
  ],
  "complex-nlayers": [
    "ai-context/structure-complex-nlayers.md",
    "database/use-repository.md",
    "database/use-unitofwork.md",
    "application-services.md"
  ],
  "microservices": [
    "ai-context/template-microservices.md",
    "ai-context/messaging-patterns.md",
    "cqrs/integration-events.md",
    "modernization/aspire.md"
  ]
};

// Mapping of resources to their documentation files
const resourceContextMap: Record<string, string[]> = {
  "database": [
    "ai-context/database-patterns.md",
    "database/use-entity.md",
    "database/use-context.md"
  ],
  "caching": [
    "caching-advanced.md",
    "modernization/hybrid-cache.md"
  ],
  "observability": [
    "ai-context/observability-patterns.md",
    "observability/logging.md",
    "observability/tracing.md"
  ],
  "messaging": [
    "ai-context/messaging-patterns.md",
    "broker.md"
  ],
  "security": [
    "ai-context/security-patterns.md"
  ],
  "testing": [
    "ai-context/testing-patterns.md"
  ],
  "containerization": [
    "ai-context/containerization-patterns.md"
  ]
};

// Mapping of database providers to their specific documentation
const databaseProviderMap: Record<string, string[]> = {
  "postgresql": [
    "database/relational.md",
    "database/efcore-advanced.md"
  ],
  "sqlserver": [
    "database/relational.md",
    "database/efcore-advanced.md"
  ],
  "mysql": [
    "database/relational.md",
    "database/efcore-advanced.md"
  ],
  "mongodb": [
    "database/nosql.md",
    "database/mongodb-advanced.md"
  ],
  "redis": [
    "database/nosql.md",
    "caching-advanced.md"
  ]
};

// Related tools for each architecture
const architectureRelatedTools: Record<string, string[]> = {
  "cqrs": [
    "mvp24h_cqrs_guide({ topic: \"commands\" })",
    "mvp24h_cqrs_guide({ topic: \"queries\" })",
    "mvp24h_cqrs_guide({ topic: \"behaviors\" })",
    "mvp24h_database_advisor({ patterns: [\"repository\", \"unit-of-work\"] })"
  ],
  "event-driven": [
    "mvp24h_cqrs_guide({ topic: \"domain-events\" })",
    "mvp24h_cqrs_guide({ topic: \"integration-events\" })",
    "mvp24h_messaging_patterns({ pattern: \"rabbitmq\" })"
  ],
  "clean-architecture": [
    "mvp24h_core_patterns({ topic: \"entity-interfaces\" })",
    "mvp24h_database_advisor({ patterns: [\"repository\"] })"
  ],
  "ddd": [
    "mvp24h_core_patterns({ topic: \"value-objects\" })",
    "mvp24h_core_patterns({ topic: \"entity-interfaces\" })",
    "mvp24h_cqrs_guide({ topic: \"domain-events\" })"
  ],
  "hexagonal": [
    "mvp24h_core_patterns({ topic: \"entity-interfaces\" })",
    "mvp24h_database_advisor({ patterns: [\"repository\"] })"
  ],
  "minimal-api": [
    "mvp24h_modernization_guide({ feature: \"minimal-apis\" })",
    "mvp24h_infrastructure_guide({ topic: \"webapi\" })"
  ],
  "simple-nlayers": [
    "mvp24h_database_advisor({ patterns: [\"repository\"] })",
    "mvp24h_infrastructure_guide({ topic: \"application-services\" })"
  ],
  "complex-nlayers": [
    "mvp24h_database_advisor({ patterns: [\"repository\", \"unit-of-work\"] })",
    "mvp24h_infrastructure_guide({ topic: \"application-services\" })"
  ],
  "microservices": [
    "mvp24h_messaging_patterns({ pattern: \"rabbitmq\" })",
    "mvp24h_modernization_guide({ feature: \"aspire\" })",
    "mvp24h_containerization_patterns({ topic: \"kubernetes\" })"
  ]
};

// NuGet packages for each architecture
const architecturePackages: Record<string, string[]> = {
  "cqrs": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Cqrs",
    "Mvp24Hours.Infrastructure.Data.EFCore (or MongoDB)",
    "FluentValidation.DependencyInjectionExtensions"
  ],
  "event-driven": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Cqrs",
    "Mvp24Hours.Infrastructure.RabbitMQ"
  ],
  "clean-architecture": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Data.EFCore"
  ],
  "ddd": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Cqrs",
    "Mvp24Hours.Infrastructure.Data.EFCore"
  ],
  "hexagonal": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Data.EFCore"
  ],
  "minimal-api": [
    "Mvp24Hours.Core",
    "Mvp24Hours.WebAPI"
  ],
  "simple-nlayers": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Data.EFCore"
  ],
  "complex-nlayers": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Data.EFCore"
  ],
  "microservices": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Cqrs",
    "Mvp24Hours.Infrastructure.RabbitMQ",
    "Aspire.Hosting"
  ]
};

export async function buildContext(args: unknown): Promise<string> {
  const { architecture, resources = [], database_provider } = args as BuildContextArgs;

  // Validate architecture
  if (!architectureContextMap[architecture]) {
    return getAvailableArchitecturesMessage(architecture);
  }

  const sections: string[] = [];

  // Header
  sections.push(`# Complete Context: ${formatArchitectureName(architecture)} Architecture`);
  sections.push("");
  sections.push(`This document provides complete context for implementing a .NET application using the **${formatArchitectureName(architecture)}** architecture pattern.`);
  sections.push("");

  // Quick Reference
  sections.push("## Quick Reference");
  sections.push("");
  sections.push("### NuGet Packages");
  sections.push("");
  const packages = architecturePackages[architecture] || [];
  packages.forEach(pkg => {
    sections.push(`- \`${pkg}\``);
  });
  sections.push("");

  // Load architecture documentation
  const archFiles = architectureContextMap[architecture].filter(f => docExists(f));
  if (archFiles.length > 0) {
    sections.push("---");
    sections.push("");
    sections.push("## Architecture Foundation");
    sections.push("");
    sections.push(loadDocs(archFiles));
  }

  // Load database provider specific docs
  if (database_provider && databaseProviderMap[database_provider]) {
    const dbFiles = databaseProviderMap[database_provider].filter(f => docExists(f));
    if (dbFiles.length > 0) {
      sections.push("");
      sections.push("---");
      sections.push("");
      sections.push(`## Database Configuration: ${database_provider.toUpperCase()}`);
      sections.push("");
      sections.push(loadDocs(dbFiles));
    }
  }

  // Load resource documentation
  if (resources.length > 0) {
    for (const resource of resources) {
      const resourceFiles = resourceContextMap[resource];
      if (resourceFiles) {
        const existingFiles = resourceFiles.filter(f => docExists(f));
        if (existingFiles.length > 0) {
          sections.push("");
          sections.push("---");
          sections.push("");
          sections.push(`## ${formatResourceName(resource)}`);
          sections.push("");
          sections.push(loadDocs(existingFiles));
        }
      }
    }
  }

  // Key Interfaces Quick Reference
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Key Interfaces Reference");
  sections.push("");
  sections.push(getKeyInterfacesForArchitecture(architecture));

  // Next Steps section
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Next Steps");
  sections.push("");
  sections.push("### Related Tools");
  sections.push("");
  sections.push("Use these tools to get more detailed documentation:");
  sections.push("");
  
  const relatedTools = architectureRelatedTools[architecture] || [];
  relatedTools.forEach(tool => {
    sections.push(`- \`${tool}\``);
  });

  // Add resource-specific tools
  if (resources.includes("database") || database_provider) {
    sections.push(`- \`mvp24h_database_advisor({ provider: "${database_provider || 'postgresql'}" })\``);
  }
  if (resources.includes("observability")) {
    sections.push(`- \`mvp24h_observability_setup({ component: "overview" })\``);
  }
  if (resources.includes("messaging")) {
    sections.push(`- \`mvp24h_messaging_patterns({ pattern: "overview" })\``);
  }
  if (resources.includes("security")) {
    sections.push(`- \`mvp24h_security_patterns({ topic: "overview" })\``);
  }
  if (resources.includes("testing")) {
    sections.push(`- \`mvp24h_testing_patterns({ topic: "overview" })\``);
  }
  if (resources.includes("containerization")) {
    sections.push(`- \`mvp24h_containerization_patterns({ topic: "overview" })\``);
  }

  sections.push("");
  sections.push("### Implementation Checklist");
  sections.push("");
  sections.push(getImplementationChecklist(architecture, resources, database_provider));

  return sections.join("\n");
}

function formatArchitectureName(architecture: string): string {
  const names: Record<string, string> = {
    "cqrs": "CQRS/Mediator",
    "event-driven": "Event-Driven",
    "clean-architecture": "Clean Architecture",
    "ddd": "Domain-Driven Design",
    "hexagonal": "Hexagonal (Ports & Adapters)",
    "minimal-api": "Minimal API",
    "simple-nlayers": "Simple N-Layers",
    "complex-nlayers": "Complex N-Layers",
    "microservices": "Microservices"
  };
  return names[architecture] || architecture;
}

function formatResourceName(resource: string): string {
  const names: Record<string, string> = {
    "database": "Database Patterns",
    "caching": "Caching Patterns",
    "observability": "Observability",
    "messaging": "Messaging Patterns",
    "security": "Security Patterns",
    "testing": "Testing Patterns",
    "containerization": "Containerization"
  };
  return names[resource] || resource;
}

function getKeyInterfacesForArchitecture(architecture: string): string {
  const baseInterfaces = `
### Core Interfaces (Mvp24Hours.Core)

| Interface | Namespace | Description |
|-----------|-----------|-------------|
| \`IRepository<TEntity>\` | \`Mvp24Hours.Core.Contract.Data\` | Sync repository |
| \`IRepositoryAsync<TEntity>\` | \`Mvp24Hours.Core.Contract.Data\` | Async repository |
| \`IUnitOfWork\` | \`Mvp24Hours.Core.Contract.Data\` | Sync unit of work |
| \`IUnitOfWorkAsync\` | \`Mvp24Hours.Core.Contract.Data\` | Async unit of work |
| \`IBusinessResult<T>\` | \`Mvp24Hours.Core.Contract.ValueObjects.Logic\` | Business result |
| \`EntityBase<TKey>\` | \`Mvp24Hours.Core.Entities\` | Entity base class |
`;

  const cqrsInterfaces = `
### CQRS Interfaces (Mvp24Hours.Infrastructure.Cqrs)

| Interface | Namespace | Description |
|-----------|-----------|-------------|
| \`IMediatorCommand<TResponse>\` | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` | Command with return |
| \`IMediatorCommand\` | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` | Command without return |
| \`IMediatorCommandHandler<TCommand, TResponse>\` | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` | Command handler |
| \`IMediatorQuery<TResponse>\` | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` | Query with return |
| \`IMediatorQueryHandler<TQuery, TResponse>\` | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` | Query handler |
| \`IMediatorNotification\` | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` | In-process notification |
| \`IMediator\` | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` | Mediator interface |
`;

  const eventInterfaces = `
### Event Interfaces

| Interface | Namespace | Description |
|-----------|-----------|-------------|
| \`IDomainEvent\` | \`Mvp24Hours.Core.Contract.Domain.Events\` | Domain event marker |
| \`IIntegrationEvent\` | \`Mvp24Hours.Core.Contract.Domain.Events\` | Integration event marker |
| \`IMvpRabbitMQPublisher\` | \`Mvp24Hours.Infrastructure.RabbitMQ\` | RabbitMQ publisher |
| \`IMvpRabbitMQConsumer\` | \`Mvp24Hours.Infrastructure.RabbitMQ\` | RabbitMQ consumer |
`;

  switch (architecture) {
    case "cqrs":
      return baseInterfaces + cqrsInterfaces;
    case "event-driven":
      return baseInterfaces + cqrsInterfaces + eventInterfaces;
    case "ddd":
      return baseInterfaces + cqrsInterfaces + eventInterfaces;
    case "microservices":
      return baseInterfaces + cqrsInterfaces + eventInterfaces;
    default:
      return baseInterfaces;
  }
}

function getImplementationChecklist(architecture: string, resources: string[], database_provider?: string): string {
  const checklist: string[] = [];

  // Architecture-specific steps
  switch (architecture) {
    case "cqrs":
      checklist.push("- [ ] Create Commands and CommandHandlers");
      checklist.push("- [ ] Create Queries and QueryHandlers");
      checklist.push("- [ ] Configure Mediator in Program.cs");
      checklist.push("- [ ] Add Pipeline Behaviors (Validation, Logging)");
      break;
    case "event-driven":
      checklist.push("- [ ] Define Domain Events");
      checklist.push("- [ ] Define Integration Events");
      checklist.push("- [ ] Configure Event Publishers");
      checklist.push("- [ ] Configure Event Consumers");
      break;
    case "clean-architecture":
      checklist.push("- [ ] Create Domain layer (Entities, Interfaces)");
      checklist.push("- [ ] Create Application layer (Use Cases)");
      checklist.push("- [ ] Create Infrastructure layer (Repositories)");
      checklist.push("- [ ] Create Presentation layer (API)");
      break;
    case "ddd":
      checklist.push("- [ ] Define Bounded Contexts");
      checklist.push("- [ ] Create Aggregate Roots");
      checklist.push("- [ ] Implement Value Objects");
      checklist.push("- [ ] Define Domain Events");
      checklist.push("- [ ] Create Domain Services");
      break;
    case "hexagonal":
      checklist.push("- [ ] Define Domain/Core (Entities, Ports)");
      checklist.push("- [ ] Create Input Adapters (Controllers)");
      checklist.push("- [ ] Create Output Adapters (Repositories)");
      checklist.push("- [ ] Configure Dependency Injection");
      break;
    case "minimal-api":
      checklist.push("- [ ] Define API Endpoints");
      checklist.push("- [ ] Configure Route Groups");
      checklist.push("- [ ] Add OpenAPI Documentation");
      break;
    case "simple-nlayers":
    case "complex-nlayers":
      checklist.push("- [ ] Create Data Access Layer");
      checklist.push("- [ ] Create Business Logic Layer");
      checklist.push("- [ ] Create Presentation Layer");
      checklist.push("- [ ] Configure Dependency Injection");
      break;
    case "microservices":
      checklist.push("- [ ] Define Service Boundaries");
      checklist.push("- [ ] Create Service Projects");
      checklist.push("- [ ] Configure Inter-Service Communication");
      checklist.push("- [ ] Setup API Gateway (if needed)");
      checklist.push("- [ ] Configure Aspire Orchestration");
      break;
  }

  // Database steps
  if (resources.includes("database") || database_provider) {
    checklist.push("");
    checklist.push("**Database:**");
    checklist.push("- [ ] Configure DbContext");
    checklist.push("- [ ] Create Entity Configurations");
    checklist.push("- [ ] Register Repositories");
    checklist.push("- [ ] Create Initial Migration");
  }

  // Resource-specific steps
  if (resources.includes("caching")) {
    checklist.push("");
    checklist.push("**Caching:**");
    checklist.push("- [ ] Configure HybridCache or Redis");
    checklist.push("- [ ] Add Cache Keys Strategy");
    checklist.push("- [ ] Implement Cache Invalidation");
  }

  if (resources.includes("observability")) {
    checklist.push("");
    checklist.push("**Observability:**");
    checklist.push("- [ ] Configure OpenTelemetry");
    checklist.push("- [ ] Setup Logging Provider");
    checklist.push("- [ ] Configure Tracing Exporter");
    checklist.push("- [ ] Add Metrics Collection");
  }

  if (resources.includes("messaging")) {
    checklist.push("");
    checklist.push("**Messaging:**");
    checklist.push("- [ ] Configure RabbitMQ Connection");
    checklist.push("- [ ] Create Message Publishers");
    checklist.push("- [ ] Create Message Consumers");
    checklist.push("- [ ] Setup Dead Letter Queue");
  }

  if (resources.includes("security")) {
    checklist.push("");
    checklist.push("**Security:**");
    checklist.push("- [ ] Configure Authentication");
    checklist.push("- [ ] Setup Authorization Policies");
    checklist.push("- [ ] Configure JWT (if needed)");
    checklist.push("- [ ] Add Input Validation");
  }

  if (resources.includes("testing")) {
    checklist.push("");
    checklist.push("**Testing:**");
    checklist.push("- [ ] Create Unit Test Project");
    checklist.push("- [ ] Create Integration Test Project");
    checklist.push("- [ ] Setup Test Fixtures");
    checklist.push("- [ ] Configure Test Containers (if needed)");
  }

  if (resources.includes("containerization")) {
    checklist.push("");
    checklist.push("**Containerization:**");
    checklist.push("- [ ] Create Dockerfile");
    checklist.push("- [ ] Configure docker-compose.yml");
    checklist.push("- [ ] Add Health Checks");
    checklist.push("- [ ] Create Kubernetes Manifests (if needed)");
  }

  return checklist.join("\n");
}

function getAvailableArchitecturesMessage(invalidArchitecture: string): string {
  return `Architecture "${invalidArchitecture}" not found.

## Available Architectures

### Simple Architectures
- \`minimal-api\` - Minimal API for simple endpoints
- \`simple-nlayers\` - Simple N-Layers (Data, Business, Presentation)

### Standard Architectures
- \`complex-nlayers\` - Complex N-Layers with UoW and Repository
- \`clean-architecture\` - Clean Architecture with dependency inversion
- \`hexagonal\` - Hexagonal/Ports & Adapters

### Advanced Architectures
- \`cqrs\` - CQRS with Mediator pattern
- \`event-driven\` - Event-Driven Architecture
- \`ddd\` - Domain-Driven Design
- \`microservices\` - Microservices Architecture

## Usage Examples

### Basic Context
\`\`\`
mvp24h_build_context({ architecture: "cqrs" })
\`\`\`

### With Resources
\`\`\`
mvp24h_build_context({ 
  architecture: "cqrs", 
  resources: ["database", "observability", "caching"] 
})
\`\`\`

### With Database Provider
\`\`\`
mvp24h_build_context({ 
  architecture: "cqrs", 
  resources: ["database"], 
  database_provider: "postgresql" 
})
\`\`\`

### Complete Example
\`\`\`
mvp24h_build_context({ 
  architecture: "event-driven", 
  resources: ["database", "messaging", "observability", "containerization"],
  database_provider: "mongodb"
})
\`\`\``;
}
