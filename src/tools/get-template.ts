/**
 * Get Template Tool
 * 
 * Retrieves a specific architecture template by name with optional related context.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

export const getTemplateSchema = {
  type: "object" as const,
  properties: {
    template_name: {
      type: "string",
      description: `Template name to retrieve. Available templates:
Architecture: minimal-api, simple-nlayers, complex-nlayers, cqrs, event-driven, hexagonal, clean-architecture, ddd, microservices
AI (Semantic Kernel): sk-chat-completion, sk-plugins, sk-rag, sk-planners
AI (SK Graph): skg-graph-executor, skg-react-agent, skg-chain-of-thought, skg-chatbot-memory, skg-multi-agent, skg-document-pipeline, skg-human-in-loop, skg-checkpointing, skg-streaming, skg-observability
AI (Agent Framework): agent-framework-basic, agent-framework-workflows, agent-framework-multi-agent, agent-framework-middleware`,
    },
    include_context: {
      type: "boolean",
      description: "Include related documentation context for the template (patterns, examples, best practices). Defaults to true for architecture templates.",
    },
  },
  required: ["template_name"],
};

interface GetTemplateArgs {
  template_name: string;
  include_context?: boolean;
}

/**
 * Mapping of templates to related documentation files for comprehensive context
 */
const templateContextMap: Record<string, string[]> = {
  // CQRS Template
  "cqrs": [
    "cqrs/commands.md",
    "cqrs/queries.md",
    "cqrs/behaviors.md",
    "database/use-repository.md",
    "database/use-unitofwork.md",
  ],
  
  // Event-Driven Template
  "event-driven": [
    "cqrs/domain-events.md",
    "cqrs/integration-events.md",
    "ai-context/messaging-patterns.md",
    "cqrs/resilience/inbox-outbox.md",
  ],
  
  // DDD Template
  "ddd": [
    "core/value-objects.md",
    "core/entity-interfaces.md",
    "cqrs/domain-events.md",
    "core/strongly-typed-ids.md",
    "core/guard-clauses.md",
  ],
  
  // Clean Architecture Template
  "clean-architecture": [
    "core/entity-interfaces.md",
    "cqrs/commands.md",
    "cqrs/queries.md",
    "database/use-repository.md",
  ],
  
  // Hexagonal Template
  "hexagonal": [
    "core/entity-interfaces.md",
    "core/infrastructure-abstractions.md",
    "database/use-repository.md",
    "cqrs/commands.md",
  ],
  
  // Microservices Template
  "microservices": [
    "ai-context/messaging-patterns.md",
    "cqrs/integration-events.md",
    "cqrs/resilience/circuit-breaker.md",
    "cqrs/resilience/retry.md",
    "ai-context/containerization-patterns.md",
  ],
  
  // Simple N-Layers Template
  "simple-nlayers": [
    "database/use-repository.md",
    "database/use-entity.md",
    "database/use-context.md",
  ],
  
  // Complex N-Layers Template
  "complex-nlayers": [
    "database/use-repository.md",
    "database/use-unitofwork.md",
    "database/use-service.md",
    "core/entity-interfaces.md",
  ],
  
  // Minimal API Template
  "minimal-api": [
    "database/use-repository.md",
    "database/use-entity.md",
  ],
  
  // AI Templates - Semantic Kernel
  "sk-chat-completion": [
    "ai-context/ai-decision-matrix.md",
  ],
  "sk-plugins": [
    "ai-context/ai-decision-matrix.md",
  ],
  "sk-rag": [
    "ai-context/ai-decision-matrix.md",
  ],
  "sk-planners": [
    "ai-context/ai-decision-matrix.md",
  ],
  
  // AI Templates - SK Graph
  "skg-graph-executor": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-react-agent": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-chain-of-thought": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-chatbot-memory": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-multi-agent": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-document-pipeline": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-human-in-loop": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-checkpointing": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-streaming": [
    "ai-context/ai-decision-matrix.md",
  ],
  "skg-observability": [
    "ai-context/ai-decision-matrix.md",
    "ai-context/observability-patterns.md",
  ],
  
  // AI Templates - Agent Framework
  "agent-framework-basic": [
    "ai-context/ai-decision-matrix.md",
  ],
  "agent-framework-workflows": [
    "ai-context/ai-decision-matrix.md",
  ],
  "agent-framework-multi-agent": [
    "ai-context/ai-decision-matrix.md",
  ],
  "agent-framework-middleware": [
    "ai-context/ai-decision-matrix.md",
  ],
};

/**
 * Get description for context sections
 */
function getContextDescription(templateName: string): string {
  const descriptions: Record<string, string> = {
    "cqrs": "CQRS patterns including commands, queries, behaviors, and data access patterns",
    "event-driven": "Event-driven patterns including domain events, integration events, and messaging",
    "ddd": "Domain-Driven Design patterns including value objects, entities, and domain events",
    "clean-architecture": "Clean Architecture patterns with CQRS and repository abstractions",
    "hexagonal": "Hexagonal/Ports & Adapters patterns with infrastructure abstractions",
    "microservices": "Microservices patterns including messaging, resilience, and containerization",
    "simple-nlayers": "Basic N-Layer patterns with repository and entity setup",
    "complex-nlayers": "Advanced N-Layer patterns with unit of work and service layer",
    "minimal-api": "Minimal API patterns with basic data access",
  };
  
  return descriptions[templateName] || "Related patterns and documentation";
}

/**
 * Format document title from filename
 */
function formatDocTitle(docName: string): string {
  return docName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get suggested next steps based on template type
 */
function getNextSteps(templateName: string): string {
  const steps: Record<string, string> = {
    "cqrs": `
## Suggested Next Steps

1. **Database Setup**: \`mvp24h_database_advisor({ patterns: ["repository", "unit-of-work"] })\`
2. **Add Observability**: \`mvp24h_observability_setup({ component: "overview" })\`
3. **Add Resilience**: \`mvp24h_cqrs_guide({ topic: "resilience" })\`
4. **Validation**: \`mvp24h_cqrs_guide({ topic: "validation" })\`
`,
    "event-driven": `
## Suggested Next Steps

1. **Configure Messaging**: \`mvp24h_messaging_patterns({ pattern: "rabbitmq" })\`
2. **Add Resilience**: \`mvp24h_cqrs_guide({ topic: "resilience" })\`
3. **Event Sourcing**: \`mvp24h_cqrs_guide({ topic: "event-sourcing" })\`
4. **Observability**: \`mvp24h_observability_setup({ component: "tracing" })\`
`,
    "ddd": `
## Suggested Next Steps

1. **Value Objects**: \`mvp24h_core_patterns({ topic: "value-objects" })\`
2. **Entity Design**: \`mvp24h_core_patterns({ topic: "entity-interfaces" })\`
3. **Repository Setup**: \`mvp24h_database_advisor({ patterns: ["repository"] })\`
4. **Domain Events**: \`mvp24h_cqrs_guide({ topic: "domain-events" })\`
`,
    "clean-architecture": `
## Suggested Next Steps

1. **Repository Pattern**: \`mvp24h_database_advisor({ patterns: ["repository", "unit-of-work"] })\`
2. **CQRS Integration**: \`mvp24h_cqrs_guide({ topic: "overview" })\`
3. **Validation**: \`mvp24h_reference_guide({ topic: "validation" })\`
4. **Testing**: \`mvp24h_testing_patterns({ topic: "overview" })\`
`,
    "hexagonal": `
## Suggested Next Steps

1. **Infrastructure Abstractions**: \`mvp24h_core_patterns({ topic: "infrastructure-abstractions" })\`
2. **Repository Adapters**: \`mvp24h_database_advisor({ patterns: ["repository"] })\`
3. **Testing Ports**: \`mvp24h_testing_patterns({ topic: "mocking" })\`
`,
    "microservices": `
## Suggested Next Steps

1. **Messaging Setup**: \`mvp24h_messaging_patterns({ pattern: "rabbitmq" })\`
2. **Resilience Patterns**: \`mvp24h_modernization_guide({ feature: "http-resilience" })\`
3. **Containerization**: \`mvp24h_containerization_patterns({ topic: "kubernetes" })\`
4. **Observability**: \`mvp24h_observability_setup({ component: "overview" })\`
`,
  };
  
  return steps[templateName] || "";
}

export async function getTemplate(args: unknown): Promise<string> {
  const { template_name, include_context } = args as GetTemplateArgs;
  
  // Determine if we should include context (default: true for architecture templates)
  const architectureTemplates = [
    "minimal-api", "simple-nlayers", "complex-nlayers", "cqrs", 
    "event-driven", "hexagonal", "clean-architecture", "ddd", "microservices"
  ];
  const shouldIncludeContext = include_context ?? architectureTemplates.includes(template_name);

  // Map template names to documentation files
  const templateMap: Record<string, string> = {
    // Architecture templates
    "minimal-api": "ai-context/structure-minimal-api.md",
    "simple-nlayers": "ai-context/structure-simple-nlayers.md",
    "complex-nlayers": "ai-context/structure-complex-nlayers.md",
    "cqrs": "ai-context/template-cqrs.md",
    "event-driven": "ai-context/template-event-driven.md",
    "hexagonal": "ai-context/template-hexagonal.md",
    "clean-architecture": "ai-context/template-clean-architecture.md",
    "ddd": "ai-context/template-ddd.md",
    "microservices": "ai-context/template-microservices.md",

    // Semantic Kernel templates
    "sk-chat-completion": "ai-context/template-sk-chat-completion.md",
    "sk-plugins": "ai-context/template-sk-plugins.md",
    "sk-rag": "ai-context/template-sk-rag-basic.md",
    "sk-planners": "ai-context/template-sk-planners.md",

    // Semantic Kernel Graph templates
    "skg-graph-executor": "ai-context/template-skg-graph-executor.md",
    "skg-react-agent": "ai-context/template-skg-react-agent.md",
    "skg-chain-of-thought": "ai-context/template-skg-chain-of-thought.md",
    "skg-chatbot-memory": "ai-context/template-skg-chatbot-memory.md",
    "skg-multi-agent": "ai-context/template-skg-multi-agent.md",
    "skg-document-pipeline": "ai-context/template-skg-document-pipeline.md",
    "skg-human-in-loop": "ai-context/template-skg-human-in-loop.md",
    "skg-checkpointing": "ai-context/template-skg-checkpointing.md",
    "skg-streaming": "ai-context/template-skg-streaming.md",
    "skg-observability": "ai-context/template-skg-observability.md",

    // Agent Framework templates
    "agent-framework-basic": "ai-context/template-agent-framework-basic.md",
    "agent-framework-workflows": "ai-context/template-agent-framework-workflows.md",
    "agent-framework-multi-agent": "ai-context/template-agent-framework-multi-agent.md",
    "agent-framework-middleware": "ai-context/template-agent-framework-middleware.md",
  };

  const docPath = templateMap[template_name];

  if (!docPath) {
    return `# Template Not Found

Template "${template_name}" not found.

## Available Templates

### Architecture Templates
| Name | Description |
|------|-------------|
| \`minimal-api\` | Single project, lightweight microservices |
| \`simple-nlayers\` | 3-layer architecture (Core, Infrastructure, WebAPI) |
| \`complex-nlayers\` | 4-layer with Application layer |
| \`cqrs\` | Command Query Responsibility Segregation |
| \`event-driven\` | Event sourcing and domain events |
| \`hexagonal\` | Ports & Adapters pattern |
| \`clean-architecture\` | Uncle Bob's Clean Architecture |
| \`ddd\` | Domain-Driven Design |
| \`microservices\` | Distributed services |

### AI Templates - Semantic Kernel
| Name | Description |
|------|-------------|
| \`sk-chat-completion\` | Basic chat/completion |
| \`sk-plugins\` | Tool integration |
| \`sk-rag\` | Retrieval Augmented Generation |
| \`sk-planners\` | Task decomposition |

### AI Templates - Semantic Kernel Graph
| Name | Description |
|------|-------------|
| \`skg-graph-executor\` | Workflow orchestration |
| \`skg-react-agent\` | ReAct pattern |
| \`skg-chain-of-thought\` | Step-by-step reasoning |
| \`skg-chatbot-memory\` | Contextual conversations |
| \`skg-multi-agent\` | Agent coordination |
| \`skg-document-pipeline\` | Document processing |
| \`skg-human-in-loop\` | Approval workflows |
| \`skg-checkpointing\` | State persistence |
| \`skg-streaming\` | Real-time events |
| \`skg-observability\` | Metrics and monitoring |

### AI Templates - Agent Framework
| Name | Description |
|------|-------------|
| \`agent-framework-basic\` | Simple agent setup |
| \`agent-framework-workflows\` | Workflow-based agents |
| \`agent-framework-multi-agent\` | Agent orchestration |
| \`agent-framework-middleware\` | Request/response processing |

## Usage Example

\`\`\`
mvp24h_get_template({ template_name: "clean-architecture" })
\`\`\`
`;
  }

  // Try to load the document
  try {
    if (docExists(docPath)) {
      const content = loadDoc(docPath);
      
      // Build output with optional context
      let output = `# Template: ${formatTemplateName(template_name)}

${content}
`;

      // Add related context if requested
      if (shouldIncludeContext && templateContextMap[template_name]) {
        const contextDocs = templateContextMap[template_name];
        const contextDescription = getContextDescription(template_name);
        
        output += `
---

## Related Context: ${contextDescription}

`;
        // Load each context document
        for (const contextDoc of contextDocs) {
          if (docExists(contextDoc)) {
            try {
              const contextContent = loadDoc(contextDoc);
              const docTitle = contextDoc.split('/').pop()?.replace('.md', '') || contextDoc;
              output += `### ${formatDocTitle(docTitle)}

${contextContent}

---

`;
            } catch {
              // Skip if document can't be loaded
            }
          }
        }
      }
      
      // Add related tools section
      output += `
## Related Tools

- \`mvp24h_architecture_advisor\`: Get architecture recommendations
- \`mvp24h_database_advisor\`: Configure database layer
- \`mvp24h_observability_setup\`: Add telemetry
- \`mvp24h_build_context\`: Build complete context with multiple resources
`;

      // Add next steps based on template type
      output += getNextSteps(template_name);
      
      return output;
    }
  } catch {
    // Fall through to inline template
  }

  // If document doesn't exist, return inline template
  return getInlineTemplate(template_name);
}

function formatTemplateName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInlineTemplate(templateName: string): string {
  // Provide inline templates for common cases
  const templates: Record<string, string> = {
    "minimal-api": `# Minimal API Template

## Project Structure

\`\`\`
ProjectName/
├── ProjectName.csproj
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
├── Entities/
│   └── Customer.cs
├── ValueObjects/
│   └── CustomerDto.cs
├── Validators/
│   └── CustomerValidator.cs
├── Data/
│   ├── DataContext.cs
│   └── CustomerConfiguration.cs
└── Endpoints/
    └── CustomerEndpoints.cs
\`\`\`

## Program.cs

\`\`\`csharp
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Mvp24Hours.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Mvp24Hours
builder.Services.AddMvp24HoursDbContext<DataContext>();
builder.Services.AddMvp24HoursRepository(options => options.MaxQtyByQueryPage = 100);

// Validation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Map endpoints
app.MapCustomerEndpoints();

app.Run();
\`\`\`

## Entity

\`\`\`csharp
using Mvp24Hours.Core.Entities;

public class Customer : EntityBase<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool Active { get; set; } = true;
}
\`\`\`

## Endpoints

\`\`\`csharp
using FluentValidation;
using Mvp24Hours.Core.Contract.Data;
using Mvp24Hours.Extensions;

public static class CustomerEndpoints
{
    public static void MapCustomerEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/customers").WithTags("Customers");

        group.MapGet("/", async (IUnitOfWorkAsync uow, int page = 1, int limit = 10) =>
        {
            var repo = uow.GetRepository<Customer>();
            var result = await repo.ToBusinessPagingAsync(page, limit);
            return Results.Ok(result);
        });

        group.MapGet("/{id:guid}", async (Guid id, IUnitOfWorkAsync uow) =>
        {
            var repo = uow.GetRepository<Customer>();
            var customer = await repo.GetByIdAsync(id);
            return customer is not null ? Results.Ok(customer) : Results.NotFound();
        });

        group.MapPost("/", async (
            CustomerDto dto,
            IValidator<CustomerDto> validator,
            IUnitOfWorkAsync uow) =>
        {
            var validation = await validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors);

            var repo = uow.GetRepository<Customer>();
            var customer = new Customer
            {
                Name = dto.Name,
                Email = dto.Email,
                Active = dto.Active
            };

            await repo.AddAsync(customer);
            await uow.SaveChangesAsync();

            return Results.Created($"/api/customers/{customer.Id}", customer);
        });

        group.MapPut("/{id:guid}", async (
            Guid id,
            CustomerDto dto,
            IValidator<CustomerDto> validator,
            IUnitOfWorkAsync uow) =>
        {
            var validation = await validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors);

            var repo = uow.GetRepository<Customer>();
            var customer = await repo.GetByIdAsync(id);
            if (customer is null)
                return Results.NotFound();

            customer.Name = dto.Name;
            customer.Email = dto.Email;
            customer.Active = dto.Active;

            await repo.ModifyAsync(customer);
            await uow.SaveChangesAsync();

            return Results.NoContent();
        });

        group.MapDelete("/{id:guid}", async (Guid id, IUnitOfWorkAsync uow) =>
        {
            var repo = uow.GetRepository<Customer>();
            var customer = await repo.GetByIdAsync(id);
            if (customer is null)
                return Results.NotFound();

            await repo.RemoveAsync(customer);
            await uow.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
\`\`\`

## NuGet Packages

\`\`\`xml
<ItemGroup>
  <PackageReference Include="Mvp24Hours.Core" Version="9.*" />
  <PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.*" />
  <PackageReference Include="FluentValidation" Version="11.*" />
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.*" />
</ItemGroup>
\`\`\`
`,

    "clean-architecture": `# Clean Architecture Template

## Project Structure

\`\`\`
Solution/
├── src/
│   ├── ProjectName.Domain/           # Enterprise Business Rules
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Enums/
│   │   ├── Events/
│   │   ├── Exceptions/
│   │   └── Interfaces/
│   ├── ProjectName.Application/       # Application Business Rules
│   │   ├── Common/
│   │   │   ├── Behaviors/
│   │   │   ├── Interfaces/
│   │   │   └── Mappings/
│   │   ├── UseCases/
│   │   │   └── Customers/
│   │   │       ├── Commands/
│   │   │       │   └── CreateCustomer/
│   │   │       └── Queries/
│   │   │           └── GetCustomer/
│   │   └── DTOs/
│   ├── ProjectName.Infrastructure/    # Frameworks & Drivers
│   │   ├── Persistence/
│   │   │   ├── Configurations/
│   │   │   ├── Repositories/
│   │   │   └── AppDbContext.cs
│   │   ├── Services/
│   │   └── DependencyInjection.cs
│   └── ProjectName.WebAPI/            # Interface Adapters
│       ├── Controllers/
│       ├── Filters/
│       ├── Middleware/
│       └── Program.cs
└── tests/
    ├── ProjectName.Domain.Tests/
    ├── ProjectName.Application.Tests/
    └── ProjectName.Integration.Tests/
\`\`\`

## Domain Layer

\`\`\`csharp
// Domain/Entities/Customer.cs
using Mvp24Hours.Core.Entities;

namespace ProjectName.Domain.Entities;

public class Customer : EntityBase<Guid>, IAggregateRoot
{
    private Customer() { } // EF

    public string Name { get; private set; } = string.Empty;
    public Email Email { get; private set; } = null!;
    public bool Active { get; private set; }

    public static Customer Create(string name, string email)
    {
        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            Name = name,
            Email = Email.Create(email),
            Active = true
        };

        customer.AddDomainEvent(new CustomerCreatedEvent(customer.Id, name));
        return customer;
    }

    public void UpdateEmail(string newEmail)
    {
        var oldEmail = Email.Value;
        Email = Email.Create(newEmail);
        AddDomainEvent(new CustomerEmailChangedEvent(Id, oldEmail, newEmail));
    }
}

// Domain/ValueObjects/Email.cs
public record Email
{
    public string Value { get; }

    private Email(string value) => Value = value;

    public static Email Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("Email cannot be empty");

        if (!value.Contains('@'))
            throw new DomainException("Invalid email format");

        return new Email(value.ToLowerInvariant());
    }
}

// Domain/Interfaces/ICustomerRepository.cs
public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IEnumerable<Customer>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Customer customer, CancellationToken cancellationToken = default);
    void Update(Customer customer);
    void Remove(Customer customer);
}
\`\`\`

## Application Layer

\`\`\`csharp
// Application/UseCases/Customers/Commands/CreateCustomer/CreateCustomerCommand.cs
public record CreateCustomerCommand(string Name, string Email) : ICommand<Result<CustomerDto>>;

// Application/UseCases/Customers/Commands/CreateCustomer/CreateCustomerCommandHandler.cs
public class CreateCustomerCommandHandler : ICommandHandler<CreateCustomerCommand, Result<CustomerDto>>
{
    private readonly ICustomerRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateCustomerCommandHandler(
        ICustomerRepository repository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CustomerDto>> HandleAsync(
        CreateCustomerCommand command,
        CancellationToken cancellationToken)
    {
        // Check for duplicate
        var existing = await _repository.GetByEmailAsync(command.Email, cancellationToken);
        if (existing is not null)
        {
            return Result<CustomerDto>.Failure("Email already exists");
        }

        // Create customer (domain logic)
        var customer = Customer.Create(command.Name, command.Email);

        // Persist
        await _repository.AddAsync(customer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<CustomerDto>.Success(_mapper.Map<CustomerDto>(customer));
    }
}

// Application/UseCases/Customers/Commands/CreateCustomer/CreateCustomerCommandValidator.cs
public class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress();
    }
}
\`\`\`

## Infrastructure Layer

\`\`\`csharp
// Infrastructure/Persistence/AppDbContext.cs
public class AppDbContext : DbContext, IUnitOfWork
{
    private readonly IDomainEventDispatcher _dispatcher;

    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        IDomainEventDispatcher dispatcher) : base(options)
    {
        _dispatcher = dispatcher;
    }

    public DbSet<Customer> Customers { get; set; }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entities = ChangeTracker.Entries<IAggregateRoot>()
            .Where(e => e.Entity.DomainEvents.Any())
            .ToList();

        var domainEvents = entities
            .SelectMany(e => e.Entity.DomainEvents)
            .ToList();

        var result = await base.SaveChangesAsync(cancellationToken);

        await _dispatcher.DispatchAsync(domainEvents, cancellationToken);

        entities.ForEach(e => e.Entity.ClearDomainEvents());

        return result;
    }
}

// Infrastructure/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<ICustomerRepository, CustomerRepository>();

        return services;
    }
}
\`\`\`

## WebAPI Layer

\`\`\`csharp
// WebAPI/Controllers/CustomersController.cs
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create(CreateCustomerCommand command)
    {
        var result = await _mediator.SendAsync(command);
        
        if (!result.IsSuccess)
            return BadRequest(result.Error);
            
        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.SendAsync(new GetCustomerQuery(id));
        
        if (!result.IsSuccess)
            return NotFound();
            
        return Ok(result.Value);
    }
}
\`\`\`

## Dependency Rule

\`\`\`
WebAPI → Application → Domain
   ↓          ↓
Infrastructure (implements interfaces from Domain/Application)
\`\`\`

**Key Principle**: Dependencies always point inward. Domain has no dependencies. Application depends only on Domain. Infrastructure implements interfaces defined in inner layers.
`,
  };

  return templates[templateName] || `Template "${templateName}" documentation not available. Use mvp24h_architecture_advisor to get recommendations.`;
}
