/**
 * Infrastructure Guide Tool
 * 
 * Provides documentation for Pipeline, Caching, WebAPI, and CronJob patterns.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

export const infrastructureGuideSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
        "pipeline",
        "caching",
        "caching-advanced",
        "webapi",
        "webapi-advanced",
        "cronjob",
        "cronjob-advanced",
        "cronjob-observability",
        "cronjob-resilience",
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

/**
 * Mapping of topics to documentation files
 */
const topicToFiles: Record<string, string[]> = {
  overview: ["home.md"],
  pipeline: ["pipeline.md"],
  caching: ["caching-advanced.md"],
  "caching-advanced": ["caching-advanced.md"],
  webapi: ["webapi.md"],
  "webapi-advanced": ["webapi-advanced.md"],
  cronjob: ["cronjob.md"],
  "cronjob-advanced": ["cronjob-advanced.md"],
  "cronjob-observability": ["cronjob-observability.md"],
  "cronjob-resilience": ["cronjob-resilience.md"],
  "application-services": ["application-services.md"],
};

/**
 * Related topics for cross-referencing
 */
const relatedTopics: Record<string, string[]> = {
  pipeline: ["cqrs/behaviors.md", "cqrs/saga/home.md"],
  caching: ["modernization/hybrid-cache.md", "cqrs/integration-caching.md"],
  "caching-advanced": ["modernization/hybrid-cache.md", "cqrs/integration-caching.md", "database/use-repository.md"],
  webapi: ["webapi-advanced", "modernization/minimal-apis.md", "modernization/native-openapi.md"],
  "webapi-advanced": ["webapi", "modernization/rate-limiting.md", "modernization/problem-details.md"],
  cronjob: ["cronjob-advanced", "cronjob-resilience", "cronjob-observability"],
  "cronjob-advanced": ["cronjob", "cronjob-resilience", "cronjob-observability"],
  "cronjob-observability": ["cronjob", "cronjob-advanced", "observability/metrics.md", "observability/tracing.md"],
  "cronjob-resilience": ["cronjob", "cronjob-advanced", "modernization/generic-resilience.md"],
  "application-services": ["database/use-repository.md", "database/use-unitofwork.md", "cqrs/commands.md"],
};

/**
 * Topic descriptions for overview
 */
const topicDescriptions: Record<string, string> = {
  pipeline: "Pipe and Filters pattern for composing complex operations",
  caching: "Redis caching basics with Mvp24Hours",
  "caching-advanced": "Advanced caching patterns (multi-level, invalidation, resilience)",
  webapi: "ASP.NET Web API configuration and patterns",
  "webapi-advanced": "Advanced Web API features (security, idempotency, versioning)",
  cronjob: "Background job scheduling with CRON expressions",
  "cronjob-advanced": "Advanced CronJob features (context, dependencies, distributed locking)",
  "cronjob-observability": "CronJob health checks, metrics, and tracing",
  "cronjob-resilience": "CronJob retry, circuit breaker, and overlapping prevention",
  "application-services": "Service layer patterns with Mvp24Hours",
};

export async function infrastructureGuide(args: unknown): Promise<string> {
  const { topic } = args as InfrastructureGuideArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

function getOverview(): string {
  const topicList = Object.entries(topicDescriptions)
    .map(([key, desc]) => `| \`${key}\` | ${desc} |`)
    .join("\n");

  return `# Infrastructure Guide

## Available Topics

| Topic | Description |
|-------|-------------|
${topicList}

## Quick Reference

### Pipeline Pattern
For complex workflows with multiple processing steps. Supports typed pipelines, middleware, fork/join, and resilience patterns.

### Caching
Redis integration for distributed caching with support for multi-level cache, cache-aside, read/write-through patterns, and smart invalidation.

### Web API
Controllers, routing, response formatting, rate limiting, security headers, and idempotency middleware.

### CronJob
Scheduled background tasks with CRON expressions, resilience patterns (retry, circuit breaker), observability, and distributed execution support.

### Application Services
Service layer patterns using Mvp24Hours base classes for CRUD operations with Unit of Work.

## NuGet Packages

| Package | Description |
|---------|-------------|
| \`Mvp24Hours.Infrastructure.Pipe\` | Pipeline/Pipe and Filters pattern |
| \`Mvp24Hours.Infrastructure.Caching\` | Caching abstractions |
| \`Mvp24Hours.Infrastructure.Caching.Redis\` | Redis caching implementation |
| \`Mvp24Hours.Infrastructure.CronJob\` | CronJob/Background tasks |
| \`Mvp24Hours.WebAPI\` | Web API utilities and extensions |
| \`Mvp24Hours.Application\` | Application services base classes |

## Key Interfaces

| Interface | Package | Description |
|-----------|---------|-------------|
| \`IPipeline\` / \`IPipelineAsync\` | Infrastructure.Pipe | Pipeline orchestration |
| \`IOperation<T>\` / \`OperationBase\` | Infrastructure.Pipe | Pipeline operation/filter |
| \`ICacheProvider\` | Infrastructure.Caching | Cache provider abstraction |
| \`ICacheService\` | Infrastructure.Caching | High-level cache service |
| \`CronJobService<T>\` | Infrastructure.CronJob | Base CronJob service |
| \`ResilientCronJobService<T>\` | Infrastructure.CronJob | CronJob with resilience |
| \`AdvancedCronJobService<T>\` | Infrastructure.CronJob | Full-featured CronJob |

Use \`mvp24h_infrastructure_guide({ topic: "..." })\` for detailed documentation on each topic.
`;
}

function getTopicDoc(topic: string): string {
  const files = topicToFiles[topic];
  
  if (!files) {
    return getTopicNotFoundMessage(topic);
  }

  const sections: string[] = [];

  // Load main documentation
  for (const file of files) {
    try {
      const content = loadDoc(file);
      sections.push(content);
    } catch {
      sections.push(`<!-- Documentation not found: ${file} -->`);
    }
  }

  // Add Quick Reference section
  const quickRef = getQuickReference(topic);
  if (quickRef) {
    sections.push(quickRef);
  }

  // Add Related Topics section
  const related = relatedTopics[topic];
  if (related && related.length > 0) {
    const relatedSection = getRelatedTopicsSection(topic, related);
    sections.push(relatedSection);
  }

  return sections.join("\n\n---\n\n");
}

function getQuickReference(topic: string): string | null {
  const references: Record<string, string> = {
    pipeline: `## Quick Reference - Pipeline Interfaces

| Interface | Description |
|-----------|-------------|
| \`IPipeline\` | Synchronous pipeline |
| \`IPipelineAsync\` | Asynchronous pipeline |
| \`IOperation<T>\` | Operation/filter interface |
| \`OperationBase\` | Sync operation base class |
| \`OperationBaseAsync\` | Async operation base class |
| \`IPipelineMessage\` | Message/context passed through pipeline |
| \`IPipelineBuilder\` | Builder pattern interface |

### Common Extensions

\`\`\`csharp
// Setup
builder.Services.AddMvp24HoursPipeline();      // Sync
builder.Services.AddMvp24HoursPipelineAsync(); // Async

// Get pipeline
var pipeline = serviceProvider.GetService<IPipeline>();
var pipelineAsync = serviceProvider.GetService<IPipelineAsync>();
\`\`\``,

    caching: `## Quick Reference - Caching Interfaces

| Interface | Description |
|-----------|-------------|
| \`ICacheProvider\` | Low-level cache provider |
| \`ICacheService\` | High-level cache service |
| \`IMultiLevelCache\` | L1 (memory) + L2 (distributed) cache |
| \`CacheEntryOptions\` | Cache entry configuration |

### Common Extensions

\`\`\`csharp
// Setup
builder.Services.AddMvp24HoursCaching();
builder.Services.AddMvp24HoursMemoryCache();
builder.Services.AddMvp24HoursDistributedCache(options => {
    options.ConnectionString = "localhost:6379";
});
\`\`\``,

    "caching-advanced": `## Quick Reference - Advanced Caching

| Pattern | Description |
|---------|-------------|
| Cache-Aside | Check cache, fetch on miss, store result |
| Read-Through | Cache automatically fetches on miss |
| Write-Through | Updates written to cache and DB synchronously |
| Write-Behind | Updates queued and written asynchronously |
| Refresh-Ahead | Proactively refresh before expiration |

### Multi-Level Cache Setup

\`\`\`csharp
builder.Services.AddMvp24HoursMultiLevelCache(options =>
{
    options.L1.Expiration = TimeSpan.FromMinutes(1);  // Memory
    options.L2.ConnectionString = "localhost:6379";   // Redis
    options.L2.Expiration = TimeSpan.FromMinutes(30);
    options.EnableL1Invalidation = true;
});
\`\`\``,

    cronjob: `## Quick Reference - CronJob Classes

| Class | Description |
|-------|-------------|
| \`CronJobService<T>\` | Base CronJob with CRON scheduling |
| \`ResilientCronJobService<T>\` | Adds retry, circuit breaker, overlapping prevention |
| \`AdvancedCronJobService<T>\` | Full-featured with context, state, dependencies |
| \`IScheduleConfig<T>\` | Schedule configuration interface |

### Common CRON Expressions

| Expression | Description |
|------------|-------------|
| \`*/5 * * * *\` | Every 5 minutes |
| \`0 * * * *\` | Every hour |
| \`0 0 * * *\` | Daily at midnight |
| \`0 9 * * 1-5\` | Weekdays at 9 AM |`,

    "cronjob-advanced": `## Quick Reference - Advanced CronJob Interfaces

| Interface | Description |
|-----------|-------------|
| \`ICronJobContext\` | Execution context with metadata |
| \`ICronJobContextAccessor\` | Access current context |
| \`ICronJobStateStore\` | Persist job state |
| \`ICronJobDependency\` | Job dependency tracking |
| \`IDistributedCronJobLock\` | Distributed locking |
| \`ICronJobController\` | Pause/Resume control |

### Event Handlers

| Interface | Event |
|-----------|-------|
| \`ICronJobStartingHandler\` | Before job starts |
| \`ICronJobCompletedHandler\` | After success |
| \`ICronJobFailedHandler\` | After failure |
| \`ICronJobRetryHandler\` | Before retry |`,

    "cronjob-resilience": `## Quick Reference - Resilience Options

| Option | Default | Description |
|--------|---------|-------------|
| \`EnableRetry\` | false | Enable retry policy |
| \`MaxRetryAttempts\` | 3 | Max retry attempts |
| \`UseExponentialBackoff\` | true | Exponential delay |
| \`EnableCircuitBreaker\` | false | Enable circuit breaker |
| \`CircuitBreakerFailureThreshold\` | 5 | Failures before open |
| \`PreventOverlapping\` | true | Prevent concurrent runs |
| \`GracefulShutdownTimeout\` | 30s | Shutdown wait time |

### Circuit Breaker States

\`\`\`
Closed ─── failures ≥ threshold ──→ Open
  ↑                                   │
  │                                   │ break duration
  │                                   ↓
  └──── success ≥ threshold ──── Half-Open
\`\`\``,

    "cronjob-observability": `## Quick Reference - CronJob Observability

| Component | Purpose |
|-----------|---------|
| \`ICronJobMetrics\` | Record execution metrics |
| \`CronJobHealthCheck\` | Health check for jobs |
| \`CronJobActivitySource\` | OpenTelemetry tracing |

### Key Metrics

| Metric | Type |
|--------|------|
| \`mvp24hours.cronjob.executions.total\` | Counter |
| \`mvp24hours.cronjob.executions.failed.total\` | Counter |
| \`mvp24hours.cronjob.execution.duration\` | Histogram |
| \`mvp24hours.cronjob.active.count\` | UpDownCounter |`,

    webapi: `## Quick Reference - WebAPI Extensions

| Extension | Description |
|-----------|-------------|
| \`AddMvp24HoursWebEssential()\` | Essential services |
| \`AddMvp24HoursMapService()\` | AutoMapper setup |
| \`AddMvp24HoursWebJson()\` | JSON configuration |
| \`AddMvp24HoursSwagger()\` | Swagger/OpenAPI |
| \`AddMvp24HoursNativeOpenApi()\` | Native OpenAPI (.NET 9+) |
| \`AddMvp24HoursWebGzip()\` | Response compression |
| \`AddMvp24HoursWebExceptions()\` | Exception handling |

### Middleware

| Middleware | Description |
|------------|-------------|
| \`UseMvp24HoursExceptionHandling()\` | Global exception handler |
| \`UseMvp24HoursCors()\` | CORS middleware |
| \`UseMvp24HoursCorrelationId()\` | Correlation ID propagation |`,

    "webapi-advanced": `## Quick Reference - Advanced WebAPI Features

| Feature | Description |
|---------|-------------|
| Security Headers | Content-Security-Policy, X-Frame-Options, etc. |
| Idempotency | Prevent duplicate operations |
| API Versioning | URL, header, and query string versioning |
| Rate Limiting | Request throttling (fixed, sliding window) |
| ProblemDetails | RFC 7807 error responses |

### Security Headers Setup

\`\`\`csharp
builder.Services.AddMvp24HoursSecurityHeaders(options =>
{
    options.AddContentSecurityPolicy = true;
    options.AddXContentTypeOptions = true;
    options.AddXFrameOptions = true;
    options.RemoveServerHeader = true;
});
\`\`\``,

    "application-services": `## Quick Reference - Application Services

| Class | Description |
|-------|-------------|
| \`RepositoryService<T, TUoW>\` | Sync service base |
| \`RepositoryServiceAsync<T, TUoW>\` | Async service base |
| \`RepositoryPagingService<T, TUoW>\` | With pagination |
| \`RepositoryPagingServiceAsync<T, TUoW>\` | Async with pagination |

### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| \`Repository\` | \`IRepository<T>\` | Entity repository |
| \`UnitOfWork\` | \`TUoW\` | Unit of Work instance |

### Business Result Types

| Type | Description |
|------|-------------|
| \`IBusinessResult<T>\` | Operation result |
| \`IPagingResult<T>\` | Paginated result |
| \`BusinessResult<T>.Success()\` | Create success result |
| \`BusinessResult<T>.Failure()\` | Create failure result |`,
  };

  return references[topic] || null;
}

function getRelatedTopicsSection(topic: string, related: string[]): string {
  const items = related.map(r => {
    // Check if it's a file path or a topic
    if (r.includes("/") || r.endsWith(".md")) {
      return `- \`${r}\``;
    } else {
      const desc = topicDescriptions[r] || r;
      return `- \`mvp24h_infrastructure_guide({ topic: "${r}" })\` - ${desc}`;
    }
  });

  return `## Related Topics

${items.join("\n")}

### Other Tools

- \`mvp24h_cqrs_guide\` - CQRS/Mediator patterns
- \`mvp24h_database_advisor\` - Database patterns and configuration
- \`mvp24h_observability_setup\` - Logging, tracing, and metrics
- \`mvp24h_modernization_guide\` - .NET 9 modern patterns`;
}

function getTopicNotFoundMessage(topic: string): string {
  const availableTopics = Object.keys(topicToFiles).join(", ");
  return `Topic "${topic}" not found.

## Available Topics

${availableTopics}

Use \`mvp24h_infrastructure_guide({ topic: "overview" })\` for an overview of all topics.`;
}
