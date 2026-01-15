/**
 * CQRS Guide Tool
 * 
 * Provides CQRS/Mediator pattern implementation guidance.
 * Loads documentation from actual markdown files.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

export const cqrsGuideSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
        "getting-started",
        "commands",
        "queries",
        "notifications",
        "domain-events",
        "integration-events",
        "behaviors",
        "validation",
        "saga",
        "event-sourcing",
        "resilience",
        "multi-tenancy",
        "scheduled-commands",
        "extensibility",
        "best-practices",
        "api-reference",
        "migration-mediatr",
        "integration-repository",
        "integration-unitofwork",
        "integration-caching",
        "specifications",
        "complete-example"
      ],
      description: "CQRS topic to get documentation for",
    },
  },
  required: ["topic"],
};

interface CqrsGuideArgs {
  topic: string;
}

// Mapping of topics to documentation files
const topicToFiles: Record<string, string[]> = {
  "overview": ["cqrs/home.md"],
  "getting-started": ["cqrs/getting-started.md"],
  "commands": ["cqrs/commands.md"],
  "queries": ["cqrs/queries.md"],
  "notifications": ["cqrs/notifications.md"],
  "domain-events": ["cqrs/domain-events.md"],
  "integration-events": ["cqrs/integration-events.md"],
  "behaviors": ["cqrs/behaviors.md"],
  "validation": ["cqrs/validation-behavior.md"],
  "saga": ["cqrs/saga/home.md", "cqrs/saga/implementation.md", "cqrs/saga/compensation.md"],
  "event-sourcing": ["cqrs/event-sourcing/home.md", "cqrs/event-sourcing/aggregate.md", "cqrs/event-sourcing/event-store.md", "cqrs/event-sourcing/projections.md"],
  "resilience": ["cqrs/resilience/retry.md", "cqrs/resilience/circuit-breaker.md", "cqrs/resilience/idempotency.md", "cqrs/resilience/inbox-outbox.md"],
  "multi-tenancy": ["cqrs/multi-tenancy.md"],
  "scheduled-commands": ["cqrs/scheduled-commands.md"],
  "extensibility": ["cqrs/extensibility.md"],
  "best-practices": ["cqrs/best-practices.md"],
  "api-reference": ["cqrs/api-reference.md"],
  "migration-mediatr": ["cqrs/migration-mediatr.md"],
  "integration-repository": ["cqrs/integration-repository.md", "database/use-repository.md"],
  "integration-unitofwork": ["cqrs/integration-unitofwork.md", "database/use-unitofwork.md"],
  "integration-caching": ["cqrs/integration-caching.md"],
  "specifications": ["cqrs/specifications.md"],
  "complete-example": [
    "cqrs/home.md",
    "cqrs/commands.md",
    "cqrs/queries.md",
    "cqrs/integration-repository.md",
    "cqrs/behaviors.md"
  ]
};

// Related topics for each main topic
const relatedTopics: Record<string, string[]> = {
  "commands": ["validation", "behaviors", "integration-repository"],
  "queries": ["specifications", "integration-caching", "integration-repository"],
  "notifications": ["domain-events", "integration-events"],
  "domain-events": ["event-sourcing", "notifications"],
  "behaviors": ["validation", "resilience", "integration-caching"],
  "validation": ["behaviors", "commands"],
  "saga": ["resilience", "commands"],
  "event-sourcing": ["domain-events", "saga"],
  "resilience": ["behaviors", "saga"],
  "overview": ["getting-started", "commands", "queries"]
};

export async function cqrsGuide(args: unknown): Promise<string> {
  const { topic } = args as CqrsGuideArgs;

  const files = topicToFiles[topic];
  
  if (!files || files.length === 0) {
    return getAvailableTopicsMessage(topic);
  }

  // Load all files for this topic
  const content = loadDocs(files.filter(f => docExists(f)));
  
  // Get related topics
  const related = relatedTopics[topic] || [];
  const relatedSection = related.length > 0 
    ? `\n\n---\n\n## Related Topics\n\nTo learn more about related patterns, use these commands:\n${related.map(t => `- \`mvp24h_cqrs_guide({ topic: "${t}" })\` - ${getTopicDescription(t)}`).join('\n')}`
    : '';

  // Add quick reference for key interfaces
  const quickRef = getQuickReference(topic);

  return `${content}${quickRef}${relatedSection}\n\n---\n\n## Other Tools\n\n- \`mvp24h_database_advisor\` - Database configuration with Repository and UoW\n- \`mvp24h_get_template({ template_name: "cqrs" })\` - Get complete CQRS template\n- \`mvp24h_observability_setup\` - Add logging and tracing\n- \`mvp24h_reference_guide({ topic: "validation" })\` - FluentValidation patterns`;
}

function getTopicDescription(topic: string): string {
  const descriptions: Record<string, string> = {
    "overview": "CQRS/Mediator architecture overview",
    "getting-started": "Initial setup and configuration",
    "commands": "Creating commands and handlers (IMediatorCommand)",
    "queries": "Creating queries and handlers (IMediatorQuery)",
    "notifications": "In-process notifications (IMediatorNotification)",
    "domain-events": "Domain events for aggregate state changes",
    "integration-events": "Cross-service events (RabbitMQ)",
    "behaviors": "Pipeline behaviors (validation, logging, etc)",
    "validation": "FluentValidation integration",
    "saga": "Saga pattern for distributed transactions",
    "event-sourcing": "Event sourcing implementation",
    "resilience": "Retry, circuit breaker, idempotency",
    "multi-tenancy": "Multi-tenant CQRS implementation",
    "scheduled-commands": "Background command execution",
    "extensibility": "Extending the mediator",
    "best-practices": "CQRS best practices and patterns",
    "api-reference": "Complete API reference",
    "migration-mediatr": "Migrating from MediatR",
    "integration-repository": "Using Repository with CQRS",
    "integration-unitofwork": "Using Unit of Work with CQRS",
    "integration-caching": "Caching queries results",
    "specifications": "Specification pattern for queries",
    "complete-example": "Full CQRS implementation example"
  };
  return descriptions[topic] || topic;
}

function getQuickReference(topic: string): string {
  const quickRefs: Record<string, string> = {
    "commands": `

---

## Quick Reference: Command Interfaces

| Interface | Purpose | Namespace |
|-----------|---------|-----------|
| \`IMediatorCommand<TResponse>\` | Command with return value | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` |
| \`IMediatorCommand\` | Command without return (void) | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` |
| \`IMediatorCommandHandler<TCommand, TResponse>\` | Command handler | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` |

### Minimal Command Example

\`\`\`csharp
// Command
public record CreateCustomerCommand(string Name, string Email) 
    : IMediatorCommand<CustomerDto>;

// Handler
public class CreateCustomerCommandHandler 
    : IMediatorCommandHandler<CreateCustomerCommand, CustomerDto>
{
    private readonly IRepositoryAsync<Customer> _repository;
    private readonly IUnitOfWorkAsync _unitOfWork;

    public CreateCustomerCommandHandler(
        IRepositoryAsync<Customer> repository,
        IUnitOfWorkAsync unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<CustomerDto> Handle(
        CreateCustomerCommand request, 
        CancellationToken cancellationToken)
    {
        var customer = new Customer
        {
            Name = request.Name,
            Email = request.Email
        };

        await _repository.AddAsync(customer);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return CustomerDto.FromEntity(customer);
    }
}
\`\`\``,

    "queries": `

---

## Quick Reference: Query Interfaces

| Interface | Purpose | Namespace |
|-----------|---------|-----------|
| \`IMediatorQuery<TResponse>\` | Query with return value | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` |
| \`IMediatorQueryHandler<TQuery, TResponse>\` | Query handler | \`Mvp24Hours.Infrastructure.Cqrs.Abstractions\` |

### Minimal Query Example

\`\`\`csharp
// Query
public record GetCustomerByIdQuery(int Id) : IMediatorQuery<CustomerDto?>;

// Handler
public class GetCustomerByIdQueryHandler 
    : IMediatorQueryHandler<GetCustomerByIdQuery, CustomerDto?>
{
    private readonly IRepositoryAsync<Customer> _repository;

    public GetCustomerByIdQueryHandler(IRepositoryAsync<Customer> repository)
    {
        _repository = repository;
    }

    public async Task<CustomerDto?> Handle(
        GetCustomerByIdQuery request, 
        CancellationToken cancellationToken)
    {
        var customer = await _repository.GetByIdAsync(request.Id);
        return customer is null ? null : CustomerDto.FromEntity(customer);
    }
}
\`\`\``,

    "integration-repository": `

---

## Quick Reference: Repository Interfaces

| Interface | Purpose | Namespace |
|-----------|---------|-----------|
| \`IRepository<TEntity>\` | Sync repository | \`Mvp24Hours.Core.Contract.Data\` |
| \`IRepositoryAsync<TEntity>\` | Async repository | \`Mvp24Hours.Core.Contract.Data\` |
| \`IUnitOfWork\` | Sync unit of work | \`Mvp24Hours.Core.Contract.Data\` |
| \`IUnitOfWorkAsync\` | Async unit of work | \`Mvp24Hours.Core.Contract.Data\` |

### Getting Repository from UnitOfWork

\`\`\`csharp
// Inject IUnitOfWorkAsync
public class MyHandler
{
    private readonly IUnitOfWorkAsync _unitOfWork;

    public MyHandler(IUnitOfWorkAsync unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task Handle()
    {
        // Get repository for entity
        var customerRepo = _unitOfWork.GetRepository<Customer>();
        
        // Use repository methods
        var customers = await customerRepo.ListAsync();
        var byId = await customerRepo.GetByIdAsync(1);
        var filtered = await customerRepo.GetByAsync(x => x.Active);
        
        // Save changes
        await _unitOfWork.SaveChangesAsync();
    }
}
\`\`\`

### Key Repository Methods

\`\`\`csharp
// Query methods
ListAsync()                           // Get all entities
GetByIdAsync(object id)               // Get by primary key
GetByAsync(Expression<Func<T, bool>>) // Filter with lambda
GetByAnyAsync(Expression<...>)        // Check if exists
GetByCountAsync(Expression<...>)      // Count with filter

// Command methods
AddAsync(TEntity entity)              // Insert new entity
ModifyAsync(TEntity entity)           // Update entity
RemoveAsync(TEntity entity)           // Delete entity
RemoveByIdAsync(object id)            // Delete by ID
\`\`\``
  };

  return quickRefs[topic] || '';
}

function getAvailableTopicsMessage(invalidTopic: string): string {
  const availableTopics = Object.keys(topicToFiles);
  return `Topic "${invalidTopic}" not found.

## Available CQRS Topics

### Core Concepts
- \`overview\` - CQRS/Mediator architecture overview
- \`getting-started\` - Initial setup and configuration
- \`commands\` - Creating commands and handlers
- \`queries\` - Creating queries and handlers
- \`notifications\` - In-process notifications

### Events
- \`domain-events\` - Domain events for state changes
- \`integration-events\` - Cross-service events (RabbitMQ)

### Pipeline
- \`behaviors\` - Pipeline behaviors (validation, logging)
- \`validation\` - FluentValidation integration

### Advanced
- \`saga\` - Saga pattern for distributed transactions
- \`event-sourcing\` - Event sourcing implementation
- \`resilience\` - Retry, circuit breaker, idempotency
- \`multi-tenancy\` - Multi-tenant implementation
- \`scheduled-commands\` - Background command execution

### Integration
- \`integration-repository\` - Using Repository with CQRS
- \`integration-unitofwork\` - Using Unit of Work
- \`integration-caching\` - Caching query results
- \`specifications\` - Specification pattern

### Reference
- \`best-practices\` - CQRS best practices
- \`api-reference\` - Complete API reference
- \`migration-mediatr\` - Migrating from MediatR
- \`complete-example\` - Full implementation example

## Usage

\`\`\`
mvp24h_cqrs_guide({ topic: "commands" })
mvp24h_cqrs_guide({ topic: "integration-repository" })
mvp24h_cqrs_guide({ topic: "complete-example" })
\`\`\``;
}
