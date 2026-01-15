/**
 * Core Patterns Tool
 *
 * Provides documentation for Mvp24Hours core module patterns.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

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
        "infrastructure-abstractions",
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

/**
 * Mapping of topics to documentation files
 */
const topicToFiles: Record<string, string[]> = {
  overview: ["core/home.md"],
  "guard-clauses": ["core/guard-clauses.md"],
  "value-objects": ["core/value-objects.md"],
  "strongly-typed-ids": ["core/strongly-typed-ids.md"],
  "functional-patterns": ["core/functional-patterns.md"],
  "smart-enums": ["core/smart-enums.md"],
  "entity-interfaces": ["core/entity-interfaces.md"],
  infrastructure: ["core/infrastructure-abstractions.md"],
  "infrastructure-abstractions": ["core/infrastructure-abstractions.md"],
  exceptions: ["core/exceptions.md"],
};

/**
 * Related topics for cross-referencing
 */
const relatedTopics: Record<string, string[]> = {
  "guard-clauses": ["value-objects", "exceptions"],
  "value-objects": [
    "guard-clauses",
    "entity-interfaces",
    "database/use-entity.md",
  ],
  "strongly-typed-ids": [
    "entity-interfaces",
    "value-objects",
    "database/use-entity.md",
  ],
  "functional-patterns": ["exceptions", "cqrs/commands.md", "cqrs/queries.md"],
  "smart-enums": ["value-objects", "entity-interfaces"],
  "entity-interfaces": [
    "strongly-typed-ids",
    "value-objects",
    "database/use-entity.md",
    "database/use-repository.md",
  ],
  infrastructure: [
    "infrastructure-abstractions",
    "modernization/time-provider.md",
    "ai-context/testing-patterns.md",
  ],
  "infrastructure-abstractions": [
    "modernization/time-provider.md",
    "ai-context/testing-patterns.md",
    "entity-interfaces",
  ],
  exceptions: [
    "guard-clauses",
    "functional-patterns",
    "ai-context/error-handling-patterns.md",
    "modernization/problem-details.md",
  ],
};

/**
 * Topic descriptions for overview
 */
const topicDescriptions: Record<string, string> = {
  "guard-clauses": "Defensive programming utilities for argument validation",
  "value-objects":
    "Immutable domain primitives (Email, CPF, CNPJ, Money, etc.)",
  "strongly-typed-ids": "Type-safe entity identifiers to prevent ID mix-ups",
  "functional-patterns": "Maybe<T>, Either<TLeft, TRight> monads for null safety",
  "smart-enums": "Enumeration<T> base class for rich enumerations with behavior",
  "entity-interfaces":
    "IEntity, IAuditableEntity, ISoftDeletable, ITenantEntity contracts",
  infrastructure:
    "IClock, IGuidGenerator abstractions for testability (alias for infrastructure-abstractions)",
  "infrastructure-abstractions":
    "IClock, IGuidGenerator, ICurrentUserProvider abstractions",
  exceptions:
    "BusinessException, ValidationException, NotFoundException hierarchy",
};

export async function corePatterns(args: unknown): Promise<string> {
  const { topic } = args as CorePatternsArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

async function getOverview(): Promise<string> {
  const topicList = Object.entries(topicDescriptions)
    .filter(([key]) => key !== "infrastructure") // Skip alias in list
    .map(([key, desc]) => `| \`${key}\` | ${desc} |`)
    .join("\n");

  // Try to load home.md for additional context
  let homeContent = "";
  if (docExists("core/home.md")) {
    homeContent = await loadDoc("core/home.md");
  }

  return `# Mvp24Hours Core Module

## Overview

The Core module provides foundational patterns and abstractions for building robust .NET applications.
It contains essential Value Objects, DDD patterns, Guard Clauses, and utilities used by all other modules.

## Available Topics

| Topic | Description |
|-------|-------------|
${topicList}

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

### Guard Clauses

\`\`\`csharp
using Mvp24Hours.Core.Helpers;

public void CreateOrder(string customerId, decimal amount)
{
    Guard.Against.NullOrEmpty(customerId, nameof(customerId));
    Guard.Against.NegativeOrZero(amount, nameof(amount));
}
\`\`\`

### Value Objects

\`\`\`csharp
using Mvp24Hours.Core.ValueObjects;

var email = Email.Create("user@example.com");
var cpf = Cpf.Create("123.456.789-09");
var money = Money.Create(99.99m, "BRL");
\`\`\`

## NuGet Package

\`\`\`bash
dotnet add package Mvp24Hours.Core
\`\`\`

Use \`mvp24h_core_patterns({ topic: "..." })\` for detailed documentation on each topic.

${homeContent ? `---\n\n## Additional Context\n\n${homeContent}` : ""}
`;
}

async function getTopicDoc(topic: string): Promise<string> {
  const files = topicToFiles[topic];

  if (!files) {
    const availableTopics = Object.keys(topicToFiles).join(", ");
    return `Topic "${topic}" not found. Available topics: ${availableTopics}`;
  }

  // Load documentation from files
  const docs = await loadDocs(files);

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
        return `- \`mvp24h_core_patterns({ topic: "${r}" })\`${desc ? ` - ${desc}` : ""}`;
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
    "guard-clauses": `

---

## Quick Reference

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

\`\`\`csharp
using Mvp24Hours.Core.Helpers;

Guard.Against.NullOrEmpty(name, nameof(name));
Guard.Against.NegativeOrZero(amount, nameof(amount));
Guard.Against.OutOfRange(age, nameof(age), 18, 120);
\`\`\`
`,

    "entity-interfaces": `

---

## Quick Reference

| Interface | Description |
|-----------|-------------|
| \`IEntityBase<TKey>\` | Base entity with typed ID |
| \`IEntityLog\` | Full audit (Created, Modified, Removed with user) |
| \`IEntityLogDate\` | Date audit only (without user) |
| \`EntityBase<TKey>\` | Base class implementation |
| \`EntityBaseLog<TKey>\` | Base class with audit |

\`\`\`csharp
using Mvp24Hours.Core.Entities;
using Mvp24Hours.Core.Contract.Domain;

public class Customer : EntityBase<Guid>, IEntityLog
{
    public string Name { get; set; }
    
    // IEntityLog
    public DateTime Created { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? Modified { get; set; }
    public string ModifiedBy { get; set; }
    public DateTime? Removed { get; set; }
    public string RemovedBy { get; set; }
}
\`\`\`
`,

    "infrastructure-abstractions": `

---

## Quick Reference

| Interface | Description |
|-----------|-------------|
| \`IClock\` | Abstracts system time (UtcNow, Now, Today) |
| \`IGuidGenerator\` | Abstracts GUID generation |
| \`ICurrentUserProvider\` | Current user context |
| \`ITenantProvider\` | Multi-tenant context |

### Registration

\`\`\`csharp
// Production
services.AddSingleton<IClock, SystemClock>();
services.AddSingleton<IGuidGenerator, DefaultGuidGenerator>();
services.AddScoped<ICurrentUserProvider, HttpContextUserProvider>();

// Testing
services.AddSingleton<IClock>(new TestClock(DateTime.UtcNow));
services.AddSingleton<IGuidGenerator>(new DeterministicGuidGenerator());
\`\`\`
`,

    infrastructure: `

---

## Quick Reference

| Interface | Description |
|-----------|-------------|
| \`IClock\` | Abstracts system time (UtcNow, Now, Today) |
| \`IGuidGenerator\` | Abstracts GUID generation |
| \`ICurrentUserProvider\` | Current user context |
| \`ITenantProvider\` | Multi-tenant context |

### Registration

\`\`\`csharp
// Production
services.AddSingleton<IClock, SystemClock>();
services.AddSingleton<IGuidGenerator, DefaultGuidGenerator>();
services.AddScoped<ICurrentUserProvider, HttpContextUserProvider>();

// Testing
services.AddSingleton<IClock>(new TestClock(DateTime.UtcNow));
services.AddSingleton<IGuidGenerator>(new DeterministicGuidGenerator());
\`\`\`
`,

    exceptions: `

---

## Quick Reference

| Exception | HTTP Status | Description |
|-----------|-------------|-------------|
| \`ValidationException\` | 400 | Input validation failures |
| \`NotFoundException\` | 404 | Entity not found |
| \`BusinessRuleException\` | 422 | Business rule violation |
| \`Mvp24HoursException\` | 500 | Base exception |

\`\`\`csharp
using Mvp24Hours.Core.Exceptions;

throw new ValidationException(errors);
throw new NotFoundException("Customer", customerId);
throw new BusinessRuleException("INSUFFICIENT_FUNDS", "Balance too low");
\`\`\`
`,

    "functional-patterns": `

---

## Quick Reference

| Pattern | Description |
|---------|-------------|
| \`Maybe<T>\` | Null-safe wrapper (Some/None) |
| \`Either<TLeft, TRight>\` | Error-or-success (Left/Right) |
| \`IBusinessResult<T>\` | Operation result with messages |

\`\`\`csharp
// Maybe
var result = Maybe.From(customer)
    .Map(c => c.Name)
    .ValueOr("Unknown");

// Either
return email.IsValid
    ? Either<Error, Email>.Right(email)
    : Either<Error, Email>.Left(new Error("Invalid email"));

// BusinessResult
return BusinessResult<T>.Success(data);
return BusinessResult<T>.Failure("Error message");
\`\`\`
`,

    "value-objects": `

---

## Quick Reference

| Value Object | Description |
|--------------|-------------|
| \`Email\` | Email with domain validation |
| \`Cpf\` | Brazilian CPF with validation |
| \`Cnpj\` | Brazilian CNPJ with validation |
| \`Money\` | Decimal with currency |
| \`Address\` | Complete address |
| \`DateRange\` | Start/end date range |
| \`Percentage\` | 0-100 percentage |
| \`PhoneNumber\` | Phone with validation |

\`\`\`csharp
using Mvp24Hours.Core.ValueObjects;

var email = Email.Create("user@example.com");
var cpf = Cpf.Create("123.456.789-09");
var money = Money.Create(99.99m, "BRL");
var total = money.Add(Money.Create(10m, "BRL"));
\`\`\`
`,

    "strongly-typed-ids": `

---

## Quick Reference

\`\`\`csharp
// Define strongly-typed ID
public readonly record struct CustomerId(Guid Value)
{
    public static CustomerId New() => new(Guid.NewGuid());
    public static implicit operator Guid(CustomerId id) => id.Value;
}

// Usage
public class Customer : EntityBase<CustomerId>
{
    public string Name { get; set; }
}

// Compile-time safety - can't mix IDs
void Process(OrderId orderId, CustomerId customerId) { }
// Process(customerId, orderId); // Won't compile!
\`\`\`

### EF Core Configuration

\`\`\`csharp
builder.Property(c => c.Id)
    .HasConversion(
        id => id.Value,
        value => new CustomerId(value));
\`\`\`
`,

    "smart-enums": `

---

## Quick Reference

\`\`\`csharp
public class OrderStatus : SmartEnum<OrderStatus>
{
    public static readonly OrderStatus Pending = new(1, "Pending", canCancel: true);
    public static readonly OrderStatus Confirmed = new(2, "Confirmed", canCancel: false);
    
    public bool CanCancel { get; }
    
    private OrderStatus(int id, string name, bool canCancel) : base(id, name)
    {
        CanCancel = canCancel;
    }
}

// Usage
var order = new Order { Status = OrderStatus.Pending };
if (order.Status.CanCancel) { /* cancel logic */ }

// Lookup
var status = OrderStatus.FromId(1);
var status = OrderStatus.FromName("Pending");
\`\`\`
`,
  };

  return quickRefs[topic] || "";
}
