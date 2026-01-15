# Quick Reference - Mvp24Hours Interfaces

This document provides a comprehensive reference of all main interfaces and classes in the Mvp24Hours framework.

## Table of Contents

- [CQRS/Mediator Interfaces](#cqrsmediator-interfaces)
- [Repository Interfaces](#repository-interfaces)
- [Entity Base Classes](#entity-base-classes)
- [Business Result Types](#business-result-types)
- [Pipeline Interfaces](#pipeline-interfaces)
- [Infrastructure Abstractions](#infrastructure-abstractions)
- [Marker Interfaces](#marker-interfaces)

---

## CQRS/Mediator Interfaces

**Namespace:** `Mvp24Hours.Infrastructure.Cqrs.Abstractions`  
**Package:** `Mvp24Hours.Infrastructure.Cqrs`

### Main Interfaces

| Interface | Namespace | Description |
|-----------|-----------|-------------|
| `IMediator` | `Mvp24Hours.Infrastructure.Cqrs.Abstractions` | Main interface combining ISender, IPublisher, IStreamSender |
| `ISender` | `Mvp24Hours.Infrastructure.Cqrs.Abstractions` | Sends commands/queries to handlers |
| `IPublisher` | `Mvp24Hours.Infrastructure.Cqrs.Abstractions` | Publishes notifications to multiple handlers |
| `IStreamSender` | `Mvp24Hours.Infrastructure.Cqrs.Abstractions` | Sends requests that return async streams |

### Request Abstractions

| Interface | Description | Example |
|-----------|-------------|---------|
| `IMediatorRequest<TResponse>` | Base request with response | `public record MyRequest : IMediatorRequest<MyResponse>` |
| `IMediatorRequest` | Base request returning `Unit` | `public record VoidRequest : IMediatorRequest` |
| `IMediatorCommand<TResponse>` | Command with response | `public record CreateOrderCommand : IMediatorCommand<OrderDto>` |
| `IMediatorCommand` | Command without response | `public record DeleteOrderCommand : IMediatorCommand` |
| `IMediatorQuery<TResponse>` | Query with response | `public record GetOrderQuery : IMediatorQuery<OrderDto>` |
| `IStreamRequest<TResponse>` | Streaming request | `public record StreamOrdersRequest : IStreamRequest<OrderDto>` |

### Handler Interfaces

| Interface | Description | Example |
|-----------|-------------|---------|
| `IMediatorRequestHandler<TRequest, TResponse>` | Base handler for requests | Handler for any request type |
| `IMediatorCommandHandler<TCommand, TResponse>` | Handler for commands with response | Handler for commands returning data |
| `IMediatorCommandHandler<TCommand>` | Handler for commands without response | Handler for void commands |
| `IMediatorQueryHandler<TQuery, TResponse>` | Handler for queries | Handler for read operations |
| `IStreamRequestHandler<TRequest, TResponse>` | Handler for streaming requests | Handler returning `IAsyncEnumerable` |

### Command Handler Example

```csharp
public record CreateOrderCommand(string CustomerId, List<OrderItemDto> Items) 
    : IMediatorCommand<IBusinessResult<OrderDto>>;

public class CreateOrderHandler 
    : IMediatorCommandHandler<CreateOrderCommand, IBusinessResult<OrderDto>>
{
    public async Task<IBusinessResult<OrderDto>> Handle(
        CreateOrderCommand request, 
        CancellationToken cancellationToken)
    {
        // Implementation
        return new BusinessResult<OrderDto>(orderDto);
    }
}
```

### Query Handler Example

```csharp
public record GetOrderByIdQuery(Guid OrderId) 
    : IMediatorQuery<IBusinessResult<OrderDto>>;

public class GetOrderByIdHandler 
    : IMediatorQueryHandler<GetOrderByIdQuery, IBusinessResult<OrderDto>>
{
    public async Task<IBusinessResult<OrderDto>> Handle(
        GetOrderByIdQuery request, 
        CancellationToken cancellationToken)
    {
        // Implementation
        return new BusinessResult<OrderDto>(orderDto);
    }
}
```

### Notification Interfaces

| Interface | Description | Example |
|-----------|-------------|---------|
| `IMediatorNotification` | Base notification interface | In-process notification |
| `IMediatorNotificationHandler<TNotification>` | Handler for notifications | Multiple handlers can subscribe |

### Domain Event Interfaces

| Interface | Description |
|-----------|-------------|
| `IDomainEvent` | Domain event (extends `IMediatorNotification`) |
| `IDomainEventHandler<TEvent>` | Handler for domain events |
| `IHasDomainEvents` | Entity with domain events |
| `IDomainEventDispatcher` | Dispatches domain events |

### Integration Event Interfaces

| Interface | Description |
|-----------|-------------|
| `IIntegrationEvent` | Cross-boundary event with Id, OccurredOn, CorrelationId |
| `IIntegrationEventHandler<TEvent>` | Handler for integration events |
| `IIntegrationEventOutbox` | Outbox pattern for reliable event publishing |
| `IIntegrationEventPublisher` | Publishes integration events |

### Pipeline Behavior

| Interface | Description |
|-----------|-------------|
| `IPipelineBehavior<TRequest, TResponse>` | Cross-cutting concern middleware |
| `RequestHandlerDelegate<TResponse>` | Delegate to next handler in pipeline |

```csharp
public class LoggingBehavior<TRequest, TResponse> 
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IMediatorRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Before
        var response = await next();
        // After
        return response;
    }
}
```

---

## Repository Interfaces

**Namespace:** `Mvp24Hours.Core.Contract.Data`  
**Package:** `Mvp24Hours.Infrastructure.Data.EFCore` or `Mvp24Hours.Infrastructure.Data.MongoDb`

### Main Interfaces

| Interface | Description |
|-----------|-------------|
| `IRepository<TEntity>` | Synchronous repository |
| `IRepositoryAsync<TEntity>` | Asynchronous repository |
| `IUnitOfWork` | Synchronous unit of work |
| `IUnitOfWorkAsync` | Asynchronous unit of work |

### IRepository Methods

```csharp
// Query methods (IQuery / IQueryAsync)
bool ListAny();                                                          // async: ListAnyAsync
int ListCount();                                                         // async: ListCountAsync
IList<TEntity> List();                                                   // async: ListAsync
IList<TEntity> List(IPagingCriteria criteria);                          // async: ListAsync
bool GetByAny(Expression<Func<TEntity, bool>> clause);                  // async: GetByAnyAsync
int GetByCount(Expression<Func<TEntity, bool>> clause);                 // async: GetByCountAsync
IList<TEntity> GetBy(Expression<Func<TEntity, bool>> clause);           // async: GetByAsync
IList<TEntity> GetBy(Expression<Func<TEntity, bool>> clause, IPagingCriteria criteria);
TEntity GetById(object id);                                              // async: GetByIdAsync
TEntity GetById(object id, IPagingCriteria criteria);                   // async: GetByIdAsync

// Command methods (ICommand / ICommandAsync)
void Add(TEntity entity);                                                // async: AddAsync
void Add(IList<TEntity> entities);                                      // async: AddAsync
void Modify(TEntity entity);                                             // async: ModifyAsync
void Modify(IList<TEntity> entities);                                   // async: ModifyAsync
void Remove(TEntity entity);                                             // async: RemoveAsync
void Remove(IList<TEntity> entities);                                   // async: RemoveAsync
void RemoveById(object id);                                              // async: RemoveByIdAsync
void RemoveById(IList<object> ids);                                     // async: RemoveByIdAsync

// Relation methods (IRelation / IRelationAsync)
void LoadRelation<TProperty>(TEntity entity, Expression<Func<TEntity, TProperty>> propertyExpression);
void LoadRelation<TProperty>(TEntity entity, Expression<Func<TEntity, IEnumerable<TProperty>>> propertyExpression, 
    Expression<Func<TProperty, bool>> clause = null, int limit = 0);
```

### IUnitOfWork Methods

```csharp
// IUnitOfWork / IUnitOfWorkAsync
int SaveChanges(CancellationToken cancellationToken = default);         // async: SaveChangesAsync
void Rollback();                                                         // async: RollbackAsync
IRepository<T> GetRepository<T>() where T : class, IEntityBase;
IDbConnection GetConnection();
```

### Usage Example

```csharp
public class OrderService
{
    private readonly IUnitOfWorkAsync _unitOfWork;

    public OrderService(IUnitOfWorkAsync unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Order> GetOrderAsync(Guid id)
    {
        var repository = _unitOfWork.GetRepository<Order>();
        return await repository.GetByIdAsync(id);
    }

    public async Task CreateOrderAsync(Order order)
    {
        var repository = _unitOfWork.GetRepository<Order>();
        await repository.AddAsync(order);
        await _unitOfWork.SaveChangesAsync();
    }
}
```

---

## Entity Base Classes

**Namespace:** `Mvp24Hours.Core.Entities`  
**Package:** `Mvp24Hours.Core`

### Entity Interfaces

| Interface | Description |
|-----------|-------------|
| `IEntity<TId>` | Base interface with strongly-typed ID |
| `IAuditableEntity` | Tracks CreatedAt, CreatedBy, ModifiedAt, ModifiedBy |
| `ISoftDeletable` | Supports logical deletion (IsDeleted, DeletedAt, DeletedBy) |
| `ITenantEntity` | Multi-tenancy support (TenantId) |
| `IVersionedEntity` | Optimistic concurrency (RowVersion) |

### Base Classes

| Class | Description |
|-------|-------------|
| `EntityBase<TId>` | Base entity with ID and equality |
| `AuditableEntity<TId>` | Entity with audit tracking |
| `SoftDeletableEntity<TId>` | Entity with soft delete |
| `AuditableGuidEntity` | Convenience class with Guid ID |
| `AuditableIntEntity` | Convenience class with int ID |
| `AuditableLongEntity` | Convenience class with long ID |

### Entity Interface Definitions

```csharp
public interface IEntity<TId> where TId : IEquatable<TId>
{
    TId Id { get; }
}

public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    string CreatedBy { get; set; }
    DateTime? ModifiedAt { get; set; }
    string ModifiedBy { get; set; }
}

public interface ISoftDeletable
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
    string? DeletedBy { get; set; }
}

public interface ITenantEntity
{
    string TenantId { get; set; }
}

public interface IVersionedEntity
{
    byte[] RowVersion { get; set; }
}
```

### Entity Example

```csharp
public class Customer : AuditableEntity<Guid>, ISoftDeletable, ITenantEntity
{
    public string Name { get; private set; }
    public string Email { get; private set; }
    
    // ISoftDeletable
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
    
    // ITenantEntity
    public string TenantId { get; set; } = string.Empty;
    
    public Customer(string name, string email)
    {
        Id = Guid.NewGuid();
        Name = name;
        Email = email;
    }
}
```

---

## Business Result Types

**Namespace:** `Mvp24Hours.Core.Contract.ValueObjects.Logic`  
**Package:** `Mvp24Hours.Core`

### Main Interfaces

| Interface | Description |
|-----------|-------------|
| `IBusinessResult<T>` | Result of business operation |
| `IPagingResult<T>` | Paginated result |
| `IMessageResult` | Single message in result |
| `IStructuredMessageResult` | Structured message with code and details |

### BusinessResult Class

```csharp
public class BusinessResult<T> : IBusinessResult<T>
{
    public T? Data { get; set; }
    public bool HasErrors { get; }
    public IReadOnlyList<IMessageResult> Messages { get; }
    
    // Methods
    public BusinessResult<T> SetSuccess();
    public BusinessResult<T> AddMessage(string message);
    public BusinessResult<T> AddMessage(IMessageResult message);
}
```

### Usage Example

```csharp
public async Task<IBusinessResult<CustomerDto>> GetCustomerAsync(Guid id)
{
    var customer = await _repository.GetByIdAsync(id);
    
    if (customer == null)
    {
        return new BusinessResult<CustomerDto>()
            .AddMessage(StructuredMessageResult.NotFound("Customer", id));
    }
    
    var dto = _mapper.Map<CustomerDto>(customer);
    return new BusinessResult<CustomerDto>(dto).SetSuccess();
}

public async Task<IBusinessResult<OrderDto>> CreateOrderAsync(CreateOrderDto dto)
{
    var validation = await _validator.ValidateAsync(dto);
    if (!validation.IsValid)
    {
        return BusinessResultFactory.ValidationFailure<OrderDto>(validation.Errors);
    }
    
    var order = new Order(dto.CustomerId, dto.Items);
    await _repository.AddAsync(order);
    await _unitOfWork.SaveChangesAsync();
    
    return BusinessResultFactory.Success(_mapper.Map<OrderDto>(order));
}
```

### IPagingResult

```csharp
public interface IPagingResult<T> : IBusinessResult<T>
{
    int TotalCount { get; }
    int PageNumber { get; }
    int PageSize { get; }
    int TotalPages { get; }
    bool HasPreviousPage { get; }
    bool HasNextPage { get; }
}
```

### Service Methods with BusinessResult

```csharp
// Service interface pattern
public interface ICustomerService
{
    Task<IBusinessResult<IList<CustomerDto>>> GetAllAsync();
    Task<IBusinessResult<CustomerDto>> GetByIdAsync(int id);
    Task<IBusinessResult<CustomerDto>> CreateAsync(CustomerCreateDto dto);
    Task<IBusinessResult<CustomerDto>> UpdateAsync(int id, CustomerUpdateDto dto);
    Task<IBusinessResult<bool>> DeleteAsync(int id);
    Task<IPagingResult<IList<CustomerDto>>> GetWithPaginationAsync(int page, int limit);
}
```

---

## Pipeline Interfaces

**Namespace:** `Mvp24Hours.Core.Contract.Infrastructure.Pipe`  
**Package:** `Mvp24Hours.Infrastructure.Pipe`

### Main Interfaces

| Interface | Description |
|-----------|-------------|
| `IPipeline` | Synchronous pipeline |
| `IPipelineAsync` | Asynchronous pipeline |
| `IOperation` | Synchronous operation/filter |
| `IOperationAsync` | Asynchronous operation/filter |
| `IPipelineMessage` | Message/packet passing through pipeline |
| `IPipelineBuilder` | Builder for pipeline operations |
| `IPipelineBuilderAsync` | Async builder for pipeline operations |

### Base Classes

| Class | Description |
|-------|-------------|
| `OperationBase` | Base class for sync operations |
| `OperationBaseAsync` | Base class for async operations |
| `PipelineMessage` | Default message implementation |

### Operation Example

```csharp
public class ValidateOrderOperation : OperationBaseAsync
{
    public override bool IsRequired => true;
    
    public override async Task ExecuteAsync(IPipelineMessage input)
    {
        var order = input.GetContent<Order>();
        
        if (order == null)
        {
            input.SetFailure();
            input.AddContent("error", "Order not found");
            return;
        }
        
        // Validation logic
        await Task.CompletedTask;
    }
    
    public override async Task RollbackAsync(IPipelineMessage input)
    {
        // Undo logic if needed
        await Task.CompletedTask;
    }
}
```

### Pipeline Usage

```csharp
// Configure
builder.Services.AddMvp24HoursPipelineAsync(options =>
{
    options.IsBreakOnFail = true;
});

// Use
var pipeline = serviceProvider.GetService<IPipelineAsync>();
pipeline.Add<ValidateOrderOperation>();
pipeline.Add<ProcessPaymentOperation>();
pipeline.Add<CreateShipmentOperation>();

var message = new PipelineMessage();
message.AddContent(order);
await pipeline.ExecuteAsync(message);

var result = pipeline.GetMessage();
if (result.IsFaulty)
{
    // Handle error
}
```

---

## Infrastructure Abstractions

**Namespace:** `Mvp24Hours.Core.Contract.Infrastructure`  
**Package:** `Mvp24Hours.Core`

### Main Interfaces

| Interface | Description |
|-----------|-------------|
| `IClock` | Abstracts system time for testability |
| `IGuidGenerator` | Abstracts GUID generation |
| `ICurrentUserProvider` | Current user context |
| `ITenantProvider` | Multi-tenant context |

### Interface Definitions

```csharp
public interface IClock
{
    DateTime UtcNow { get; }
    DateTime Now { get; }
    DateTime UtcToday { get; }
    DateTime Today { get; }
    DateTimeOffset UtcNowOffset { get; }
    DateTimeOffset NowOffset { get; }
}

public interface IGuidGenerator
{
    Guid NewGuid();
}

public interface ICurrentUserProvider
{
    string UserId { get; }
    string UserName { get; }
    IEnumerable<string> Roles { get; }
    bool IsAuthenticated { get; }
}

public interface ITenantProvider
{
    string TenantId { get; }
    string TenantName { get; }
}
```

### Usage Example

```csharp
public class OrderService
{
    private readonly IClock _clock;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ICurrentUserProvider _userProvider;
    
    public OrderService(IClock clock, IGuidGenerator guidGenerator, ICurrentUserProvider userProvider)
    {
        _clock = clock;
        _guidGenerator = guidGenerator;
        _userProvider = userProvider;
    }
    
    public Order CreateOrder(CreateOrderDto dto)
    {
        return new Order
        {
            Id = _guidGenerator.NewGuid(),
            CreatedAt = _clock.UtcNow,
            CreatedBy = _userProvider.UserId,
            ExpiresAt = _clock.UtcNow.AddDays(30)
        };
    }
}
```

---

## Marker Interfaces

**Namespace:** `Mvp24Hours.Infrastructure.Cqrs.Abstractions`  
**Package:** `Mvp24Hours.Infrastructure.Cqrs`

| Interface | Description | Properties |
|-----------|-------------|------------|
| `ITransactional` | Marks command for transaction behavior | - |
| `ICacheableRequest` | Marks request for caching | `CacheKey`, `AbsoluteExpiration`, `SlidingExpiration` |
| `ICacheInvalidator` | Marks command to invalidate cache | `CacheKeysToInvalidate` |
| `IAuthorized` | Marks request for authorization | `RequiredRoles`, `RequiredPolicies` |
| `IRetryable` | Marks request for retry behavior | `MaxRetryAttempts`, `BaseDelayMilliseconds` |
| `IIdempotentCommand` | Marks command for idempotency | `IdempotencyKey` |

### Marker Interface Example

```csharp
public record CreateOrderCommand(string CustomerId, List<OrderItemDto> Items) 
    : IMediatorCommand<IBusinessResult<OrderDto>>, 
      ITransactional, 
      IIdempotentCommand
{
    public string? IdempotencyKey { get; init; }
}

public record GetOrdersQuery(int Page, int PageSize) 
    : IMediatorQuery<IBusinessResult<IList<OrderDto>>>, 
      ICacheableRequest
{
    public string CacheKey => $"orders:page:{Page}:size:{PageSize}";
    public TimeSpan? AbsoluteExpiration => TimeSpan.FromMinutes(5);
    public TimeSpan? SlidingExpiration => null;
}
```

---

## Unit Type

**Namespace:** `Mvp24Hours.Infrastructure.Cqrs.Abstractions`

```csharp
public readonly struct Unit : IEquatable<Unit>
{
    public static readonly Unit Value = new();
    
    public bool Equals(Unit other) => true;
    public override bool Equals(object? obj) => obj is Unit;
    public override int GetHashCode() => 0;
    public override string ToString() => "()";
}
```

Use `Unit` as the response type for commands that don't return a value:

```csharp
public record DeleteOrderCommand(Guid OrderId) : IMediatorCommand; // Returns Unit

public class DeleteOrderHandler : IMediatorCommandHandler<DeleteOrderCommand>
{
    public async Task<Unit> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
    {
        // Delete logic
        return Unit.Value;
    }
}
```

---

## See Also

- [CQRS Guide](../cqrs/home.md)
- [Database Patterns](database-patterns.md)
- [Repository Pattern](../database/use-repository.md)
- [Entity Interfaces](../core/entity-interfaces.md)
- [Pipeline Documentation](../pipeline.md)
- [NuGet Packages Reference](nuget-packages.md)
