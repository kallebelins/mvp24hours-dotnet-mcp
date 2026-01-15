/**
 * Database Advisor Tool
 * 
 * Recommends database technology and patterns based on data requirements.
 * Uses real documentation from .md files instead of hardcoded content.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

export const databaseAdvisorSchema = {
  type: "object" as const,
  properties: {
    data_type: {
      type: "string",
      enum: ["relational", "document", "key-value", "mixed"],
      description: "Type of data to store",
    },
    provider: {
      type: "string",
      enum: ["sqlserver", "postgresql", "mysql", "mongodb", "redis"],
      description: "Specific database provider (optional)",
    },
    requirements: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "transactions",
          "complex-queries",
          "high-write-throughput",
          "horizontal-scaling",
          "flexible-schema",
          "caching",
          "full-text-search",
          "relationships",
        ],
      },
      description: "Specific database requirements",
    },
    patterns: {
      type: "array",
      items: {
        type: "string",
        enum: ["repository", "unit-of-work", "specification", "dapper", "hybrid"],
      },
      description: "Patterns to implement",
    },
    topic: {
      type: "string",
      enum: [
        "overview",
        "relational",
        "nosql",
        "repository",
        "unit-of-work",
        "entity",
        "context",
        "service",
        "efcore-advanced",
        "mongodb-advanced",
      ],
      description: "Specific topic to get documentation for",
    },
  },
  required: [],
};

interface DatabaseAdvisorArgs {
  data_type?: "relational" | "document" | "key-value" | "mixed";
  provider?: "sqlserver" | "postgresql" | "mysql" | "mongodb" | "redis";
  requirements?: string[];
  patterns?: string[];
  topic?: string;
}

// Mapping of topics to documentation files
const topicToFiles: Record<string, string[]> = {
  overview: [
    "ai-context/database-patterns.md",
  ],
  relational: [
    "database/relational.md",
  ],
  nosql: [
    "database/nosql.md",
  ],
  repository: [
    "database/use-repository.md",
  ],
  "unit-of-work": [
    "database/use-unitofwork.md",
  ],
  entity: [
    "database/use-entity.md",
  ],
  context: [
    "database/use-context.md",
  ],
  service: [
    "database/use-service.md",
  ],
  "efcore-advanced": [
    "database/efcore-advanced.md",
  ],
  "mongodb-advanced": [
    "database/mongodb-advanced.md",
  ],
};

// Related topics for each main topic
const relatedTopics: Record<string, string[]> = {
  overview: ["relational", "nosql", "repository", "unit-of-work"],
  relational: ["efcore-advanced", "entity", "context", "repository", "unit-of-work"],
  nosql: ["mongodb-advanced", "entity", "repository"],
  repository: ["unit-of-work", "entity", "service"],
  "unit-of-work": ["repository", "efcore-advanced"],
  entity: ["context", "repository", "relational", "nosql"],
  context: ["entity", "efcore-advanced", "relational"],
  service: ["repository", "unit-of-work"],
  "efcore-advanced": ["relational", "context", "repository"],
  "mongodb-advanced": ["nosql", "repository"],
};

// Provider to documentation files mapping
const providerToFiles: Record<string, string[]> = {
  sqlserver: ["database/relational.md", "database/efcore-advanced.md"],
  postgresql: ["database/relational.md", "database/efcore-advanced.md"],
  mysql: ["database/relational.md", "database/efcore-advanced.md"],
  mongodb: ["database/nosql.md", "database/mongodb-advanced.md"],
  redis: ["database/nosql.md"],
};

// Pattern to documentation files mapping
const patternToFiles: Record<string, string[]> = {
  repository: ["database/use-repository.md"],
  "unit-of-work": ["database/use-unitofwork.md"],
  specification: ["database/efcore-advanced.md"],
  dapper: ["database/use-unitofwork.md"],
  hybrid: ["database/efcore-advanced.md", "database/use-unitofwork.md"],
};

export async function databaseAdvisor(args: unknown): Promise<string> {
  const {
    data_type,
    provider,
    requirements = [],
    patterns = [],
    topic,
  } = args as DatabaseAdvisorArgs;

  // If a specific topic is requested, return that documentation
  if (topic) {
    return getTopicDocumentation(topic);
  }

  // If no specific parameters, return overview
  if (!data_type && !provider && requirements.length === 0 && patterns.length === 0) {
    return getTopicDocumentation("overview");
  }

  // Determine recommended provider
  const recommendedProvider = provider || determineProvider(data_type, requirements);
  const recommendedPatterns = patterns.length > 0 ? patterns : determinePatterns(requirements);

  // Load provider-specific documentation
  const providerDocs = await loadProviderDocs(recommendedProvider);
  const patternDocs = await loadPatternDocs(recommendedPatterns);

  const providerInfo = getProviderSummary(recommendedProvider);

  return `# Database Configuration Recommendation

## Recommended Database: **${providerInfo.name}**

### Why This Database?
${providerInfo.reasoning}

---

${getQuickReference()}

---

## Database Selection Matrix

| Requirement | SQL Server | PostgreSQL | MySQL | MongoDB | Redis |
|-------------|:----------:|:----------:|:-----:|:-------:|:-----:|
| ACID transactions | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Complex queries | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| High write throughput | ⚠️ | ✅ | ⚠️ | ✅ | ✅ |
| Horizontal scaling | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ |
| Flexible schema | ❌ | ⚠️ | ❌ | ✅ | ✅ |
| Relationships | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Cloud cost | $$$ | $$ | $ | $$ | $$ |

---

## Provider Documentation

${providerDocs}

---

${patternDocs ? `## Pattern Documentation\n\n${patternDocs}\n\n---\n\n` : ""}

## Next Steps

1. Add the NuGet packages to your project
2. Configure the connection string
3. Create your DbContext (for EF Core) or configure MongoDB options
4. Register services in DI container
${recommendedPatterns.includes("dapper") || requirements.includes("high-write-throughput") 
  ? "5. Consider hybrid approach with Dapper for read-heavy queries" 
  : ""}

---

${getRelatedTopicsSection(recommendedProvider === "mongodb" || recommendedProvider === "redis" ? "nosql" : "relational")}
`;
}

function getTopicDocumentation(topic: string): string {
  const files = topicToFiles[topic];
  
  if (!files || files.length === 0) {
    return `# Topic Not Found\n\nThe topic "${topic}" was not found. Available topics:\n${Object.keys(topicToFiles).map(t => `- ${t}`).join("\n")}`;
  }

  try {
    const content = loadDocs(files);
    const related = relatedTopics[topic] || [];
    
    return `${content}

---

${getQuickReference()}

---

${related.length > 0 ? getRelatedTopicsSection(topic) : ""}
`;
  } catch (error) {
    return `# Error Loading Documentation\n\nCould not load documentation for topic "${topic}". Error: ${error}`;
  }
}

async function loadProviderDocs(provider: string): Promise<string> {
  const files = providerToFiles[provider] || providerToFiles["postgresql"];
  
  try {
    return loadDocs(files);
  } catch (error) {
    return `Could not load provider documentation: ${error}`;
  }
}

async function loadPatternDocs(patterns: string[]): Promise<string> {
  if (patterns.length === 0) return "";
  
  const allFiles = new Set<string>();
  for (const pattern of patterns) {
    const files = patternToFiles[pattern];
    if (files) {
      files.forEach(f => allFiles.add(f));
    }
  }
  
  if (allFiles.size === 0) return "";
  
  try {
    return loadDocs(Array.from(allFiles));
  } catch (error) {
    return `Could not load pattern documentation: ${error}`;
  }
}

function determineProvider(
  dataType?: string,
  requirements: string[] = []
): string {
  if (requirements.includes("caching")) return "redis";
  if (requirements.includes("flexible-schema")) return "mongodb";
  if (requirements.includes("high-write-throughput")) return "postgresql";
  
  switch (dataType) {
    case "document": return "mongodb";
    case "key-value": return "redis";
    case "mixed": return "postgresql"; // Most flexible relational
    default: return "postgresql"; // Good default
  }
}

function determinePatterns(requirements: string[]): string[] {
  const patterns: string[] = ["repository", "unit-of-work"];
  
  if (requirements.includes("complex-queries")) {
    patterns.push("specification");
  }
  if (requirements.includes("high-write-throughput")) {
    patterns.push("dapper");
  }
  
  return patterns;
}

function getProviderSummary(provider: string): { name: string; reasoning: string } {
  const providers: Record<string, { name: string; reasoning: string }> = {
    sqlserver: {
      name: "SQL Server with Entity Framework Core",
      reasoning: "Enterprise-grade relational database with excellent .NET integration. Best for Windows environments and Azure deployments. Supports ACID transactions, complex queries, and relationships.",
    },
    postgresql: {
      name: "PostgreSQL with Entity Framework Core",
      reasoning: "Open-source, highly performant relational database. Excellent for complex queries, JSON support, and full-text search. Cost-effective in cloud environments and supports advanced features like JSONB columns.",
    },
    mysql: {
      name: "MySQL with Entity Framework Core",
      reasoning: "Popular open-source database with wide hosting support. Good for web applications with moderate requirements and cost-sensitive deployments.",
    },
    mongodb: {
      name: "MongoDB",
      reasoning: "Document database ideal for flexible schemas and horizontal scaling. Great for content management, real-time analytics, and applications with evolving data models.",
    },
    redis: {
      name: "Redis",
      reasoning: "In-memory data store ideal for caching, sessions, and real-time data. Use as a secondary store alongside a primary database for high-performance scenarios.",
    },
  };

  return providers[provider] || providers["postgresql"];
}

function getQuickReference(): string {
  return `## Quick Reference - Mvp24Hours Interfaces

### Repository Interfaces (\`Mvp24Hours.Core.Contract.Data\`)

| Interface | Description |
|-----------|-------------|
| \`IRepository<TEntity>\` | Synchronous repository for CRUD operations |
| \`IRepositoryAsync<TEntity>\` | Asynchronous repository for CRUD operations |
| \`IUnitOfWork\` | Synchronous Unit of Work for transaction management |
| \`IUnitOfWorkAsync\` | Asynchronous Unit of Work for transaction management |

### Entity Interfaces (\`Mvp24Hours.Core.Entities\`)

| Class/Interface | Description |
|-----------------|-------------|
| \`IEntityBase\` | Base interface for all entities |
| \`EntityBase<TKey>\` | Base entity class with typed ID |
| \`EntityBase\` | Base entity class with int ID |
| \`IEntityDateLog\` | Interface for date-based audit (Created, Modified, Removed) |
| \`IEntityLog<TUserKey>\` | Interface for full audit with user tracking |
| \`EntityBaseLog<TKey, TUserKey>\` | Base entity with full audit support |

### Business Result (\`Mvp24Hours.Core.Contract.ValueObjects.Logic\`)

| Interface | Description |
|-----------|-------------|
| \`IBusinessResult<T>\` | Wraps operation result with success/error info |
| \`IPagingResult<T>\` | Wraps paginated result with metadata |

### DbContext (\`Mvp24Hours.Infrastructure.Data.EFCore\`)

| Class | Description |
|-------|-------------|
| \`Mvp24HoursContext\` | Base DbContext with logging support |
| \`Mvp24HoursContextAsync\` | Async-optimized DbContext |

### Extension Methods

\`\`\`csharp
// DI Registration
services.AddMvp24HoursDbContext<TContext>();           // Register DbContext
services.AddMvp24HoursRepository();                     // Sync repository
services.AddMvp24HoursRepositoryAsync();               // Async repository

// MongoDB
services.AddMvp24HoursDbContext(options => { ... });   // Configure MongoDB
services.AddMvp24HoursRepositoryMongoDb();             // MongoDB repository

// Redis
services.AddMvp24HoursCaching();                       // Redis caching
services.AddMvp24HoursCachingRedis(connectionString);  // With connection string
\`\`\`
`;
}

function getRelatedTopicsSection(currentTopic: string): string {
  const related = relatedTopics[currentTopic] || [];
  
  if (related.length === 0) return "";

  const topicDescriptions: Record<string, string> = {
    overview: "Database patterns overview for AI agents",
    relational: "SQL Server, PostgreSQL, MySQL configuration with EF Core",
    nosql: "MongoDB and Redis configuration",
    repository: "Repository pattern implementation and usage",
    "unit-of-work": "Unit of Work pattern for transaction management",
    entity: "Entity implementation with audit support",
    context: "DbContext implementation and configuration",
    service: "Service layer using repository pattern",
    "efcore-advanced": "Advanced EF Core features: interceptors, bulk operations, multi-tenancy",
    "mongodb-advanced": "Advanced MongoDB features: GridFS, Change Streams, geospatial queries",
  };

  return `## Related Topics

Use \`mvp24h_database_advisor({ topic: "..." })\` to explore:

${related.map(t => `- **${t}**: ${topicDescriptions[t] || t}`).join("\n")}
`;
}
