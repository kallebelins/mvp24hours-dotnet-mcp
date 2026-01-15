# Infrastructure Base - Mvp24Hours.Infrastructure

Base infrastructure module providing HTTP clients, secrets management, serialization, templates, and health checks.

## Installation

```bash
dotnet add package Mvp24Hours.Infrastructure
```

## Features Overview

| Feature | Description |
|---------|-------------|
| HTTP Client Factory | Polly resilience patterns for HTTP calls |
| Memory Caching | In-memory caching abstractions |
| MessagePack | Binary serialization for performance |
| Scriban Templates | Template engine for emails, reports |
| Redis Connectivity | Base Redis connection management |
| Secrets Management | Azure Key Vault, AWS Secrets Manager |
| Health Checks | Infrastructure health monitoring |

---

## HTTP Client Factory with Polly Resilience

### Basic Setup

```csharp
using Mvp24Hours.Infrastructure.Extensions;

builder.Services.AddMvp24HoursHttpClient<IMyApiClient, MyApiClient>(options =>
{
    options.BaseAddress = new Uri("https://api.example.com");
    options.Timeout = TimeSpan.FromSeconds(30);
});
```

### With Resilience Policies

```csharp
builder.Services.AddMvp24HoursHttpClient<IPaymentGateway, PaymentGatewayClient>(options =>
{
    options.BaseAddress = new Uri(configuration["PaymentGateway:Url"]!);
})
.AddMvp24HoursResilienceHandler(resilience =>
{
    // Retry with exponential backoff
    resilience.AddRetry(new HttpRetryStrategyOptions
    {
        MaxRetryAttempts = 3,
        Delay = TimeSpan.FromMilliseconds(500),
        UseJitter = true,
        BackoffType = DelayBackoffType.Exponential
    });

    // Circuit breaker
    resilience.AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions
    {
        FailureRatio = 0.5,
        SamplingDuration = TimeSpan.FromSeconds(30),
        MinimumThroughput = 10,
        BreakDuration = TimeSpan.FromSeconds(30)
    });

    // Timeout
    resilience.AddTimeout(TimeSpan.FromSeconds(10));
});
```

### Standard Resilience Handler

```csharp
builder.Services.AddMvp24HoursHttpClient<IExternalApi, ExternalApiClient>()
    .AddMvp24HoursStandardResilienceHandler(); // Includes retry + circuit breaker + timeout
```

### Custom Typed Client

```csharp
public interface IPaymentGateway
{
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
    Task<PaymentStatus> GetStatusAsync(string transactionId);
}

public class PaymentGatewayClient : IPaymentGateway
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PaymentGatewayClient> _logger;

    public PaymentGatewayClient(HttpClient httpClient, ILogger<PaymentGatewayClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync("/payments", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<PaymentResult>()
            ?? throw new InvalidOperationException("Invalid response");
    }

    public async Task<PaymentStatus> GetStatusAsync(string transactionId)
    {
        return await _httpClient.GetFromJsonAsync<PaymentStatus>($"/payments/{transactionId}/status")
            ?? throw new InvalidOperationException("Payment not found");
    }
}
```

---

## MessagePack Serialization

High-performance binary serialization for caching and messaging.

### Setup

```csharp
using Mvp24Hours.Infrastructure.Serialization;

builder.Services.AddMvp24HoursMessagePack();
```

### Usage

```csharp
public class CacheService
{
    private readonly IMessagePackSerializer _serializer;
    private readonly IDistributedCache _cache;

    public CacheService(IMessagePackSerializer serializer, IDistributedCache cache)
    {
        _serializer = serializer;
        _cache = cache;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        var bytes = _serializer.Serialize(value);
        await _cache.SetAsync(key, bytes, new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(30)
        });
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var bytes = await _cache.GetAsync(key);
        return bytes is null ? default : _serializer.Deserialize<T>(bytes);
    }
}
```

### MessagePack Attributes

```csharp
using MessagePack;

[MessagePackObject]
public class CachedProduct
{
    [Key(0)]
    public int Id { get; set; }

    [Key(1)]
    public string Name { get; set; } = string.Empty;

    [Key(2)]
    public decimal Price { get; set; }

    [Key(3)]
    public DateTime CachedAt { get; set; }
}
```

---

## Scriban Templates

Template engine for generating emails, reports, and dynamic content.

### Setup

```csharp
using Mvp24Hours.Infrastructure.Templates;

builder.Services.AddMvp24HoursScribanTemplates(options =>
{
    options.TemplateDirectory = "Templates";
    options.EnableCaching = true;
});
```

### Email Template Example

**Templates/welcome-email.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome {{ user.name }}</title>
</head>
<body>
    <h1>Welcome to {{ company_name }}!</h1>
    <p>Hello {{ user.name }},</p>
    <p>Your account has been created successfully.</p>
    
    <h2>Your Details:</h2>
    <ul>
        <li><strong>Email:</strong> {{ user.email }}</li>
        <li><strong>Plan:</strong> {{ user.plan }}</li>
        <li><strong>Member since:</strong> {{ user.created_at | date.to_string "%B %d, %Y" }}</li>
    </ul>
    
    {{ if user.is_premium }}
    <p>As a premium member, you have access to:</p>
    <ul>
        {{ for feature in premium_features }}
        <li>{{ feature }}</li>
        {{ end }}
    </ul>
    {{ end }}
    
    <p>Best regards,<br>The {{ company_name }} Team</p>
</body>
</html>
```

### Rendering Templates

```csharp
public class EmailService
{
    private readonly ITemplateEngine _templateEngine;
    private readonly IEmailSender _emailSender;

    public EmailService(ITemplateEngine templateEngine, IEmailSender emailSender)
    {
        _templateEngine = templateEngine;
        _emailSender = emailSender;
    }

    public async Task SendWelcomeEmailAsync(User user)
    {
        var model = new
        {
            user = new
            {
                name = user.Name,
                email = user.Email,
                plan = user.Plan.ToString(),
                created_at = user.CreatedAt,
                is_premium = user.Plan == UserPlan.Premium
            },
            company_name = "Mvp24Hours",
            premium_features = new[] { "Priority Support", "Advanced Analytics", "API Access" }
        };

        var html = await _templateEngine.RenderAsync("welcome-email.html", model);
        
        await _emailSender.SendAsync(new EmailMessage
        {
            To = user.Email,
            Subject = $"Welcome to Mvp24Hours, {user.Name}!",
            Body = html,
            IsHtml = true
        });
    }
}
```

### Inline Template Rendering

```csharp
var template = "Hello {{ name }}, your order #{{ order_id }} is {{ status }}.";
var result = await _templateEngine.RenderStringAsync(template, new
{
    name = "John",
    order_id = "ORD-12345",
    status = "shipped"
});
// Output: "Hello John, your order #ORD-12345 is shipped."
```

---

## Redis Connectivity Base

Base Redis connection management used by caching and messaging modules.

### Setup

```csharp
using Mvp24Hours.Infrastructure.Redis;

builder.Services.AddMvp24HoursRedisConnection(options =>
{
    options.Configuration = configuration.GetConnectionString("Redis")!;
    options.InstanceName = "myapp:";
});
```

### Connection Options

```csharp
builder.Services.AddMvp24HoursRedisConnection(options =>
{
    options.Configuration = "localhost:6379,password=secret,ssl=false,abortConnect=false";
    options.InstanceName = "myapp:";
    
    // Connection resilience
    options.ConnectRetry = 3;
    options.ConnectTimeout = 5000;
    options.SyncTimeout = 5000;
    
    // Connection pooling
    options.PoolSize = 10;
});
```

### Direct Redis Access

```csharp
public class RedisService
{
    private readonly IConnectionMultiplexer _redis;

    public RedisService(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<bool> SetWithExpiryAsync(string key, string value, TimeSpan expiry)
    {
        var db = _redis.GetDatabase();
        return await db.StringSetAsync(key, value, expiry);
    }

    public async Task<string?> GetAsync(string key)
    {
        var db = _redis.GetDatabase();
        return await db.StringGetAsync(key);
    }

    public async Task<bool> KeyExistsAsync(string key)
    {
        var db = _redis.GetDatabase();
        return await db.KeyExistsAsync(key);
    }
}
```

---

## Secrets Management

### Azure Key Vault

```csharp
using Mvp24Hours.Infrastructure.Secrets;

// In Program.cs
builder.Configuration.AddMvp24HoursAzureKeyVault(options =>
{
    options.VaultUri = new Uri(configuration["KeyVault:Uri"]!);
    options.TenantId = configuration["KeyVault:TenantId"];
    options.ClientId = configuration["KeyVault:ClientId"];
    options.ClientSecret = configuration["KeyVault:ClientSecret"];
    
    // Or use Managed Identity (recommended for Azure)
    options.UseManagedIdentity = true;
});

// Or in services
builder.Services.AddMvp24HoursAzureKeyVault(options =>
{
    options.VaultUri = new Uri("https://myvault.vault.azure.net/");
    options.UseManagedIdentity = true;
    options.CacheSecrets = true;
    options.CacheDuration = TimeSpan.FromMinutes(5);
});
```

### AWS Secrets Manager

```csharp
using Mvp24Hours.Infrastructure.Secrets;

builder.Configuration.AddMvp24HoursAwsSecretsManager(options =>
{
    options.Region = "us-east-1";
    options.SecretId = "myapp/production";
    
    // Credentials (or use IAM roles)
    options.AccessKeyId = configuration["AWS:AccessKeyId"];
    options.SecretAccessKey = configuration["AWS:SecretAccessKey"];
});

// Or in services
builder.Services.AddMvp24HoursAwsSecretsManager(options =>
{
    options.Region = "us-east-1";
    options.UseInstanceProfile = true; // Use EC2 instance profile
    options.CacheSecrets = true;
    options.CacheDuration = TimeSpan.FromMinutes(5);
});
```

### Using Secrets Service

```csharp
public class PaymentService
{
    private readonly ISecretsManager _secrets;

    public PaymentService(ISecretsManager secrets)
    {
        _secrets = secrets;
    }

    public async Task<string> GetApiKeyAsync()
    {
        return await _secrets.GetSecretAsync("payment-gateway-api-key");
    }

    public async Task<DatabaseCredentials> GetDatabaseCredentialsAsync()
    {
        return await _secrets.GetSecretAsync<DatabaseCredentials>("database-credentials");
    }
}

public class DatabaseCredentials
{
    public string Host { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Database { get; set; } = string.Empty;
}
```

---

## Health Checks

### Setup

```csharp
using Mvp24Hours.Infrastructure.HealthChecks;

builder.Services.AddMvp24HoursHealthChecks()
    .AddRedisHealthCheck("redis", configuration.GetConnectionString("Redis")!)
    .AddUrlHealthCheck("external-api", "https://api.example.com/health")
    .AddCustomHealthCheck<DatabaseHealthCheck>("database");

app.MapMvp24HoursHealthChecks("/health");
```

### Custom Health Check

```csharp
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly IDbConnection _connection;

    public DatabaseHealthCheck(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (_connection.State != ConnectionState.Open)
            {
                await ((DbConnection)_connection).OpenAsync(cancellationToken);
            }

            using var command = _connection.CreateCommand();
            command.CommandText = "SELECT 1";
            await ((DbCommand)command).ExecuteScalarAsync(cancellationToken);

            return HealthCheckResult.Healthy("Database connection is healthy");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database connection failed", ex);
        }
    }
}
```

### Health Check Response

```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.1234567",
  "entries": {
    "redis": {
      "status": "Healthy",
      "duration": "00:00:00.0123456",
      "description": "Redis connection is healthy"
    },
    "database": {
      "status": "Healthy",
      "duration": "00:00:00.0234567",
      "description": "Database connection is healthy"
    },
    "external-api": {
      "status": "Healthy",
      "duration": "00:00:00.0876543",
      "description": "External API is reachable"
    }
  }
}
```

### Detailed Health Check Endpoint

```csharp
app.MapMvp24HoursHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        
        var response = new
        {
            status = report.Status.ToString(),
            totalDuration = report.TotalDuration,
            entries = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                duration = e.Value.Duration,
                description = e.Value.Description,
                exception = e.Value.Exception?.Message,
                data = e.Value.Data
            })
        };
        
        await context.Response.WriteAsJsonAsync(response);
    }
});
```

---

## Memory Caching

In-memory caching for single-instance scenarios or L1 cache layer.

### Setup

```csharp
builder.Services.AddMvp24HoursMemoryCache(options =>
{
    options.SizeLimit = 1024; // Max entries
    options.CompactionPercentage = 0.25; // Remove 25% when limit reached
    options.ExpirationScanFrequency = TimeSpan.FromMinutes(1);
});
```

### Usage

```csharp
public class ProductService
{
    private readonly IMemoryCache _cache;
    private readonly IProductRepository _repository;

    public ProductService(IMemoryCache cache, IProductRepository repository)
    {
        _cache = cache;
        _repository = repository;
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        var cacheKey = $"product:{id}";
        
        if (_cache.TryGetValue(cacheKey, out Product? product))
        {
            return product;
        }

        product = await _repository.GetByIdAsync(id);
        
        if (product is not null)
        {
            var options = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(10))
                .SetSlidingExpiration(TimeSpan.FromMinutes(2))
                .SetSize(1);
            
            _cache.Set(cacheKey, product, options);
        }

        return product;
    }
}
```

---

## Key Interfaces

| Interface | Description |
|-----------|-------------|
| `IMessagePackSerializer` | MessagePack serialization |
| `ITemplateEngine` | Scriban template rendering |
| `ISecretsManager` | Secrets retrieval abstraction |
| `IConnectionMultiplexer` | Redis connection (StackExchange.Redis) |
| `IHealthCheck` | Custom health check interface |

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `Mvp24Hours.Core` | 9.1.x | Core abstractions |
| `Polly` | 8.x | Resilience patterns |
| `StackExchange.Redis` | 2.x | Redis client |
| `MessagePack` | 2.x | Binary serialization |
| `Scriban` | 5.x | Template engine |
| `Azure.Security.KeyVault.Secrets` | 4.x | Azure Key Vault |
| `AWSSDK.SecretsManager` | 4.x | AWS Secrets Manager |

---

## See Also

- [HTTP Resilience](modernization/http-resilience.md) - Advanced HTTP resilience patterns
- [Generic Resilience](modernization/generic-resilience.md) - Resilience for any operation
- [Caching Advanced](caching-advanced.md) - Distributed caching with Redis
- [Security Patterns](ai-context/security-patterns.md) - Secrets management best practices
- [Health Checks](observability/metrics.md) - Observability patterns
