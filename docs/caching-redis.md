# Caching Redis - Mvp24Hours.Infrastructure.Caching.Redis

Redis-specific caching extensions and simplified configuration for the Mvp24Hours framework.

## Installation

```bash
dotnet add package Mvp24Hours.Infrastructure.Caching.Redis
```

**Dependencies:**
- `Mvp24Hours.Infrastructure.Caching`
- `StackExchange.Redis`

---

## Overview

The `Mvp24Hours.Infrastructure.Caching.Redis` package provides:

| Feature | Description |
|---------|-------------|
| Redis Extensions | Simplified Redis setup with sensible defaults |
| HybridCache L2 | Redis as distributed cache layer (L2) |
| Connection Management | Pooled connection with resilience |
| Simplified Configuration | Fluent API for common scenarios |

---

## Quick Start

### Basic Setup

```csharp
using Mvp24Hours.Infrastructure.Caching.Redis;

builder.Services.AddMvp24HoursRedisCaching(options =>
{
    options.Configuration = "localhost:6379";
    options.InstanceName = "myapp:";
});
```

### With HybridCache (L1 + L2)

```csharp
builder.Services.AddMvp24HoursHybridCache(options =>
{
    // L1 - Memory (fast local cache)
    options.MaximumPayloadBytes = 1024 * 1024; // 1MB max per entry
    options.MaximumKeyLength = 1024;
    options.DefaultEntryOptions = new HybridCacheEntryOptions
    {
        Expiration = TimeSpan.FromMinutes(30),
        LocalCacheExpiration = TimeSpan.FromMinutes(5)
    };
})
.AddMvp24HoursRedisHybridCacheStore(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis")!;
    options.InstanceName = "myapp:";
});
```

---

## Configuration Options

### Basic Configuration

```csharp
builder.Services.AddMvp24HoursRedisCaching(options =>
{
    // Connection string
    options.Configuration = "localhost:6379";
    
    // Key prefix for namespacing
    options.InstanceName = "myapp:";
    
    // Default expiration
    options.DefaultExpiration = TimeSpan.FromMinutes(30);
    
    // Enable compression for large values
    options.EnableCompression = true;
    options.CompressionThreshold = 1024; // Compress values > 1KB
});
```

### Advanced Connection Options

```csharp
builder.Services.AddMvp24HoursRedisCaching(options =>
{
    // Full connection string with options
    options.Configuration = "redis-server:6379,password=secret,ssl=true,abortConnect=false";
    
    // Or use ConfigurationOptions
    options.ConfigurationOptions = new ConfigurationOptions
    {
        EndPoints = { "redis-server:6379" },
        Password = "secret",
        Ssl = true,
        AbortOnConnectFail = false,
        ConnectTimeout = 5000,
        SyncTimeout = 5000,
        AsyncTimeout = 5000,
        ConnectRetry = 3,
        KeepAlive = 60,
        AllowAdmin = false
    };
    
    options.InstanceName = "myapp:";
});
```

### From Configuration File

```json
// appsettings.json
{
  "Redis": {
    "Configuration": "localhost:6379",
    "InstanceName": "myapp:",
    "DefaultExpiration": "00:30:00",
    "EnableCompression": true
  }
}
```

```csharp
builder.Services.AddMvp24HoursRedisCaching(
    builder.Configuration.GetSection("Redis"));
```

---

## HybridCache Integration

### Understanding HybridCache

HybridCache (.NET 9) combines L1 (memory) and L2 (distributed) caching:

```text
+--------------------------------------------------+
|                  Application                      |
+--------------------------------------------------+
                       |
                       v
+--------------------------------------------------+
|              HybridCache                          |
|  +------------------+ +------------------------+  |
|  |   L1 (Memory)    | |    L2 (Redis)          |  |
|  |   Fast, Local    | |    Distributed         |  |
|  |   Short TTL      | |    Longer TTL          |  |
|  +------------------+ +------------------------+  |
+--------------------------------------------------+
```

### Setup with Redis L2

```csharp
using Mvp24Hours.Infrastructure.Caching.Redis;

builder.Services.AddMvp24HoursHybridCache(options =>
{
    // L1 settings
    options.MaximumPayloadBytes = 1024 * 1024; // 1MB
    options.MaximumKeyLength = 1024;
    
    // Default cache behavior
    options.DefaultEntryOptions = new HybridCacheEntryOptions
    {
        // Total cache duration (both L1 and L2)
        Expiration = TimeSpan.FromMinutes(30),
        
        // L1 local cache duration (should be shorter)
        LocalCacheExpiration = TimeSpan.FromMinutes(5),
        
        // Cache flags
        Flags = HybridCacheEntryFlags.None
    };
})
.AddMvp24HoursRedisHybridCacheStore(options =>
{
    options.Configuration = "localhost:6379";
    options.InstanceName = "myapp:";
});
```

### Using HybridCache

```csharp
public class ProductService
{
    private readonly HybridCache _cache;
    private readonly IProductRepository _repository;

    public ProductService(HybridCache cache, IProductRepository repository)
    {
        _cache = cache;
        _repository = repository;
    }

    public async Task<Product?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _cache.GetOrCreateAsync(
            $"products:{id}",
            async token => await _repository.GetByIdAsync(id, token),
            new HybridCacheEntryOptions
            {
                Expiration = TimeSpan.FromHours(1),
                LocalCacheExpiration = TimeSpan.FromMinutes(10)
            },
            cancellationToken: ct);
    }

    public async Task InvalidateAsync(int id, CancellationToken ct = default)
    {
        await _cache.RemoveAsync($"products:{id}", ct);
    }
}
```

### Cache Entry Options

```csharp
// Per-operation options
var product = await _cache.GetOrCreateAsync(
    $"products:{id}",
    async token => await LoadProductAsync(id, token),
    new HybridCacheEntryOptions
    {
        // Total expiration (L2)
        Expiration = TimeSpan.FromHours(1),
        
        // Local expiration (L1) - typically shorter
        LocalCacheExpiration = TimeSpan.FromMinutes(5),
        
        // Flags
        Flags = HybridCacheEntryFlags.DisableLocalCacheWrite // Skip L1
    });
```

---

## Redis Extensions

### Cache Service Extension

```csharp
public class ProductService
{
    private readonly IRedisCacheService _cache;

    public ProductService(IRedisCacheService cache)
    {
        _cache = cache;
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _cache.GetOrSetAsync(
            $"products:{id}",
            async () => await _repository.GetByIdAsync(id),
            TimeSpan.FromMinutes(30));
    }

    public async Task SetAsync(Product product)
    {
        await _cache.SetAsync(
            $"products:{product.Id}",
            product,
            TimeSpan.FromMinutes(30));
    }

    public async Task RemoveAsync(int id)
    {
        await _cache.RemoveAsync($"products:{id}");
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _cache.ExistsAsync($"products:{id}");
    }
}
```

### Batch Operations

```csharp
// Get multiple keys
var products = await _cache.GetManyAsync<Product>(
    new[] { "products:1", "products:2", "products:3" });

// Set multiple keys
await _cache.SetManyAsync(new Dictionary<string, Product>
{
    ["products:1"] = product1,
    ["products:2"] = product2,
    ["products:3"] = product3
}, TimeSpan.FromMinutes(30));

// Remove multiple keys
await _cache.RemoveManyAsync(new[] { "products:1", "products:2" });

// Remove by pattern
await _cache.RemoveByPatternAsync("products:*");
```

### Hash Operations

```csharp
// Store as hash (useful for partial updates)
await _cache.HashSetAsync("user:123", new Dictionary<string, string>
{
    ["name"] = "John Doe",
    ["email"] = "john@example.com",
    ["plan"] = "premium"
});

// Get single field
var name = await _cache.HashGetAsync("user:123", "name");

// Get all fields
var user = await _cache.HashGetAllAsync("user:123");

// Update single field
await _cache.HashSetFieldAsync("user:123", "plan", "enterprise");
```

---

## Connection Resilience

### Built-in Resilience

```csharp
builder.Services.AddMvp24HoursRedisCaching(options =>
{
    options.Configuration = "localhost:6379";
    
    // Connection resilience
    options.Resilience.ConnectRetry = 3;
    options.Resilience.ConnectTimeout = TimeSpan.FromSeconds(5);
    options.Resilience.SyncTimeout = TimeSpan.FromSeconds(5);
    options.Resilience.AbortOnConnectFail = false;
    
    // Operation resilience
    options.Resilience.EnableRetry = true;
    options.Resilience.MaxRetries = 3;
    options.Resilience.RetryDelay = TimeSpan.FromMilliseconds(100);
    options.Resilience.UseExponentialBackoff = true;
});
```

### Circuit Breaker

```csharp
builder.Services.AddMvp24HoursRedisCaching(options =>
{
    options.Configuration = "localhost:6379";
    
    options.Resilience.EnableCircuitBreaker = true;
    options.Resilience.CircuitBreaker.FailureThreshold = 5;
    options.Resilience.CircuitBreaker.SamplingDuration = TimeSpan.FromSeconds(30);
    options.Resilience.CircuitBreaker.BreakDuration = TimeSpan.FromSeconds(60);
});
```

### Fallback Behavior

```csharp
builder.Services.AddMvp24HoursRedisCaching(options =>
{
    options.Configuration = "localhost:6379";
    
    // When Redis is unavailable
    options.Resilience.FallbackStrategy = CacheFallbackStrategy.BypassCache;
    // Options: BypassCache, ReturnDefault, ThrowException, UseStaleData
    
    options.Resilience.OnFallback = (key, ex) =>
    {
        _logger.LogWarning(ex, "Redis fallback for key {Key}", key);
    };
});
```

---

## Health Checks

```csharp
builder.Services.AddHealthChecks()
    .AddMvp24HoursRedisHealthCheck(options =>
    {
        options.Name = "redis";
        options.Tags = new[] { "ready", "cache" };
        options.Timeout = TimeSpan.FromSeconds(5);
        options.FailureStatus = HealthStatus.Degraded;
    });

app.MapHealthChecks("/health");
```

---

## Observability

### Metrics

```csharp
builder.Services.AddMvp24HoursRedisCaching(options =>
{
    options.Configuration = "localhost:6379";
    
    options.Metrics.Enabled = true;
    options.Metrics.MeterName = "myapp.cache.redis";
});

// Exposed metrics:
// - redis_cache_hits_total
// - redis_cache_misses_total
// - redis_cache_operation_duration_seconds
// - redis_connection_pool_size
// - redis_connection_errors_total
```

### OpenTelemetry Tracing

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddMvp24HoursRedisInstrumentation());

// Traces include:
// - Redis operation type
// - Key (optionally masked)
// - Duration
// - Result status
```

---

## Complete Example

```csharp
using Mvp24Hours.Infrastructure.Caching.Redis;

var builder = WebApplication.CreateBuilder(args);

// HybridCache with Redis L2
builder.Services.AddMvp24HoursHybridCache(options =>
{
    options.MaximumPayloadBytes = 1024 * 1024;
    options.DefaultEntryOptions = new HybridCacheEntryOptions
    {
        Expiration = TimeSpan.FromMinutes(30),
        LocalCacheExpiration = TimeSpan.FromMinutes(5)
    };
})
.AddMvp24HoursRedisHybridCacheStore(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis")!;
    options.InstanceName = "myapp:";
    
    // Resilience
    options.Resilience.EnableRetry = true;
    options.Resilience.EnableCircuitBreaker = true;
    options.Resilience.FallbackStrategy = CacheFallbackStrategy.BypassCache;
    
    // Compression
    options.EnableCompression = true;
    options.CompressionThreshold = 1024;
});

// Health checks
builder.Services.AddHealthChecks()
    .AddMvp24HoursRedisHealthCheck();

var app = builder.Build();

app.MapHealthChecks("/health");
app.Run();
```

---

## Key Interfaces

| Interface | Description |
|-----------|-------------|
| `HybridCache` | .NET 9 hybrid cache (L1 + L2) |
| `IRedisCacheService` | High-level Redis cache operations |
| `IConnectionMultiplexer` | Raw Redis connection (StackExchange.Redis) |
| `IDistributedCache` | Standard distributed cache interface |

---

## See Also

- [Caching Advanced](caching-advanced.md) - Advanced caching patterns
- [HybridCache (.NET 9)](modernization/hybrid-cache.md) - HybridCache documentation
- [Infrastructure Base](infrastructure-base.md) - Redis connectivity base
- [CQRS Caching Integration](cqrs/integration-caching.md) - CQRS with caching
