/**
 * Modernization Guide Tool
 * 
 * Provides .NET 9 modernization patterns and features.
 * Loads documentation from markdown files for accurate, up-to-date content.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

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
        "communication",
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
        "options-configuration",
        "problem-details",
        "minimal-apis",
        "native-openapi",
        "source-generators",
        "aspire",
        "channels",
        "dotnet9-features",
        "migration-guide",
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

// Mapping of features to documentation files
const featureToFiles: Record<string, string[]> = {
  "http-resilience": ["modernization/http-resilience.md"],
  "generic-resilience": ["modernization/generic-resilience.md"],
  "rate-limiting": ["modernization/rate-limiting.md"],
  "hybrid-cache": ["modernization/hybrid-cache.md"],
  "output-caching": ["modernization/output-caching.md"],
  "time-provider": ["modernization/time-provider.md"],
  "periodic-timer": ["modernization/periodic-timer.md"],
  "keyed-services": ["modernization/keyed-services.md"],
  "options-pattern": ["modernization/options-configuration.md"],
  "options-configuration": ["modernization/options-configuration.md"],
  "problem-details": ["modernization/problem-details.md"],
  "minimal-apis": ["modernization/minimal-apis.md"],
  "native-openapi": ["modernization/native-openapi.md"],
  "source-generators": ["modernization/source-generators.md"],
  "aspire": ["modernization/aspire.md"],
  "channels": ["modernization/channels.md"],
  "dotnet9-features": ["modernization/dotnet9-features.md"],
  "migration-guide": ["modernization/migration-guide.md"],
};

// Mapping of categories to documentation files
const categoryToFiles: Record<string, string[]> = {
  overview: [
    "modernization/dotnet9-features.md",
  ],
  resilience: [
    "modernization/http-resilience.md",
    "modernization/generic-resilience.md",
    "modernization/rate-limiting.md",
  ],
  caching: [
    "modernization/hybrid-cache.md",
    "modernization/output-caching.md",
  ],
  time: [
    "modernization/time-provider.md",
    "modernization/periodic-timer.md",
  ],
  di: [
    "modernization/keyed-services.md",
    "modernization/options-configuration.md",
  ],
  apis: [
    "modernization/problem-details.md",
    "modernization/minimal-apis.md",
    "modernization/native-openapi.md",
  ],
  performance: [
    "modernization/source-generators.md",
  ],
  cloud: [
    "modernization/aspire.md",
  ],
  communication: [
    "modernization/channels.md",
  ],
};

// Related topics for cross-referencing
const relatedTopics: Record<string, string[]> = {
  "http-resilience": ["generic-resilience", "rate-limiting"],
  "generic-resilience": ["http-resilience", "rate-limiting"],
  "rate-limiting": ["http-resilience", "generic-resilience"],
  "hybrid-cache": ["output-caching"],
  "output-caching": ["hybrid-cache"],
  "time-provider": ["periodic-timer"],
  "periodic-timer": ["time-provider", "channels"],
  "keyed-services": ["options-configuration"],
  "options-pattern": ["keyed-services"],
  "options-configuration": ["keyed-services"],
  "problem-details": ["minimal-apis", "native-openapi"],
  "minimal-apis": ["problem-details", "native-openapi"],
  "native-openapi": ["minimal-apis", "problem-details"],
  "source-generators": ["aspire"],
  "aspire": ["source-generators", "channels"],
  "channels": ["periodic-timer", "aspire"],
  "dotnet9-features": ["migration-guide"],
  "migration-guide": ["dotnet9-features"],
};

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
  const sections: string[] = [];

  // Header
  sections.push(`# .NET 9 Modernization Guide

## Overview

.NET 9 introduces many features for building modern, resilient, and performant applications.
This guide covers the native .NET 9 features adopted by Mvp24Hours framework.`);

  // Feature Categories Table
  sections.push(`## Feature Categories

| Category | Features | When to Use |
|----------|----------|-------------|
| **Resilience** | HTTP Resilience, Generic Resilience, Rate Limiting | External API calls, protecting resources |
| **Caching** | HybridCache, Output Caching | Performance optimization, reducing load |
| **Time** | TimeProvider, PeriodicTimer | Testable time-dependent code, background tasks |
| **DI** | Keyed Services, Options Pattern | Multiple implementations, configuration |
| **APIs** | ProblemDetails, Minimal APIs, Native OpenAPI | Better error handling, lightweight endpoints |
| **Performance** | Source Generators | Startup time, AOT compilation |
| **Cloud** | .NET Aspire | Cloud-native applications, orchestration |
| **Communication** | Channels | High-performance producer/consumer patterns |`);

  // Quick Decision Guide
  sections.push(`## Quick Decision Guide

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

### Need high-performance producer/consumer?
→ Use \`mvp24h_modernization_guide({ feature: "channels" })\`

### Want a complete overview of .NET 9 features?
→ Use \`mvp24h_modernization_guide({ feature: "dotnet9-features" })\`

### Need migration help from legacy code?
→ Use \`mvp24h_modernization_guide({ feature: "migration-guide" })\``);

  // Migration Considerations
  sections.push(`## Migration Considerations

| From | To | Benefit |
|------|-----|---------|
| Polly v7 | Microsoft.Extensions.Resilience | Built-in, standardized |
| IMemoryCache + IDistributedCache | HybridCache | Unified API, stampede protection |
| DateTime.Now | TimeProvider | Testability |
| Custom rate limiting | Built-in Rate Limiting | Standards-compliant |
| Swashbuckle | Native OpenAPI | Smaller footprint |
| ConcurrentQueue + AutoResetEvent | System.Threading.Channels | Modern async-first API |
| TelemetryHelper | ILogger + OpenTelemetry | Industry standard |`);

  // Available Features
  sections.push(`## Available Features

### Resilience
- \`http-resilience\` - HTTP client resilience with retry, circuit breaker
- \`generic-resilience\` - Resilience for any operation
- \`rate-limiting\` - API rate limiting (fixed window, sliding window, token bucket)

### Caching
- \`hybrid-cache\` - L1 (memory) + L2 (distributed) cache with stampede protection
- \`output-caching\` - HTTP response caching

### Time & Scheduling
- \`time-provider\` - Testable time abstraction
- \`periodic-timer\` - Async-friendly periodic timer

### Dependency Injection
- \`keyed-services\` - Multiple implementations with key-based resolution
- \`options-configuration\` - Strongly-typed configuration with validation

### APIs
- \`problem-details\` - RFC 7807 error responses
- \`minimal-apis\` - Lightweight endpoints with TypedResults
- \`native-openapi\` - Built-in OpenAPI support

### Performance
- \`source-generators\` - AOT-friendly code generation (JSON, Logging, Regex)

### Cloud
- \`aspire\` - .NET Aspire for cloud-native applications

### Communication
- \`channels\` - High-performance producer/consumer patterns

### Guides
- \`dotnet9-features\` - Overview of all .NET 9 features
- \`migration-guide\` - Migration from legacy implementations`);

  return sections.join("\n\n");
}

function getCategoryOverview(category: string): string {
  const files = categoryToFiles[category];

  if (!files || files.length === 0) {
    return `Category "${category}" not found.

Available categories:
- \`overview\` - Complete overview of modernization features
- \`resilience\` - HTTP Resilience, Generic Resilience, Rate Limiting
- \`caching\` - HybridCache, Output Caching
- \`time\` - TimeProvider, PeriodicTimer
- \`di\` - Keyed Services, Options Pattern
- \`apis\` - ProblemDetails, Minimal APIs, Native OpenAPI
- \`performance\` - Source Generators
- \`cloud\` - .NET Aspire
- \`communication\` - System.Threading.Channels`;
  }

  // Load documentation from files
  const content = loadDocs(files);

  // Add category header and related topics
  const header = getCategoryHeader(category);
  const relatedSection = getCategoryRelatedTopics(category);

  return `${header}

${content}

${relatedSection}`;
}

function getCategoryHeader(category: string): string {
  const headers: Record<string, string> = {
    overview: "# .NET 9 Modernization - Overview",
    resilience: "# Resilience Features (.NET 9)",
    caching: "# Caching Features (.NET 9)",
    time: "# Time & Scheduling Features (.NET 9)",
    di: "# Dependency Injection Features (.NET 9)",
    apis: "# API Features (.NET 9)",
    performance: "# Performance Features (.NET 9)",
    cloud: "# Cloud-Native Features (.NET 9)",
    communication: "# Communication Features (.NET 9)",
  };

  return headers[category] || `# ${category}`;
}

function getCategoryRelatedTopics(category: string): string {
  const categoryFeatures: Record<string, string[]> = {
    resilience: ["http-resilience", "generic-resilience", "rate-limiting"],
    caching: ["hybrid-cache", "output-caching"],
    time: ["time-provider", "periodic-timer"],
    di: ["keyed-services", "options-configuration"],
    apis: ["problem-details", "minimal-apis", "native-openapi"],
    performance: ["source-generators"],
    cloud: ["aspire"],
    communication: ["channels"],
  };

  const features = categoryFeatures[category] || [];

  if (features.length === 0) {
    return "";
  }

  const featureCommands = features
    .map((f) => `- \`mvp24h_modernization_guide({ feature: "${f}" })\``)
    .join("\n");

  return `## Related Features

Get detailed documentation for specific features:

${featureCommands}

## Other Categories

- \`mvp24h_modernization_guide({ category: "resilience" })\` - Resilience patterns
- \`mvp24h_modernization_guide({ category: "caching" })\` - Caching strategies
- \`mvp24h_modernization_guide({ category: "time" })\` - Time abstractions
- \`mvp24h_modernization_guide({ category: "di" })\` - DI enhancements
- \`mvp24h_modernization_guide({ category: "apis" })\` - API improvements
- \`mvp24h_modernization_guide({ category: "cloud" })\` - Cloud-native features
- \`mvp24h_modernization_guide({ category: "communication" })\` - Channels & messaging`;
}

function getFeatureDoc(feature: string): string {
  const files = featureToFiles[feature];

  if (!files || files.length === 0) {
    return getFeatureNotFoundMessage(feature);
  }

  // Check if all files exist
  const missingFiles = files.filter((f) => !docExists(f));
  if (missingFiles.length === files.length) {
    return getFeatureNotFoundMessage(feature);
  }

  // Load documentation from files
  const content = loadDocs(files);

  // Add related topics section
  const relatedSection = getRelatedTopicsSection(feature);

  // Add quick reference if applicable
  const quickRef = getQuickReference(feature);

  return `${content}

${quickRef}

${relatedSection}`;
}

function getFeatureNotFoundMessage(feature: string): string {
  const availableFeatures = Object.keys(featureToFiles).join(", ");

  return `Feature "${feature}" not found.

Available features: ${availableFeatures}

Use \`mvp24h_modernization_guide()\` without parameters to see a complete overview.`;
}

function getRelatedTopicsSection(feature: string): string {
  const related = relatedTopics[feature] || [];

  if (related.length === 0) {
    return "";
  }

  const commands = related
    .map((topic) => `- \`mvp24h_modernization_guide({ feature: "${topic}" })\` - ${getFeatureDescription(topic)}`)
    .join("\n");

  return `## Related Topics

${commands}

## Other Resources

- \`mvp24h_modernization_guide({ feature: "dotnet9-features" })\` - Complete .NET 9 features overview
- \`mvp24h_modernization_guide({ feature: "migration-guide" })\` - Migration from legacy code`;
}

function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    "http-resilience": "HTTP client resilience",
    "generic-resilience": "Generic resilience patterns",
    "rate-limiting": "API rate limiting",
    "hybrid-cache": "L1/L2 caching with stampede protection",
    "output-caching": "HTTP response caching",
    "time-provider": "Testable time abstraction",
    "periodic-timer": "Async-friendly periodic timer",
    "keyed-services": "Key-based DI resolution",
    "options-pattern": "Strongly-typed configuration",
    "options-configuration": "Strongly-typed configuration with validation",
    "problem-details": "RFC 7807 error responses",
    "minimal-apis": "Lightweight endpoints with TypedResults",
    "native-openapi": "Built-in OpenAPI support",
    "source-generators": "AOT-friendly code generation",
    "aspire": ".NET Aspire cloud-native stack",
    "channels": "High-performance producer/consumer",
    "dotnet9-features": ".NET 9 features overview",
    "migration-guide": "Migration from legacy code",
  };

  return descriptions[feature] || feature;
}

function getQuickReference(feature: string): string {
  const quickRefs: Record<string, string> = {
    "http-resilience": `## Quick Reference

### Key Package
\`\`\`bash
dotnet add package Microsoft.Extensions.Http.Resilience
\`\`\`

### Basic Usage
\`\`\`csharp
builder.Services.AddHttpClient("my-api")
    .AddStandardResilienceHandler();
\`\`\`

### Standard Handler Includes
- Rate limiter (concurrency)
- Total request timeout
- Retry (exponential backoff)
- Circuit breaker
- Attempt timeout`,

    "hybrid-cache": `## Quick Reference

### Key Package
\`\`\`bash
dotnet add package Microsoft.Extensions.Caching.Hybrid
\`\`\`

### Basic Usage
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

### Key Features
- L1 (memory) + L2 (distributed) caching
- Stampede protection (single factory call)
- Automatic serialization for L2`,

    "rate-limiting": `## Quick Reference

### Built-in (no package needed for ASP.NET Core)

### Basic Usage
\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("api", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 100;
    });
});

app.UseRateLimiter();
\`\`\`

### Limiter Types
- FixedWindow - X requests per time window
- SlidingWindow - Smoother rate limiting
- TokenBucket - Allows bursts
- Concurrency - Limit simultaneous requests`,

    "channels": `## Quick Reference

### Namespace
\`\`\`csharp
using System.Threading.Channels;
\`\`\`

### Basic Usage
\`\`\`csharp
// Create bounded channel
var channel = Channel.CreateBounded<Order>(100);

// Write
await channel.Writer.WriteAsync(order);
channel.Writer.Complete();

// Read
await foreach (var item in channel.Reader.ReadAllAsync())
{
    await ProcessAsync(item);
}
\`\`\`

### Channel Types
- Unbounded - No limit, no backpressure
- Bounded - Limited capacity with backpressure`,

    "aspire": `## Quick Reference

### Create Project
\`\`\`bash
dotnet new install Aspire.ProjectTemplates
dotnet new aspire-starter -n MyApp
\`\`\`

### AppHost Example
\`\`\`csharp
var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");
var api = builder.AddProject<Projects.MyApp_Api>("api")
    .WithReference(cache);

builder.Build().Run();
\`\`\`

### Key Components
- AppHost - Orchestration project
- ServiceDefaults - Shared configuration
- Dashboard - Built-in observability UI`,
  };

  return quickRefs[feature] || "";
}
