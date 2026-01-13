/**
 * Get Started Tool
 * 
 * Provides an overview of the Mvp24Hours framework and helps determine
 * the best starting point based on user needs.
 */

import { loadDoc, loadDocSection, docExists } from "../utils/doc-loader.js";

export const getStartedSchema = {
  type: "object" as const,
  properties: {
    focus: {
      type: "string",
      enum: ["overview", "quick-start", "packages", "all"],
      description: "What aspect to focus on: overview (framework intro), quick-start (minimal setup), packages (NuGet reference), all (complete guide)",
      default: "overview",
    },
  },
  required: [],
};

interface GetStartedArgs {
  focus?: "overview" | "quick-start" | "packages" | "all";
}

export async function getStarted(args: unknown): Promise<string> {
  const { focus = "overview" } = args as GetStartedArgs;

  const sections: string[] = [];

  // Always include the quick reference header
  sections.push(`# Mvp24Hours .NET Framework

> **AI Agent Note**: This is a modular framework for building .NET applications with best practices.
> Use the specialized tools (mvp24h_*) to get detailed guidance for specific topics.

## Quick Tool Reference

| Need | Tool to Use |
|------|-------------|
| Choose architecture template | \`mvp24h_architecture_advisor\` |
| Select database/ORM | \`mvp24h_database_advisor\` |
| Implement CQRS/Mediator | \`mvp24h_cqrs_guide\` |
| Add AI capabilities | \`mvp24h_ai_implementation\` |
| Use .NET 9 features | \`mvp24h_modernization_guide\` |
| Setup observability | \`mvp24h_observability_setup\` |
| Async messaging | \`mvp24h_messaging_patterns\` |
| Core patterns (Guards, Value Objects) | \`mvp24h_core_patterns\` |
| Pipeline, Caching, WebAPI, CronJob | \`mvp24h_infrastructure_guide\` |
| Mapping, Validation, Specification | \`mvp24h_reference_guide\` |
| Get specific template | \`mvp24h_get_template\` |
`);

  if (focus === "overview" || focus === "all") {
    sections.push(`## Framework Overview

Mvp24Hours is a comprehensive .NET framework that provides:

### Core Features
- **Entity Base Classes**: \`EntityBase<TKey>\`, \`IEntityLog\` for audit
- **Repository Pattern**: \`IRepository<T>\`, \`IRepositoryAsync<T>\`
- **Unit of Work**: Transaction management with \`IUnitOfWork\`
- **Business Results**: Standardized responses with \`IBusinessResult<T>\`
- **Pipeline Pattern**: Pipe and Filters with \`IPipelineAsync\`
- **Validation**: FluentValidation integration

### Architecture Templates
| Template | Complexity | Best For |
|----------|------------|----------|
| Minimal API | Low | Microservices, simple CRUDs |
| Simple N-Layers | Medium | Medium apps, clear separation |
| Complex N-Layers | High | Enterprise, complex logic |
| CQRS | High | Read/write separation |
| Event-Driven | High | Audit, event sourcing |
| Hexagonal | High | External integrations |
| Clean Architecture | High | Domain-centric apps |
| DDD | Very High | Complex business rules |
| Microservices | Very High | Independent deployments |

### Database Support
- **Relational**: SQL Server, PostgreSQL, MySQL (via EF Core)
- **NoSQL**: MongoDB
- **Cache**: Redis
- **Hybrid**: EF Core + Dapper for optimized queries

### AI Capabilities
- **Semantic Kernel**: Chat, RAG, Plugins
- **Semantic Kernel Graph**: Workflows, Multi-agent, Checkpointing
- **Agent Framework**: Enterprise agents, Middleware
`);
  }

  if (focus === "quick-start" || focus === "all") {
    sections.push(`## Quick Start

### 1. Create a new project

\`\`\`bash
dotnet new webapi -n MyProject
cd MyProject
\`\`\`

### 2. Add Mvp24Hours packages

\`\`\`bash
# Core (always needed)
dotnet add package Mvp24Hours.Core

# Choose your database package:
dotnet add package Mvp24Hours.Infrastructure.Data.EFCore  # For SQL Server/PostgreSQL/MySQL
# OR
dotnet add package Mvp24Hours.Infrastructure.Data.MongoDb  # For MongoDB

# For Web API features
dotnet add package Mvp24Hours.WebAPI

# For validation
dotnet add package FluentValidation.AspNetCore
\`\`\`

### 3. Configure in Program.cs

\`\`\`csharp
using Microsoft.EntityFrameworkCore;
using Mvp24Hours.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Mvp24Hours
builder.Services.AddMvp24HoursDbContext<MyDbContext>();
builder.Services.AddMvp24HoursRepository(options => options.MaxQtyByQueryPage = 100);

// Add validation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();
app.Run();
\`\`\`

### 4. Create your entity

\`\`\`csharp
using Mvp24Hours.Core.Entities;

public class Customer : EntityBase<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool Active { get; set; } = true;
}
\`\`\`

### 5. Use the repository

\`\`\`csharp
using Mvp24Hours.Core.Contract.Data;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly IUnitOfWorkAsync _uow;

    public CustomerController(IUnitOfWorkAsync uow) => _uow = uow;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var repo = _uow.GetRepository<Customer>();
        var result = await repo.ToBusinessPagingAsync();
        return Ok(result);
    }
}
\`\`\`
`);
  }

  if (focus === "packages" || focus === "all") {
    sections.push(`## NuGet Packages Reference

### Core Packages
\`\`\`xml
<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Application" Version="9.*" />
\`\`\`

### Database Packages
\`\`\`xml
<!-- Entity Framework Core -->
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.*" />
<!-- OR PostgreSQL -->
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.*" />
<!-- OR MySQL -->
<PackageReference Include="MySql.EntityFrameworkCore" Version="9.*" />

<!-- MongoDB -->
<PackageReference Include="Mvp24Hours.Infrastructure.Data.MongoDb" Version="9.*" />
<PackageReference Include="MongoDB.Driver" Version="2.*" />

<!-- Redis -->
<PackageReference Include="Mvp24Hours.Infrastructure.Caching.Redis" Version="9.*" />
<PackageReference Include="StackExchange.Redis" Version="2.*" />
\`\`\`

### Web API Packages
\`\`\`xml
<PackageReference Include="Mvp24Hours.WebAPI" Version="9.*" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.*" />
\`\`\`

### Messaging Packages
\`\`\`xml
<PackageReference Include="Mvp24Hours.Infrastructure.RabbitMQ" Version="9.*" />
<PackageReference Include="RabbitMQ.Client" Version="6.*" />
\`\`\`

### Pipeline Package
\`\`\`xml
<PackageReference Include="Mvp24Hours.Infrastructure.Pipe" Version="9.*" />
\`\`\`

### Validation & Mapping
\`\`\`xml
<PackageReference Include="FluentValidation" Version="11.*" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.*" />
<PackageReference Include="AutoMapper" Version="12.*" />
\`\`\`

### Logging
\`\`\`xml
<PackageReference Include="NLog.Web.AspNetCore" Version="5.*" />
\`\`\`
`);
  }

  // Add next steps
  sections.push(`## Next Steps

Based on your needs, use these tools:

1. **Choosing Architecture**: Call \`mvp24h_architecture_advisor\` with your requirements
2. **Database Setup**: Call \`mvp24h_database_advisor\` to configure data layer
3. **Get Template Code**: Call \`mvp24h_get_template\` with the template name

### Example Flow

\`\`\`
User: "I need to create an enterprise app with complex business rules"

1. mvp24h_architecture_advisor({ complexity: "high", business_rules: "complex" })
   → Recommends: Complex N-Layers or CQRS

2. mvp24h_database_advisor({ data_type: "relational", transactions: true })
   → Recommends: SQL Server + EF Core + Unit of Work

3. mvp24h_get_template({ template_name: "complex-nlayers" })
   → Returns: Complete project structure and code
\`\`\`
`);

  return sections.join("\n\n");
}
