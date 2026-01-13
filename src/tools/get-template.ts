/**
 * Get Template Tool
 * 
 * Retrieves a specific architecture template by name.
 */

import { loadDoc, docExists } from "../utils/doc-loader.js";

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
  },
  required: ["template_name"],
};

interface GetTemplateArgs {
  template_name: string;
}

export async function getTemplate(args: unknown): Promise<string> {
  const { template_name } = args as GetTemplateArgs;

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
      return `# Template: ${formatTemplateName(template_name)}

${content}

---

## Related Tools

- \`mvp24h_architecture_advisor\`: Get architecture recommendations
- \`mvp24h_database_advisor\`: Configure database layer
- \`mvp24h_observability_setup\`: Add telemetry
`;
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
