/**
 * Architecture Advisor Tool
 * 
 * Recommends the best architecture template based on project requirements.
 * Acts as an intelligent router to the appropriate documentation.
 */

import { loadDoc, loadDocSection, docExists } from "../utils/doc-loader.js";

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

  const templateInfo = getTemplateInfo(recommendedTemplate);

  return `# Architecture Recommendation

## Recommended Template: **${templateInfo.name}**

### Why This Template?
${reasoning.map((r) => `- ${r}`).join("\n")}

### Template Overview
${templateInfo.description}

### Project Structure
\`\`\`
${templateInfo.structure}
\`\`\`

### Key Characteristics
${templateInfo.characteristics.map((c) => `- ${c}`).join("\n")}

### Required Packages
\`\`\`xml
${templateInfo.packages}
\`\`\`

---

## Decision Matrix

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
| Microservices | Very High | Service-based | Independent deploy | Large |

---

## Alternative Options

${getAlternatives(recommendedTemplate)}

---

## Next Steps

1. **Get the template code**: \`mvp24h_get_template({ template_name: "${recommendedTemplate}" })\`
2. **Configure database**: \`mvp24h_database_advisor({ ... })\`
3. **Add observability**: \`mvp24h_observability_setup({ ... })\`

${requirements.includes("cqrs") || recommendedTemplate === "cqrs" ? `
4. **CQRS patterns**: \`mvp24h_cqrs_guide({ topic: "commands" })\`
` : ""}
`;
}

function getTemplateInfo(template: string) {
  const templates: Record<string, {
    name: string;
    description: string;
    structure: string;
    characteristics: string[];
    packages: string;
  }> = {
    "minimal-api": {
      name: "Minimal API",
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
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="FluentValidation" Version="11.*" />`,
    },
    "simple-nlayers": {
      name: "Simple N-Layers",
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
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="Mvp24Hours.WebAPI" Version="9.*" />
<PackageReference Include="FluentValidation" Version="11.*" />
<PackageReference Include="AutoMapper" Version="12.*" />`,
    },
    "complex-nlayers": {
      name: "Complex N-Layers",
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
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Application" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Pipe" Version="9.*" />
<PackageReference Include="Mvp24Hours.WebAPI" Version="9.*" />
<PackageReference Include="FluentValidation" Version="11.*" />
<PackageReference Include="AutoMapper" Version="12.*" />`,
    },
    "cqrs": {
      name: "CQRS (Command Query Responsibility Segregation)",
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
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Application" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="FluentValidation" Version="11.*" />`,
    },
    "hexagonal": {
      name: "Hexagonal (Ports & Adapters)",
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
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="Mvp24Hours.WebAPI" Version="9.*" />`,
    },
    "clean-architecture": {
      name: "Clean Architecture",
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
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Application" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="Mvp24Hours.WebAPI" Version="9.*" />`,
    },
    "ddd": {
      name: "Domain-Driven Design (DDD)",
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
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Application" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />`,
    },
    "event-driven": {
      name: "Event-Driven Architecture",
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
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.RabbitMQ" Version="9.*" />
<PackageReference Include="RabbitMQ.Client" Version="6.*" />`,
    },
    "microservices": {
      name: "Microservices Architecture",
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
      packages: `<!-- Per service -->
<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.WebAPI" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.RabbitMQ" Version="9.*" />`,
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
