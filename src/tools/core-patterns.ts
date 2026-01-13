/**
 * Core Patterns Tool
 * 
 * Provides documentation for Mvp24Hours core module patterns.
 */

export const corePatternsSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
        "guard-clauses",
        "value-objects",
        "strongly-typed-ids",
        "functional-patterns",
        "smart-enums",
        "entity-interfaces",
        "infrastructure",
        "exceptions",
      ],
      description: "Core module topic to get documentation for",
    },
  },
  required: [],
};

interface CorePatternsArgs {
  topic?: string;
}

export async function corePatterns(args: unknown): Promise<string> {
  const { topic } = args as CorePatternsArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

function getOverview(): string {
  return `# Mvp24Hours Core Module

## Overview

The Core module provides foundational patterns and abstractions for building robust .NET applications.

## Available Topics

| Topic | Description |
|-------|-------------|
| \`guard-clauses\` | Input validation and defensive programming |
| \`value-objects\` | Immutable domain primitives |
| \`strongly-typed-ids\` | Type-safe entity identifiers |
| \`functional-patterns\` | Result, Option, Either monads |
| \`smart-enums\` | Enumeration classes with behavior |
| \`entity-interfaces\` | Base entity contracts |
| \`infrastructure\` | Infrastructure abstractions |
| \`exceptions\` | Custom exception types |

## Quick Reference

### Entity Base Classes

\`\`\`csharp
using Mvp24Hours.Core.Entities;

// Simple entity with typed ID
public class Customer : EntityBase<Guid>
{
    public string Name { get; set; }
}

// Entity with audit fields
public class Order : EntityBase<int>, IEntityLog
{
    public DateTime Created { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? Modified { get; set; }
    public string ModifiedBy { get; set; }
    public DateTime? Removed { get; set; }
    public string RemovedBy { get; set; }
}
\`\`\`

### Business Result

\`\`\`csharp
using Mvp24Hours.Core.Contract.ValueObjects.Logic;

public IBusinessResult<CustomerDto> GetCustomer(Guid id)
{
    var customer = _repository.GetById(id);
    
    if (customer is null)
        return BusinessResult<CustomerDto>.Failure("Customer not found");
    
    return BusinessResult<CustomerDto>.Success(_mapper.Map<CustomerDto>(customer));
}
\`\`\`

Use \`mvp24h_core_patterns({ topic: "..." })\` for detailed documentation.
`;
}

function getTopicDoc(topic: string): string {
  const topics: Record<string, string> = {
    "guard-clauses": `# Guard Clauses

## Overview

Guard clauses provide defensive programming utilities to validate inputs and fail fast.

## Usage

\`\`\`csharp
using Mvp24Hours.Core.Contract.Infrastructure.Guards;

public class CustomerService
{
    public void CreateCustomer(string name, string email, int age)
    {
        // String guards
        Guard.Against.NullOrEmpty(name, nameof(name));
        Guard.Against.NullOrWhiteSpace(email, nameof(email));
        
        // Numeric guards
        Guard.Against.NegativeOrZero(age, nameof(age));
        Guard.Against.OutOfRange(age, nameof(age), 18, 120);
        
        // Null guards
        Guard.Against.Null(name, nameof(name));
        
        // Pattern guards
        Guard.Against.InvalidEmail(email, nameof(email));
        
        // Custom guard
        Guard.Against.Expression(
            () => name.Length < 2,
            nameof(name),
            "Name must be at least 2 characters");
    }
}
\`\`\`

## Available Guards

| Guard | Description |
|-------|-------------|
| \`Null\` | Value is null |
| \`NullOrEmpty\` | String/collection is null or empty |
| \`NullOrWhiteSpace\` | String is null, empty, or whitespace |
| \`Zero\` | Number equals zero |
| \`Negative\` | Number is negative |
| \`NegativeOrZero\` | Number is negative or zero |
| \`OutOfRange\` | Number outside min/max range |
| \`InvalidEmail\` | String is not valid email format |
| \`InvalidFormat\` | String doesn't match regex pattern |
| \`Expression\` | Custom expression evaluates to true |

## Custom Guards

\`\`\`csharp
public static class CustomGuards
{
    public static void InvalidCPF(this IGuardClause guardClause, string cpf, string parameterName)
    {
        if (!CpfValidator.IsValid(cpf))
        {
            throw new ArgumentException($"Invalid CPF: {cpf}", parameterName);
        }
    }
}

// Usage
Guard.Against.InvalidCPF(cpf, nameof(cpf));
\`\`\`
`,

    "value-objects": `# Value Objects

## Overview

Value Objects are immutable domain primitives that define equality based on their properties, not identity.

## Creating Value Objects

\`\`\`csharp
using Mvp24Hours.Core.ValueObjects;

public record Email
{
    public string Value { get; }

    private Email(string value) => Value = value;

    public static Email Create(string value)
    {
        Guard.Against.NullOrWhiteSpace(value, nameof(value));
        Guard.Against.InvalidEmail(value, nameof(value));
        
        return new Email(value.ToLowerInvariant().Trim());
    }

    public static implicit operator string(Email email) => email.Value;
}

public record Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    private Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public static Money Create(decimal amount, string currency = "BRL")
    {
        Guard.Against.Negative(amount, nameof(amount));
        Guard.Against.NullOrEmpty(currency, nameof(currency));
        
        return new Money(Math.Round(amount, 2), currency.ToUpperInvariant());
    }

    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("Cannot add different currencies");
        
        return Create(Amount + other.Amount, Currency);
    }
}

public record Address
{
    public string Street { get; }
    public string City { get; }
    public string State { get; }
    public string ZipCode { get; }

    private Address(string street, string city, string state, string zipCode)
    {
        Street = street;
        City = city;
        State = state;
        ZipCode = zipCode;
    }

    public static Address Create(string street, string city, string state, string zipCode)
    {
        Guard.Against.NullOrWhiteSpace(street, nameof(street));
        Guard.Against.NullOrWhiteSpace(city, nameof(city));
        Guard.Against.NullOrWhiteSpace(state, nameof(state));
        Guard.Against.NullOrWhiteSpace(zipCode, nameof(zipCode));
        
        return new Address(street, city, state, zipCode);
    }
}
\`\`\`

## Usage in Entities

\`\`\`csharp
public class Customer : EntityBase<Guid>
{
    public string Name { get; private set; }
    public Email Email { get; private set; }
    public Address Address { get; private set; }

    public void UpdateEmail(string email)
    {
        Email = Email.Create(email);
    }
}
\`\`\`

## EF Core Configuration

\`\`\`csharp
public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.OwnsOne(c => c.Email, email =>
        {
            email.Property(e => e.Value)
                .HasColumnName("Email")
                .HasMaxLength(255)
                .IsRequired();
        });

        builder.OwnsOne(c => c.Address, address =>
        {
            address.Property(a => a.Street).HasColumnName("Street").HasMaxLength(200);
            address.Property(a => a.City).HasColumnName("City").HasMaxLength(100);
            address.Property(a => a.State).HasColumnName("State").HasMaxLength(2);
            address.Property(a => a.ZipCode).HasColumnName("ZipCode").HasMaxLength(10);
        });
    }
}
\`\`\`
`,

    "strongly-typed-ids": `# Strongly-Typed IDs

## Overview

Strongly-typed IDs prevent mixing up identifiers of different entity types.

## Creating Strongly-Typed IDs

\`\`\`csharp
using System.Text.Json.Serialization;

// Using record struct for performance
public readonly record struct CustomerId
{
    public Guid Value { get; }

    public CustomerId(Guid value) => Value = value;

    public static CustomerId New() => new(Guid.NewGuid());
    public static CustomerId Empty => new(Guid.Empty);

    public override string ToString() => Value.ToString();

    public static implicit operator Guid(CustomerId id) => id.Value;
    public static explicit operator CustomerId(Guid id) => new(id);
}

public readonly record struct OrderId
{
    public Guid Value { get; }

    public OrderId(Guid value) => Value = value;

    public static OrderId New() => new(Guid.NewGuid());
    public static implicit operator Guid(OrderId id) => id.Value;
}
\`\`\`

## Usage

\`\`\`csharp
public class Customer : EntityBase<CustomerId>
{
    public string Name { get; set; }
}

public class Order : EntityBase<OrderId>
{
    public CustomerId CustomerId { get; set; } // Can't mix with OrderId!
    public decimal Total { get; set; }
}

// Compile-time safety
void ProcessOrder(OrderId orderId, CustomerId customerId)
{
    // Can't accidentally swap parameters
}

// This won't compile:
// ProcessOrder(customerId, orderId); // Error!
\`\`\`

## EF Core Configuration

\`\`\`csharp
public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.Id)
            .HasConversion(
                id => id.Value,
                value => new CustomerId(value));
    }
}
\`\`\`

## JSON Serialization

\`\`\`csharp
public class CustomerIdJsonConverter : JsonConverter<CustomerId>
{
    public override CustomerId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return new CustomerId(reader.GetGuid());
    }

    public override void Write(Utf8JsonWriter writer, CustomerId value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.Value);
    }
}

// Registration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new CustomerIdJsonConverter());
    });
\`\`\`
`,

    "functional-patterns": `# Functional Patterns

## Result Pattern

\`\`\`csharp
using Mvp24Hours.Core.Contract.ValueObjects.Logic;

// Success result
var success = BusinessResult<Customer>.Success(customer);

// Failure result
var failure = BusinessResult<Customer>.Failure("Customer not found");

// With messages
var result = new BusinessResult<Customer>()
    .AddMessage("Warning: Customer has pending orders")
    .SetData(customer);

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

## Option Pattern

\`\`\`csharp
public class Option<T>
{
    private readonly T? _value;
    private readonly bool _hasValue;

    private Option(T value)
    {
        _value = value;
        _hasValue = true;
    }

    private Option()
    {
        _hasValue = false;
    }

    public static Option<T> Some(T value) => new(value);
    public static Option<T> None() => new();

    public bool HasValue => _hasValue;
    public T Value => _hasValue ? _value! : throw new InvalidOperationException("No value");

    public Option<TResult> Map<TResult>(Func<T, TResult> mapper)
        => _hasValue ? Option<TResult>.Some(mapper(_value!)) : Option<TResult>.None();

    public T GetValueOrDefault(T defaultValue)
        => _hasValue ? _value! : defaultValue;

    public Option<T> Where(Func<T, bool> predicate)
        => _hasValue && predicate(_value!) ? this : None();
}

// Usage
public Option<Customer> FindCustomer(Guid id)
{
    var customer = _repository.GetById(id);
    return customer is not null 
        ? Option<Customer>.Some(customer) 
        : Option<Customer>.None();
}

var name = FindCustomer(id)
    .Map(c => c.Name)
    .GetValueOrDefault("Unknown");
\`\`\`

## Either Pattern

\`\`\`csharp
public class Either<TLeft, TRight>
{
    private readonly TLeft? _left;
    private readonly TRight? _right;
    private readonly bool _isRight;

    private Either(TLeft left)
    {
        _left = left;
        _isRight = false;
    }

    private Either(TRight right)
    {
        _right = right;
        _isRight = true;
    }

    public static Either<TLeft, TRight> Left(TLeft value) => new(value);
    public static Either<TLeft, TRight> Right(TRight value) => new(value);

    public TResult Match<TResult>(
        Func<TLeft, TResult> onLeft,
        Func<TRight, TResult> onRight)
        => _isRight ? onRight(_right!) : onLeft(_left!);
}

// Usage: Either<Error, Success>
public Either<string, Customer> CreateCustomer(CreateCustomerRequest request)
{
    if (string.IsNullOrEmpty(request.Name))
        return Either<string, Customer>.Left("Name is required");

    if (EmailExists(request.Email))
        return Either<string, Customer>.Left("Email already exists");

    var customer = new Customer { Name = request.Name, Email = request.Email };
    _repository.Add(customer);

    return Either<string, Customer>.Right(customer);
}

var result = CreateCustomer(request).Match(
    error => BadRequest(error),
    customer => Created(customer)
);
\`\`\`
`,

    "smart-enums": `# Smart Enums

## Overview

Smart enums are classes that behave like enums but can contain behavior and additional data.

## Implementation

\`\`\`csharp
public abstract class SmartEnum<TEnum> where TEnum : SmartEnum<TEnum>
{
    private static readonly Dictionary<int, TEnum> _items = new();
    private static readonly Dictionary<string, TEnum> _itemsByName = new();

    public int Id { get; }
    public string Name { get; }

    protected SmartEnum(int id, string name)
    {
        Id = id;
        Name = name;
        _items[id] = (TEnum)this;
        _itemsByName[name] = (TEnum)this;
    }

    public static IEnumerable<TEnum> GetAll() => _items.Values;
    
    public static TEnum FromId(int id) => _items.TryGetValue(id, out var item) 
        ? item 
        : throw new ArgumentException($"Invalid id: {id}");
    
    public static TEnum FromName(string name) => _itemsByName.TryGetValue(name, out var item) 
        ? item 
        : throw new ArgumentException($"Invalid name: {name}");

    public override string ToString() => Name;
}
\`\`\`

## Usage Examples

\`\`\`csharp
// Order Status with behavior
public class OrderStatus : SmartEnum<OrderStatus>
{
    public static readonly OrderStatus Pending = new(1, "Pending", canCancel: true, canShip: false);
    public static readonly OrderStatus Confirmed = new(2, "Confirmed", canCancel: true, canShip: true);
    public static readonly OrderStatus Shipped = new(3, "Shipped", canCancel: false, canShip: false);
    public static readonly OrderStatus Delivered = new(4, "Delivered", canCancel: false, canShip: false);
    public static readonly OrderStatus Cancelled = new(5, "Cancelled", canCancel: false, canShip: false);

    public bool CanCancel { get; }
    public bool CanShip { get; }

    private OrderStatus(int id, string name, bool canCancel, bool canShip) : base(id, name)
    {
        CanCancel = canCancel;
        CanShip = canShip;
    }

    public OrderStatus? Next() => this switch
    {
        _ when this == Pending => Confirmed,
        _ when this == Confirmed => Shipped,
        _ when this == Shipped => Delivered,
        _ => null
    };
}

// Payment Method with processing logic
public abstract class PaymentMethod : SmartEnum<PaymentMethod>
{
    public static readonly PaymentMethod CreditCard = new CreditCardPayment();
    public static readonly PaymentMethod DebitCard = new DebitCardPayment();
    public static readonly PaymentMethod Pix = new PixPayment();
    public static readonly PaymentMethod BankSlip = new BankSlipPayment();

    protected PaymentMethod(int id, string name) : base(id, name) { }

    public abstract Task<PaymentResult> ProcessAsync(Payment payment);
    public abstract decimal CalculateFee(decimal amount);

    private class CreditCardPayment : PaymentMethod
    {
        public CreditCardPayment() : base(1, "CreditCard") { }
        
        public override decimal CalculateFee(decimal amount) => amount * 0.03m; // 3%
        
        public override async Task<PaymentResult> ProcessAsync(Payment payment)
        {
            // Credit card processing logic
            return new PaymentResult(true, "Approved");
        }
    }

    private class PixPayment : PaymentMethod
    {
        public PixPayment() : base(3, "Pix") { }
        
        public override decimal CalculateFee(decimal amount) => 0; // No fee
        
        public override async Task<PaymentResult> ProcessAsync(Payment payment)
        {
            // PIX processing logic
            return new PaymentResult(true, "Approved");
        }
    }
    
    // ... other payment methods
}

// Usage
var order = new Order { Status = OrderStatus.Pending };

if (order.Status.CanCancel)
{
    order.Status = OrderStatus.Cancelled;
}

var fee = PaymentMethod.CreditCard.CalculateFee(100m); // 3.00
\`\`\`

## EF Core Configuration

\`\`\`csharp
builder.Property(o => o.Status)
    .HasConversion(
        status => status.Id,
        id => OrderStatus.FromId(id));
\`\`\`
`,

    "entity-interfaces": `# Entity Interfaces

## Available Interfaces

### IEntityBase<TKey>

\`\`\`csharp
public interface IEntityBase<TKey>
{
    TKey Id { get; set; }
}

// Usage
public class Customer : IEntityBase<Guid>
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
\`\`\`

### IEntityLog (Audit Fields)

\`\`\`csharp
public interface IEntityLog
{
    DateTime Created { get; set; }
    string? CreatedBy { get; set; }
    DateTime? Modified { get; set; }
    string? ModifiedBy { get; set; }
    DateTime? Removed { get; set; }
    string? RemovedBy { get; set; }
}

// Usage
public class Order : EntityBase<int>, IEntityLog
{
    public string Description { get; set; }
    
    // IEntityLog
    public DateTime Created { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? Modified { get; set; }
    public string? ModifiedBy { get; set; }
    public DateTime? Removed { get; set; }
    public string? RemovedBy { get; set; }
}
\`\`\`

### IEntityLogDate (Date Only)

\`\`\`csharp
public interface IEntityLogDate
{
    DateTime Created { get; set; }
    DateTime? Modified { get; set; }
    DateTime? Removed { get; set; }
}
\`\`\`

### Soft Delete

\`\`\`csharp
// Entities with IEntityLog support soft delete
// Removed field is set instead of physical deletion

public class SoftDeleteRepository<T> where T : class, IEntityLog
{
    public void SoftDelete(T entity)
    {
        entity.Removed = DateTime.UtcNow;
        entity.RemovedBy = _currentUser.Name;
        _context.Update(entity);
    }

    public IQueryable<T> GetActive()
    {
        return _context.Set<T>().Where(e => e.Removed == null);
    }
}
\`\`\`

## EntityBase Classes

\`\`\`csharp
// Simple entity with typed ID
public abstract class EntityBase<TKey> : IEntityBase<TKey>
{
    public virtual TKey Id { get; set; }
}

// Entity with audit (full)
public abstract class EntityBaseLog<TKey, TUserKey> : EntityBase<TKey>, IEntityLog
{
    public DateTime Created { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? Modified { get; set; }
    public string? ModifiedBy { get; set; }
    public DateTime? Removed { get; set; }
    public string? RemovedBy { get; set; }
}

// Entity with date audit only
public abstract class EntityBaseLogDate<TKey> : EntityBase<TKey>, IEntityLogDate
{
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }
    public DateTime? Removed { get; set; }
}
\`\`\`

## Automatic Audit in DbContext

\`\`\`csharp
public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
{
    var entries = ChangeTracker.Entries<IEntityLog>();

    foreach (var entry in entries)
    {
        switch (entry.State)
        {
            case EntityState.Added:
                entry.Entity.Created = DateTime.UtcNow;
                entry.Entity.CreatedBy = _currentUser.Name;
                break;
            case EntityState.Modified:
                entry.Entity.Modified = DateTime.UtcNow;
                entry.Entity.ModifiedBy = _currentUser.Name;
                break;
        }
    }

    return base.SaveChangesAsync(cancellationToken);
}
\`\`\`
`,

    "infrastructure": `# Infrastructure Abstractions

## Repository Interfaces

\`\`\`csharp
// Synchronous repository
public interface IRepository<TEntity> where TEntity : class
{
    TEntity GetById(object id);
    IEnumerable<TEntity> GetAll();
    IEnumerable<TEntity> GetBy(Expression<Func<TEntity, bool>> predicate);
    void Add(TEntity entity);
    void AddRange(IEnumerable<TEntity> entities);
    void Modify(TEntity entity);
    void Remove(TEntity entity);
    void RemoveRange(IEnumerable<TEntity> entities);
    int Count(Expression<Func<TEntity, bool>> predicate = null);
    bool Any(Expression<Func<TEntity, bool>> predicate = null);
}

// Asynchronous repository
public interface IRepositoryAsync<TEntity> : IRepository<TEntity> where TEntity : class
{
    Task<TEntity> GetByIdAsync(object id, CancellationToken cancellationToken = default);
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<TEntity>> GetByAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default);
    Task ModifyAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task RemoveAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate = null, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate = null, CancellationToken cancellationToken = default);
}
\`\`\`

## Unit of Work

\`\`\`csharp
public interface IUnitOfWork : IDisposable
{
    IRepository<TEntity> GetRepository<TEntity>() where TEntity : class;
    int SaveChanges();
}

public interface IUnitOfWorkAsync : IUnitOfWork
{
    new IRepositoryAsync<TEntity> GetRepository<TEntity>() where TEntity : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
\`\`\`

## Specification Pattern

\`\`\`csharp
public interface ISpecificationQuery<TEntity>
{
    Expression<Func<TEntity, bool>> IsSatisfiedByExpression { get; }
}

public interface ISpecificationQueryOrder<TEntity> : ISpecificationQuery<TEntity>
{
    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> OrderBy { get; }
}

// Usage
public class ActiveCustomersSpec : ISpecificationQuery<Customer>
{
    public Expression<Func<Customer, bool>> IsSatisfiedByExpression 
        => customer => customer.Active && customer.Removed == null;
}
\`\`\`

## Business Result

\`\`\`csharp
public interface IBusinessResult<T>
{
    T Data { get; }
    bool HasData { get; }
    bool HasErrors { get; }
    IReadOnlyCollection<IMessageResult> Messages { get; }
}

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
`,

    "exceptions": `# Custom Exceptions

## Mvp24Hours Exceptions

\`\`\`csharp
using Mvp24Hours.Core.Contract.Infrastructure.Exceptions;

// Base exception
public class Mvp24HoursException : Exception
{
    public Mvp24HoursException(string message) : base(message) { }
    public Mvp24HoursException(string message, Exception innerException) : base(message, innerException) { }
}

// Validation exception
public class ValidationException : Mvp24HoursException
{
    public IEnumerable<ValidationError> Errors { get; }

    public ValidationException(IEnumerable<ValidationError> errors)
        : base("Validation failed")
    {
        Errors = errors;
    }
}

// Not found exception
public class NotFoundException : Mvp24HoursException
{
    public string EntityName { get; }
    public object Id { get; }

    public NotFoundException(string entityName, object id)
        : base($"{entityName} with id {id} was not found")
    {
        EntityName = entityName;
        Id = id;
    }
}

// Business rule exception
public class BusinessRuleException : Mvp24HoursException
{
    public string RuleName { get; }

    public BusinessRuleException(string ruleName, string message)
        : base(message)
    {
        RuleName = ruleName;
    }
}
\`\`\`

## Creating Custom Exceptions

\`\`\`csharp
public class InsufficientFundsException : Mvp24HoursException
{
    public decimal Requested { get; }
    public decimal Available { get; }

    public InsufficientFundsException(decimal requested, decimal available)
        : base($"Insufficient funds. Requested: {requested:C}, Available: {available:C}")
    {
        Requested = requested;
        Available = available;
    }
}

public class DuplicateEmailException : Mvp24HoursException
{
    public string Email { get; }

    public DuplicateEmailException(string email)
        : base($"Email {email} is already registered")
    {
        Email = email;
    }
}
\`\`\`

## Global Exception Handler

\`\`\`csharp
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            ValidationException validationEx => (
                StatusCodes.Status400BadRequest,
                new { errors = validationEx.Errors }),
            NotFoundException notFoundEx => (
                StatusCodes.Status404NotFound,
                new { message = notFoundEx.Message }),
            BusinessRuleException businessEx => (
                StatusCodes.Status422UnprocessableEntity,
                new { rule = businessEx.RuleName, message = businessEx.Message }),
            _ => (
                StatusCodes.Status500InternalServerError,
                new { message = "An unexpected error occurred" })
        };

        _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        
        await context.Response.WriteAsJsonAsync(message);
    }
}

// Registration
app.UseMiddleware<GlobalExceptionMiddleware>();
\`\`\`
`,
  };

  return topics[topic] || `Topic "${topic}" not found. Available topics: ${Object.keys(topics).join(", ")}`;
}
