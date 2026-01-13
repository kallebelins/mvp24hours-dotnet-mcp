/**
 * Infrastructure Guide Tool
 * 
 * Provides documentation for Pipeline, Caching, WebAPI, and CronJob patterns.
 */

export const infrastructureGuideSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
        "pipeline",
        "caching",
        "webapi",
        "webapi-advanced",
        "cronjob",
        "application-services",
      ],
      description: "Infrastructure topic to get documentation for",
    },
  },
  required: [],
};

interface InfrastructureGuideArgs {
  topic?: string;
}

export async function infrastructureGuide(args: unknown): Promise<string> {
  const { topic } = args as InfrastructureGuideArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

function getOverview(): string {
  return `# Infrastructure Guide

## Available Topics

| Topic | Description |
|-------|-------------|
| \`pipeline\` | Pipe and Filters pattern |
| \`caching\` | Redis caching with Mvp24Hours |
| \`webapi\` | ASP.NET Web API configuration |
| \`webapi-advanced\` | Advanced Web API features |
| \`cronjob\` | Background job scheduling |
| \`application-services\` | Service layer patterns |

## Quick Reference

### Pipeline Pattern
For complex workflows with multiple processing steps.

### Caching
Redis integration for distributed caching.

### Web API
Controllers, routing, response formatting.

### CronJob
Scheduled background tasks with resilience.

Use \`mvp24h_infrastructure_guide({ topic: "..." })\` for detailed documentation.
`;
}

function getTopicDoc(topic: string): string {
  const topics: Record<string, string> = {
    pipeline: `# Pipeline Pattern (Pipe and Filters)

## Overview

The Pipeline pattern allows composing complex operations from simple, reusable operations.

## Installation

\`\`\`bash
dotnet add package Mvp24Hours.Infrastructure.Pipe
\`\`\`

## Basic Pipeline

\`\`\`csharp
using Mvp24Hours.Core.Contract.Infrastructure.Pipe;
using Mvp24Hours.Infrastructure.Pipe;

// Define operations
public class ValidateOrderOperation : IOperation<OrderContext>
{
    public Task<bool> ExecuteAsync(OrderContext context)
    {
        if (context.Order.Items.Count == 0)
        {
            context.AddMessage("Order must have at least one item");
            return Task.FromResult(false);
        }
        return Task.FromResult(true);
    }
}

public class CalculateTotalOperation : IOperation<OrderContext>
{
    public Task<bool> ExecuteAsync(OrderContext context)
    {
        context.Order.Total = context.Order.Items.Sum(i => i.Price * i.Quantity);
        return Task.FromResult(true);
    }
}

public class ApplyDiscountOperation : IOperation<OrderContext>
{
    public Task<bool> ExecuteAsync(OrderContext context)
    {
        if (context.Order.Total > 1000)
        {
            context.Order.Discount = context.Order.Total * 0.1m;
            context.Order.Total -= context.Order.Discount;
        }
        return Task.FromResult(true);
    }
}

public class SaveOrderOperation : IOperation<OrderContext>
{
    private readonly IUnitOfWorkAsync _uow;

    public SaveOrderOperation(IUnitOfWorkAsync uow) => _uow = uow;

    public async Task<bool> ExecuteAsync(OrderContext context)
    {
        var repo = _uow.GetRepository<Order>();
        await repo.AddAsync(context.Order);
        await _uow.SaveChangesAsync();
        return true;
    }
}
\`\`\`

## Pipeline Execution

\`\`\`csharp
public class OrderService
{
    private readonly IPipelineAsync _pipeline;

    public OrderService(IPipelineAsync pipeline)
    {
        _pipeline = pipeline;
    }

    public async Task<IBusinessResult<Order>> CreateOrderAsync(CreateOrderRequest request)
    {
        var context = new OrderContext
        {
            Order = new Order
            {
                CustomerId = request.CustomerId,
                Items = request.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            }
        };

        // Execute pipeline
        await _pipeline
            .AddAsync<ValidateOrderOperation>()
            .AddAsync<CalculateTotalOperation>()
            .AddAsync<ApplyDiscountOperation>()
            .AddAsync<SaveOrderOperation>()
            .ExecuteAsync(context);

        if (context.HasErrors)
        {
            return BusinessResult<Order>.Failure(context.Messages);
        }

        return BusinessResult<Order>.Success(context.Order);
    }
}
\`\`\`

## Pipeline Context

\`\`\`csharp
public class OrderContext : IPipelineMessage
{
    public Order Order { get; set; }
    public List<string> Messages { get; } = new();
    public bool HasErrors => Messages.Any();

    public void AddMessage(string message) => Messages.Add(message);
}
\`\`\`

## Registration

\`\`\`csharp
// Program.cs
builder.Services.AddMvp24HoursPipeline();

// Or with custom configuration
builder.Services.AddMvp24HoursPipeline(options =>
{
    options.IsBreakOnFail = true; // Stop on first failure
});

// Register operations
builder.Services.AddScoped<ValidateOrderOperation>();
builder.Services.AddScoped<CalculateTotalOperation>();
builder.Services.AddScoped<ApplyDiscountOperation>();
builder.Services.AddScoped<SaveOrderOperation>();
\`\`\`

## Conditional Operations

\`\`\`csharp
public class ApplyVIPDiscountOperation : IOperation<OrderContext>
{
    public Task<bool> ExecuteAsync(OrderContext context)
    {
        // Only execute if customer is VIP
        if (!context.Customer.IsVIP)
        {
            return Task.FromResult(true); // Skip but continue pipeline
        }

        context.Order.Discount += context.Order.Total * 0.05m;
        return Task.FromResult(true);
    }
}
\`\`\`
`,

    caching: `# Caching with Mvp24Hours

## Installation

\`\`\`bash
dotnet add package Mvp24Hours.Infrastructure.Caching.Redis
dotnet add package StackExchange.Redis
\`\`\`

## Configuration

### appsettings.json

\`\`\`json
{
  "Redis": {
    "ConnectionString": "localhost:6379",
    "InstanceName": "myapp_",
    "DefaultExpiration": "00:30:00"
  }
}
\`\`\`

### Program.cs

\`\`\`csharp
using Mvp24Hours.Extensions;

// Add Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.InstanceName = builder.Configuration["Redis:InstanceName"];
});

// Add Mvp24Hours caching
builder.Services.AddMvp24HoursCaching();
\`\`\`

## Using Cache Service

\`\`\`csharp
using Mvp24Hours.Core.Contract.Infrastructure.Caching;

public class ProductService
{
    private readonly ICacheService _cache;
    private readonly IUnitOfWorkAsync _uow;

    public ProductService(ICacheService cache, IUnitOfWorkAsync uow)
    {
        _cache = cache;
        _uow = uow;
    }

    public async Task<Product?> GetProductAsync(int id)
    {
        var cacheKey = $"product:{id}";

        // Try get from cache
        var cached = await _cache.GetAsync<Product>(cacheKey);
        if (cached is not null)
        {
            return cached;
        }

        // Get from database
        var repo = _uow.GetRepository<Product>();
        var product = await repo.GetByIdAsync(id);

        if (product is not null)
        {
            // Store in cache
            await _cache.SetAsync(cacheKey, product, TimeSpan.FromMinutes(30));
        }

        return product;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _cache.GetOrCreateAsync(
            "products:all",
            async () =>
            {
                var repo = _uow.GetRepository<Product>();
                return await repo.GetAllAsync();
            },
            TimeSpan.FromMinutes(10)
        );
    }

    public async Task InvalidateProductCacheAsync(int id)
    {
        await _cache.RemoveAsync($"product:{id}");
        await _cache.RemoveAsync("products:all");
    }
}
\`\`\`

## Cache Patterns

### Cache-Aside

\`\`\`csharp
public async Task<T?> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null)
{
    var cached = await _cache.GetAsync<T>(key);
    if (cached is not null)
    {
        return cached;
    }

    var value = await factory();
    if (value is not null)
    {
        await _cache.SetAsync(key, value, expiration ?? _defaultExpiration);
    }

    return value;
}
\`\`\`

### Cache Invalidation

\`\`\`csharp
public class ProductCacheInvalidator
{
    private readonly ICacheService _cache;

    public ProductCacheInvalidator(ICacheService cache) => _cache = cache;

    public async Task InvalidateByIdAsync(int productId)
    {
        await _cache.RemoveAsync($"product:{productId}");
        await InvalidateListsAsync();
    }

    public async Task InvalidateListsAsync()
    {
        await _cache.RemoveAsync("products:all");
        await _cache.RemoveByPatternAsync("products:page:*");
        await _cache.RemoveByPatternAsync("products:category:*");
    }
}
\`\`\`

## Health Check

\`\`\`csharp
builder.Services.AddHealthChecks()
    .AddRedis(builder.Configuration["Redis:ConnectionString"]!, "redis");
\`\`\`
`,

    webapi: `# ASP.NET Web API with Mvp24Hours

## Installation

\`\`\`bash
dotnet add package Mvp24Hours.WebAPI
dotnet add package Swashbuckle.AspNetCore
\`\`\`

## Basic Setup

### Program.cs

\`\`\`csharp
using Mvp24Hours.WebAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Mvp24Hours
builder.Services.AddMvp24HoursWebAPI();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
\`\`\`

## Controller Patterns

### Basic Controller

\`\`\`csharp
using Microsoft.AspNetCore.Mvc;
using Mvp24Hours.Core.Contract.Data;
using Mvp24Hours.Extensions;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly IUnitOfWorkAsync _uow;

    public CustomersController(IUnitOfWorkAsync uow) => _uow = uow;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var repo = _uow.GetRepository<Customer>();
        var result = await repo.ToBusinessPagingAsync(page, limit);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var repo = _uow.GetRepository<Customer>();
        var customer = await repo.GetByIdAsync(id);
        
        if (customer is null)
            return NotFound();
            
        return Ok(customer);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CustomerDto dto)
    {
        var repo = _uow.GetRepository<Customer>();
        
        var customer = new Customer
        {
            Name = dto.Name,
            Email = dto.Email
        };
        
        await repo.AddAsync(customer);
        await _uow.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CustomerDto dto)
    {
        var repo = _uow.GetRepository<Customer>();
        var customer = await repo.GetByIdAsync(id);
        
        if (customer is null)
            return NotFound();
        
        customer.Name = dto.Name;
        customer.Email = dto.Email;
        
        await repo.ModifyAsync(customer);
        await _uow.SaveChangesAsync();
        
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var repo = _uow.GetRepository<Customer>();
        var customer = await repo.GetByIdAsync(id);
        
        if (customer is null)
            return NotFound();
        
        await repo.RemoveAsync(customer);
        await _uow.SaveChangesAsync();
        
        return NoContent();
    }
}
\`\`\`

### Controller with Service Layer

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService) => _orderService = orderService;

    [HttpGet]
    [ProducesResponseType(typeof(IPagingResult<OrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] OrderFilterDto filter, int page = 1, int limit = 10)
    {
        var result = await _orderService.GetAllAsync(filter, page, limit);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(IBusinessResult<OrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _orderService.GetByIdAsync(id);
        
        if (!result.HasData)
            return NotFound(result);
            
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(IBusinessResult<OrderDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var result = await _orderService.CreateAsync(dto);
        
        if (!result.HasData)
            return BadRequest(result);
            
        return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
    }
}
\`\`\`

## Swagger Configuration

\`\`\`csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1",
        Description = "API documentation"
    });

    // Add JWT authentication
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});
\`\`\`
`,

    "webapi-advanced": `# Advanced Web API Features

## Validation with FluentValidation

\`\`\`csharp
// Validator
public class CreateCustomerValidator : AbstractValidator<CreateCustomerDto>
{
    public CreateCustomerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");
    }
}

// Registration
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Controller usage
[HttpPost]
public async Task<IActionResult> Create(
    [FromBody] CreateCustomerDto dto,
    [FromServices] IValidator<CreateCustomerDto> validator)
{
    var validation = await validator.ValidateAsync(dto);
    if (!validation.IsValid)
    {
        return BadRequest(validation.Errors);
    }
    
    // ...
}
\`\`\`

## Response Formatting

\`\`\`csharp
// Standard response wrapper
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();
    public IDictionary<string, object> Meta { get; set; } = new Dictionary<string, object>();
}

// Extension
public static class ControllerExtensions
{
    public static IActionResult ApiOk<T>(this ControllerBase controller, T data)
    {
        return controller.Ok(new ApiResponse<T>
        {
            Success = true,
            Data = data
        });
    }

    public static IActionResult ApiError(this ControllerBase controller, params string[] errors)
    {
        return controller.BadRequest(new ApiResponse<object>
        {
            Success = false,
            Errors = errors.ToList()
        });
    }
}
\`\`\`

## API Versioning

\`\`\`csharp
// Program.cs
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version")
    );
});

builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

// Controller
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CustomersV1Controller : ControllerBase
{
    // V1 implementation
}

[ApiController]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CustomersV2Controller : ControllerBase
{
    // V2 implementation with breaking changes
}
\`\`\`

## Rate Limiting per Endpoint

\`\`\`csharp
[HttpGet]
[EnableRateLimiting("standard")]
public async Task<IActionResult> GetAll() { }

[HttpPost]
[EnableRateLimiting("strict")]
public async Task<IActionResult> Create() { }
\`\`\`

## Health Checks

\`\`\`csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(connectionString, name: "database")
    .AddRedis(redisConnectionString, name: "redis")
    .AddRabbitMQ(rabbitConnectionString, name: "rabbitmq");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
\`\`\`
`,

    cronjob: `# CronJob (Background Jobs)

## Overview

Scheduled background tasks with resilience patterns.

## Basic CronJob

\`\`\`csharp
public class CleanupJob : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<CleanupJob> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromHours(1);

    public CleanupJob(IServiceProvider serviceProvider, ILogger<CleanupJob> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Cleanup job starting");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await DoWorkAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in cleanup job");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }

    private async Task DoWorkAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<MyDbContext>();

        var cutoff = DateTime.UtcNow.AddDays(-30);
        
        var deleted = await context.AuditLogs
            .Where(x => x.CreatedAt < cutoff)
            .ExecuteDeleteAsync(stoppingToken);

        _logger.LogInformation("Deleted {Count} old audit logs", deleted);
    }
}

// Registration
builder.Services.AddHostedService<CleanupJob>();
\`\`\`

## Cron Expression Based

\`\`\`csharp
public class ScheduledJob : BackgroundService
{
    private readonly string _cronExpression = "0 0 * * *"; // Daily at midnight
    private readonly IServiceProvider _serviceProvider;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var cron = CronExpression.Parse(_cronExpression);
        
        while (!stoppingToken.IsCancellationRequested)
        {
            var nextOccurrence = cron.GetNextOccurrence(DateTimeOffset.UtcNow, TimeZoneInfo.Utc);
            
            if (nextOccurrence.HasValue)
            {
                var delay = nextOccurrence.Value - DateTimeOffset.UtcNow;
                
                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(delay, stoppingToken);
                }

                if (!stoppingToken.IsCancellationRequested)
                {
                    await ExecuteJobAsync(stoppingToken);
                }
            }
        }
    }

    private async Task ExecuteJobAsync(CancellationToken stoppingToken)
    {
        // Job logic
    }
}
\`\`\`

## With Resilience

\`\`\`csharp
public class ResilientJob : BackgroundService
{
    private readonly ResiliencePipeline _pipeline;

    public ResilientJob(ResiliencePipelineProvider<string> pipelineProvider)
    {
        _pipeline = pipelineProvider.GetPipeline("job-pipeline");
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await _pipeline.ExecuteAsync(async token =>
            {
                await DoWorkAsync(token);
            }, stoppingToken);

            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}

// Registration with resilience
builder.Services.AddResiliencePipeline("job-pipeline", builder =>
{
    builder
        .AddRetry(new RetryStrategyOptions
        {
            MaxRetryAttempts = 3,
            Delay = TimeSpan.FromSeconds(5),
            BackoffType = DelayBackoffType.Exponential
        })
        .AddCircuitBreaker(new CircuitBreakerStrategyOptions
        {
            FailureRatio = 0.5,
            MinimumThroughput = 10,
            BreakDuration = TimeSpan.FromMinutes(1)
        });
});
\`\`\`

## Observability

\`\`\`csharp
public class ObservableJob : BackgroundService
{
    private readonly Counter<long> _executionCounter;
    private readonly Histogram<double> _executionDuration;
    private readonly ILogger<ObservableJob> _logger;

    public ObservableJob(IMeterFactory meterFactory, ILogger<ObservableJob> logger)
    {
        var meter = meterFactory.Create("MyApp.Jobs");
        _executionCounter = meter.CreateCounter<long>("job.executions");
        _executionDuration = meter.CreateHistogram<double>("job.duration", "ms");
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var stopwatch = Stopwatch.StartNew();
            var status = "success";

            try
            {
                await DoWorkAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                status = "failure";
                _logger.LogError(ex, "Job failed");
            }
            finally
            {
                stopwatch.Stop();
                _executionCounter.Add(1, new KeyValuePair<string, object?>("status", status));
                _executionDuration.Record(stopwatch.ElapsedMilliseconds);
            }

            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
\`\`\`
`,

    "application-services": `# Application Services

## Service Layer Pattern

\`\`\`csharp
// Contract
public interface ICustomerService
{
    Task<IPagingResult<CustomerDto>> GetAllAsync(CustomerFilterDto filter, int page, int limit);
    Task<IBusinessResult<CustomerDto>> GetByIdAsync(Guid id);
    Task<IBusinessResult<CustomerDto>> CreateAsync(CreateCustomerDto dto);
    Task<IBusinessResult<CustomerDto>> UpdateAsync(Guid id, UpdateCustomerDto dto);
    Task<IBusinessResult<bool>> DeleteAsync(Guid id);
}
\`\`\`

## Using Mvp24Hours Service Base

\`\`\`csharp
using Mvp24Hours.Application.Logic;
using Mvp24Hours.Core.Contract.Data;

public class CustomerService : RepositoryPagingServiceAsync<Customer, IUnitOfWorkAsync>, ICustomerService
{
    private readonly IMapper _mapper;

    public CustomerService(IUnitOfWorkAsync unitOfWork, IMapper mapper) : base(unitOfWork)
    {
        _mapper = mapper;
    }

    public async Task<IPagingResult<CustomerDto>> GetAllAsync(CustomerFilterDto filter, int page, int limit)
    {
        Expression<Func<Customer, bool>> predicate = c =>
            (string.IsNullOrEmpty(filter.Name) || c.Name.Contains(filter.Name)) &&
            (!filter.Active.HasValue || c.Active == filter.Active.Value);

        var result = await Repository.ToBusinessPagingAsync(predicate, page, limit);
        return result.MapPagingTo<Customer, CustomerDto>(_mapper);
    }

    public async Task<IBusinessResult<CustomerDto>> GetByIdAsync(Guid id)
    {
        var customer = await Repository.GetByIdAsync(id);
        
        if (customer is null)
            return BusinessResult<CustomerDto>.Failure("Customer not found");

        return BusinessResult<CustomerDto>.Success(_mapper.Map<CustomerDto>(customer));
    }

    public async Task<IBusinessResult<CustomerDto>> CreateAsync(CreateCustomerDto dto)
    {
        // Check for duplicate email
        var existing = await Repository.GetByAsync(c => c.Email == dto.Email);
        if (existing.Any())
            return BusinessResult<CustomerDto>.Failure("Email already exists");

        var customer = _mapper.Map<Customer>(dto);
        await Repository.AddAsync(customer);
        await UnitOfWork.SaveChangesAsync();

        return BusinessResult<CustomerDto>.Success(_mapper.Map<CustomerDto>(customer));
    }

    public async Task<IBusinessResult<CustomerDto>> UpdateAsync(Guid id, UpdateCustomerDto dto)
    {
        var customer = await Repository.GetByIdAsync(id);
        
        if (customer is null)
            return BusinessResult<CustomerDto>.Failure("Customer not found");

        _mapper.Map(dto, customer);
        await Repository.ModifyAsync(customer);
        await UnitOfWork.SaveChangesAsync();

        return BusinessResult<CustomerDto>.Success(_mapper.Map<CustomerDto>(customer));
    }

    public async Task<IBusinessResult<bool>> DeleteAsync(Guid id)
    {
        var customer = await Repository.GetByIdAsync(id);
        
        if (customer is null)
            return BusinessResult<bool>.Failure("Customer not found");

        await Repository.RemoveAsync(customer);
        await UnitOfWork.SaveChangesAsync();

        return BusinessResult<bool>.Success(true);
    }
}
\`\`\`

## Facade Pattern

\`\`\`csharp
// Single entry point for multiple services
public class FacadeService
{
    public ICustomerService Customers { get; }
    public IOrderService Orders { get; }
    public IProductService Products { get; }

    public FacadeService(
        ICustomerService customers,
        IOrderService orders,
        IProductService products)
    {
        Customers = customers;
        Orders = orders;
        Products = products;
    }
}

// Registration
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<FacadeService>();

// Usage in controller
public class DashboardController : ControllerBase
{
    private readonly FacadeService _facade;

    public DashboardController(FacadeService facade) => _facade = facade;

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var customers = await _facade.Customers.GetAllAsync(new(), 1, 5);
        var orders = await _facade.Orders.GetRecentAsync(10);
        
        return Ok(new { customers, orders });
    }
}
\`\`\`
`,
  };

  return topics[topic] || `Topic "${topic}" not found. Available topics: ${Object.keys(topics).join(", ")}`;
}
