/**
 * Database Advisor Tool
 * 
 * Recommends database technology and patterns based on data requirements.
 */

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
  },
  required: [],
};

interface DatabaseAdvisorArgs {
  data_type?: "relational" | "document" | "key-value" | "mixed";
  provider?: "sqlserver" | "postgresql" | "mysql" | "mongodb" | "redis";
  requirements?: string[];
  patterns?: string[];
}

export async function databaseAdvisor(args: unknown): Promise<string> {
  const {
    data_type,
    provider,
    requirements = [],
    patterns = [],
  } = args as DatabaseAdvisorArgs;

  // Determine recommended provider
  let recommendedProvider = provider || determineProvider(data_type, requirements);
  let recommendedPatterns = patterns.length > 0 ? patterns : determinePatterns(requirements);

  const providerInfo = getProviderInfo(recommendedProvider);
  const patternDocs = getPatternDocs(recommendedPatterns);

  return `# Database Configuration

## Recommended Database: **${providerInfo.name}**

### Why This Database?
${providerInfo.reasoning}

---

## NuGet Packages

\`\`\`xml
${providerInfo.packages}
\`\`\`

---

## Configuration

### appsettings.json

\`\`\`json
${providerInfo.appsettings}
\`\`\`

### Program.cs / ServiceBuilderExtensions

\`\`\`csharp
${providerInfo.programCs}
\`\`\`

---

## Entity Configuration

\`\`\`csharp
${providerInfo.entityConfig}
\`\`\`

---

## DbContext Setup

\`\`\`csharp
${providerInfo.dbContext}
\`\`\`

---

${patternDocs}

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

## Next Steps

1. Add the NuGet packages to your project
2. Configure the connection string
3. Create your DbContext
4. Register services in DI container
${patterns.includes("dapper") || requirements.includes("high-write-throughput") 
  ? "5. Consider hybrid approach with Dapper for read-heavy queries" 
  : ""}
`;
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

function getProviderInfo(provider: string) {
  const providers: Record<string, {
    name: string;
    reasoning: string;
    packages: string;
    appsettings: string;
    programCs: string;
    entityConfig: string;
    dbContext: string;
  }> = {
    sqlserver: {
      name: "SQL Server with Entity Framework Core",
      reasoning: "Enterprise-grade relational database with excellent .NET integration. Best for Windows environments and Azure deployments.",
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.*" />`,
      appsettings: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
  }
}`,
      programCs: `// In Program.cs or ServiceBuilderExtensions.cs
using Microsoft.EntityFrameworkCore;
using Mvp24Hours.Extensions;

services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

services.AddMvp24HoursDbContext<MyDbContext>();
services.AddMvp24HoursRepository(options => options.MaxQtyByQueryPage = 100);`,
      entityConfig: `using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(x => x.Email)
            .HasMaxLength(255);
            
        builder.HasIndex(x => x.Email)
            .IsUnique();
    }
}`,
      dbContext: `using Microsoft.EntityFrameworkCore;
using Mvp24Hours.Infrastructure.Data.EFCore;

public class MyDbContext : Mvp24HoursContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MyDbContext).Assembly);
    }
}`,
    },
    postgresql: {
      name: "PostgreSQL with Entity Framework Core",
      reasoning: "Open-source, highly performant relational database. Excellent for complex queries and JSON support. Cost-effective in cloud.",
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.*" />`,
      appsettings: `{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=mydb;Username=postgres;Password=YourPassword"
  }
}`,
      programCs: `// In Program.cs or ServiceBuilderExtensions.cs
using Microsoft.EntityFrameworkCore;
using Mvp24Hours.Extensions;

services.AddDbContext<MyDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

services.AddMvp24HoursDbContext<MyDbContext>();
services.AddMvp24HoursRepository(options => options.MaxQtyByQueryPage = 100);`,
      entityConfig: `using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("customers"); // PostgreSQL prefers lowercase
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        // PostgreSQL JSON column
        builder.Property(x => x.Metadata)
            .HasColumnType("jsonb");
    }
}`,
      dbContext: `using Microsoft.EntityFrameworkCore;
using Mvp24Hours.Infrastructure.Data.EFCore;

public class MyDbContext : Mvp24HoursContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MyDbContext).Assembly);
        
        // Use snake_case naming convention (PostgreSQL standard)
        // modelBuilder.UseSnakeCaseNamingConvention();
    }
}`,
    },
    mysql: {
      name: "MySQL with Entity Framework Core",
      reasoning: "Popular open-source database with wide hosting support. Good for web applications with moderate requirements.",
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.EFCore" Version="9.*" />
<PackageReference Include="MySql.EntityFrameworkCore" Version="8.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.*" />`,
      appsettings: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=mydb;User=root;Password=YourPassword;"
  }
}`,
      programCs: `// In Program.cs or ServiceBuilderExtensions.cs
using Microsoft.EntityFrameworkCore;
using Mvp24Hours.Extensions;

services.AddDbContext<MyDbContext>(options =>
    options.UseMySQL(configuration.GetConnectionString("DefaultConnection")));

services.AddMvp24HoursDbContext<MyDbContext>();
services.AddMvp24HoursRepository(options => options.MaxQtyByQueryPage = 100);`,
      entityConfig: `using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100)
            .HasCharSet("utf8mb4");
    }
}`,
      dbContext: `using Microsoft.EntityFrameworkCore;
using Mvp24Hours.Infrastructure.Data.EFCore;

public class MyDbContext : Mvp24HoursContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MyDbContext).Assembly);
    }
}`,
    },
    mongodb: {
      name: "MongoDB",
      reasoning: "Document database ideal for flexible schemas and horizontal scaling. Great for content management and real-time analytics.",
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Data.MongoDb" Version="9.*" />
<PackageReference Include="MongoDB.Driver" Version="2.*" />`,
      appsettings: `{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "Database": "mydb"
  }
}`,
      programCs: `// In Program.cs or ServiceBuilderExtensions.cs
using Mvp24Hours.Extensions;
using Mvp24Hours.Infrastructure.Data.MongoDb;

// Configure MongoDB options
services.Configure<MongoDbOptions>(configuration.GetSection("MongoDb"));

// Add Mvp24Hours MongoDB
services.AddMvp24HoursMongoDb();
services.AddMvp24HoursRepository();`,
      entityConfig: `using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Mvp24Hours.Core.Entities;

public class Customer : EntityBase<string>
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public override string Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; }

    [BsonElement("email")]
    public string Email { get; set; }

    [BsonElement("metadata")]
    public BsonDocument Metadata { get; set; }
}`,
      dbContext: `// MongoDB doesn't use DbContext, but you can create a collection registry
using MongoDB.Driver;

public interface IMongoCollections
{
    IMongoCollection<Customer> Customers { get; }
    IMongoCollection<Order> Orders { get; }
}

public class MongoCollections : IMongoCollections
{
    private readonly IMongoDatabase _database;

    public MongoCollections(IMongoDatabase database)
    {
        _database = database;
    }

    public IMongoCollection<Customer> Customers => 
        _database.GetCollection<Customer>("customers");
    
    public IMongoCollection<Order> Orders => 
        _database.GetCollection<Order>("orders");
}`,
    },
    redis: {
      name: "Redis",
      reasoning: "In-memory data store ideal for caching, sessions, and real-time data. Use as a secondary store alongside a primary database.",
      packages: `<PackageReference Include="Mvp24Hours.Core" Version="9.*" />
<PackageReference Include="Mvp24Hours.Infrastructure.Caching.Redis" Version="9.*" />
<PackageReference Include="StackExchange.Redis" Version="2.*" />
<PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="8.*" />`,
      appsettings: `{
  "Redis": {
    "Configuration": "localhost:6379",
    "InstanceName": "myapp_"
  }
}`,
      programCs: `// In Program.cs or ServiceBuilderExtensions.cs
using Mvp24Hours.Extensions;

// Add Redis distributed cache
services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = configuration["Redis:Configuration"];
    options.InstanceName = configuration["Redis:InstanceName"];
});

// Add Mvp24Hours caching
services.AddMvp24HoursCaching();`,
      entityConfig: `// Redis stores key-value pairs, typically serialized as JSON
// Use for caching entities from your primary database

public static class CacheKeys
{
    public static string Customer(Guid id) => $"customer:{id}";
    public static string CustomerList(int page) => $"customers:page:{page}";
}`,
      dbContext: `// Redis cache service wrapper
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

public class RedisCacheService
{
    private readonly IDistributedCache _cache;
    private readonly DistributedCacheEntryOptions _defaultOptions;

    public RedisCacheService(IDistributedCache cache)
    {
        _cache = cache;
        _defaultOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
            SlidingExpiration = TimeSpan.FromMinutes(10)
        };
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var data = await _cache.GetStringAsync(key);
        return data is null ? default : JsonSerializer.Deserialize<T>(data);
    }

    public async Task SetAsync<T>(string key, T value, DistributedCacheEntryOptions? options = null)
    {
        var data = JsonSerializer.Serialize(value);
        await _cache.SetStringAsync(key, data, options ?? _defaultOptions);
    }

    public async Task RemoveAsync(string key)
    {
        await _cache.RemoveAsync(key);
    }
}`,
    },
  };

  return providers[provider] || providers["postgresql"];
}

function getPatternDocs(patterns: string[]): string {
  const sections: string[] = [];

  if (patterns.includes("repository")) {
    sections.push(`## Repository Pattern

\`\`\`csharp
// Using Mvp24Hours built-in repository
public class CustomerController : ControllerBase
{
    private readonly IUnitOfWorkAsync _uow;

    public CustomerController(IUnitOfWorkAsync uow) => _uow = uow;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var repo = _uow.GetRepository<Customer>();
        
        // Paging
        var result = await repo.ToBusinessPagingAsync(page: 1, limit: 10);
        
        // With filter expression
        var filtered = await repo.GetByAsync(x => x.Active);
        
        return Ok(result);
    }
}
\`\`\`
`);
  }

  if (patterns.includes("unit-of-work")) {
    sections.push(`## Unit of Work Pattern

\`\`\`csharp
// Transaction management with Unit of Work
public async Task<IActionResult> CreateOrder(OrderDto dto)
{
    var customerRepo = _uow.GetRepository<Customer>();
    var orderRepo = _uow.GetRepository<Order>();

    // All operations in a single transaction
    var customer = await customerRepo.GetByIdAsync(dto.CustomerId);
    if (customer is null) return NotFound();

    var order = new Order { CustomerId = customer.Id, Total = dto.Total };
    await orderRepo.AddAsync(order);

    customer.OrderCount++;
    await customerRepo.ModifyAsync(customer);

    // Commit transaction
    await _uow.SaveChangesAsync();

    return Created($"/orders/{order.Id}", order);
}
\`\`\`
`);
  }

  if (patterns.includes("specification")) {
    sections.push(`## Specification Pattern

\`\`\`csharp
using Mvp24Hours.Core.Contract.Domain;
using System.Linq.Expressions;

// Define specification
public class ActiveCustomersSpec : ISpecificationQuery<Customer>
{
    private readonly string? _nameFilter;

    public ActiveCustomersSpec(string? nameFilter = null)
    {
        _nameFilter = nameFilter;
    }

    public Expression<Func<Customer, bool>> IsSatisfiedByExpression =>
        customer => customer.Active &&
            (string.IsNullOrEmpty(_nameFilter) || customer.Name.Contains(_nameFilter));
}

// Usage
var spec = new ActiveCustomersSpec(filter.Name);
var result = await repo.ToBusinessPagingAsync(spec.IsSatisfiedByExpression, page, limit);
\`\`\`
`);
  }

  if (patterns.includes("dapper") || patterns.includes("hybrid")) {
    sections.push(`## Hybrid Approach (EF Core + Dapper)

\`\`\`csharp
using Dapper;
using Microsoft.EntityFrameworkCore;

// Use EF Core for writes, Dapper for complex reads
public class CustomerRepository
{
    private readonly MyDbContext _context;

    public CustomerRepository(MyDbContext context) => _context = context;

    // EF Core for writes (transactions, change tracking)
    public async Task AddAsync(Customer customer)
    {
        await _context.Customers.AddAsync(customer);
        await _context.SaveChangesAsync();
    }

    // Dapper for optimized reads
    public async Task<IEnumerable<CustomerSummaryDto>> GetSummaryAsync()
    {
        var connection = _context.Database.GetDbConnection();
        
        return await connection.QueryAsync<CustomerSummaryDto>(@"
            SELECT 
                c.Id, c.Name, COUNT(o.Id) as OrderCount, SUM(o.Total) as TotalSpent
            FROM Customers c
            LEFT JOIN Orders o ON o.CustomerId = c.Id
            WHERE c.Active = 1
            GROUP BY c.Id, c.Name
            ORDER BY TotalSpent DESC
        ");
    }
}
\`\`\`
`);
  }

  return sections.length > 0 
    ? `## Recommended Patterns\n\n${sections.join("\n")}`
    : "";
}
