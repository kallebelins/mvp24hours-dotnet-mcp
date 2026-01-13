/**
 * Modernization Guide Tool
 * 
 * Provides .NET 9 modernization patterns and features.
 */

export const modernizationGuideSchema = {
  type: "object" as const,
  properties: {
    category: {
      type: "string",
      enum: [
        "overview",
        "resilience",
        "caching",
        "time",
        "di",
        "apis",
        "performance",
        "cloud",
      ],
      description: "Modernization category",
    },
    feature: {
      type: "string",
      enum: [
        "http-resilience",
        "generic-resilience",
        "rate-limiting",
        "hybrid-cache",
        "output-caching",
        "time-provider",
        "periodic-timer",
        "keyed-services",
        "options-pattern",
        "problem-details",
        "minimal-apis",
        "native-openapi",
        "source-generators",
        "aspire",
        "channels",
      ],
      description: "Specific feature to get documentation for",
    },
  },
  required: [],
};

interface ModernizationGuideArgs {
  category?: string;
  feature?: string;
}

export async function modernizationGuide(args: unknown): Promise<string> {
  const { category, feature } = args as ModernizationGuideArgs;

  if (feature) {
    return getFeatureDoc(feature);
  }

  if (category) {
    return getCategoryOverview(category);
  }

  return getOverview();
}

function getOverview(): string {
  return `# .NET 9 Modernization Guide

## Overview

.NET 9 introduces many features for building modern, resilient, and performant applications.

## Feature Categories

| Category | Features | When to Use |
|----------|----------|-------------|
| **Resilience** | HTTP Resilience, Generic Resilience, Rate Limiting | External API calls, protecting resources |
| **Caching** | HybridCache, Output Caching | Performance optimization, reducing load |
| **Time** | TimeProvider, PeriodicTimer | Testable time-dependent code, background tasks |
| **DI** | Keyed Services, Options Pattern | Multiple implementations, configuration |
| **APIs** | ProblemDetails, Minimal APIs, Native OpenAPI | Better error handling, lightweight endpoints |
| **Performance** | Source Generators | Startup time, AOT compilation |
| **Cloud** | .NET Aspire | Cloud-native applications, orchestration |

## Quick Decision Guide

### Need resilience for HTTP calls?
→ Use \`mvp24h_modernization_guide({ feature: "http-resilience" })\`

### Need distributed caching with local fallback?
→ Use \`mvp24h_modernization_guide({ feature: "hybrid-cache" })\`

### Need rate limiting for APIs?
→ Use \`mvp24h_modernization_guide({ feature: "rate-limiting" })\`

### Need standardized error responses?
→ Use \`mvp24h_modernization_guide({ feature: "problem-details" })\`

### Building cloud-native app?
→ Use \`mvp24h_modernization_guide({ feature: "aspire" })\`

## Migration Considerations

| From | To | Benefit |
|------|-----|---------|
| Polly v7 | Microsoft.Extensions.Resilience | Built-in, standardized |
| IMemoryCache + IDistributedCache | HybridCache | Unified API, stampede protection |
| DateTime.Now | TimeProvider | Testability |
| Custom rate limiting | Built-in Rate Limiting | Standards-compliant |
| Swashbuckle | Native OpenAPI | Smaller footprint |
`;
}

function getCategoryOverview(category: string): string {
  const categories: Record<string, string> = {
    resilience: `# Resilience Features (.NET 9)

## Available Features

| Feature | Package | Use Case |
|---------|---------|----------|
| HTTP Resilience | Microsoft.Extensions.Http.Resilience | External API calls |
| Generic Resilience | Microsoft.Extensions.Resilience | Any operation |
| Rate Limiting | Microsoft.AspNetCore.RateLimiting | API protection |

## HTTP Resilience

\`\`\`csharp
builder.Services.AddHttpClient("external-api")
    .AddStandardResilienceHandler();
\`\`\`

## Generic Resilience

\`\`\`csharp
builder.Services.AddResiliencePipeline("my-pipeline", builder =>
{
    builder.AddRetry(new RetryStrategyOptions());
    builder.AddCircuitBreaker(new CircuitBreakerStrategyOptions());
    builder.AddTimeout(TimeSpan.FromSeconds(30));
});
\`\`\`

## Rate Limiting

\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("api", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 100;
    });
});
\`\`\`

Use \`mvp24h_modernization_guide({ feature: "..." })\` for detailed documentation.
`,

    caching: `# Caching Features (.NET 9)

## Available Features

| Feature | Package | Use Case |
|---------|---------|----------|
| HybridCache | Microsoft.Extensions.Caching.Hybrid | L1/L2 caching with stampede protection |
| Output Caching | Built-in | HTTP response caching |

## HybridCache

\`\`\`csharp
builder.Services.AddHybridCache(options =>
{
    options.DefaultEntryOptions = new HybridCacheEntryOptions
    {
        Expiration = TimeSpan.FromMinutes(5),
        LocalCacheExpiration = TimeSpan.FromMinutes(1)
    };
});
\`\`\`

## Output Caching

\`\`\`csharp
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder.Expire(TimeSpan.FromMinutes(10)));
    options.AddPolicy("products", builder => 
        builder.Expire(TimeSpan.FromHours(1)).Tag("products"));
});
\`\`\`

Use \`mvp24h_modernization_guide({ feature: "..." })\` for detailed documentation.
`,

    // Add more categories as needed
  };

  return categories[category] || `Category "${category}" not found.`;
}

function getFeatureDoc(feature: string): string {
  const features: Record<string, string> = {
    "http-resilience": `# HTTP Resilience (.NET 9)

## Overview

Microsoft.Extensions.Http.Resilience provides production-ready resilience for HTTP clients.

## Installation

\`\`\`bash
dotnet add package Microsoft.Extensions.Http.Resilience
\`\`\`

## Basic Usage

\`\`\`csharp
// Program.cs
builder.Services.AddHttpClient("my-api", client =>
{
    client.BaseAddress = new Uri("https://api.example.com");
})
.AddStandardResilienceHandler();
\`\`\`

## Standard Resilience Handler

The standard handler includes:
- Rate limiter (concurrency)
- Total request timeout
- Retry (exponential backoff)
- Circuit breaker
- Attempt timeout

## Custom Configuration

\`\`\`csharp
builder.Services.AddHttpClient("my-api")
    .AddStandardResilienceHandler(options =>
    {
        // Customize retry
        options.Retry.MaxRetryAttempts = 5;
        options.Retry.Delay = TimeSpan.FromSeconds(1);
        options.Retry.UseJitter = true;
        options.Retry.BackoffType = DelayBackoffType.Exponential;

        // Customize circuit breaker
        options.CircuitBreaker.FailureRatio = 0.5;
        options.CircuitBreaker.MinimumThroughput = 10;
        options.CircuitBreaker.BreakDuration = TimeSpan.FromSeconds(30);

        // Customize timeouts
        options.TotalRequestTimeout.Timeout = TimeSpan.FromSeconds(60);
        options.AttemptTimeout.Timeout = TimeSpan.FromSeconds(10);
    });
\`\`\`

## With Typed Client

\`\`\`csharp
public interface IExternalApiClient
{
    Task<Product> GetProductAsync(int id);
}

public class ExternalApiClient : IExternalApiClient
{
    private readonly HttpClient _client;

    public ExternalApiClient(HttpClient client) => _client = client;

    public async Task<Product> GetProductAsync(int id)
    {
        var response = await _client.GetAsync($"/products/{id}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Product>();
    }
}

// Registration
builder.Services.AddHttpClient<IExternalApiClient, ExternalApiClient>()
    .AddStandardResilienceHandler();
\`\`\`

## Hedging (Parallel Requests)

\`\`\`csharp
builder.Services.AddHttpClient("my-api")
    .AddStandardHedgingHandler(options =>
    {
        options.Hedging.MaxHedgedAttempts = 2;
        options.Hedging.Delay = TimeSpan.FromMilliseconds(200);
    });
\`\`\`
`,

    "hybrid-cache": `# HybridCache (.NET 9)

## Overview

HybridCache provides a unified caching API with L1 (in-memory) and L2 (distributed) caching, plus stampede protection.

## Installation

\`\`\`bash
dotnet add package Microsoft.Extensions.Caching.Hybrid
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis
\`\`\`

## Basic Setup

\`\`\`csharp
// Program.cs
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
});

builder.Services.AddHybridCache(options =>
{
    options.DefaultEntryOptions = new HybridCacheEntryOptions
    {
        Expiration = TimeSpan.FromMinutes(5),
        LocalCacheExpiration = TimeSpan.FromMinutes(1)
    };
});
\`\`\`

## Usage

\`\`\`csharp
public class ProductService
{
    private readonly HybridCache _cache;
    private readonly IProductRepository _repository;

    public ProductService(HybridCache cache, IProductRepository repository)
    {
        _cache = cache;
        _repository = repository;
    }

    public async Task<Product?> GetProductAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _cache.GetOrCreateAsync(
            $"product:{id}",
            async cancel => await _repository.GetByIdAsync(id, cancel),
            cancellationToken: cancellationToken
        );
    }

    public async Task<IEnumerable<Product>> GetProductsAsync(CancellationToken cancellationToken = default)
    {
        return await _cache.GetOrCreateAsync(
            "products:all",
            async cancel => await _repository.GetAllAsync(cancel),
            new HybridCacheEntryOptions
            {
                Expiration = TimeSpan.FromMinutes(10),
                LocalCacheExpiration = TimeSpan.FromMinutes(2)
            },
            cancellationToken: cancellationToken
        ) ?? [];
    }

    public async Task InvalidateProductAsync(int id, CancellationToken cancellationToken = default)
    {
        await _cache.RemoveAsync($"product:{id}", cancellationToken);
    }
}
\`\`\`

## Key Features

### Stampede Protection
When multiple requests ask for the same uncached key simultaneously, only one factory call is made.

### Two-Tier Caching
- L1: In-memory (fast, process-local)
- L2: Distributed (Redis, shared across instances)

### Serialization
Automatic serialization for L2 cache. Supports JSON and custom serializers.

\`\`\`csharp
builder.Services.AddHybridCache()
    .AddSerializer<Product, ProductSerializer>();
\`\`\`
`,

    "rate-limiting": `# Rate Limiting (.NET 9)

## Overview

Built-in rate limiting middleware for ASP.NET Core.

## Basic Setup

\`\`\`csharp
// Program.cs
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    
    // Fixed window: X requests per time window
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 100;
        opt.QueueLimit = 10;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });

    // Sliding window: smoother rate limiting
    options.AddSlidingWindowLimiter("sliding", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow = 6; // 10-second segments
        opt.PermitLimit = 100;
    });

    // Token bucket: allows bursts
    options.AddTokenBucketLimiter("token", opt =>
    {
        opt.TokenLimit = 100;
        opt.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
        opt.TokensPerPeriod = 10;
    });

    // Concurrency: limit simultaneous requests
    options.AddConcurrencyLimiter("concurrent", opt =>
    {
        opt.PermitLimit = 10;
        opt.QueueLimit = 5;
    });
});

var app = builder.Build();
app.UseRateLimiter();
\`\`\`

## Applying to Endpoints

### Minimal APIs

\`\`\`csharp
app.MapGet("/api/products", GetProducts)
    .RequireRateLimiting("fixed");

app.MapPost("/api/orders", CreateOrder)
    .RequireRateLimiting("sliding");
\`\`\`

### Controllers

\`\`\`csharp
[EnableRateLimiting("fixed")]
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok();

    [HttpPost]
    [EnableRateLimiting("token")] // Override
    public IActionResult Create() => Ok();

    [HttpGet("{id}")]
    [DisableRateLimiting] // No rate limiting
    public IActionResult GetById(int id) => Ok();
}
\`\`\`

## Per-User Rate Limiting

\`\`\`csharp
options.AddPolicy("per-user", context =>
{
    var userId = context.HttpContext.User.Identity?.Name ?? "anonymous";
    
    return RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: userId,
        factory: _ => new FixedWindowRateLimiterOptions
        {
            Window = TimeSpan.FromMinutes(1),
            PermitLimit = 100
        });
});
\`\`\`

## Custom Response

\`\`\`csharp
options.OnRejected = async (context, cancellationToken) =>
{
    context.HttpContext.Response.StatusCode = 429;
    
    if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
    {
        context.HttpContext.Response.Headers.RetryAfter = retryAfter.TotalSeconds.ToString();
    }

    await context.HttpContext.Response.WriteAsJsonAsync(new
    {
        error = "Too many requests",
        retryAfter = retryAfter.TotalSeconds
    }, cancellationToken);
};
\`\`\`
`,

    "keyed-services": `# Keyed Services (.NET 8+)

## Overview

Keyed services allow registering multiple implementations of the same interface with different keys.

## Registration

\`\`\`csharp
// Program.cs
builder.Services.AddKeyedScoped<INotificationService, EmailNotificationService>("email");
builder.Services.AddKeyedScoped<INotificationService, SmsNotificationService>("sms");
builder.Services.AddKeyedScoped<INotificationService, PushNotificationService>("push");
\`\`\`

## Injection

### Constructor Injection

\`\`\`csharp
public class OrderService
{
    private readonly INotificationService _emailService;
    private readonly INotificationService _smsService;

    public OrderService(
        [FromKeyedServices("email")] INotificationService emailService,
        [FromKeyedServices("sms")] INotificationService smsService)
    {
        _emailService = emailService;
        _smsService = smsService;
    }
}
\`\`\`

### Service Provider

\`\`\`csharp
public class NotificationDispatcher
{
    private readonly IServiceProvider _serviceProvider;

    public NotificationDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task SendAsync(string channel, string message)
    {
        var service = _serviceProvider.GetRequiredKeyedService<INotificationService>(channel);
        await service.SendAsync(message);
    }
}
\`\`\`

## Use Cases

### Database Providers

\`\`\`csharp
builder.Services.AddKeyedScoped<IRepository, SqlServerRepository>("sqlserver");
builder.Services.AddKeyedScoped<IRepository, PostgresRepository>("postgres");
builder.Services.AddKeyedScoped<IRepository, MongoRepository>("mongodb");
\`\`\`

### Feature Flags

\`\`\`csharp
builder.Services.AddKeyedScoped<IPaymentProcessor, StripeProcessor>("stripe");
builder.Services.AddKeyedScoped<IPaymentProcessor, PayPalProcessor>("paypal");
builder.Services.AddKeyedScoped<IPaymentProcessor, LegacyProcessor>("legacy");

// Controller
public class PaymentController : ControllerBase
{
    public PaymentController(
        [FromKeyedServices("stripe")] IPaymentProcessor defaultProcessor)
    {
        // Use based on configuration or user preference
    }
}
\`\`\`
`,

    "problem-details": `# ProblemDetails (RFC 7807)

## Overview

Standardized error responses following RFC 7807 Problem Details specification.

## Basic Setup

\`\`\`csharp
// Program.cs
builder.Services.AddProblemDetails();

var app = builder.Build();
app.UseExceptionHandler();
app.UseStatusCodePages();
\`\`\`

## Custom Problem Details

\`\`\`csharp
builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Instance = context.HttpContext.Request.Path;
        context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;
        context.ProblemDetails.Extensions["timestamp"] = DateTime.UtcNow;
    };
});
\`\`\`

## Returning Problem Details

### From Controller

\`\`\`csharp
[ApiController]
public class ProductsController : ControllerBase
{
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var product = _repository.GetById(id);
        
        if (product is null)
        {
            return Problem(
                title: "Product not found",
                detail: $"Product with ID {id} was not found",
                statusCode: StatusCodes.Status404NotFound,
                type: "https://api.example.com/errors/product-not-found"
            );
        }

        return Ok(product);
    }

    [HttpPost]
    public IActionResult Create(ProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        // ...
    }
}
\`\`\`

### From Minimal APIs

\`\`\`csharp
app.MapGet("/products/{id}", (int id, IProductRepository repo) =>
{
    var product = repo.GetById(id);
    
    return product is not null
        ? Results.Ok(product)
        : Results.Problem(
            title: "Product not found",
            statusCode: StatusCodes.Status404NotFound);
});
\`\`\`

## Exception Handling

\`\`\`csharp
builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        var exception = context.HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;

        if (exception is ValidationException validationEx)
        {
            context.ProblemDetails.Status = StatusCodes.Status400BadRequest;
            context.ProblemDetails.Title = "Validation failed";
            context.ProblemDetails.Extensions["errors"] = validationEx.Errors;
        }
        else if (exception is NotFoundException)
        {
            context.ProblemDetails.Status = StatusCodes.Status404NotFound;
            context.ProblemDetails.Title = "Resource not found";
        }
    };
});
\`\`\`

## Response Format

\`\`\`json
{
  "type": "https://api.example.com/errors/product-not-found",
  "title": "Product not found",
  "status": 404,
  "detail": "Product with ID 123 was not found",
  "instance": "/api/products/123",
  "traceId": "00-abc123-def456-00",
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`
`,

    "aspire": `# .NET Aspire

## Overview

.NET Aspire is an opinionated stack for building observable, production-ready distributed applications.

## Installation

\`\`\`bash
dotnet new install Aspire.ProjectTemplates
dotnet new aspire-starter -n MyApp
\`\`\`

## Project Structure

\`\`\`
MyApp/
├── MyApp.AppHost/           # Orchestration
│   └── Program.cs
├── MyApp.ServiceDefaults/   # Shared configuration
│   └── Extensions.cs
├── MyApp.ApiService/        # API project
└── MyApp.Web/               # Frontend project
\`\`\`

## AppHost (Orchestration)

\`\`\`csharp
// MyApp.AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);

// Add Redis cache
var cache = builder.AddRedis("cache");

// Add PostgreSQL
var postgres = builder.AddPostgres("postgres")
    .AddDatabase("mydb");

// Add API service
var api = builder.AddProject<Projects.MyApp_ApiService>("api")
    .WithReference(cache)
    .WithReference(postgres);

// Add web frontend
builder.AddProject<Projects.MyApp_Web>("web")
    .WithReference(api);

builder.Build().Run();
\`\`\`

## Service Defaults

\`\`\`csharp
// MyApp.ServiceDefaults/Extensions.cs
public static class Extensions
{
    public static IHostApplicationBuilder AddServiceDefaults(
        this IHostApplicationBuilder builder)
    {
        // Add OpenTelemetry
        builder.ConfigureOpenTelemetry();

        // Add health checks
        builder.AddDefaultHealthChecks();

        // Add service discovery
        builder.Services.AddServiceDiscovery();

        // Add resilience
        builder.Services.ConfigureHttpClientDefaults(http =>
        {
            http.AddStandardResilienceHandler();
            http.AddServiceDiscovery();
        });

        return builder;
    }
}
\`\`\`

## Using in Services

\`\`\`csharp
// MyApp.ApiService/Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add service defaults (telemetry, health checks, etc.)
builder.AddServiceDefaults();

// Add Redis
builder.AddRedisClient("cache");

// Add PostgreSQL
builder.AddNpgsqlDbContext<MyDbContext>("mydb");

var app = builder.Build();
app.MapDefaultEndpoints(); // Health checks, etc.
app.Run();
\`\`\`

## Dashboard

Aspire includes a dashboard for monitoring:
- Service health
- Distributed traces
- Logs
- Metrics

Access at: https://localhost:17024 (default)

## Components

| Component | Package |
|-----------|---------|
| Redis | Aspire.StackExchange.Redis |
| PostgreSQL | Aspire.Npgsql |
| SQL Server | Aspire.Microsoft.Data.SqlClient |
| MongoDB | Aspire.MongoDB.Driver |
| RabbitMQ | Aspire.RabbitMQ.Client |
| Azure Storage | Aspire.Azure.Storage.Blobs |
| Azure Service Bus | Aspire.Azure.Messaging.ServiceBus |
`,

    "generic-resilience": `# Generic Resilience (.NET 9)

## Overview

Microsoft.Extensions.Resilience provides resilience patterns for any operation.

## Installation

\`\`\`bash
dotnet add package Microsoft.Extensions.Resilience
\`\`\`

## Creating Resilience Pipelines

\`\`\`csharp
builder.Services.AddResiliencePipeline("database", builder =>
{
    builder
        .AddRetry(new RetryStrategyOptions
        {
            MaxRetryAttempts = 3,
            Delay = TimeSpan.FromMilliseconds(500),
            BackoffType = DelayBackoffType.Exponential
        })
        .AddCircuitBreaker(new CircuitBreakerStrategyOptions
        {
            FailureRatio = 0.5,
            BreakDuration = TimeSpan.FromSeconds(30)
        })
        .AddTimeout(TimeSpan.FromSeconds(10));
});
\`\`\`

## Usage

\`\`\`csharp
public class OrderService
{
    private readonly ResiliencePipeline _pipeline;

    public OrderService(ResiliencePipelineProvider<string> provider)
    {
        _pipeline = provider.GetPipeline("database");
    }

    public async Task<Order?> GetOrderAsync(Guid id, CancellationToken ct)
    {
        return await _pipeline.ExecuteAsync(
            async token => await _repository.GetByIdAsync(id, token), ct);
    }
}
\`\`\`
`,

    "time-provider": `# TimeProvider (.NET 8+)

## Overview

TimeProvider enables testable time-dependent code.

## Usage

\`\`\`csharp
public class OrderService
{
    private readonly TimeProvider _timeProvider;

    public OrderService(TimeProvider timeProvider) => _timeProvider = timeProvider;

    public Order CreateOrder() => new Order
    {
        CreatedAt = _timeProvider.GetUtcNow(),
        ExpiresAt = _timeProvider.GetUtcNow().AddDays(30)
    };
}

// Registration
builder.Services.AddSingleton(TimeProvider.System);
\`\`\`

## Testing

\`\`\`csharp
using Microsoft.Extensions.Time.Testing;

var fakeTime = new FakeTimeProvider();
fakeTime.SetUtcNow(new DateTimeOffset(2024, 1, 15, 10, 0, 0, TimeSpan.Zero));

var service = new OrderService(fakeTime);
var order = service.CreateOrder();

fakeTime.Advance(TimeSpan.FromDays(31));
Assert.True(order.ExpiresAt < fakeTime.GetUtcNow());
\`\`\`
`,

    "periodic-timer": `# PeriodicTimer (.NET 6+)

## Overview

Async-friendly periodic execution.

## Usage

\`\`\`csharp
public class SyncService : BackgroundService
{
    private readonly PeriodicTimer _timer = new(TimeSpan.FromMinutes(5));

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (await _timer.WaitForNextTickAsync(stoppingToken))
        {
            await SyncDataAsync(stoppingToken);
        }
    }

    public override void Dispose()
    {
        _timer.Dispose();
        base.Dispose();
    }
}
\`\`\`
`,

    "output-caching": `# Output Caching (.NET 7+)

## Setup

\`\`\`csharp
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(b => b.Expire(TimeSpan.FromMinutes(10)));
    options.AddPolicy("products", b => b.Expire(TimeSpan.FromHours(1)).Tag("products"));
});

app.UseOutputCache();
\`\`\`

## Usage

\`\`\`csharp
app.MapGet("/products", GetProducts).CacheOutput("products");

// Invalidation
await cacheStore.EvictByTagAsync("products", default);
\`\`\`
`,

    "options-pattern": `# Options Pattern

## Basic

\`\`\`csharp
public class EmailOptions
{
    public string SmtpServer { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
}

builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection("Email"));
\`\`\`

## With Validation

\`\`\`csharp
builder.Services.AddOptions<DatabaseOptions>()
    .Bind(builder.Configuration.GetSection("Database"))
    .ValidateDataAnnotations()
    .ValidateOnStart();
\`\`\`

## Interfaces

| Interface | Lifetime | Reloads |
|-----------|----------|---------|
| IOptions<T> | Singleton | No |
| IOptionsSnapshot<T> | Scoped | Yes |
| IOptionsMonitor<T> | Singleton | Yes + notification |
`,

    "minimal-apis": `# Minimal APIs with TypedResults

## Endpoints

\`\`\`csharp
app.MapGet("/products", async (IProductRepository repo) =>
    TypedResults.Ok(await repo.GetAllAsync()));

app.MapGet("/products/{id}", async (int id, IProductRepository repo) =>
{
    var product = await repo.GetByIdAsync(id);
    return product is not null ? TypedResults.Ok(product) : TypedResults.NotFound();
});
\`\`\`

## Groups

\`\`\`csharp
var products = app.MapGroup("/api/products").WithTags("Products");
products.MapGet("/", ProductEndpoints.GetAll);
products.MapPost("/", ProductEndpoints.Create);
\`\`\`
`,

    "native-openapi": `# Native OpenAPI (.NET 9)

## Setup

\`\`\`csharp
builder.Services.AddOpenApi();
app.MapOpenApi();
\`\`\`

## Documentation

\`\`\`csharp
app.MapGet("/products", GetProducts)
    .WithName("GetProducts")
    .WithSummary("Get all products")
    .Produces<IEnumerable<ProductDto>>(200)
    .WithTags("Products");
\`\`\`
`,

    "source-generators": `# Source Generators

## JSON

\`\`\`csharp
[JsonSerializable(typeof(Product))]
public partial class AppJsonContext : JsonSerializerContext { }

var json = JsonSerializer.Serialize(product, AppJsonContext.Default.Product);
\`\`\`

## Logging

\`\`\`csharp
[LoggerMessage(EventId = 1, Level = LogLevel.Information, Message = "Processing {OrderId}")]
private partial void LogProcessing(Guid orderId);
\`\`\`

## Regex

\`\`\`csharp
[GeneratedRegex(@"^[\\w.-]+@[\\w.-]+\\.\\w+$")]
private static partial Regex EmailRegex();
\`\`\`
`,
  };

  return features[feature] || `Feature "${feature}" not found. Available features: ${Object.keys(features).join(", ")}`;
}
