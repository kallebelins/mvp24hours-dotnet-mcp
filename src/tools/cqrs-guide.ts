/**
 * CQRS Guide Tool
 * 
 * Provides CQRS/Mediator pattern implementation guidance.
 */

export const cqrsGuideSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
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
      ],
      description: "CQRS topic to get documentation for",
    },
  },
  required: ["topic"],
};

interface CqrsGuideArgs {
  topic: string;
}

export async function cqrsGuide(args: unknown): Promise<string> {
  const { topic } = args as CqrsGuideArgs;

  const docs = getCqrsDocs(topic);
  return docs;
}

function getCqrsDocs(topic: string): string {
  const topics: Record<string, string> = {
    overview: `# CQRS/Mediator Overview

## What is CQRS?

Command Query Responsibility Segregation (CQRS) separates read and write operations into different models:

- **Commands**: Change state (Create, Update, Delete)
- **Queries**: Read state (no side effects)

## Mvp24Hours Mediator

Mvp24Hours provides a built-in mediator implementation that doesn't require MediatR.

### Key Components

| Component | Purpose |
|-----------|---------|
| \`ICommand<TResponse>\` | Commands that return a response |
| \`IQuery<TResponse>\` | Queries that return data |
| \`INotification\` | Fire-and-forget notifications |
| \`ICommandHandler<TCommand, TResponse>\` | Handles commands |
| \`IQueryHandler<TQuery, TResponse>\` | Handles queries |
| \`INotificationHandler<TNotification>\` | Handles notifications |
| \`IPipelineBehavior<TRequest, TResponse>\` | Cross-cutting concerns |

### Quick Setup

\`\`\`csharp
// Program.cs
using Mvp24Hours.Extensions;

builder.Services.AddMvp24HoursMediator(typeof(Program).Assembly);
\`\`\`

### Usage

\`\`\`csharp
public class MyController : ControllerBase
{
    private readonly IMediator _mediator;

    public MyController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create(CreateCustomerCommand command)
    {
        var result = await _mediator.SendAsync(command);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.SendAsync(new GetCustomersQuery());
        return Ok(result);
    }
}
\`\`\`

## When to Use CQRS

✅ **Use when:**
- Different read/write models are beneficial
- Complex business logic in write operations
- Need for event-driven architecture
- Audit requirements
- Team separation (read team / write team)

❌ **Avoid when:**
- Simple CRUD operations
- Small applications
- Team unfamiliar with the pattern
`,

    commands: `# CQRS Commands

## Command Definition

Commands represent intentions to change state. They should be named with verbs.

### Basic Command

\`\`\`csharp
using Mvp24Hours.Core.Contract.ValueObjects.Logic;

// Command with response
public record CreateCustomerCommand(
    string Name,
    string Email
) : ICommand<IBusinessResult<CustomerDto>>;

// Command without response (returns Unit)
public record DeleteCustomerCommand(
    Guid Id
) : ICommand<Unit>;
\`\`\`

### Command Handler

\`\`\`csharp
using Mvp24Hours.Core.Contract.Data;
using Mvp24Hours.Core.Contract.ValueObjects.Logic;

public class CreateCustomerCommandHandler 
    : ICommandHandler<CreateCustomerCommand, IBusinessResult<CustomerDto>>
{
    private readonly IUnitOfWorkAsync _uow;
    private readonly IMapper _mapper;

    public CreateCustomerCommandHandler(IUnitOfWorkAsync uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<IBusinessResult<CustomerDto>> HandleAsync(
        CreateCustomerCommand command, 
        CancellationToken cancellationToken = default)
    {
        var repository = _uow.GetRepository<Customer>();

        // Check for duplicate email
        var existing = await repository.GetByAsync(x => x.Email == command.Email);
        if (existing.Any())
        {
            return BusinessResult<CustomerDto>.Failure("Email already exists");
        }

        // Create entity
        var customer = new Customer
        {
            Name = command.Name,
            Email = command.Email,
            Active = true
        };

        await repository.AddAsync(customer);
        await _uow.SaveChangesAsync();

        return BusinessResult<CustomerDto>.Success(_mapper.Map<CustomerDto>(customer));
    }
}
\`\`\`

### Command with Validation

\`\`\`csharp
using FluentValidation;

public class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");
    }
}
\`\`\`

### Registration

\`\`\`csharp
// Program.cs - All handlers are registered automatically
builder.Services.AddMvp24HoursMediator(typeof(Program).Assembly);

// Or register manually
builder.Services.AddScoped<
    ICommandHandler<CreateCustomerCommand, IBusinessResult<CustomerDto>>,
    CreateCustomerCommandHandler>();
\`\`\`
`,

    queries: `# CQRS Queries

## Query Definition

Queries request data without changing state. They should be named descriptively.

### Basic Query

\`\`\`csharp
using Mvp24Hours.Core.Contract.ValueObjects.Logic;

// Query with filter
public record GetCustomersQuery(
    string? NameFilter = null,
    bool? Active = null,
    int Page = 1,
    int Limit = 10
) : IQuery<IPagingResult<CustomerDto>>;

// Query by ID
public record GetCustomerByIdQuery(
    Guid Id
) : IQuery<IBusinessResult<CustomerDto>>;
\`\`\`

### Query Handler

\`\`\`csharp
using Mvp24Hours.Core.Contract.Data;
using Mvp24Hours.Extensions;

public class GetCustomersQueryHandler 
    : IQueryHandler<GetCustomersQuery, IPagingResult<CustomerDto>>
{
    private readonly IUnitOfWorkAsync _uow;
    private readonly IMapper _mapper;

    public GetCustomersQueryHandler(IUnitOfWorkAsync uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<IPagingResult<CustomerDto>> HandleAsync(
        GetCustomersQuery query, 
        CancellationToken cancellationToken = default)
    {
        var repository = _uow.GetRepository<Customer>();

        // Build filter expression
        Expression<Func<Customer, bool>> filter = x =>
            (string.IsNullOrEmpty(query.NameFilter) || x.Name.Contains(query.NameFilter)) &&
            (!query.Active.HasValue || x.Active == query.Active.Value);

        var result = await repository.ToBusinessPagingAsync(
            filter,
            query.Page,
            query.Limit
        );

        return result.MapPagingTo<Customer, CustomerDto>(_mapper);
    }
}
\`\`\`

### Optimized Query with Dapper

\`\`\`csharp
using Dapper;
using Microsoft.EntityFrameworkCore;

public class GetCustomerSummaryQueryHandler 
    : IQueryHandler<GetCustomerSummaryQuery, IEnumerable<CustomerSummaryDto>>
{
    private readonly MyDbContext _context;

    public GetCustomerSummaryQueryHandler(MyDbContext context) => _context = context;

    public async Task<IEnumerable<CustomerSummaryDto>> HandleAsync(
        GetCustomerSummaryQuery query, 
        CancellationToken cancellationToken = default)
    {
        var connection = _context.Database.GetDbConnection();

        return await connection.QueryAsync<CustomerSummaryDto>(@"
            SELECT 
                c.Id, 
                c.Name, 
                COUNT(o.Id) as OrderCount,
                COALESCE(SUM(o.Total), 0) as TotalSpent
            FROM Customers c
            LEFT JOIN Orders o ON o.CustomerId = c.Id
            WHERE c.Active = 1
            GROUP BY c.Id, c.Name
            ORDER BY TotalSpent DESC
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY",
            new { Offset = (query.Page - 1) * query.Limit, query.Limit }
        );
    }
}
\`\`\`

### Read Model (Separate from Write Model)

\`\`\`csharp
// Write model (rich domain entity)
public class Customer : EntityBase<Guid>
{
    public string Name { get; private set; }
    public string Email { get; private set; }
    public Address Address { get; private set; }
    public List<Order> Orders { get; private set; }

    public void UpdateEmail(string email)
    {
        // Business logic here
        Email = email;
    }
}

// Read model (flat DTO for queries)
public record CustomerListDto(
    Guid Id,
    string Name,
    string Email,
    string City,
    int OrderCount,
    decimal TotalSpent
);

// Query returns read model directly
public record GetCustomerListQuery() : IQuery<IEnumerable<CustomerListDto>>;
\`\`\`
`,

    notifications: `# CQRS Notifications

## Notification Definition

Notifications are fire-and-forget messages that can have multiple handlers.

### Basic Notification

\`\`\`csharp
// Notification definition
public record CustomerCreatedNotification(
    Guid CustomerId,
    string Name,
    string Email
) : INotification;
\`\`\`

### Notification Handlers

\`\`\`csharp
// Handler 1: Send welcome email
public class SendWelcomeEmailHandler : INotificationHandler<CustomerCreatedNotification>
{
    private readonly IEmailService _emailService;

    public SendWelcomeEmailHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task HandleAsync(
        CustomerCreatedNotification notification, 
        CancellationToken cancellationToken = default)
    {
        await _emailService.SendWelcomeEmailAsync(notification.Email, notification.Name);
    }
}

// Handler 2: Update analytics
public class UpdateAnalyticsHandler : INotificationHandler<CustomerCreatedNotification>
{
    private readonly IAnalyticsService _analytics;

    public UpdateAnalyticsHandler(IAnalyticsService analytics)
    {
        _analytics = analytics;
    }

    public async Task HandleAsync(
        CustomerCreatedNotification notification, 
        CancellationToken cancellationToken = default)
    {
        await _analytics.TrackNewCustomerAsync(notification.CustomerId);
    }
}

// Handler 3: Sync to external system
public class SyncToExternalSystemHandler : INotificationHandler<CustomerCreatedNotification>
{
    private readonly IExternalSystemClient _client;

    public SyncToExternalSystemHandler(IExternalSystemClient client)
    {
        _client = client;
    }

    public async Task HandleAsync(
        CustomerCreatedNotification notification, 
        CancellationToken cancellationToken = default)
    {
        await _client.CreateCustomerAsync(new
        {
            ExternalId = notification.CustomerId.ToString(),
            notification.Name,
            notification.Email
        });
    }
}
\`\`\`

### Publishing Notifications

\`\`\`csharp
public class CreateCustomerCommandHandler 
    : ICommandHandler<CreateCustomerCommand, IBusinessResult<CustomerDto>>
{
    private readonly IUnitOfWorkAsync _uow;
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public CreateCustomerCommandHandler(
        IUnitOfWorkAsync uow, 
        IMediator mediator,
        IMapper mapper)
    {
        _uow = uow;
        _mediator = mediator;
        _mapper = mapper;
    }

    public async Task<IBusinessResult<CustomerDto>> HandleAsync(
        CreateCustomerCommand command, 
        CancellationToken cancellationToken = default)
    {
        var customer = new Customer
        {
            Name = command.Name,
            Email = command.Email
        };

        var repository = _uow.GetRepository<Customer>();
        await repository.AddAsync(customer);
        await _uow.SaveChangesAsync();

        // Publish notification (all handlers execute)
        await _mediator.PublishAsync(new CustomerCreatedNotification(
            customer.Id,
            customer.Name,
            customer.Email
        ), cancellationToken);

        return BusinessResult<CustomerDto>.Success(_mapper.Map<CustomerDto>(customer));
    }
}
\`\`\`
`,

    "domain-events": `# Domain Events

## What are Domain Events?

Domain events represent something that happened in the domain. They are used to:
- Decouple domain logic
- Implement eventual consistency
- Enable event sourcing

### Domain Event Definition

\`\`\`csharp
// Base interface
public interface IDomainEvent
{
    Guid EventId { get; }
    DateTime OccurredOn { get; }
}

// Concrete event
public record CustomerCreatedEvent(
    Guid CustomerId,
    string Name,
    string Email
) : IDomainEvent
{
    public Guid EventId { get; } = Guid.NewGuid();
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}

public record CustomerEmailChangedEvent(
    Guid CustomerId,
    string OldEmail,
    string NewEmail
) : IDomainEvent
{
    public Guid EventId { get; } = Guid.NewGuid();
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}
\`\`\`

### Entity with Domain Events

\`\`\`csharp
public abstract class AggregateRoot : EntityBase<Guid>
{
    private readonly List<IDomainEvent> _domainEvents = new();
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}

public class Customer : AggregateRoot
{
    public string Name { get; private set; }
    public string Email { get; private set; }

    private Customer() { } // EF

    public static Customer Create(string name, string email)
    {
        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            Name = name,
            Email = email
        };

        customer.AddDomainEvent(new CustomerCreatedEvent(
            customer.Id, name, email
        ));

        return customer;
    }

    public void ChangeEmail(string newEmail)
    {
        if (Email == newEmail) return;

        var oldEmail = Email;
        Email = newEmail;

        AddDomainEvent(new CustomerEmailChangedEvent(Id, oldEmail, newEmail));
    }
}
\`\`\`

### Domain Event Handler

\`\`\`csharp
public class CustomerCreatedEventHandler : IDomainEventHandler<CustomerCreatedEvent>
{
    private readonly ILogger<CustomerCreatedEventHandler> _logger;

    public CustomerCreatedEventHandler(ILogger<CustomerCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task HandleAsync(CustomerCreatedEvent domainEvent, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Customer created: {CustomerId}, {Name}",
            domainEvent.CustomerId,
            domainEvent.Name
        );

        return Task.CompletedTask;
    }
}
\`\`\`

### Dispatching Domain Events

\`\`\`csharp
public class DomainEventDispatcher : IDomainEventDispatcher
{
    private readonly IServiceProvider _serviceProvider;

    public DomainEventDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task DispatchAsync(IEnumerable<IDomainEvent> events, CancellationToken cancellationToken)
    {
        foreach (var domainEvent in events)
        {
            var eventType = domainEvent.GetType();
            var handlerType = typeof(IDomainEventHandler<>).MakeGenericType(eventType);
            var handlers = _serviceProvider.GetServices(handlerType);

            foreach (var handler in handlers)
            {
                var method = handlerType.GetMethod("HandleAsync");
                await (Task)method!.Invoke(handler, new object[] { domainEvent, cancellationToken })!;
            }
        }
    }
}

// Usage in SaveChanges
public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
{
    var entities = ChangeTracker.Entries<AggregateRoot>()
        .Where(e => e.Entity.DomainEvents.Any())
        .ToList();

    var domainEvents = entities
        .SelectMany(e => e.Entity.DomainEvents)
        .ToList();

    var result = await base.SaveChangesAsync(cancellationToken);

    // Dispatch events after save
    await _domainEventDispatcher.DispatchAsync(domainEvents, cancellationToken);

    // Clear events
    entities.ForEach(e => e.Entity.ClearDomainEvents());

    return result;
}
\`\`\`
`,

    behaviors: `# Pipeline Behaviors

## What are Pipeline Behaviors?

Pipeline behaviors are middleware for your commands/queries. They run before and after handlers.

### Common Use Cases

- Validation
- Logging
- Performance monitoring
- Caching
- Transaction management
- Exception handling

### Validation Behavior

\`\`\`csharp
using FluentValidation;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);
        var failures = _validators
            .Select(v => v.Validate(context))
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any())
        {
            throw new ValidationException(failures);
        }

        return await next();
    }
}
\`\`\`

### Logging Behavior

\`\`\`csharp
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var requestId = Guid.NewGuid();

        _logger.LogInformation(
            "[{RequestId}] Handling {RequestName}: {@Request}",
            requestId, requestName, request);

        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var response = await next();
            stopwatch.Stop();

            _logger.LogInformation(
                "[{RequestId}] Handled {RequestName} in {ElapsedMs}ms",
                requestId, requestName, stopwatch.ElapsedMilliseconds);

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex,
                "[{RequestId}] Error handling {RequestName} after {ElapsedMs}ms",
                requestId, requestName, stopwatch.ElapsedMilliseconds);
            throw;
        }
    }
}
\`\`\`

### Transaction Behavior

\`\`\`csharp
public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICommand<TResponse>
{
    private readonly IUnitOfWorkAsync _unitOfWork;

    public TransactionBehavior(IUnitOfWorkAsync unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Start transaction
        await using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var response = await next();
            await transaction.CommitAsync(cancellationToken);
            return response;
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
\`\`\`

### Registration

\`\`\`csharp
// Program.cs
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
\`\`\`
`,

    validation: `# Validation in CQRS

## FluentValidation Integration

### Command Validator

\`\`\`csharp
using FluentValidation;

public class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    private readonly IUnitOfWorkAsync _uow;

    public CreateCustomerCommandValidator(IUnitOfWorkAsync uow)
    {
        _uow = uow;

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MustAsync(BeUniqueEmail).WithMessage("Email already exists");
    }

    private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        var repo = _uow.GetRepository<Customer>();
        var existing = await repo.GetByAsync(x => x.Email == email);
        return !existing.Any();
    }
}
\`\`\`

### Validation Behavior (Auto-validation)

\`\`\`csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
            return await next();

        var context = new ValidationContext<TRequest>(request);
        
        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken))
        );

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any())
        {
            // Return business result with validation errors
            if (typeof(TResponse).IsGenericType && 
                typeof(TResponse).GetGenericTypeDefinition() == typeof(IBusinessResult<>))
            {
                var resultType = typeof(TResponse).GetGenericArguments()[0];
                var businessResultType = typeof(BusinessResult<>).MakeGenericType(resultType);
                var result = Activator.CreateInstance(businessResultType);
                
                foreach (var failure in failures)
                {
                    // Add validation message
                }
                
                return (TResponse)result!;
            }

            throw new ValidationException(failures);
        }

        return await next();
    }
}
\`\`\`

### Registration

\`\`\`csharp
// Program.cs
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
\`\`\`
`,

    saga: `# Saga Pattern

## Overview

Saga pattern manages distributed transactions across multiple services using compensating transactions.

### Saga Orchestrator

\`\`\`csharp
public interface ISagaStep<TContext>
{
    Task<bool> ExecuteAsync(TContext context, CancellationToken cancellationToken);
    Task CompensateAsync(TContext context, CancellationToken cancellationToken);
}

public class SagaOrchestrator<TContext>
{
    private readonly List<ISagaStep<TContext>> _steps = new();
    private readonly ILogger<SagaOrchestrator<TContext>> _logger;

    public SagaOrchestrator(ILogger<SagaOrchestrator<TContext>> logger)
    {
        _logger = logger;
    }

    public SagaOrchestrator<TContext> AddStep(ISagaStep<TContext> step)
    {
        _steps.Add(step);
        return this;
    }

    public async Task<bool> ExecuteAsync(TContext context, CancellationToken cancellationToken)
    {
        var executedSteps = new Stack<ISagaStep<TContext>>();

        foreach (var step in _steps)
        {
            try
            {
                _logger.LogInformation("Executing step: {StepName}", step.GetType().Name);
                
                var success = await step.ExecuteAsync(context, cancellationToken);
                
                if (!success)
                {
                    _logger.LogWarning("Step failed: {StepName}", step.GetType().Name);
                    await CompensateAsync(executedSteps, context, cancellationToken);
                    return false;
                }

                executedSteps.Push(step);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Step threw exception: {StepName}", step.GetType().Name);
                await CompensateAsync(executedSteps, context, cancellationToken);
                throw;
            }
        }

        return true;
    }

    private async Task CompensateAsync(
        Stack<ISagaStep<TContext>> executedSteps,
        TContext context,
        CancellationToken cancellationToken)
    {
        while (executedSteps.Count > 0)
        {
            var step = executedSteps.Pop();
            try
            {
                _logger.LogInformation("Compensating step: {StepName}", step.GetType().Name);
                await step.CompensateAsync(context, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Compensation failed: {StepName}", step.GetType().Name);
                // Continue compensating other steps
            }
        }
    }
}
\`\`\`

### Order Processing Saga Example

\`\`\`csharp
public class OrderSagaContext
{
    public Guid OrderId { get; set; }
    public Guid CustomerId { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public decimal Total { get; set; }
    public string? PaymentTransactionId { get; set; }
    public string? ShipmentTrackingId { get; set; }
}

// Step 1: Reserve Inventory
public class ReserveInventoryStep : ISagaStep<OrderSagaContext>
{
    private readonly IInventoryService _inventory;

    public ReserveInventoryStep(IInventoryService inventory) => _inventory = inventory;

    public async Task<bool> ExecuteAsync(OrderSagaContext context, CancellationToken cancellationToken)
    {
        foreach (var item in context.Items)
        {
            var reserved = await _inventory.ReserveAsync(item.ProductId, item.Quantity);
            if (!reserved) return false;
        }
        return true;
    }

    public async Task CompensateAsync(OrderSagaContext context, CancellationToken cancellationToken)
    {
        foreach (var item in context.Items)
        {
            await _inventory.ReleaseAsync(item.ProductId, item.Quantity);
        }
    }
}

// Step 2: Process Payment
public class ProcessPaymentStep : ISagaStep<OrderSagaContext>
{
    private readonly IPaymentService _payment;

    public ProcessPaymentStep(IPaymentService payment) => _payment = payment;

    public async Task<bool> ExecuteAsync(OrderSagaContext context, CancellationToken cancellationToken)
    {
        var result = await _payment.ChargeAsync(context.CustomerId, context.Total);
        if (result.Success)
        {
            context.PaymentTransactionId = result.TransactionId;
            return true;
        }
        return false;
    }

    public async Task CompensateAsync(OrderSagaContext context, CancellationToken cancellationToken)
    {
        if (context.PaymentTransactionId != null)
        {
            await _payment.RefundAsync(context.PaymentTransactionId);
        }
    }
}

// Usage
public class CreateOrderCommandHandler : ICommandHandler<CreateOrderCommand, OrderResult>
{
    private readonly SagaOrchestrator<OrderSagaContext> _saga;

    public CreateOrderCommandHandler(
        IInventoryService inventory,
        IPaymentService payment,
        IShippingService shipping,
        ILogger<SagaOrchestrator<OrderSagaContext>> logger)
    {
        _saga = new SagaOrchestrator<OrderSagaContext>(logger)
            .AddStep(new ReserveInventoryStep(inventory))
            .AddStep(new ProcessPaymentStep(payment))
            .AddStep(new CreateShipmentStep(shipping));
    }

    public async Task<OrderResult> HandleAsync(CreateOrderCommand command, CancellationToken cancellationToken)
    {
        var context = new OrderSagaContext
        {
            OrderId = Guid.NewGuid(),
            CustomerId = command.CustomerId,
            Items = command.Items,
            Total = command.Items.Sum(x => x.Price * x.Quantity)
        };

        var success = await _saga.ExecuteAsync(context, cancellationToken);

        return new OrderResult(success, context.OrderId, context.PaymentTransactionId);
    }
}
\`\`\`
`,

    "event-sourcing": `# Event Sourcing

## Overview

Event sourcing stores all changes to application state as a sequence of events.

### Event Store

\`\`\`csharp
public interface IEventStore
{
    Task SaveEventsAsync(Guid aggregateId, IEnumerable<IDomainEvent> events, int expectedVersion, CancellationToken cancellationToken);
    Task<IEnumerable<IDomainEvent>> GetEventsAsync(Guid aggregateId, CancellationToken cancellationToken);
    Task<IEnumerable<IDomainEvent>> GetEventsAsync(Guid aggregateId, int fromVersion, CancellationToken cancellationToken);
}

public class EventStoreEntity
{
    public Guid Id { get; set; }
    public Guid AggregateId { get; set; }
    public string AggregateType { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public string EventData { get; set; } = string.Empty;
    public int Version { get; set; }
    public DateTime Timestamp { get; set; }
}

public class EfEventStore : IEventStore
{
    private readonly MyDbContext _context;

    public EfEventStore(MyDbContext context) => _context = context;

    public async Task SaveEventsAsync(
        Guid aggregateId,
        IEnumerable<IDomainEvent> events,
        int expectedVersion,
        CancellationToken cancellationToken)
    {
        var currentVersion = await _context.Events
            .Where(e => e.AggregateId == aggregateId)
            .MaxAsync(e => (int?)e.Version, cancellationToken) ?? 0;

        if (currentVersion != expectedVersion)
        {
            throw new ConcurrencyException($"Expected version {expectedVersion}, but found {currentVersion}");
        }

        var version = currentVersion;
        foreach (var @event in events)
        {
            version++;
            var eventEntity = new EventStoreEntity
            {
                Id = Guid.NewGuid(),
                AggregateId = aggregateId,
                AggregateType = @event.GetType().DeclaringType?.Name ?? "Unknown",
                EventType = @event.GetType().Name,
                EventData = JsonSerializer.Serialize(@event, @event.GetType()),
                Version = version,
                Timestamp = DateTime.UtcNow
            };

            await _context.Events.AddAsync(eventEntity, cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<IDomainEvent>> GetEventsAsync(
        Guid aggregateId,
        CancellationToken cancellationToken)
    {
        var eventEntities = await _context.Events
            .Where(e => e.AggregateId == aggregateId)
            .OrderBy(e => e.Version)
            .ToListAsync(cancellationToken);

        return eventEntities.Select(DeserializeEvent);
    }

    private IDomainEvent DeserializeEvent(EventStoreEntity entity)
    {
        var eventType = Type.GetType(entity.EventType) 
            ?? throw new InvalidOperationException($"Unknown event type: {entity.EventType}");
        
        return (IDomainEvent)JsonSerializer.Deserialize(entity.EventData, eventType)!;
    }
}
\`\`\`

### Event-Sourced Aggregate

\`\`\`csharp
public abstract class EventSourcedAggregate
{
    public Guid Id { get; protected set; }
    public int Version { get; private set; }
    
    private readonly List<IDomainEvent> _uncommittedEvents = new();
    public IReadOnlyCollection<IDomainEvent> UncommittedEvents => _uncommittedEvents.AsReadOnly();

    protected void ApplyChange(IDomainEvent @event)
    {
        Apply(@event);
        _uncommittedEvents.Add(@event);
    }

    protected abstract void Apply(IDomainEvent @event);

    public void LoadFromHistory(IEnumerable<IDomainEvent> history)
    {
        foreach (var @event in history)
        {
            Apply(@event);
            Version++;
        }
    }

    public void ClearUncommittedEvents()
    {
        _uncommittedEvents.Clear();
    }
}

public class Customer : EventSourcedAggregate
{
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }

    private Customer() { }

    public static Customer Create(string name, string email)
    {
        var customer = new Customer();
        customer.ApplyChange(new CustomerCreatedEvent(Guid.NewGuid(), name, email));
        return customer;
    }

    public void Activate()
    {
        if (IsActive) return;
        ApplyChange(new CustomerActivatedEvent(Id));
    }

    public void Deactivate()
    {
        if (!IsActive) return;
        ApplyChange(new CustomerDeactivatedEvent(Id));
    }

    protected override void Apply(IDomainEvent @event)
    {
        switch (@event)
        {
            case CustomerCreatedEvent e:
                Id = e.CustomerId;
                Name = e.Name;
                Email = e.Email;
                IsActive = false;
                break;
            case CustomerActivatedEvent:
                IsActive = true;
                break;
            case CustomerDeactivatedEvent:
                IsActive = false;
                break;
        }
    }
}
\`\`\`

### Repository for Event-Sourced Aggregates

\`\`\`csharp
public class EventSourcedRepository<T> where T : EventSourcedAggregate, new()
{
    private readonly IEventStore _eventStore;

    public EventSourcedRepository(IEventStore eventStore)
    {
        _eventStore = eventStore;
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var events = await _eventStore.GetEventsAsync(id, cancellationToken);
        var eventList = events.ToList();
        
        if (!eventList.Any()) return null;

        var aggregate = new T();
        aggregate.LoadFromHistory(eventList);
        return aggregate;
    }

    public async Task SaveAsync(T aggregate, CancellationToken cancellationToken = default)
    {
        var uncommittedEvents = aggregate.UncommittedEvents.ToList();
        
        if (!uncommittedEvents.Any()) return;

        await _eventStore.SaveEventsAsync(
            aggregate.Id,
            uncommittedEvents,
            aggregate.Version,
            cancellationToken
        );

        aggregate.ClearUncommittedEvents();
    }
}
\`\`\`
`,

    resilience: `# Resilience Patterns in CQRS

## Idempotency

\`\`\`csharp
public interface IIdempotencyService
{
    Task<bool> TryAcquireLockAsync(string idempotencyKey, TimeSpan expiry);
    Task<T?> GetResultAsync<T>(string idempotencyKey);
    Task SetResultAsync<T>(string idempotencyKey, T result, TimeSpan expiry);
}

public class IdempotencyBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICommand<TResponse>
{
    private readonly IIdempotencyService _idempotency;

    public IdempotencyBehavior(IIdempotencyService idempotency)
    {
        _idempotency = idempotency;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Get idempotency key from request
        var key = GetIdempotencyKey(request);
        if (string.IsNullOrEmpty(key))
        {
            return await next();
        }

        // Check for existing result
        var existingResult = await _idempotency.GetResultAsync<TResponse>(key);
        if (existingResult != null)
        {
            return existingResult;
        }

        // Try to acquire lock
        if (!await _idempotency.TryAcquireLockAsync(key, TimeSpan.FromMinutes(5)))
        {
            throw new ConcurrencyException("Request is already being processed");
        }

        var result = await next();

        // Store result
        await _idempotency.SetResultAsync(key, result, TimeSpan.FromHours(24));

        return result;
    }

    private static string? GetIdempotencyKey(TRequest request)
    {
        // Use reflection or interface to get key
        var prop = typeof(TRequest).GetProperty("IdempotencyKey");
        return prop?.GetValue(request)?.ToString();
    }
}
\`\`\`

## Circuit Breaker

\`\`\`csharp
using Polly;
using Polly.CircuitBreaker;

public class CircuitBreakerBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private static readonly AsyncCircuitBreakerPolicy CircuitBreaker = Policy
        .Handle<Exception>()
        .CircuitBreakerAsync(
            exceptionsAllowedBeforeBreaking: 3,
            durationOfBreak: TimeSpan.FromSeconds(30),
            onBreak: (ex, duration) => Console.WriteLine($"Circuit broken for {duration}"),
            onReset: () => Console.WriteLine("Circuit reset")
        );

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        return await CircuitBreaker.ExecuteAsync(async () => await next());
    }
}
\`\`\`

## Outbox Pattern

\`\`\`csharp
public class OutboxMessage
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
}

public class OutboxProcessor : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OutboxProcessor> _logger;

    public OutboxProcessor(IServiceProvider serviceProvider, ILogger<OutboxProcessor> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            var publisher = scope.ServiceProvider.GetRequiredService<IEventPublisher>();

            var messages = await context.OutboxMessages
                .Where(m => m.ProcessedAt == null)
                .OrderBy(m => m.CreatedAt)
                .Take(100)
                .ToListAsync(stoppingToken);

            foreach (var message in messages)
            {
                try
                {
                    await publisher.PublishAsync(message.Type, message.Payload);
                    message.ProcessedAt = DateTime.UtcNow;
                    _logger.LogInformation("Processed outbox message: {Id}", message.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process outbox message: {Id}", message.Id);
                }
            }

            await context.SaveChangesAsync(stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
\`\`\`
`,

    "integration-events": `# Integration Events

## Overview

Integration events enable communication between bounded contexts or microservices.

### Integration Event Definition

\`\`\`csharp
public interface IIntegrationEvent
{
    Guid EventId { get; }
    DateTime OccurredOn { get; }
    string EventType { get; }
}

public record CustomerCreatedIntegrationEvent(
    Guid CustomerId,
    string Name,
    string Email
) : IIntegrationEvent
{
    public Guid EventId { get; } = Guid.NewGuid();
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
    public string EventType => nameof(CustomerCreatedIntegrationEvent);
}
\`\`\`

### Event Publisher (RabbitMQ)

\`\`\`csharp
using Mvp24Hours.Infrastructure.RabbitMQ;

public interface IIntegrationEventPublisher
{
    Task PublishAsync<T>(T @event) where T : IIntegrationEvent;
}

public class RabbitMqEventPublisher : IIntegrationEventPublisher
{
    private readonly IMvpRabbitMQClient _client;
    private readonly ILogger<RabbitMqEventPublisher> _logger;

    public RabbitMqEventPublisher(
        IMvpRabbitMQClient client,
        ILogger<RabbitMqEventPublisher> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async Task PublishAsync<T>(T @event) where T : IIntegrationEvent
    {
        _logger.LogInformation(
            "Publishing integration event: {EventType} ({EventId})",
            @event.EventType,
            @event.EventId);

        await _client.PublishAsync(
            exchange: "integration-events",
            routingKey: @event.EventType,
            message: @event
        );
    }
}
\`\`\`

### Event Consumer

\`\`\`csharp
using Mvp24Hours.Infrastructure.RabbitMQ;

public class CustomerCreatedConsumer : IMvpRabbitMQConsumerAsync
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<CustomerCreatedConsumer> _logger;

    public CustomerCreatedConsumer(
        IServiceProvider serviceProvider,
        ILogger<CustomerCreatedConsumer> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public string RoutingKey => nameof(CustomerCreatedIntegrationEvent);
    public string QueueName => "notification-service.customer-created";
    public string Exchange => "integration-events";

    public async Task<bool> ReceivedAsync(object message, string token)
    {
        var @event = JsonSerializer.Deserialize<CustomerCreatedIntegrationEvent>(
            message.ToString()!);

        if (@event is null) return false;

        _logger.LogInformation(
            "Received CustomerCreatedIntegrationEvent: {CustomerId}",
            @event.CustomerId);

        using var scope = _serviceProvider.CreateScope();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        await emailService.SendWelcomeEmailAsync(@event.Email, @event.Name);

        return true;
    }
}
\`\`\`

### Registration

\`\`\`csharp
// Program.cs
builder.Services.AddMvp24HoursRabbitMQ(configuration);
builder.Services.AddScoped<IIntegrationEventPublisher, RabbitMqEventPublisher>();
builder.Services.AddMvp24HoursRabbitMQConsumer<CustomerCreatedConsumer>();
\`\`\`
`,

    "migration-mediatr": `# Migration from MediatR

## Overview

Mvp24Hours provides a built-in mediator that is compatible with MediatR patterns.

### Interface Mapping

| MediatR | Mvp24Hours |
|---------|------------|
| \`IRequest<T>\` | \`ICommand<T>\` or \`IQuery<T>\` |
| \`IRequestHandler<TRequest, TResponse>\` | \`ICommandHandler<,>\` or \`IQueryHandler<,>\` |
| \`INotification\` | \`INotification\` |
| \`INotificationHandler<T>\` | \`INotificationHandler<T>\` |
| \`IPipelineBehavior<,>\` | \`IPipelineBehavior<,>\` |

### Migration Steps

1. **Replace package references**

\`\`\`xml
<!-- Remove -->
<PackageReference Include="MediatR" Version="*" />
<PackageReference Include="MediatR.Extensions.Microsoft.DependencyInjection" Version="*" />

<!-- Add -->
<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
\`\`\`

2. **Update using statements**

\`\`\`csharp
// Before
using MediatR;

// After
using Mvp24Hours.Core.Contract.Application;
\`\`\`

3. **Update request definitions**

\`\`\`csharp
// Before (MediatR)
public record CreateCustomerCommand(string Name) : IRequest<CustomerDto>;

// After (Mvp24Hours)
public record CreateCustomerCommand(string Name) : ICommand<IBusinessResult<CustomerDto>>;
\`\`\`

4. **Update handlers**

\`\`\`csharp
// Before (MediatR)
public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, CustomerDto>
{
    public async Task<CustomerDto> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        // ...
    }
}

// After (Mvp24Hours)
public class CreateCustomerHandler : ICommandHandler<CreateCustomerCommand, IBusinessResult<CustomerDto>>
{
    public async Task<IBusinessResult<CustomerDto>> HandleAsync(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        // ...
    }
}
\`\`\`

5. **Update registration**

\`\`\`csharp
// Before (MediatR)
services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// After (Mvp24Hours)
services.AddMvp24HoursMediator(typeof(Program).Assembly);
\`\`\`

### Benefits of Migration

1. **Consistent response handling** with \`IBusinessResult<T>\`
2. **Integration** with Mvp24Hours ecosystem
3. **No additional package** required
4. **Same patterns** (pipeline behaviors, notifications)
`,

    "multi-tenancy": `# Multi-Tenancy in CQRS

## Overview

Multi-tenancy allows a single application instance to serve multiple tenants (customers/organizations) with isolated data.

## Tenant Resolution Strategies

### 1. Header-Based Tenant

\`\`\`csharp
public interface ITenantResolver
{
    string? GetTenantId();
}

public class HeaderTenantResolver : ITenantResolver
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public HeaderTenantResolver(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? GetTenantId()
    {
        return _httpContextAccessor.HttpContext?
            .Request.Headers["X-Tenant-Id"].FirstOrDefault();
    }
}
\`\`\`

### 2. Subdomain-Based Tenant

\`\`\`csharp
public class SubdomainTenantResolver : ITenantResolver
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SubdomainTenantResolver(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? GetTenantId()
    {
        var host = _httpContextAccessor.HttpContext?.Request.Host.Host;
        if (string.IsNullOrEmpty(host)) return null;

        // tenant1.myapp.com -> tenant1
        var parts = host.Split('.');
        return parts.Length >= 3 ? parts[0] : null;
    }
}
\`\`\`

### 3. Claim-Based Tenant

\`\`\`csharp
public class ClaimTenantResolver : ITenantResolver
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ClaimTenantResolver(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? GetTenantId()
    {
        return _httpContextAccessor.HttpContext?.User
            .FindFirst("tenant_id")?.Value;
    }
}
\`\`\`

## Tenant Context

\`\`\`csharp
public interface ITenantContext
{
    string TenantId { get; }
    string? TenantName { get; }
    string? ConnectionString { get; }
}

public class TenantContext : ITenantContext
{
    public string TenantId { get; set; } = string.Empty;
    public string? TenantName { get; set; }
    public string? ConnectionString { get; set; }
}

// Middleware to set tenant context
public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(
        HttpContext context,
        ITenantResolver resolver,
        ITenantContext tenantContext,
        ITenantStore tenantStore)
    {
        var tenantId = resolver.GetTenantId();

        if (string.IsNullOrEmpty(tenantId))
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { error = "Tenant ID required" });
            return;
        }

        var tenant = await tenantStore.GetTenantAsync(tenantId);
        if (tenant is null)
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(new { error = "Tenant not found" });
            return;
        }

        ((TenantContext)tenantContext).TenantId = tenant.Id;
        ((TenantContext)tenantContext).TenantName = tenant.Name;
        ((TenantContext)tenantContext).ConnectionString = tenant.ConnectionString;

        await _next(context);
    }
}
\`\`\`

## Multi-Tenant DbContext

### Strategy 1: Shared Database with Tenant Column

\`\`\`csharp
public class MultiTenantDbContext : DbContext
{
    private readonly ITenantContext _tenantContext;

    public MultiTenantDbContext(
        DbContextOptions<MultiTenantDbContext> options,
        ITenantContext tenantContext) : base(options)
    {
        _tenantContext = tenantContext;
    }

    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Global query filter for tenant isolation
        modelBuilder.Entity<Customer>()
            .HasQueryFilter(c => c.TenantId == _tenantContext.TenantId);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Auto-set tenant ID on new entities
        foreach (var entry in ChangeTracker.Entries<ITenantEntity>()
            .Where(e => e.State == EntityState.Added))
        {
            entry.Entity.TenantId = _tenantContext.TenantId;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}

public interface ITenantEntity
{
    string TenantId { get; set; }
}

public class Customer : EntityBase<Guid>, ITenantEntity
{
    public string TenantId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
\`\`\`

### Strategy 2: Database per Tenant

\`\`\`csharp
public class TenantDbContextFactory
{
    private readonly ITenantContext _tenantContext;
    private readonly IConfiguration _configuration;

    public TenantDbContextFactory(
        ITenantContext tenantContext,
        IConfiguration configuration)
    {
        _tenantContext = tenantContext;
        _configuration = configuration;
    }

    public AppDbContext CreateDbContext()
    {
        var connectionString = _tenantContext.ConnectionString 
            ?? _configuration.GetConnectionString("DefaultConnection");

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(connectionString)
            .Options;

        return new AppDbContext(options);
    }
}

// Registration
builder.Services.AddScoped(sp =>
{
    var factory = sp.GetRequiredService<TenantDbContextFactory>();
    return factory.CreateDbContext();
});
\`\`\`

## Tenant-Aware Commands

\`\`\`csharp
// Command includes tenant context automatically
public record CreateCustomerCommand(string Name, string Email) : ICommand<IBusinessResult<CustomerDto>>;

public class CreateCustomerCommandHandler 
    : ICommandHandler<CreateCustomerCommand, IBusinessResult<CustomerDto>>
{
    private readonly IUnitOfWorkAsync _uow;
    private readonly ITenantContext _tenantContext;

    public CreateCustomerCommandHandler(
        IUnitOfWorkAsync uow,
        ITenantContext tenantContext)
    {
        _uow = uow;
        _tenantContext = tenantContext;
    }

    public async Task<IBusinessResult<CustomerDto>> HandleAsync(
        CreateCustomerCommand command,
        CancellationToken cancellationToken)
    {
        // TenantId is automatically set via DbContext
        var customer = new Customer
        {
            Name = command.Name,
            Email = command.Email
            // TenantId set automatically in SaveChangesAsync
        };

        var repo = _uow.GetRepository<Customer>();
        await repo.AddAsync(customer);
        await _uow.SaveChangesAsync();

        return BusinessResult<CustomerDto>.Success(new CustomerDto
        {
            Id = customer.Id,
            Name = customer.Name,
            TenantId = _tenantContext.TenantId
        });
    }
}
\`\`\`

## Tenant-Aware Pipeline Behavior

\`\`\`csharp
public class TenantValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ITenantContext _tenantContext;

    public TenantValidationBehavior(ITenantContext tenantContext)
    {
        _tenantContext = tenantContext;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(_tenantContext.TenantId))
        {
            throw new UnauthorizedAccessException("Tenant context not established");
        }

        return await next();
    }
}
\`\`\`

## Registration

\`\`\`csharp
// Program.cs
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantResolver, HeaderTenantResolver>();
builder.Services.AddScoped<ITenantContext, TenantContext>();
builder.Services.AddScoped<ITenantStore, TenantStore>();

// Add multi-tenant DbContext
builder.Services.AddDbContext<MultiTenantDbContext>((sp, options) =>
{
    var tenantContext = sp.GetRequiredService<ITenantContext>();
    var connectionString = tenantContext.ConnectionString 
        ?? builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

// Middleware
app.UseMiddleware<TenantMiddleware>();
\`\`\`
`,

    "scheduled-commands": `# Scheduled Commands

## Overview

Execute CQRS commands on a schedule using background services.

## Command Scheduler

\`\`\`csharp
public interface IScheduledCommand
{
    string CronExpression { get; }
    ICommand<Unit> Command { get; }
}

public class CleanupOldDataSchedule : IScheduledCommand
{
    public string CronExpression => "0 0 * * *"; // Daily at midnight
    public ICommand<Unit> Command => new CleanupOldDataCommand();
}

public record CleanupOldDataCommand() : ICommand<Unit>;

public class CleanupOldDataCommandHandler : ICommandHandler<CleanupOldDataCommand, Unit>
{
    private readonly IUnitOfWorkAsync _uow;
    private readonly ILogger<CleanupOldDataCommandHandler> _logger;

    public CleanupOldDataCommandHandler(
        IUnitOfWorkAsync uow,
        ILogger<CleanupOldDataCommandHandler> logger)
    {
        _uow = uow;
        _logger = logger;
    }

    public async Task<Unit> HandleAsync(
        CleanupOldDataCommand command,
        CancellationToken cancellationToken)
    {
        var repo = _uow.GetRepository<AuditLog>();
        var cutoff = DateTime.UtcNow.AddDays(-90);

        var oldLogs = await repo.GetByAsync(x => x.CreatedAt < cutoff);
        
        foreach (var log in oldLogs)
        {
            await repo.RemoveAsync(log);
        }

        await _uow.SaveChangesAsync();
        
        _logger.LogInformation("Cleaned up {Count} old audit logs", oldLogs.Count());
        
        return Unit.Value;
    }
}
\`\`\`

## Command Scheduler Service

\`\`\`csharp
public class CommandSchedulerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IEnumerable<IScheduledCommand> _scheduledCommands;
    private readonly ILogger<CommandSchedulerService> _logger;

    public CommandSchedulerService(
        IServiceProvider serviceProvider,
        IEnumerable<IScheduledCommand> scheduledCommands,
        ILogger<CommandSchedulerService> logger)
    {
        _serviceProvider = serviceProvider;
        _scheduledCommands = scheduledCommands;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var tasks = _scheduledCommands
            .Select(sc => RunScheduleAsync(sc, stoppingToken))
            .ToList();

        await Task.WhenAll(tasks);
    }

    private async Task RunScheduleAsync(
        IScheduledCommand schedule,
        CancellationToken stoppingToken)
    {
        var cron = CronExpression.Parse(schedule.CronExpression);
        var commandName = schedule.Command.GetType().Name;

        while (!stoppingToken.IsCancellationRequested)
        {
            var next = cron.GetNextOccurrence(DateTimeOffset.UtcNow, TimeZoneInfo.Utc);
            
            if (!next.HasValue) break;

            var delay = next.Value - DateTimeOffset.UtcNow;
            if (delay > TimeSpan.Zero)
            {
                await Task.Delay(delay, stoppingToken);
            }

            if (stoppingToken.IsCancellationRequested) break;

            try
            {
                _logger.LogInformation("Executing scheduled command: {Command}", commandName);
                
                using var scope = _serviceProvider.CreateScope();
                var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
                
                await mediator.SendAsync(schedule.Command, stoppingToken);
                
                _logger.LogInformation("Scheduled command completed: {Command}", commandName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Scheduled command failed: {Command}", commandName);
            }
        }
    }
}

// Registration
builder.Services.AddSingleton<IScheduledCommand, CleanupOldDataSchedule>();
builder.Services.AddSingleton<IScheduledCommand, SendDailyReportSchedule>();
builder.Services.AddHostedService<CommandSchedulerService>();
\`\`\`

## Delayed Commands

\`\`\`csharp
public interface IDelayedCommand<TResponse>
{
    ICommand<TResponse> Command { get; }
    TimeSpan Delay { get; }
}

public class DelayedCommandProcessor : BackgroundService
{
    private readonly Channel<DelayedCommandEnvelope> _channel;
    private readonly IServiceProvider _serviceProvider;

    public DelayedCommandProcessor(
        Channel<DelayedCommandEnvelope> channel,
        IServiceProvider serviceProvider)
    {
        _channel = channel;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var envelope in _channel.Reader.ReadAllAsync(stoppingToken))
        {
            await Task.Delay(envelope.Delay, stoppingToken);
            
            using var scope = _serviceProvider.CreateScope();
            var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
            
            await mediator.SendAsync((dynamic)envelope.Command, stoppingToken);
        }
    }
}

public record DelayedCommandEnvelope(object Command, TimeSpan Delay);

// Usage
public class OrderService
{
    private readonly Channel<DelayedCommandEnvelope> _delayedChannel;

    public async Task ScheduleFollowUpEmail(Guid orderId)
    {
        var command = new SendFollowUpEmailCommand(orderId);
        var envelope = new DelayedCommandEnvelope(command, TimeSpan.FromHours(24));
        
        await _delayedChannel.Writer.WriteAsync(envelope);
    }
}
\`\`\`
`,

    "extensibility": `# CQRS Extensibility

## Custom Pipeline Behaviors

### Creating Custom Behaviors

\`\`\`csharp
public class PerformanceMonitorBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<PerformanceMonitorBehavior<TRequest, TResponse>> _logger;
    private readonly Histogram<double> _histogram;

    public PerformanceMonitorBehavior(
        ILogger<PerformanceMonitorBehavior<TRequest, TResponse>> logger,
        IMeterFactory meterFactory)
    {
        _logger = logger;
        var meter = meterFactory.Create("CQRS.Performance");
        _histogram = meter.CreateHistogram<double>("cqrs.handler.duration", "ms");
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var stopwatch = Stopwatch.StartNew();

        try
        {
            return await next();
        }
        finally
        {
            stopwatch.Stop();
            
            _histogram.Record(
                stopwatch.ElapsedMilliseconds,
                new KeyValuePair<string, object?>("request", requestName));

            if (stopwatch.ElapsedMilliseconds > 500)
            {
                _logger.LogWarning(
                    "Slow handler: {Request} took {ElapsedMs}ms",
                    requestName,
                    stopwatch.ElapsedMilliseconds);
            }
        }
    }
}
\`\`\`

### Conditional Behaviors

\`\`\`csharp
// Marker interface
public interface IRequiresTransaction { }

// Behavior only runs for commands with marker
public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICommand<TResponse>, IRequiresTransaction
{
    private readonly IUnitOfWorkAsync _unitOfWork;

    public TransactionBehavior(IUnitOfWorkAsync unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var response = await next();
            await transaction.CommitAsync(cancellationToken);
            return response;
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}

// Usage
public record CreateOrderCommand(Guid CustomerId, List<OrderItem> Items) 
    : ICommand<IBusinessResult<OrderDto>>, IRequiresTransaction;
\`\`\`

## Custom Handler Decorators

\`\`\`csharp
public class CachingQueryHandlerDecorator<TQuery, TResponse> : IQueryHandler<TQuery, TResponse>
    where TQuery : IQuery<TResponse>, ICacheableQuery
{
    private readonly IQueryHandler<TQuery, TResponse> _inner;
    private readonly IDistributedCache _cache;

    public CachingQueryHandlerDecorator(
        IQueryHandler<TQuery, TResponse> inner,
        IDistributedCache cache)
    {
        _inner = inner;
        _cache = cache;
    }

    public async Task<TResponse> HandleAsync(
        TQuery query,
        CancellationToken cancellationToken)
    {
        var cacheKey = query.CacheKey;
        
        var cached = await _cache.GetStringAsync(cacheKey, cancellationToken);
        if (cached is not null)
        {
            return JsonSerializer.Deserialize<TResponse>(cached)!;
        }

        var result = await _inner.HandleAsync(query, cancellationToken);

        await _cache.SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(result),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = query.CacheDuration
            },
            cancellationToken);

        return result;
    }
}

public interface ICacheableQuery
{
    string CacheKey { get; }
    TimeSpan CacheDuration { get; }
}
\`\`\`

## Custom Mediator Extensions

\`\`\`csharp
public static class MediatorExtensions
{
    public static async Task<TResponse> SendWithRetryAsync<TResponse>(
        this IMediator mediator,
        ICommand<TResponse> command,
        int maxRetries = 3,
        CancellationToken cancellationToken = default)
    {
        var attempt = 0;
        while (true)
        {
            try
            {
                return await mediator.SendAsync(command, cancellationToken);
            }
            catch (Exception) when (attempt < maxRetries)
            {
                attempt++;
                await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, attempt)), cancellationToken);
            }
        }
    }

    public static async Task PublishAndForgetAsync<TNotification>(
        this IMediator mediator,
        TNotification notification,
        CancellationToken cancellationToken = default)
        where TNotification : INotification
    {
        _ = Task.Run(async () =>
        {
            try
            {
                await mediator.PublishAsync(notification, cancellationToken);
            }
            catch
            {
                // Log but don't throw
            }
        }, cancellationToken);
    }
}
\`\`\`
`,

    "best-practices": `# CQRS Best Practices

## Command Design

### ✅ Do

\`\`\`csharp
// Use records for immutability
public record CreateCustomerCommand(
    string Name,
    string Email,
    string? Phone = null
) : ICommand<IBusinessResult<CustomerDto>>;

// Include only necessary data
public record UpdateCustomerEmailCommand(
    Guid CustomerId,
    string NewEmail
) : ICommand<IBusinessResult<bool>>;
\`\`\`

### ❌ Don't

\`\`\`csharp
// Don't include entities directly
public record BadCommand(Customer Customer) : ICommand<Customer>;

// Don't use mutable objects
public class BadMutableCommand : ICommand<Result>
{
    public string Name { get; set; } // Mutable!
}
\`\`\`

## Query Design

### ✅ Do

\`\`\`csharp
// Use projections for read models
public record GetCustomerSummaryQuery(Guid Id) : IQuery<CustomerSummaryDto>;

// Use specifications for complex filters
public record GetCustomersQuery(CustomerFilterSpec Filter, int Page, int Limit) 
    : IQuery<IPagingResult<CustomerDto>>;

// Optimize with separate read models
public class CustomerSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int OrderCount { get; set; }  // Pre-computed
    public decimal TotalSpent { get; set; }  // Pre-computed
}
\`\`\`

### ❌ Don't

\`\`\`csharp
// Don't return full entity graphs
public record GetCustomerQuery(Guid Id) : IQuery<Customer>; // Returns entity!

// Don't include business logic in queries
public record GetCustomerWithDiscountQuery(Guid Id) : IQuery<CustomerWithDiscount>;
// Discount calculation is business logic, should be in command handler
\`\`\`

## Handler Design

### ✅ Do

\`\`\`csharp
public class CreateCustomerCommandHandler 
    : ICommandHandler<CreateCustomerCommand, IBusinessResult<CustomerDto>>
{
    private readonly IUnitOfWorkAsync _uow;
    private readonly IMapper _mapper;

    // Constructor injection
    public CreateCustomerCommandHandler(IUnitOfWorkAsync uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<IBusinessResult<CustomerDto>> HandleAsync(
        CreateCustomerCommand command,
        CancellationToken cancellationToken)
    {
        // 1. Validate business rules
        var repo = _uow.GetRepository<Customer>();
        if (await repo.AnyAsync(c => c.Email == command.Email))
        {
            return BusinessResult<CustomerDto>.Failure("Email already exists");
        }

        // 2. Create domain entity
        var customer = Customer.Create(command.Name, command.Email);

        // 3. Persist
        await repo.AddAsync(customer);
        await _uow.SaveChangesAsync();

        // 4. Return DTO (not entity)
        return BusinessResult<CustomerDto>.Success(_mapper.Map<CustomerDto>(customer));
    }
}
\`\`\`

### ❌ Don't

\`\`\`csharp
public class BadHandler : ICommandHandler<CreateCommand, Result>
{
    // Don't use static or service locator
    public async Task<Result> HandleAsync(CreateCommand command, CancellationToken ct)
    {
        var service = ServiceLocator.Get<IService>(); // Anti-pattern!
        
        // Don't call other handlers directly
        var otherHandler = new OtherHandler();
        await otherHandler.HandleAsync(...);  // Use mediator instead!
        
        // Don't swallow exceptions
        try { ... } catch { return Result.Failure(); }  // Log and handle properly!
    }
}
\`\`\`

## Pipeline Behavior Order

\`\`\`csharp
// Register in correct order (outermost to innermost)
services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));      // 1. Logging (outer)
services.AddScoped(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));  // 2. Performance
services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));   // 3. Validation
services.AddScoped(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));  // 4. Transaction (inner)
\`\`\`

## Error Handling

\`\`\`csharp
// Use Result pattern, not exceptions for business errors
public async Task<IBusinessResult<CustomerDto>> HandleAsync(...)
{
    // Business rule violation -> Return failure
    if (await EmailExists(command.Email))
    {
        return BusinessResult<CustomerDto>.Failure("EMAIL_EXISTS", "Email already registered");
    }

    // Technical errors -> Let exception propagate (handled by middleware)
    var customer = await CreateCustomerAsync(command);  // May throw
    
    return BusinessResult<CustomerDto>.Success(customer);
}
\`\`\`

## Testing

\`\`\`csharp
public class CreateCustomerCommandHandlerTests
{
    [Fact]
    public async Task Handle_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var uow = new Mock<IUnitOfWorkAsync>();
        var repo = new Mock<IRepositoryAsync<Customer>>();
        
        repo.Setup(r => r.AnyAsync(It.IsAny<Expression<Func<Customer, bool>>>(), default))
            .ReturnsAsync(false);  // Email doesn't exist
        
        uow.Setup(u => u.GetRepository<Customer>()).Returns(repo.Object);

        var handler = new CreateCustomerCommandHandler(uow.Object, _mapper);
        var command = new CreateCustomerCommand("John", "john@example.com");

        // Act
        var result = await handler.HandleAsync(command, default);

        // Assert
        Assert.True(result.HasData);
        Assert.Equal("John", result.Data.Name);
        
        repo.Verify(r => r.AddAsync(It.IsAny<Customer>(), default), Times.Once);
        uow.Verify(u => u.SaveChangesAsync(default), Times.Once);
    }
}
\`\`\`
`,

    "api-reference": `# CQRS API Reference

## Core Interfaces

### ICommand<TResponse>

\`\`\`csharp
/// <summary>
/// Represents a command that changes state and returns a response.
/// </summary>
/// <typeparam name="TResponse">The response type</typeparam>
public interface ICommand<TResponse> : IRequest<TResponse> { }

// Usage
public record CreateCustomerCommand(string Name, string Email) 
    : ICommand<IBusinessResult<CustomerDto>>;
\`\`\`

### IQuery<TResponse>

\`\`\`csharp
/// <summary>
/// Represents a query that reads state without side effects.
/// </summary>
/// <typeparam name="TResponse">The response type</typeparam>
public interface IQuery<TResponse> : IRequest<TResponse> { }

// Usage
public record GetCustomerQuery(Guid Id) : IQuery<IBusinessResult<CustomerDto>>;
\`\`\`

### INotification

\`\`\`csharp
/// <summary>
/// Represents a notification that can be handled by multiple handlers.
/// </summary>
public interface INotification { }

// Usage
public record CustomerCreatedNotification(Guid CustomerId, string Email) : INotification;
\`\`\`

### ICommandHandler<TCommand, TResponse>

\`\`\`csharp
/// <summary>
/// Handles a command and produces a response.
/// </summary>
public interface ICommandHandler<in TCommand, TResponse>
    where TCommand : ICommand<TResponse>
{
    Task<TResponse> HandleAsync(TCommand command, CancellationToken cancellationToken = default);
}
\`\`\`

### IQueryHandler<TQuery, TResponse>

\`\`\`csharp
/// <summary>
/// Handles a query and produces a response.
/// </summary>
public interface IQueryHandler<in TQuery, TResponse>
    where TQuery : IQuery<TResponse>
{
    Task<TResponse> HandleAsync(TQuery query, CancellationToken cancellationToken = default);
}
\`\`\`

### INotificationHandler<TNotification>

\`\`\`csharp
/// <summary>
/// Handles a notification.
/// </summary>
public interface INotificationHandler<in TNotification>
    where TNotification : INotification
{
    Task HandleAsync(TNotification notification, CancellationToken cancellationToken = default);
}
\`\`\`

### IPipelineBehavior<TRequest, TResponse>

\`\`\`csharp
/// <summary>
/// Pipeline behavior that wraps request handlers.
/// </summary>
public interface IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    Task<TResponse> HandleAsync(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken);
}

public delegate Task<TResponse> RequestHandlerDelegate<TResponse>();
\`\`\`

### IMediator

\`\`\`csharp
/// <summary>
/// Mediator for sending commands, queries, and notifications.
/// </summary>
public interface IMediator
{
    /// <summary>
    /// Send a command or query and receive a response.
    /// </summary>
    Task<TResponse> SendAsync<TResponse>(
        IRequest<TResponse> request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Publish a notification to all handlers.
    /// </summary>
    Task PublishAsync<TNotification>(
        TNotification notification,
        CancellationToken cancellationToken = default)
        where TNotification : INotification;
}
\`\`\`

## Extension Methods

### AddMvp24HoursMediator

\`\`\`csharp
/// <summary>
/// Registers all handlers and the mediator from specified assemblies.
/// </summary>
/// <param name="services">Service collection</param>
/// <param name="assemblies">Assemblies to scan for handlers</param>
public static IServiceCollection AddMvp24HoursMediator(
    this IServiceCollection services,
    params Assembly[] assemblies);

// Usage
builder.Services.AddMvp24HoursMediator(typeof(Program).Assembly);
\`\`\`

## Business Result Types

### IBusinessResult<T>

\`\`\`csharp
public interface IBusinessResult<T>
{
    T? Data { get; }
    bool HasData { get; }
    bool HasErrors { get; }
    IReadOnlyCollection<IMessageResult> Messages { get; }
}

// Factory methods
BusinessResult<T>.Success(T data);
BusinessResult<T>.Failure(string message);
BusinessResult<T>.Failure(IEnumerable<string> messages);
\`\`\`

### IPagingResult<T>

\`\`\`csharp
public interface IPagingResult<T> : IBusinessResult<IEnumerable<T>>
{
    IPagingCriteria Paging { get; }
    ISummaryResult Summary { get; }
}

public interface IPagingCriteria
{
    int Limit { get; }
    int Offset { get; }
}

public interface ISummaryResult
{
    int TotalCount { get; }
    int TotalPages { get; }
}
\`\`\`

## Common Patterns

### Unit (Void Response)

\`\`\`csharp
/// <summary>
/// Represents a void return type for commands.
/// </summary>
public struct Unit
{
    public static readonly Unit Value = new();
}

// Usage
public record DeleteCustomerCommand(Guid Id) : ICommand<Unit>;
\`\`\`

### Result Pattern

\`\`\`csharp
// Success with data
return BusinessResult<CustomerDto>.Success(customerDto);

// Failure with message
return BusinessResult<CustomerDto>.Failure("Customer not found");

// Failure with multiple messages
return BusinessResult<CustomerDto>.Failure(new[] { "Error 1", "Error 2" });

// Checking result
if (result.HasData)
{
    var customer = result.Data;
}

if (result.HasErrors)
{
    var errors = result.Messages.Where(m => m.Type == MessageType.Error);
}
\`\`\`
`,
  };

  return topics[topic] || `Topic "${topic}" not found. Available topics: ${Object.keys(topics).join(", ")}`;
}
