/**
 * Reference Guide Tool
 * 
 * Provides documentation for Mapping, Validation, Specification, and other reference topics.
 */

export const referenceGuideSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
        "mapping",
        "validation",
        "specification",
        "documentation",
        "migration",
      ],
      description: "Reference topic to get documentation for",
    },
  },
  required: [],
};

interface ReferenceGuideArgs {
  topic?: string;
}

export async function referenceGuide(args: unknown): Promise<string> {
  const { topic } = args as ReferenceGuideArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

function getOverview(): string {
  return `# Reference Guide

## Available Topics

| Topic | Description |
|-------|-------------|
| \`mapping\` | AutoMapper configuration and usage |
| \`validation\` | FluentValidation patterns |
| \`specification\` | Specification pattern implementation |
| \`documentation\` | XML documentation and Swagger |
| \`migration\` | Database migrations with EF Core |

## Quick Reference

### Mapping (AutoMapper)
Object-to-object mapping between entities and DTOs.

### Validation (FluentValidation)
Declarative validation rules for DTOs and commands.

### Specification
Query specifications for complex filtering.

Use \`mvp24h_reference_guide({ topic: "..." })\` for detailed documentation.
`;
}

function getTopicDoc(topic: string): string {
  const topics: Record<string, string> = {
    mapping: `# AutoMapper Configuration

## Installation

\`\`\`bash
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
\`\`\`

## Profile Definition

\`\`\`csharp
using AutoMapper;

public class CustomerProfile : Profile
{
    public CustomerProfile()
    {
        // Entity to DTO
        CreateMap<Customer, CustomerDto>();
        
        // DTO to Entity
        CreateMap<CreateCustomerDto, Customer>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Active, opt => opt.MapFrom(_ => true));
        
        // Update mapping (ignore nulls)
        CreateMap<UpdateCustomerDto, Customer>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer.Name))
            .ForMember(dest => dest.ItemCount, opt => opt.MapFrom(src => src.Items.Count))
            .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Items.Sum(i => i.Price * i.Quantity)));

        CreateMap<OrderItem, OrderItemDto>();
    }
}
\`\`\`

## Registration

\`\`\`csharp
// Program.cs
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Or specify assemblies
builder.Services.AddAutoMapper(
    typeof(CustomerProfile).Assembly,
    typeof(OrderProfile).Assembly
);
\`\`\`

## Usage

### In Services

\`\`\`csharp
public class CustomerService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWorkAsync _uow;

    public CustomerService(IMapper mapper, IUnitOfWorkAsync uow)
    {
        _mapper = mapper;
        _uow = uow;
    }

    public async Task<CustomerDto> GetByIdAsync(Guid id)
    {
        var repo = _uow.GetRepository<Customer>();
        var customer = await repo.GetByIdAsync(id);
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto)
    {
        var customer = _mapper.Map<Customer>(dto);
        
        var repo = _uow.GetRepository<Customer>();
        await repo.AddAsync(customer);
        await _uow.SaveChangesAsync();
        
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> UpdateAsync(Guid id, UpdateCustomerDto dto)
    {
        var repo = _uow.GetRepository<Customer>();
        var customer = await repo.GetByIdAsync(id);
        
        _mapper.Map(dto, customer); // Update existing entity
        
        await repo.ModifyAsync(customer);
        await _uow.SaveChangesAsync();
        
        return _mapper.Map<CustomerDto>(customer);
    }
}
\`\`\`

### Paging Results

\`\`\`csharp
using Mvp24Hours.Extensions;

public async Task<IPagingResult<CustomerDto>> GetAllAsync(int page, int limit)
{
    var repo = _uow.GetRepository<Customer>();
    var result = await repo.ToBusinessPagingAsync(page, limit);
    
    // Map paging result
    return result.MapPagingTo<Customer, CustomerDto>(_mapper);
}
\`\`\`

## Advanced Mappings

### Value Resolver

\`\`\`csharp
public class FullNameResolver : IValueResolver<Customer, CustomerDto, string>
{
    public string Resolve(Customer source, CustomerDto destination, string destMember, ResolutionContext context)
    {
        return $"{source.FirstName} {source.LastName}";
    }
}

// In profile
CreateMap<Customer, CustomerDto>()
    .ForMember(dest => dest.FullName, opt => opt.MapFrom<FullNameResolver>());
\`\`\`

### Type Converter

\`\`\`csharp
public class MoneyToDecimalConverter : ITypeConverter<Money, decimal>
{
    public decimal Convert(Money source, decimal destination, ResolutionContext context)
    {
        return source.Amount;
    }
}

// Registration
CreateMap<Money, decimal>().ConvertUsing<MoneyToDecimalConverter>();
\`\`\`

### Conditional Mapping

\`\`\`csharp
CreateMap<Order, OrderDto>()
    .ForMember(dest => dest.ShippingAddress, opt => 
        opt.Condition(src => src.Status != OrderStatus.Cancelled));
\`\`\`
`,

    validation: `# FluentValidation

## Installation

\`\`\`bash
dotnet add package FluentValidation
dotnet add package FluentValidation.AspNetCore
\`\`\`

## Basic Validator

\`\`\`csharp
using FluentValidation;

public class CreateCustomerValidator : AbstractValidator<CreateCustomerDto>
{
    public CreateCustomerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MinimumLength(2).WithMessage("Name must be at least 2 characters")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.BirthDate)
            .NotEmpty().WithMessage("Birth date is required")
            .LessThan(DateTime.Today).WithMessage("Birth date must be in the past")
            .Must(BeAtLeast18).WithMessage("Customer must be at least 18 years old");

        RuleFor(x => x.Phone)
            .Matches(@"^\\d{10,11}$").WithMessage("Invalid phone format")
            .When(x => !string.IsNullOrEmpty(x.Phone));
    }

    private bool BeAtLeast18(DateTime birthDate)
    {
        return birthDate <= DateTime.Today.AddYears(-18);
    }
}
\`\`\`

## Async Validation

\`\`\`csharp
public class CreateCustomerValidator : AbstractValidator<CreateCustomerDto>
{
    private readonly IUnitOfWorkAsync _uow;

    public CreateCustomerValidator(IUnitOfWorkAsync uow)
    {
        _uow = uow;

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MustAsync(BeUniqueEmail).WithMessage("Email already exists");

        RuleFor(x => x.Cpf)
            .NotEmpty()
            .Must(BeValidCpf).WithMessage("Invalid CPF")
            .MustAsync(BeUniqueCpf).WithMessage("CPF already registered");
    }

    private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        var repo = _uow.GetRepository<Customer>();
        var exists = await repo.AnyAsync(c => c.Email == email, cancellationToken);
        return !exists;
    }

    private bool BeValidCpf(string cpf)
    {
        // CPF validation logic
        return CpfValidator.IsValid(cpf);
    }

    private async Task<bool> BeUniqueCpf(string cpf, CancellationToken cancellationToken)
    {
        var repo = _uow.GetRepository<Customer>();
        return !await repo.AnyAsync(c => c.Cpf == cpf, cancellationToken);
    }
}
\`\`\`

## Nested Validation

\`\`\`csharp
public class CreateOrderValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty().WithMessage("Customer is required");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Order must have at least one item");

        RuleForEach(x => x.Items)
            .SetValidator(new OrderItemValidator());

        RuleFor(x => x.ShippingAddress)
            .SetValidator(new AddressValidator())
            .When(x => x.RequiresShipping);
    }
}

public class OrderItemValidator : AbstractValidator<OrderItemDto>
{
    public OrderItemValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product is required");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Maximum quantity is 100");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");
    }
}
\`\`\`

## Registration

\`\`\`csharp
// Program.cs

// Register all validators from assembly
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Or register individually
builder.Services.AddScoped<IValidator<CreateCustomerDto>, CreateCustomerValidator>();
\`\`\`

## Usage

### Manual Validation

\`\`\`csharp
public class CustomerService
{
    private readonly IValidator<CreateCustomerDto> _validator;

    public async Task<IBusinessResult<CustomerDto>> CreateAsync(CreateCustomerDto dto)
    {
        var validation = await _validator.ValidateAsync(dto);
        
        if (!validation.IsValid)
        {
            var errors = validation.Errors.Select(e => e.ErrorMessage);
            return BusinessResult<CustomerDto>.Failure(errors);
        }

        // Continue with creation...
    }
}
\`\`\`

### Automatic Validation (ASP.NET Core)

\`\`\`csharp
// Program.cs
builder.Services.AddFluentValidationAutoValidation();

// Controller - validation happens automatically
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto)
{
    // If validation fails, returns 400 automatically
    
    var result = await _service.CreateAsync(dto);
    return Ok(result);
}
\`\`\`

## Custom Validators

\`\`\`csharp
public static class CustomValidators
{
    public static IRuleBuilderOptions<T, string> ValidCpf<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder
            .Must(CpfValidator.IsValid)
            .WithMessage("Invalid CPF");
    }

    public static IRuleBuilderOptions<T, string> ValidCnpj<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder
            .Must(CnpjValidator.IsValid)
            .WithMessage("Invalid CNPJ");
    }
}

// Usage
RuleFor(x => x.Cpf).ValidCpf();
RuleFor(x => x.Cnpj).ValidCnpj();
\`\`\`
`,

    specification: `# Specification Pattern

## Overview

The Specification pattern encapsulates query logic for reuse.

## Basic Specification

\`\`\`csharp
using Mvp24Hours.Core.Contract.Domain;
using System.Linq.Expressions;

public class ActiveCustomersSpec : ISpecificationQuery<Customer>
{
    public Expression<Func<Customer, bool>> IsSatisfiedByExpression 
        => customer => customer.Active && customer.Removed == null;
}

public class CustomerByEmailSpec : ISpecificationQuery<Customer>
{
    private readonly string _email;

    public CustomerByEmailSpec(string email)
    {
        _email = email.ToLowerInvariant();
    }

    public Expression<Func<Customer, bool>> IsSatisfiedByExpression 
        => customer => customer.Email.ToLower() == _email;
}
\`\`\`

## Filter Specification

\`\`\`csharp
public class CustomerFilterSpec : ISpecificationQuery<Customer>
{
    private readonly CustomerFilterDto _filter;

    public CustomerFilterSpec(CustomerFilterDto filter)
    {
        _filter = filter;
    }

    public Expression<Func<Customer, bool>> IsSatisfiedByExpression
    {
        get
        {
            return customer =>
                (string.IsNullOrEmpty(_filter.Name) || customer.Name.Contains(_filter.Name)) &&
                (string.IsNullOrEmpty(_filter.Email) || customer.Email.Contains(_filter.Email)) &&
                (!_filter.Active.HasValue || customer.Active == _filter.Active.Value) &&
                (!_filter.CreatedFrom.HasValue || customer.Created >= _filter.CreatedFrom.Value) &&
                (!_filter.CreatedTo.HasValue || customer.Created <= _filter.CreatedTo.Value);
        }
    }
}
\`\`\`

## Ordered Specification

\`\`\`csharp
public class RecentCustomersSpec : ISpecificationQueryOrder<Customer>
{
    private readonly int _days;

    public RecentCustomersSpec(int days = 30)
    {
        _days = days;
    }

    public Expression<Func<Customer, bool>> IsSatisfiedByExpression
        => customer => customer.Created >= DateTime.UtcNow.AddDays(-_days);

    public Func<IQueryable<Customer>, IOrderedQueryable<Customer>> OrderBy
        => query => query.OrderByDescending(c => c.Created);
}
\`\`\`

## Composite Specifications

\`\`\`csharp
public static class SpecificationExtensions
{
    public static ISpecificationQuery<T> And<T>(
        this ISpecificationQuery<T> left,
        ISpecificationQuery<T> right)
    {
        return new AndSpecification<T>(left, right);
    }

    public static ISpecificationQuery<T> Or<T>(
        this ISpecificationQuery<T> left,
        ISpecificationQuery<T> right)
    {
        return new OrSpecification<T>(left, right);
    }

    public static ISpecificationQuery<T> Not<T>(
        this ISpecificationQuery<T> spec)
    {
        return new NotSpecification<T>(spec);
    }
}

public class AndSpecification<T> : ISpecificationQuery<T>
{
    private readonly ISpecificationQuery<T> _left;
    private readonly ISpecificationQuery<T> _right;

    public AndSpecification(ISpecificationQuery<T> left, ISpecificationQuery<T> right)
    {
        _left = left;
        _right = right;
    }

    public Expression<Func<T, bool>> IsSatisfiedByExpression
    {
        get
        {
            var leftExpr = _left.IsSatisfiedByExpression;
            var rightExpr = _right.IsSatisfiedByExpression;

            var parameter = Expression.Parameter(typeof(T));
            var combined = Expression.AndAlso(
                Expression.Invoke(leftExpr, parameter),
                Expression.Invoke(rightExpr, parameter)
            );

            return Expression.Lambda<Func<T, bool>>(combined, parameter);
        }
    }
}

// Usage
var spec = new ActiveCustomersSpec()
    .And(new CustomerByEmailSpec("test@example.com"));
\`\`\`

## Usage with Repository

\`\`\`csharp
public class CustomerService
{
    private readonly IUnitOfWorkAsync _uow;
    private readonly IMapper _mapper;

    public async Task<IPagingResult<CustomerDto>> GetFilteredAsync(
        CustomerFilterDto filter,
        int page,
        int limit)
    {
        var spec = new CustomerFilterSpec(filter);
        var repo = _uow.GetRepository<Customer>();
        
        var result = await repo.ToBusinessPagingAsync(
            spec.IsSatisfiedByExpression,
            page,
            limit
        );

        return result.MapPagingTo<Customer, CustomerDto>(_mapper);
    }

    public async Task<IEnumerable<CustomerDto>> GetRecentActiveAsync()
    {
        var spec = new RecentCustomersSpec(30)
            .And(new ActiveCustomersSpec());

        var repo = _uow.GetRepository<Customer>();
        var customers = await repo.GetByAsync(spec.IsSatisfiedByExpression);

        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }
}
\`\`\`
`,

    documentation: `# API Documentation

## XML Documentation

### Enable in .csproj

\`\`\`xml
<PropertyGroup>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);1591</NoWarn>
</PropertyGroup>
\`\`\`

### Document Controllers

\`\`\`csharp
/// <summary>
/// Customer management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CustomersController : ControllerBase
{
    /// <summary>
    /// Get all customers with pagination
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="limit">Items per page (max 100)</param>
    /// <returns>Paginated list of customers</returns>
    /// <response code="200">Returns the list of customers</response>
    [HttpGet]
    [ProducesResponseType(typeof(IPagingResult<CustomerDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(int page = 1, int limit = 10)
    {
        // ...
    }

    /// <summary>
    /// Get customer by ID
    /// </summary>
    /// <param name="id">Customer unique identifier</param>
    /// <returns>Customer details</returns>
    /// <response code="200">Returns the customer</response>
    /// <response code="404">Customer not found</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // ...
    }

    /// <summary>
    /// Create a new customer
    /// </summary>
    /// <param name="dto">Customer creation data</param>
    /// <returns>Created customer</returns>
    /// <response code="201">Customer created successfully</response>
    /// <response code="400">Invalid data</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/customers
    ///     {
    ///         "name": "John Doe",
    ///         "email": "john@example.com"
    ///     }
    /// 
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto)
    {
        // ...
    }
}
\`\`\`

### Document DTOs

\`\`\`csharp
/// <summary>
/// Customer data transfer object
/// </summary>
public class CustomerDto
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    /// <example>3fa85f64-5717-4562-b3fc-2c963f66afa6</example>
    public Guid Id { get; set; }

    /// <summary>
    /// Customer full name
    /// </summary>
    /// <example>John Doe</example>
    public string Name { get; set; }

    /// <summary>
    /// Customer email address
    /// </summary>
    /// <example>john@example.com</example>
    public string Email { get; set; }

    /// <summary>
    /// Whether the customer is active
    /// </summary>
    /// <example>true</example>
    public bool Active { get; set; }
}
\`\`\`

## Swagger Configuration

\`\`\`csharp
// Program.cs
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1",
        Description = "API for customer management",
        Contact = new OpenApiContact
        {
            Name = "Support",
            Email = "support@example.com"
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);

    // Add security
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey
    });
});

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
    options.RoutePrefix = string.Empty; // Serve at root
});
\`\`\`
`,

    migration: `# EF Core Migrations

## Setup

\`\`\`bash
# Install EF Core tools
dotnet tool install --global dotnet-ef

# Add design package
dotnet add package Microsoft.EntityFrameworkCore.Design
\`\`\`

## Basic Commands

\`\`\`bash
# Create migration
dotnet ef migrations add InitialCreate

# Apply migrations
dotnet ef database update

# Remove last migration (not applied)
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script
\`\`\`

## Migration in Code

\`\`\`csharp
using Microsoft.EntityFrameworkCore.Migrations;

public partial class AddCustomerAddress : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Street",
            table: "Customers",
            type: "nvarchar(200)",
            maxLength: 200,
            nullable: true);

        migrationBuilder.AddColumn<string>(
            name: "City",
            table: "Customers",
            type: "nvarchar(100)",
            maxLength: 100,
            nullable: true);

        migrationBuilder.CreateIndex(
            name: "IX_Customers_City",
            table: "Customers",
            column: "City");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_Customers_City",
            table: "Customers");

        migrationBuilder.DropColumn(
            name: "Street",
            table: "Customers");

        migrationBuilder.DropColumn(
            name: "City",
            table: "Customers");
    }
}
\`\`\`

## Auto-Migration on Startup

\`\`\`csharp
// Program.cs (Development only!)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<MyDbContext>();
    await context.Database.MigrateAsync();
}
\`\`\`

## Data Seeding

\`\`\`csharp
public partial class SeedInitialData : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.InsertData(
            table: "Categories",
            columns: new[] { "Id", "Name", "Active" },
            values: new object[,]
            {
                { 1, "Electronics", true },
                { 2, "Clothing", true },
                { 3, "Books", true }
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DeleteData(
            table: "Categories",
            keyColumn: "Id",
            keyValues: new object[] { 1, 2, 3 });
    }
}
\`\`\`

## Best Practices

1. **Never edit applied migrations**
2. **Test migrations in staging before production**
3. **Use idempotent scripts for production**
4. **Keep migrations small and focused**
5. **Include both Up and Down methods**

\`\`\`bash
# Generate idempotent script
dotnet ef migrations script --idempotent -o migration.sql
\`\`\`
`,
  };

  return topics[topic] || `Topic "${topic}" not found. Available topics: ${Object.keys(topics).join(", ")}`;
}
