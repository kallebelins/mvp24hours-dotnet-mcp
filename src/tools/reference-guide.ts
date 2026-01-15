/**
 * Reference Guide Tool
 *
 * Provides documentation for Mapping, Validation, Specification, and other reference topics.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

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
        "api-versioning",
        "error-handling",
        "telemetry",
      ],
      description: "Reference topic to get documentation for",
    },
  },
  required: [],
};

interface ReferenceGuideArgs {
  topic?: string;
}

/**
 * Mapping of topics to documentation files
 */
const topicToFiles: Record<string, string[]> = {
  overview: ["home.md"],
  mapping: ["mapping.md"],
  validation: ["validation.md"],
  specification: ["specification.md"],
  documentation: ["documentation.md"],
  migration: ["migration.md"],
  "api-versioning": ["ai-context/api-versioning-patterns.md"],
  "error-handling": ["ai-context/error-handling-patterns.md"],
  telemetry: ["telemetry.md"],
};

/**
 * Related topics for cross-referencing
 */
const relatedTopics: Record<string, string[]> = {
  mapping: [
    "cqrs/commands.md",
    "database/use-repository.md",
    "application-services.md",
  ],
  validation: [
    "cqrs/validation-behavior.md",
    "error-handling",
    "application-services.md",
  ],
  specification: [
    "cqrs/specifications.md",
    "database/use-repository.md",
  ],
  documentation: [
    "modernization/native-openapi.md",
    "api-versioning",
  ],
  migration: [
    "observability/migration.md",
    "modernization/migration-guide.md",
    "cqrs/getting-started.md",
  ],
  "api-versioning": [
    "documentation",
    "error-handling",
    "modernization/minimal-apis.md",
  ],
  "error-handling": [
    "validation",
    "modernization/problem-details.md",
    "core/exceptions.md",
    "cqrs/validation-behavior.md",
  ],
  telemetry: [
    "observability/migration.md",
    "observability/logging.md",
    "observability/tracing.md",
  ],
};

/**
 * Topic descriptions for overview
 */
const topicDescriptions: Record<string, string> = {
  mapping: "AutoMapper configuration and IMapFrom interface for object-to-object mapping",
  validation: "FluentValidation patterns and DataAnnotations for data validation",
  specification: "Specification pattern implementation for query composition",
  documentation: "API documentation with Swagger and Native OpenAPI (.NET 9+)",
  migration: "Migration guides from legacy to modern APIs and version upgrades",
  "api-versioning": "API versioning patterns (URL, Query String, Header, Media Type)",
  "error-handling": "Exception handling, ProblemDetails, and Result pattern with IBusinessResult",
  telemetry: "Telemetry configuration (deprecated - migrate to ILogger and OpenTelemetry)",
};

export async function referenceGuide(args: unknown): Promise<string> {
  const { topic } = args as ReferenceGuideArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

async function getOverview(): Promise<string> {
  const topicList = Object.entries(topicDescriptions)
    .map(([key, desc]) => `| \`${key}\` | ${desc} |`)
    .join("\n");

  return `# Reference Guide

## Overview

The Reference Guide provides documentation for cross-cutting concerns and supporting patterns 
used throughout Mvp24Hours applications. These patterns complement the core architecture 
with mapping, validation, documentation, and error handling capabilities.

## Available Topics

| Topic | Description |
|-------|-------------|
${topicList}

## Quick Reference

### Mapping (AutoMapper)

\`\`\`csharp
// Define mapping in DTO
public class CustomerDto : IMapFrom
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public void Mapping(Profile profile) 
        => profile.CreateMap<Customer, CustomerDto>();
}

// Registration
builder.Services.AddMvp24HoursMapService(Assembly.GetExecutingAssembly());

// Usage
var dto = _mapper.Map<CustomerDto>(customer);
\`\`\`

### Validation (FluentValidation)

\`\`\`csharp
public class CustomerValidator : AbstractValidator<Customer>
{
    public CustomerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
    }
}

// With CQRS
builder.Services.AddMvp24HoursCqrs(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddValidationBehavior(); // Automatic validation
});
\`\`\`

### Error Handling (IBusinessResult)

\`\`\`csharp
using Mvp24Hours.Core.Contract.ValueObjects.Logic;
using Mvp24Hours.Extensions;

public async Task<IBusinessResult<CustomerDto>> GetByIdAsync(int id)
{
    var customer = await _repository.GetByIdAsync(id);
    
    if (customer == null)
        return new CustomerDto().ToBusinessNotFound("Customer not found");
    
    return customer.ToDto().ToBusinessSuccess();
}
\`\`\`

### API Versioning

\`\`\`csharp
// URL Path versioning (recommended)
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CustomersController : ControllerBase { }

// Configuration
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});
\`\`\`

## Key NuGet Packages

| Package | Description |
|---------|-------------|
| \`Mvp24Hours.Infrastructure\` | AutoMapper integration (IMapFrom) |
| \`Mvp24Hours.WebAPI\` | Swagger/OpenAPI documentation |
| \`FluentValidation\` | Validation rules |
| \`Asp.Versioning.Mvc\` | API versioning |

Use \`mvp24h_reference_guide({ topic: "..." })\` for detailed documentation on each topic.
`;
}

async function getTopicDoc(topic: string): Promise<string> {
  const files = topicToFiles[topic];

  if (!files) {
    const availableTopics = Object.keys(topicToFiles).join(", ");
    return `Topic "${topic}" not found. Available topics: ${availableTopics}`;
  }

  // Load documentation from files
  let docs: string;
  try {
    docs = await loadDocs(files);
  } catch {
    // Fallback for missing files
    docs = `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\nDocumentation not yet available for this topic.`;
  }

  // Build related topics section
  const related = relatedTopics[topic];
  let relatedSection = "";
  if (related && related.length > 0) {
    const relatedList = related
      .map((r) => {
        if (r.includes("/")) {
          // It's a file reference
          return `- \`${r}\``;
        }
        // It's a topic reference
        const desc = topicDescriptions[r] || "";
        return `- \`mvp24h_reference_guide({ topic: "${r}" })\`${desc ? ` - ${desc}` : ""}`;
      })
      .join("\n");

    relatedSection = `

---

## Related Topics

${relatedList}
`;
  }

  // Build quick reference based on topic
  const quickRef = getQuickReference(topic);

  return `${docs}${quickRef}${relatedSection}`;
}

function getQuickReference(topic: string): string {
  const quickRefs: Record<string, string> = {
    mapping: `

---

## Quick Reference

| Interface | Description |
|-----------|-------------|
| \`IMapFrom\` | Define mapping with custom configuration |
| \`IMapFrom<T>\` | Simple automatic mapping |
| \`IMapper\` | AutoMapper injection interface |

### Extension Methods

| Method | Description |
|--------|-------------|
| \`MapIgnore()\` | Ignore a property in mapping |
| \`MapProperty()\` | Map to a different property name |
| \`MapBusinessTo()\` | Map IBusinessResult content |
| \`MapPagingTo()\` | Map IPagingResult content |

\`\`\`csharp
// Registration
builder.Services.AddMvp24HoursMapService(Assembly.GetExecutingAssembly());

// Usage with IMapper
var dto = _mapper.Map<CustomerDto>(entity);
var entities = _mapper.Map<IEnumerable<Customer>>(dtos);
_mapper.Map(updateDto, existingEntity); // Update existing
\`\`\`
`,

    validation: `

---

## Quick Reference

| Approach | Description |
|----------|-------------|
| FluentValidation | Declarative rules with AbstractValidator |
| DataAnnotations | Attribute-based validation |
| CQRS ValidationBehavior | Automatic pipeline validation |
| IValidationService | Manual validation in services |

### Common Rules

| Rule | Description |
|------|-------------|
| \`NotEmpty()\` | Required field |
| \`MaximumLength(n)\` | Max string length |
| \`EmailAddress()\` | Email format |
| \`GreaterThan(n)\` | Numeric comparison |
| \`MustAsync()\` | Async custom validation |
| \`SetValidator()\` | Nested object validation |

\`\`\`csharp
// Register validators
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Manual validation
var errors = entity.TryValidate(validator);
if (errors.AnySafe())
    return errors.ToBusiness<int>();
\`\`\`
`,

    specification: `

---

## Quick Reference

| Interface | Description |
|-----------|-------------|
| \`ISpecificationQuery<T>\` | Query specification with expression |
| \`Specification<T>\` | Base class with ToExpression() |

### Operators

| Operator | Description |
|----------|-------------|
| \`And<T, TSpec>()\` | Combine with AND |
| \`Or<T, TSpec>()\` | Combine with OR |
| \`Not<T, TSpec>()\` | Negate specification |

\`\`\`csharp
// Define specification
public class ActiveCustomersSpec : ISpecificationQuery<Customer>
{
    public Expression<Func<Customer, bool>> IsSatisfiedByExpression 
        => x => x.Active && x.Removed == null;
}

// Compose specifications
Expression<Func<Customer, bool>> filter = x => x.Active;
filter = filter
    .And<Customer, CustomerHasEmailSpec>()
    .Not<Customer, CustomerIsBlockedSpec>();
\`\`\`
`,

    documentation: `

---

## Quick Reference

| Approach | Best For |
|----------|----------|
| Swashbuckle | .NET 8 and earlier |
| Native OpenAPI | .NET 9+ (recommended) |

### Native OpenAPI Benefits

| Feature | Native OpenAPI | Swashbuckle |
|---------|---------------|-------------|
| AOT Compatible | ✅ | ⚠️ Limited |
| Package Size | ~50KB | ~500KB |
| First-party Support | ✅ Microsoft | ❌ Third-party |

\`\`\`csharp
// .NET 9+ with Native OpenAPI
builder.Services.AddMvp24HoursNativeOpenApi(options =>
{
    options.Title = "My API";
    options.Version = "1.0.0";
    options.EnableSwaggerUI = true;
});

app.MapMvp24HoursNativeOpenApi();

// Legacy Swashbuckle
builder.Services.AddMvp24HoursSwagger("My API", version: "v1");
\`\`\`
`,

    migration: `

---

## Quick Reference

### Version Migration Summary

| From | To | Key Changes |
|------|-----|-------------|
| v8.x | v9.0 | TelemetryHelper → ILogger, HttpPolicyHelper → Resilience |
| v9.0 | v9.1 | CQRS, Observability, TimeProvider |

### Deprecated APIs

| Deprecated | Replacement |
|------------|-------------|
| \`TelemetryHelper\` | \`ILogger<T>\` |
| \`HttpPolicyHelper\` | \`AddMvpResilience()\` |
| \`MultiLevelCache\` | \`HybridCache\` |
| \`ServiceProviderHelper\` | Dependency Injection |
| \`AutoMapperHelper\` | \`IMapper\` injection |

\`\`\`csharp
// Recommended pattern for all migrations
// 1. Use dependency injection
// 2. Use modern .NET native APIs
// 3. Follow CQRS for complex operations
\`\`\`
`,

    "api-versioning": `

---

## Quick Reference

| Strategy | Example | Use Case |
|----------|---------|----------|
| URL Path | \`/api/v1/customers\` | RESTful APIs (recommended) |
| Query String | \`?api-version=1.0\` | Backward compatibility |
| Header | \`X-API-Version: 1.0\` | Clean URLs |
| Media Type | \`Accept: application/vnd.api.v1+json\` | Content negotiation |

### Key Components

| Component | Description |
|-----------|-------------|
| \`ApiVersionAttribute\` | Mark controller version |
| \`ApiVersionReader\` | Read version from request |
| \`IApiVersionDescriptionProvider\` | List available versions |

\`\`\`csharp
// Install package
dotnet add package Asp.Versioning.Mvc

// Configuration
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
\`\`\`
`,

    "error-handling": `

---

## Quick Reference

| Layer | Strategy | Implementation |
|-------|----------|----------------|
| Domain | Domain Exceptions | Custom exception types |
| Application | Result Pattern | \`IBusinessResult<T>\` |
| API | ProblemDetails | RFC 7807 standard |
| Global | Exception Middleware | Centralized handling |

### Exception Types

| Exception | HTTP Status | Use Case |
|-----------|-------------|----------|
| \`ValidationException\` | 400 | Input validation |
| \`NotFoundException\` | 404 | Entity not found |
| \`BusinessRuleException\` | 422 | Business rule violation |
| \`ConcurrencyException\` | 409 | Optimistic locking conflict |

### IBusinessResult Extensions

| Method | Description |
|--------|-------------|
| \`ToBusinessSuccess()\` | Success result with data |
| \`ToBusinessNotFound()\` | 404 result |
| \`ToBusinessError()\` | Error result with message |
| \`ToBusinessCreate()\` | 201 created result |
| \`ToBusinessWithMessages()\` | Result with multiple messages |

\`\`\`csharp
// Using IBusinessResult
if (customer == null)
    return new CustomerDto().ToBusinessNotFound("Customer not found");

return customer.ToDto().ToBusinessSuccess();
\`\`\`
`,

    telemetry: `

---

## Quick Reference

> ⚠️ **DEPRECATED**: TelemetryHelper is deprecated. Use ILogger<T> and OpenTelemetry instead.

### Migration Path

| Legacy | Modern |
|--------|--------|
| \`TelemetryHelper.Execute()\` | \`_logger.LogInformation()\` |
| \`TelemetryLevels.Verbose\` | \`LogLevel.Debug\` |
| \`TelemetryLevels.Error\` | \`LogLevel.Error\` |
| \`AddMvp24HoursTelemetry()\` | \`AddLogging()\` / \`AddOpenTelemetry()\` |

\`\`\`csharp
// Modern approach with ILogger
private readonly ILogger<MyService> _logger;

public MyService(ILogger<MyService> logger)
{
    _logger = logger;
}

public void DoWork(string token)
{
    _logger.LogDebug("Processing started. Token: {Token}", token);
}

// High-performance logging with source generators
[LoggerMessage(Level = LogLevel.Debug, Message = "Processing {Token}")]
static partial void LogProcessing(ILogger logger, string token);
\`\`\`
`,
  };

  return quickRefs[topic] || "";
}
