/**
 * Architecture Advisor Tool
 * 
 * Recommends the best architecture template based on project requirements.
 * Acts as an intelligent router to the appropriate documentation.
 * 
 * Loads real documentation from:
 * - ai-context/decision-matrix.md
 * - ai-context/architecture-templates.md
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

export const architectureAdvisorSchema = {
  type: "object" as const,
  properties: {
    complexity: {
      type: "string",
      enum: ["low", "medium", "high", "very-high"],
      description: "Project complexity level",
    },
    entity_count: {
      type: "string",
      enum: ["few", "medium", "many"],
      description: "Number of entities: few (1-5), medium (5-15), many (15+)",
    },
    business_rules: {
      type: "string",
      enum: ["simple", "moderate", "complex"],
      description: "Complexity of business rules",
    },
    team_size: {
      type: "string",
      enum: ["solo", "small", "large"],
      description: "Team size: solo (1), small (2-5), large (5+)",
    },
    requirements: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "cqrs",
          "event-sourcing",
          "audit-trail",
          "external-integrations",
          "microservices",
          "domain-driven",
          "rapid-prototype",
          "high-performance",
          "multiple-databases",
        ],
      },
      description: "Specific requirements for the project",
    },
  },
  required: [],
};

interface ArchitectureAdvisorArgs {
  complexity?: "low" | "medium" | "high" | "very-high";
  entity_count?: "few" | "medium" | "many";
  business_rules?: "simple" | "moderate" | "complex";
  team_size?: "solo" | "small" | "large";
  requirements?: string[];
}

// Mapping of architectures to recommended resources
const architectureResourcesMap: Record<string, string[]> = {
  "minimal-api": ["database"],
  "simple-nlayers": ["database", "observability"],
  "complex-nlayers": ["database", "caching", "observability", "testing"],
  "cqrs": ["database", "caching", "observability", "messaging"],
  "event-driven": ["database", "messaging", "observability"],
  "hexagonal": ["database", "observability", "testing"],
  "clean-architecture": ["database", "caching", "observability", "testing", "security"],
  "ddd": ["database", "observability", "testing", "messaging"],
  "microservices": ["database", "messaging", "observability", "containerization", "security"],
};

// Mapping of architectures to NuGet packages
const architecturePackagesMap: Record<string, string[]> = {
  "minimal-api": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Infrastructure.Data.EFCore",
    "FluentValidation",
  ],
  "simple-nlayers": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Infrastructure.Data.EFCore",
    "Mvp24Hours.WebAPI",
    "FluentValidation",
    "AutoMapper",
  ],
  "complex-nlayers": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Data.EFCore",
    "Mvp24Hours.Infrastructure.Pipe",
    "Mvp24Hours.WebAPI",
    "FluentValidation",
    "AutoMapper",
  ],
  "cqrs": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Data.EFCore",
    "FluentValidation",
  ],
  "event-driven": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Infrastructure.RabbitMQ",
    "Mvp24Hours.Infrastructure.Data.EFCore",
    "RabbitMQ.Client",
  ],
  "hexagonal": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Infrastructure.Data.EFCore",
    "Mvp24Hours.WebAPI",
  ],
  "clean-architecture": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Data.EFCore",
    "Mvp24Hours.WebAPI",
    "FluentValidation",
    "AutoMapper",
  ],
  "ddd": [
    "Mvp24Hours.Core",
    "Mvp24Hours.Application",
    "Mvp24Hours.Infrastructure.Data.EFCore",
    "FluentValidation",
  ],
  "microservices": [
    "Mvp24Hours.Core",
    "Mvp24Hours.WebAPI",
    "Mvp24Hours.Infrastructure.RabbitMQ",
    "Mvp24Hours.Infrastructure.Caching.Redis",
    "Polly",
  ],
};

// Implementation checklist by architecture
const implementationChecklistMap: Record<string, string[]> = {
  "minimal-api": [
    "Create project structure with single project",
    "Configure DbContext with EF Core",
    "Add Mvp24Hours repository services",
    "Create entity classes with EntityBase<T>",
    "Add FluentValidation validators",
    "Implement endpoints using minimal API syntax",
    "Configure Swagger for API documentation",
    "Add health checks",
  ],
  "simple-nlayers": [
    "Create solution with Core, Infrastructure, WebAPI projects",
    "Define entities in Core layer with EntityBase<T>",
    "Create DTOs and validators in Core layer",
    "Configure DbContext in Infrastructure layer",
    "Register Mvp24Hours services (repository, unit of work)",
    "Implement controllers in WebAPI layer",
    "Configure AutoMapper profiles",
    "Add health checks and Swagger",
  ],
  "complex-nlayers": [
    "Create solution with Core, Infrastructure, Application, WebAPI projects",
    "Define entities, DTOs, and specifications in Core layer",
    "Create service contracts (interfaces) in Core layer",
    "Configure DbContext and migrations in Infrastructure layer",
    "Implement services in Application layer using RepositoryService<T>",
    "Create AutoMapper profiles in Application layer",
    "Implement controllers calling service layer",
    "Add exception middleware and NLog configuration",
    "Configure health checks with database probe",
  ],
  "cqrs": [
    "Create solution with Domain, Application, Infrastructure, WebAPI projects",
    "Define entities and domain events in Domain layer",
    "Create Commands (IMediatorCommand<T>) in Application layer",
    "Create Queries (IMediatorQuery<T>) in Application layer",
    "Implement Command/Query Handlers",
    "Add pipeline behaviors (validation, logging, transaction)",
    "Configure Mvp24Hours Mediator in DI",
    "Register handlers with assembly scanning",
    "Implement controllers using IMediator.Send()",
  ],
  "event-driven": [
    "Create solution with Domain, Application, Infrastructure, WebAPI projects",
    "Define domain events (IDomainEvent) in Domain layer",
    "Define integration events for cross-service communication",
    "Implement event handlers (IMediatorNotificationHandler<T>)",
    "Configure RabbitMQ for integration events",
    "Implement Outbox pattern for reliable messaging",
    "Add event store for event sourcing (optional)",
    "Configure retry and circuit breaker for consumers",
  ],
  "hexagonal": [
    "Create solution with Core (Domain + Ports), Adapters, Bootstrap projects",
    "Define domain model in Core/Domain",
    "Create inbound ports (use cases) as interfaces",
    "Create outbound ports (repositories, external services) as interfaces",
    "Implement inbound adapters (WebAPI controllers)",
    "Implement outbound adapters (EF Core repositories, HTTP clients)",
    "Configure DI in Bootstrap project",
    "Ensure Core has no infrastructure dependencies",
  ],
  "clean-architecture": [
    "Create solution with Domain, Application, Infrastructure, WebAPI projects",
    "Define entities and interfaces in Domain layer (no dependencies)",
    "Create use cases in Application layer",
    "Define DTOs and application interfaces in Application layer",
    "Implement persistence in Infrastructure layer",
    "Implement external services in Infrastructure layer",
    "Configure dependency injection following dependency rule",
    "Ensure all dependencies point inward (toward Domain)",
  ],
  "ddd": [
    "Create solution with Domain, Application, Infrastructure, WebAPI projects",
    "Identify bounded contexts and aggregates",
    "Define Aggregate Roots with EntityBase<T>",
    "Create Value Objects for identity-less concepts",
    "Implement domain services for cross-aggregate logic",
    "Define domain events for state changes",
    "Create repositories per aggregate root",
    "Implement application services orchestrating use cases",
    "Add domain event handlers",
  ],
  "microservices": [
    "Create solution structure with Services, BuildingBlocks, ApiGateway folders",
    "Define service boundaries based on business capabilities",
    "Create shared contracts/events in BuildingBlocks",
    "Implement each service with its own database",
    "Configure RabbitMQ for async communication",
    "Implement API Gateway for routing",
    "Add service discovery (optional)",
    "Create Docker/docker-compose configuration",
    "Configure health checks per service",
    "Implement circuit breaker for inter-service calls",
  ],
};

export async function architectureAdvisor(args: unknown): Promise<string> {
  const {
    complexity,
    entity_count,
    business_rules,
    team_size,
    requirements = [],
  } = args as ArchitectureAdvisorArgs;

  // Decision logic
  let recommendedTemplate = "simple-nlayers";
  let reasoning: string[] = [];

  // Check for specific requirements first
  if (requirements.includes("microservices")) {
    recommendedTemplate = "microservices";
    reasoning.push("Microservices architecture requested");
  } else if (requirements.includes("domain-driven") || requirements.includes("event-sourcing")) {
    recommendedTemplate = "ddd";
    reasoning.push("Domain-driven design with rich domain model needed");
  } else if (requirements.includes("cqrs")) {
    recommendedTemplate = "cqrs";
    reasoning.push("CQRS pattern for read/write separation");
  } else if (requirements.includes("external-integrations")) {
    recommendedTemplate = "hexagonal";
    reasoning.push("Hexagonal/Ports & Adapters for external integrations");
  } else if (requirements.includes("audit-trail")) {
    recommendedTemplate = "event-driven";
    reasoning.push("Event-driven for audit trail and event sourcing");
  } else if (requirements.includes("rapid-prototype")) {
    recommendedTemplate = "minimal-api";
    reasoning.push("Minimal API for rapid prototyping");
  } else {
    // Decision based on complexity
    if (complexity === "low" || (entity_count === "few" && business_rules === "simple")) {
      recommendedTemplate = "minimal-api";
      reasoning.push("Low complexity with simple requirements");
    } else if (complexity === "medium" || business_rules === "moderate") {
      recommendedTemplate = "simple-nlayers";
      reasoning.push("Medium complexity with moderate business rules");
    } else if (complexity === "high" || business_rules === "complex") {
      recommendedTemplate = "complex-nlayers";
      reasoning.push("High complexity requiring dedicated application layer");
    } else if (complexity === "very-high") {
      recommendedTemplate = "clean-architecture";
      reasoning.push("Very high complexity requiring clean architecture principles");
    }

    // Adjustments based on team size
    if (team_size === "large" && recommendedTemplate === "complex-nlayers") {
      recommendedTemplate = "clean-architecture";
      reasoning.push("Large team benefits from stricter architectural boundaries");
    }

    // Adjustments based on entity count
    if (entity_count === "many" && recommendedTemplate === "simple-nlayers") {
      recommendedTemplate = "complex-nlayers";
      reasoning.push("Many entities benefit from specification pattern and services layer");
    }
  }

  // Build the response with real documentation
  const sections: string[] = [];

  // Header
  sections.push(`# Architecture Recommendation

## Recommended Template: **${getTemplateName(recommendedTemplate)}**

### Why This Template?
${reasoning.map((r) => `- ${r}`).join("\n")}`);

  // Load decision matrix documentation
  const decisionMatrixDoc = await loadDecisionMatrix();
  if (decisionMatrixDoc) {
    sections.push(`\n---\n\n## Decision Matrix\n\n${decisionMatrixDoc}`);
  } else {
    // Fallback to inline matrix
    sections.push(`\n---\n\n## Decision Matrix

| Template | Complexity | Entities | Business Rules | Team Size |
|----------|------------|----------|----------------|-----------|
| Minimal API | Low | 1-5 | Simple | Solo/Small |
| Simple N-Layers | Medium | 5-15 | Moderate | Small |
| Complex N-Layers | High | 15+ | Complex | Small/Large |
| CQRS | High | 10+ | Complex + R/W separation | Any |
| Event-Driven | High | Any | Audit/Event history | Any |
| Hexagonal | High | Any | Many integrations | Small/Large |
| Clean Architecture | Very High | 20+ | Very Complex | Large |
| DDD | Very High | Any | Rich Domain Model | Large |
| Microservices | Very High | Service-based | Independent deploy | Large |`);
  }

  // Template info - try to load from documentation
  const templateDoc = await loadTemplateDocumentation(recommendedTemplate);
  if (templateDoc) {
    sections.push(`\n---\n\n## Template Details\n\n${templateDoc}`);
  } else {
    // Fallback to inline template info
    const templateInfo = getTemplateInfoFallback(recommendedTemplate);
    sections.push(`\n---\n\n## Template Overview

${templateInfo.description}

### Project Structure
\`\`\`
${templateInfo.structure}
\`\`\`

### Key Characteristics
${templateInfo.characteristics.map((c) => `- ${c}`).join("\n")}`);
  }

  // Required NuGet packages
  const packages = architecturePackagesMap[recommendedTemplate] || [];
  sections.push(`\n---\n\n## Required NuGet Packages

\`\`\`xml
${packages.map(p => `<PackageReference Include="${p}" Version="9.*" />`).join("\n")}
\`\`\``);

  // Recommended resources
  const resources = architectureResourcesMap[recommendedTemplate] || [];
  sections.push(`\n---\n\n## Recommended Resources

For the **${getTemplateName(recommendedTemplate)}** architecture, consider adding these resources:

${resources.map(r => `- **${capitalizeFirst(r)}**: \`mvp24h_${getResourceTool(r)}({ ... })\``).join("\n")}`);

  // Build context suggestion
  const resourceList = resources.length > 0 ? `["${resources.join('", "')}"]` : "[]";
  sections.push(`\n---\n\n## Quick Start with Complete Context

Get all the documentation you need in a single call:

\`\`\`
mvp24h_build_context({
  architecture: "${recommendedTemplate}",
  resources: ${resourceList}
})
\`\`\`

This will provide:
- Complete template code
- Database configuration
${resources.includes("caching") ? "- Caching setup with Redis/HybridCache\n" : ""}${resources.includes("observability") ? "- Observability (logging, tracing, metrics)\n" : ""}${resources.includes("messaging") ? "- Messaging patterns with RabbitMQ\n" : ""}${resources.includes("security") ? "- Security patterns (JWT, authentication)\n" : ""}${resources.includes("testing") ? "- Testing patterns and examples\n" : ""}${resources.includes("containerization") ? "- Docker/Kubernetes configuration\n" : ""}`);

  // Implementation checklist
  const checklist = implementationChecklistMap[recommendedTemplate] || [];
  if (checklist.length > 0) {
    sections.push(`\n---\n\n## Implementation Checklist

Follow these steps to implement the **${getTemplateName(recommendedTemplate)}** architecture:

${checklist.map((item, index) => `${index + 1}. [ ] ${item}`).join("\n")}`);
  }

  // Alternative options
  sections.push(`\n---\n\n## Alternative Options

${getAlternatives(recommendedTemplate)}`);

  // Next steps
  sections.push(`\n---\n\n## Next Steps

1. **Get the template code**: \`mvp24h_get_template({ template_name: "${recommendedTemplate}" })\`
2. **Build complete context**: \`mvp24h_build_context({ architecture: "${recommendedTemplate}", resources: ${resourceList} })\`
3. **Configure database**: \`mvp24h_database_advisor({ provider: "postgresql" })\`
4. **Add observability**: \`mvp24h_observability_setup({ component: "overview" })\`
${requirements.includes("cqrs") || recommendedTemplate === "cqrs" ? `5. **CQRS patterns**: \`mvp24h_cqrs_guide({ topic: "commands" })\`\n` : ""}${requirements.includes("microservices") || recommendedTemplate === "microservices" ? `5. **Containerization**: \`mvp24h_containerization_patterns({ topic: "docker-compose" })\`\n` : ""}`);

  // Related documentation
  sections.push(`\n---\n\n## Related Documentation

| Topic | Tool |
|-------|------|
| Database Patterns | \`mvp24h_database_advisor\` |
| CQRS/Mediator | \`mvp24h_cqrs_guide\` |
| Observability | \`mvp24h_observability_setup\` |
| Messaging | \`mvp24h_messaging_patterns\` |
| Testing | \`mvp24h_testing_patterns\` |
| Security | \`mvp24h_security_patterns\` |
| Containerization | \`mvp24h_containerization_patterns\` |
| Modernization (.NET 9) | \`mvp24h_modernization_guide\` |`);

  return sections.join("\n");
}

async function loadDecisionMatrix(): Promise<string | null> {
  try {
    if (await docExists("ai-context/decision-matrix.md")) {
      const content = await loadDoc("ai-context/decision-matrix.md");
      // Extract just the template selection matrix section
      const matrixMatch = content.match(/### Template Selection Matrix[\s\S]*?(?=###|---|\n## )/);
      if (matrixMatch) {
        return matrixMatch[0].trim();
      }
      // Return the architecture pattern combinations section as alternative
      const combinationsMatch = content.match(/## Architecture Pattern Combinations[\s\S]*?(?=## AI Agent|$)/);
      if (combinationsMatch) {
        return combinationsMatch[0].trim();
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function loadTemplateDocumentation(template: string): Promise<string | null> {
  try {
    // Try to load specific template documentation
    const templatePath = `ai-context/template-${template}.md`;
    if (await docExists(templatePath)) {
      const content = await loadDoc(templatePath);
      // Return first 2000 characters as overview
      const overview = content.substring(0, 2000);
      const lastNewline = overview.lastIndexOf("\n\n");
      return lastNewline > 0 ? overview.substring(0, lastNewline) + "\n\n*[See full template with `mvp24h_get_template`]*" : overview;
    }
    
    // Try architecture-templates.md for basic templates
    if (await docExists("ai-context/architecture-templates.md")) {
      const content = await loadDoc("ai-context/architecture-templates.md");
      const templateName = getTemplateName(template);
      // Look for the template section
      const regex = new RegExp(`## Template \\d+: ${templateName}[\\s\\S]*?(?=## Template|## Template Variations|---|\n## [A-Z])`, "i");
      const match = content.match(regex);
      if (match) {
        return match[0].trim();
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

function getTemplateName(template: string): string {
  const names: Record<string, string> = {
    "minimal-api": "Minimal API",
    "simple-nlayers": "Simple N-Layers",
    "complex-nlayers": "Complex N-Layers",
    "cqrs": "CQRS (Command Query Responsibility Segregation)",
    "event-driven": "Event-Driven Architecture",
    "hexagonal": "Hexagonal (Ports & Adapters)",
    "clean-architecture": "Clean Architecture",
    "ddd": "Domain-Driven Design (DDD)",
    "microservices": "Microservices Architecture",
  };
  return names[template] || template;
}

function getResourceTool(resource: string): string {
  const tools: Record<string, string> = {
    "database": "database_advisor",
    "caching": "infrastructure_guide({ topic: \"caching\" })",
    "observability": "observability_setup",
    "messaging": "messaging_patterns",
    "security": "security_patterns",
    "testing": "testing_patterns",
    "containerization": "containerization_patterns",
  };
  return tools[resource] || resource;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTemplateInfoFallback(template: string) {
  const templates: Record<string, {
    description: string;
    structure: string;
    characteristics: string[];
  }> = {
    "minimal-api": {
      description: "Lightweight single-project structure ideal for microservices and simple CRUDs. Uses .NET minimal API syntax with endpoint-based routing.",
      structure: `ProjectName/
├── ProjectName.csproj
├── Program.cs
├── appsettings.json
├── Entities/
├── ValueObjects/
├── Validators/
├── Data/
└── Endpoints/`,
      characteristics: [
        "Single project, minimal boilerplate",
        "Endpoint-based routing (MapGet, MapPost)",
        "No separate service layer",
        "Direct repository access",
        "Fast startup time",
      ],
    },
    "simple-nlayers": {
      description: "3-layer architecture with Core, Infrastructure, and WebAPI projects. Good balance between simplicity and separation of concerns.",
      structure: `Solution/
├── ProjectName.Core/
│   ├── Entities/
│   ├── ValueObjects/
│   └── Validators/
├── ProjectName.Infrastructure/
│   └── Data/
└── ProjectName.WebAPI/
    ├── Controllers/
    └── Extensions/`,
      characteristics: [
        "3 projects: Core, Infrastructure, WebAPI",
        "Clear separation of concerns",
        "Controllers with repository access",
        "Validators in Core layer",
        "Easy to understand and maintain",
      ],
    },
    "complex-nlayers": {
      description: "4-layer architecture adding an Application layer with services, specifications, and mapping. Ideal for enterprise applications.",
      structure: `Solution/
├── ProjectName.Core/
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Validators/
│   ├── Contract/
│   └── Specifications/
├── ProjectName.Infrastructure/
│   └── Data/
├── ProjectName.Application/
│   ├── Services/
│   ├── Mappings/
│   └── Pipelines/
└── ProjectName.WebAPI/
    ├── Controllers/
    └── Middlewares/`,
      characteristics: [
        "4 projects with dedicated Application layer",
        "Service contracts and implementations",
        "Specification pattern for queries",
        "AutoMapper profiles",
        "Pipeline support for complex workflows",
      ],
    },
    "cqrs": {
      description: "Separates read and write operations with dedicated Command and Query handlers. Includes pipeline behaviors for cross-cutting concerns.",
      structure: `Solution/
├── ProjectName.Domain/
│   ├── Entities/
│   ├── ValueObjects/
│   └── Events/
├── ProjectName.Application/
│   ├── Commands/
│   ├── Queries/
│   ├── Behaviors/
│   └── Handlers/
├── ProjectName.Infrastructure/
│   ├── Data/
│   └── Messaging/
└── ProjectName.WebAPI/
    └── Controllers/`,
      characteristics: [
        "Separate Command and Query models",
        "Mediator pattern (built-in Mvp24Hours.Mediator)",
        "Pipeline behaviors for validation, logging, etc.",
        "Support for domain events",
        "Optimized read models",
      ],
    },
    "hexagonal": {
      description: "Clean separation between business logic and external dependencies. Core has no knowledge of infrastructure.",
      structure: `Solution/
├── ProjectName.Core/
│   ├── Domain/
│   └── Ports/
│       ├── Inbound/
│       └── Outbound/
├── ProjectName.Adapters/
│   ├── Inbound/
│   │   └── WebAPI/
│   └── Outbound/
│       ├── Persistence/
│       └── ExternalServices/
└── ProjectName.Bootstrap/`,
      characteristics: [
        "Ports define contracts",
        "Adapters implement ports",
        "Business logic isolated from infrastructure",
        "Easy to swap external dependencies",
        "High testability",
      ],
    },
    "clean-architecture": {
      description: "Follows Uncle Bob's Clean Architecture with strict dependency rules. All dependencies point inward toward the domain.",
      structure: `Solution/
├── ProjectName.Domain/
│   ├── Entities/
│   ├── ValueObjects/
│   └── Interfaces/
├── ProjectName.Application/
│   ├── UseCases/
│   ├── DTOs/
│   └── Interfaces/
├── ProjectName.Infrastructure/
│   ├── Persistence/
│   └── Services/
└── ProjectName.WebAPI/
    └── Controllers/`,
      characteristics: [
        "Domain at the center",
        "Use Cases in Application layer",
        "Infrastructure implements interfaces",
        "Dependency inversion throughout",
        "Framework-agnostic domain",
      ],
    },
    "ddd": {
      description: "Rich domain model with Aggregates, Value Objects, Domain Services, and Domain Events. Best for complex business domains.",
      structure: `Solution/
├── ProjectName.Domain/
│   ├── Aggregates/
│   │   └── Customer/
│   │       ├── Customer.cs (Aggregate Root)
│   │       ├── Address.cs (Value Object)
│   │       └── Events/
│   ├── Services/
│   └── Repositories/
├── ProjectName.Application/
│   ├── Commands/
│   ├── Queries/
│   └── EventHandlers/
├── ProjectName.Infrastructure/
└── ProjectName.WebAPI/`,
      characteristics: [
        "Aggregates with Aggregate Roots",
        "Value Objects for identity-less concepts",
        "Domain Services for cross-aggregate logic",
        "Domain Events for state changes",
        "Rich domain model (behavior + data)",
      ],
    },
    "event-driven": {
      description: "Centered around domain events and integration events. Supports event sourcing for complete audit trails.",
      structure: `Solution/
├── ProjectName.Domain/
│   ├── Entities/
│   ├── Events/
│   │   ├── DomainEvents/
│   │   └── IntegrationEvents/
│   └── Handlers/
├── ProjectName.Application/
├── ProjectName.Infrastructure/
│   ├── EventStore/
│   └── Messaging/
└── ProjectName.WebAPI/`,
      characteristics: [
        "Domain events for internal state changes",
        "Integration events for external communication",
        "Event Store for persistence (optional)",
        "Eventual consistency",
        "Complete audit trail",
      ],
    },
    "microservices": {
      description: "Decomposed services with independent deployments. Each service owns its data and communicates via APIs or messaging.",
      structure: `Solution/
├── src/
│   ├── Services/
│   │   ├── Customer.API/
│   │   ├── Order.API/
│   │   └── Notification.API/
│   ├── BuildingBlocks/
│   │   ├── EventBus/
│   │   └── Contracts/
│   └── ApiGateway/
├── docker-compose.yml
└── kubernetes/`,
      characteristics: [
        "Independent deployable services",
        "Each service has its own database",
        "API Gateway for routing",
        "Event-based communication",
        "Container-ready (Docker/Kubernetes)",
      ],
    },
  };

  return templates[template] || templates["simple-nlayers"];
}

function getAlternatives(current: string): string {
  const alternatives: Record<string, string[]> = {
    "minimal-api": ["simple-nlayers if you need more structure"],
    "simple-nlayers": ["minimal-api for simpler apps", "complex-nlayers for more structure"],
    "complex-nlayers": ["simple-nlayers for simpler apps", "clean-architecture for stricter rules", "cqrs for read/write separation"],
    "cqrs": ["complex-nlayers without CQRS", "event-driven with event sourcing"],
    "hexagonal": ["clean-architecture for similar separation", "complex-nlayers for simpler approach"],
    "clean-architecture": ["complex-nlayers for simpler approach", "ddd for richer domain"],
    "ddd": ["clean-architecture without DDD", "event-driven for event sourcing"],
    "event-driven": ["cqrs without event sourcing", "ddd with events"],
    "microservices": ["modular monolith as first step"],
  };

  const alts = alternatives[current] || [];
  return alts.length > 0
    ? `Consider these alternatives:\n${alts.map((a) => `- ${a}`).join("\n")}`
    : "This is the recommended approach for your requirements.";
}
