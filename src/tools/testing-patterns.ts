/**
 * Testing Patterns Tool
 * 
 * Provides testing patterns and best practices for .NET applications.
 */

export const testingPatternsSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
        "unit-testing",
        "integration-testing",
        "mocking",
        "test-containers",
        "api-testing",
        "architecture-testing",
      ],
      description: "Testing topic to get documentation for",
    },
  },
  required: [],
};

interface TestingPatternsArgs {
  topic?: string;
}

export async function testingPatterns(args: unknown): Promise<string> {
  const { topic } = args as TestingPatternsArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

function getOverview(): string {
  return `# Testing Patterns

## Overview

Comprehensive testing strategies for .NET applications.

## Testing Pyramid

\`\`\`
         /\\
        /  \\     E2E Tests (Few)
       /----\\
      /      \\   Integration Tests (Some)
     /--------\\
    /          \\ Unit Tests (Many)
   /------------\\
\`\`\`

## Available Topics

| Topic | Description |
|-------|-------------|
| \`unit-testing\` | xUnit, test organization, assertions |
| \`integration-testing\` | WebApplicationFactory, database testing |
| \`mocking\` | Moq, NSubstitute patterns |
| \`test-containers\` | Docker-based integration tests |
| \`api-testing\` | HTTP client testing, response validation |
| \`architecture-testing\` | ArchUnitNET, dependency validation |

## Quick Start

\`\`\`bash
dotnet add package xunit
dotnet add package xunit.runner.visualstudio
dotnet add package Moq
dotnet add package FluentAssertions
dotnet add package Microsoft.AspNetCore.Mvc.Testing
\`\`\`

Use \`mvp24h_testing_patterns({ topic: "..." })\` for detailed documentation.
`;
}

function getTopicDoc(topic: string): string {
  const topics: Record<string, string> = {
    "unit-testing": `# Unit Testing

## Project Setup

\`\`\`bash
dotnet new xunit -n MyProject.Tests
dotnet add package FluentAssertions
dotnet add package Moq
\`\`\`

## Test Organization

\`\`\`csharp
// Naming: MethodName_StateUnderTest_ExpectedBehavior
public class CustomerServiceTests
{
    [Fact]
    public void CreateCustomer_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var repository = new Mock<ICustomerRepository>();
        var service = new CustomerService(repository.Object);
        var request = new CreateCustomerRequest("John", "john@example.com");

        // Act
        var result = service.CreateCustomer(request);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("John");
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("   ")]
    public void CreateCustomer_WithInvalidName_ThrowsValidationException(string? name)
    {
        // Arrange
        var service = new CustomerService(Mock.Of<ICustomerRepository>());
        var request = new CreateCustomerRequest(name!, "john@example.com");

        // Act & Assert
        var act = () => service.CreateCustomer(request);
        act.Should().Throw<ValidationException>()
            .WithMessage("*Name*required*");
    }
}
\`\`\`

## Arrange-Act-Assert (AAA)

\`\`\`csharp
[Fact]
public async Task GetOrder_ExistingId_ReturnsOrder()
{
    // Arrange - Setup test data and dependencies
    var orderId = Guid.NewGuid();
    var expectedOrder = new Order { Id = orderId, Total = 100m };
    
    var repository = new Mock<IOrderRepository>();
    repository
        .Setup(r => r.GetByIdAsync(orderId, It.IsAny<CancellationToken>()))
        .ReturnsAsync(expectedOrder);

    var service = new OrderService(repository.Object);

    // Act - Execute the method under test
    var result = await service.GetOrderAsync(orderId);

    // Assert - Verify the results
    result.Should().NotBeNull();
    result.Id.Should().Be(orderId);
    result.Total.Should().Be(100m);
    
    repository.Verify(r => r.GetByIdAsync(orderId, It.IsAny<CancellationToken>()), Times.Once);
}
\`\`\`

## Test Data Builders

\`\`\`csharp
public class CustomerBuilder
{
    private Guid _id = Guid.NewGuid();
    private string _name = "John Doe";
    private string _email = "john@example.com";
    private bool _active = true;

    public CustomerBuilder WithId(Guid id) { _id = id; return this; }
    public CustomerBuilder WithName(string name) { _name = name; return this; }
    public CustomerBuilder WithEmail(string email) { _email = email; return this; }
    public CustomerBuilder Inactive() { _active = false; return this; }

    public Customer Build() => new Customer
    {
        Id = _id,
        Name = _name,
        Email = _email,
        Active = _active
    };
}

// Usage
var customer = new CustomerBuilder()
    .WithName("Jane Doe")
    .WithEmail("jane@example.com")
    .Build();
\`\`\`

## FluentAssertions Examples

\`\`\`csharp
// Collections
customers.Should().HaveCount(3);
customers.Should().Contain(c => c.Name == "John");
customers.Should().BeInAscendingOrder(c => c.Name);
customers.Should().OnlyContain(c => c.Active);

// Objects
customer.Should().BeEquivalentTo(expectedCustomer);
customer.Should().NotBeNull();

// Exceptions
act.Should().Throw<InvalidOperationException>()
    .WithMessage("*not found*")
    .And.Data.Should().ContainKey("CustomerId");

// Async
await act.Should().ThrowAsync<TimeoutException>();
await result.Should().CompleteWithinAsync(TimeSpan.FromSeconds(5));
\`\`\`

## Test Fixtures (Shared Setup)

\`\`\`csharp
public class DatabaseFixture : IAsyncLifetime
{
    public MyDbContext Context { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        Context = new MyDbContext(options);
        await SeedDataAsync();
    }

    public Task DisposeAsync()
    {
        Context.Dispose();
        return Task.CompletedTask;
    }

    private async Task SeedDataAsync()
    {
        Context.Customers.AddRange(
            new Customer { Id = Guid.NewGuid(), Name = "Test Customer 1" },
            new Customer { Id = Guid.NewGuid(), Name = "Test Customer 2" }
        );
        await Context.SaveChangesAsync();
    }
}

[CollectionDefinition("Database")]
public class DatabaseCollection : ICollectionFixture<DatabaseFixture> { }

[Collection("Database")]
public class CustomerRepositoryTests
{
    private readonly DatabaseFixture _fixture;

    public CustomerRepositoryTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task GetAll_ReturnsSeededCustomers()
    {
        var repository = new CustomerRepository(_fixture.Context);
        var customers = await repository.GetAllAsync();
        customers.Should().HaveCount(2);
    }
}
\`\`\`
`,

    "integration-testing": `# Integration Testing

## WebApplicationFactory

\`\`\`csharp
using Microsoft.AspNetCore.Mvc.Testing;

public class CustomWebApplicationFactory<TProgram> 
    : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove real database
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<MyDbContext>));
            if (descriptor != null)
                services.Remove(descriptor);

            // Add in-memory database
            services.AddDbContext<MyDbContext>(options =>
            {
                options.UseInMemoryDatabase("TestDb");
            });

            // Replace external services with fakes
            services.AddSingleton<IEmailService, FakeEmailService>();
        });

        builder.UseEnvironment("Testing");
    }
}
\`\`\`

## API Integration Tests

\`\`\`csharp
public class CustomersApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory<Program> _factory;

    public CustomersApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCustomers_ReturnsSuccessAndCustomers()
    {
        // Arrange - Seed data
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        context.Customers.Add(new Customer { Name = "Test", Email = "test@test.com" });
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/customers");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var customers = await response.Content.ReadFromJsonAsync<List<CustomerDto>>();
        customers.Should().NotBeEmpty();
    }

    [Fact]
    public async Task CreateCustomer_WithValidData_Returns201()
    {
        // Arrange
        var request = new CreateCustomerDto { Name = "John", Email = "john@test.com" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/customers", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();

        var customer = await response.Content.ReadFromJsonAsync<CustomerDto>();
        customer!.Name.Should().Be("John");
    }

    [Fact]
    public async Task CreateCustomer_WithInvalidData_Returns400()
    {
        // Arrange
        var request = new CreateCustomerDto { Name = "", Email = "invalid" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/customers", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetCustomer_NonExistent_Returns404()
    {
        var response = await _client.GetAsync($"/api/customers/{Guid.NewGuid()}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
\`\`\`

## Authenticated Requests

\`\`\`csharp
public class AuthenticatedApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly CustomWebApplicationFactory<Program> _factory;

    public AuthenticatedApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    private HttpClient CreateAuthenticatedClient(string userId, string role = "User")
    {
        return _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddAuthentication("Test")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                        "Test", options => { });

                services.AddSingleton<IAuthenticationSchemeProvider, TestAuthSchemeProvider>();
            });
        })
        .CreateClient();
    }

    [Fact]
    public async Task AdminEndpoint_WithAdminUser_ReturnsSuccess()
    {
        var client = CreateAuthenticatedClient("admin-user", "Admin");
        var response = await client.GetAsync("/api/admin/dashboard");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}

public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) : base(options, logger, encoder) { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[] { new Claim(ClaimTypes.Name, "TestUser") };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Test");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
\`\`\`

## Database Cleanup Between Tests

\`\`\`csharp
public class CustomerIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Program> _factory;
    private IServiceScope _scope = null!;
    private MyDbContext _context = null!;

    public CustomerIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    public async Task InitializeAsync()
    {
        _scope = _factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<MyDbContext>();
        await _context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.Database.EnsureDeletedAsync();
        _scope.Dispose();
    }

    // Tests run with clean database each time
}
\`\`\`
`,

    "mocking": `# Mocking with Moq

## Basic Mocking

\`\`\`csharp
// Setup mock
var repository = new Mock<ICustomerRepository>();

// Setup return value
repository
    .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
    .ReturnsAsync(new Customer { Id = Guid.NewGuid(), Name = "John" });

// Setup with specific parameter
var customerId = Guid.NewGuid();
repository
    .Setup(r => r.GetByIdAsync(customerId, It.IsAny<CancellationToken>()))
    .ReturnsAsync(new Customer { Id = customerId, Name = "Specific" });

// Setup to throw exception
repository
    .Setup(r => r.GetByIdAsync(Guid.Empty, It.IsAny<CancellationToken>()))
    .ThrowsAsync(new NotFoundException("Customer", Guid.Empty));

// Use mock
var service = new CustomerService(repository.Object);
\`\`\`

## Verifying Calls

\`\`\`csharp
[Fact]
public async Task CreateCustomer_SavesAndPublishesEvent()
{
    // Arrange
    var repository = new Mock<ICustomerRepository>();
    var eventBus = new Mock<IEventBus>();
    var service = new CustomerService(repository.Object, eventBus.Object);

    // Act
    await service.CreateCustomerAsync(new CreateCustomerRequest("John", "john@test.com"));

    // Verify - Called once
    repository.Verify(r => r.AddAsync(
        It.Is<Customer>(c => c.Name == "John"),
        It.IsAny<CancellationToken>()), Times.Once);

    // Verify - Called with specific argument
    eventBus.Verify(e => e.PublishAsync(
        It.Is<CustomerCreatedEvent>(evt => evt.Name == "John"),
        It.IsAny<CancellationToken>()), Times.Once);

    // Verify - Never called
    repository.Verify(r => r.DeleteAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Never);
}
\`\`\`

## Callback and Capture

\`\`\`csharp
[Fact]
public async Task CreateCustomer_AssignsNewId()
{
    // Arrange
    Customer? savedCustomer = null;
    var repository = new Mock<ICustomerRepository>();
    
    repository
        .Setup(r => r.AddAsync(It.IsAny<Customer>(), It.IsAny<CancellationToken>()))
        .Callback<Customer, CancellationToken>((c, _) => savedCustomer = c);

    var service = new CustomerService(repository.Object);

    // Act
    await service.CreateCustomerAsync(new CreateCustomerRequest("John", "john@test.com"));

    // Assert
    savedCustomer.Should().NotBeNull();
    savedCustomer!.Id.Should().NotBeEmpty();
    savedCustomer.Name.Should().Be("John");
}
\`\`\`

## Mocking DbContext

\`\`\`csharp
public static class DbContextMockExtensions
{
    public static Mock<DbSet<T>> CreateMockDbSet<T>(this IEnumerable<T> data) where T : class
    {
        var queryable = data.AsQueryable();
        var mockSet = new Mock<DbSet<T>>();

        mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
        mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
        mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
        mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());

        return mockSet;
    }
}

[Fact]
public void GetActiveCustomers_ReturnsOnlyActive()
{
    // Arrange
    var customers = new List<Customer>
    {
        new Customer { Id = Guid.NewGuid(), Name = "Active", Active = true },
        new Customer { Id = Guid.NewGuid(), Name = "Inactive", Active = false }
    };

    var mockSet = customers.CreateMockDbSet();
    var mockContext = new Mock<MyDbContext>();
    mockContext.Setup(c => c.Customers).Returns(mockSet.Object);

    var repository = new CustomerRepository(mockContext.Object);

    // Act
    var result = repository.GetActive();

    // Assert
    result.Should().HaveCount(1);
    result.First().Name.Should().Be("Active");
}
\`\`\`

## Strict vs Loose Mocking

\`\`\`csharp
// Loose (default) - Returns default values for unconfigured methods
var looseMock = new Mock<IService>();

// Strict - Throws for any unconfigured call
var strictMock = new Mock<IService>(MockBehavior.Strict);
strictMock.Setup(s => s.DoSomething()).Returns(true);
// Any other method call will throw MockException

// Verify all setups were called
strictMock.VerifyAll();
\`\`\`

## Auto Mocking with AutoFixture

\`\`\`csharp
using AutoFixture;
using AutoFixture.AutoMoq;

public class CustomerServiceTests
{
    private readonly IFixture _fixture;

    public CustomerServiceTests()
    {
        _fixture = new Fixture().Customize(new AutoMoqCustomization());
    }

    [Fact]
    public async Task CreateCustomer_WithAutoFixture()
    {
        // AutoFixture creates the service with mocked dependencies
        var service = _fixture.Create<CustomerService>();
        var request = _fixture.Create<CreateCustomerRequest>();

        // Test
        var result = await service.CreateCustomerAsync(request);

        result.Should().NotBeNull();
    }
}
\`\`\`
`,

    "test-containers": `# TestContainers

## Overview

TestContainers provides Docker-based integration testing.

## Installation

\`\`\`bash
dotnet add package Testcontainers
dotnet add package Testcontainers.MsSql
dotnet add package Testcontainers.PostgreSql
dotnet add package Testcontainers.Redis
dotnet add package Testcontainers.RabbitMq
\`\`\`

## SQL Server Container

\`\`\`csharp
using Testcontainers.MsSql;

public class SqlServerFixture : IAsyncLifetime
{
    private readonly MsSqlContainer _container = new MsSqlBuilder()
        .WithImage("mcr.microsoft.com/mssql/server:2022-latest")
        .Build();

    public string ConnectionString => _container.GetConnectionString();

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
    }

    public async Task DisposeAsync()
    {
        await _container.DisposeAsync();
    }
}

[CollectionDefinition("SqlServer")]
public class SqlServerCollection : ICollectionFixture<SqlServerFixture> { }

[Collection("SqlServer")]
public class CustomerRepositoryIntegrationTests
{
    private readonly SqlServerFixture _fixture;

    public CustomerRepositoryIntegrationTests(SqlServerFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task CreateAndRetrieveCustomer()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseSqlServer(_fixture.ConnectionString)
            .Options;

        await using var context = new MyDbContext(options);
        await context.Database.EnsureCreatedAsync();

        var repository = new CustomerRepository(context);

        // Act
        var customer = new Customer { Name = "Test", Email = "test@test.com" };
        await repository.AddAsync(customer);
        await context.SaveChangesAsync();

        var retrieved = await repository.GetByIdAsync(customer.Id);

        // Assert
        retrieved.Should().NotBeNull();
        retrieved!.Name.Should().Be("Test");
    }
}
\`\`\`

## PostgreSQL Container

\`\`\`csharp
using Testcontainers.PostgreSql;

public class PostgresFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder()
        .WithImage("postgres:15-alpine")
        .Build();

    public string ConnectionString => _container.GetConnectionString();

    public async Task InitializeAsync() => await _container.StartAsync();
    public async Task DisposeAsync() => await _container.DisposeAsync();
}
\`\`\`

## Redis Container

\`\`\`csharp
using Testcontainers.Redis;

public class RedisFixture : IAsyncLifetime
{
    private readonly RedisContainer _container = new RedisBuilder()
        .WithImage("redis:7-alpine")
        .Build();

    public string ConnectionString => _container.GetConnectionString();

    public async Task InitializeAsync() => await _container.StartAsync();
    public async Task DisposeAsync() => await _container.DisposeAsync();
}

[Collection("Redis")]
public class CacheServiceTests
{
    private readonly RedisFixture _fixture;

    public CacheServiceTests(RedisFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task SetAndGetValue()
    {
        var multiplexer = await ConnectionMultiplexer.ConnectAsync(_fixture.ConnectionString);
        var cache = new RedisCacheService(multiplexer);

        await cache.SetAsync("key", "value", TimeSpan.FromMinutes(1));
        var result = await cache.GetAsync<string>("key");

        result.Should().Be("value");
    }
}
\`\`\`

## RabbitMQ Container

\`\`\`csharp
using Testcontainers.RabbitMq;

public class RabbitMqFixture : IAsyncLifetime
{
    private readonly RabbitMqContainer _container = new RabbitMqBuilder()
        .WithImage("rabbitmq:3-management-alpine")
        .Build();

    public string ConnectionString => _container.GetConnectionString();

    public async Task InitializeAsync() => await _container.StartAsync();
    public async Task DisposeAsync() => await _container.DisposeAsync();
}

[Collection("RabbitMq")]
public class MessageBusTests
{
    [Fact]
    public async Task PublishAndConsume()
    {
        var factory = new ConnectionFactory { Uri = new Uri(_fixture.ConnectionString) };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        // Test publish/consume
    }
}
\`\`\`

## WebApplicationFactory with Containers

\`\`\`csharp
public class IntegrationTestFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder().Build();
    private readonly RedisContainer _redisContainer = new RedisBuilder().Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Replace DbContext
            services.RemoveAll<DbContextOptions<MyDbContext>>();
            services.AddDbContext<MyDbContext>(options =>
                options.UseNpgsql(_dbContainer.GetConnectionString()));

            // Replace Redis
            services.RemoveAll<IDistributedCache>();
            services.AddStackExchangeRedisCache(options =>
                options.Configuration = _redisContainer.GetConnectionString());
        });
    }

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
        await _redisContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _dbContainer.DisposeAsync();
        await _redisContainer.DisposeAsync();
    }
}
\`\`\`
`,

    "api-testing": `# API Testing

## Response Validation

\`\`\`csharp
public class ProductApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    [Fact]
    public async Task GetProducts_ReturnsCorrectSchema()
    {
        var response = await _client.GetAsync("/api/products");

        response.Should().BeSuccessful();
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonSerializer.Deserialize<List<ProductDto>>(content);

        products.Should().AllSatisfy(p =>
        {
            p.Id.Should().NotBeEmpty();
            p.Name.Should().NotBeNullOrEmpty();
            p.Price.Should().BeGreaterThan(0);
        });
    }

    [Fact]
    public async Task GetProducts_ReturnsPaginatedResult()
    {
        var response = await _client.GetAsync("/api/products?page=1&limit=10");

        response.Should().BeSuccessful();
        response.Headers.Should().ContainKey("X-Total-Count");
        response.Headers.Should().ContainKey("X-Page");
    }
}
\`\`\`

## Custom Assertions

\`\`\`csharp
public static class HttpResponseAssertions
{
    public static async Task<T> ShouldBeSuccessWithContent<T>(this HttpResponseMessage response)
    {
        response.IsSuccessStatusCode.Should().BeTrue(
            $"Expected success but got {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");

        return await response.Content.ReadFromJsonAsync<T>()
            ?? throw new InvalidOperationException("Response content was null");
    }

    public static async Task ShouldBeBadRequestWithErrors(
        this HttpResponseMessage response,
        params string[] expectedErrors)
    {
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        problem.Should().NotBeNull();
        
        var allErrors = problem!.Errors.SelectMany(e => e.Value).ToList();
        foreach (var error in expectedErrors)
        {
            allErrors.Should().Contain(e => e.Contains(error));
        }
    }
}

// Usage
[Fact]
public async Task CreateProduct_ReturnsCreatedProduct()
{
    var request = new CreateProductDto { Name = "Widget", Price = 9.99m };
    
    var response = await _client.PostAsJsonAsync("/api/products", request);
    
    var product = await response.ShouldBeSuccessWithContent<ProductDto>();
    product.Name.Should().Be("Widget");
}

[Fact]
public async Task CreateProduct_InvalidData_ReturnsErrors()
{
    var request = new CreateProductDto { Name = "", Price = -1 };
    
    var response = await _client.PostAsJsonAsync("/api/products", request);
    
    await response.ShouldBeBadRequestWithErrors("Name", "Price");
}
\`\`\`

## Testing File Uploads

\`\`\`csharp
[Fact]
public async Task UploadFile_ReturnsFileUrl()
{
    // Arrange
    var content = new MultipartFormDataContent();
    var fileContent = new ByteArrayContent(Encoding.UTF8.GetBytes("test content"));
    fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("text/plain");
    content.Add(fileContent, "file", "test.txt");

    // Act
    var response = await _client.PostAsync("/api/files/upload", content);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var result = await response.Content.ReadFromJsonAsync<FileUploadResult>();
    result!.Url.Should().NotBeNullOrEmpty();
}
\`\`\`

## Contract Testing

\`\`\`csharp
// Verify API contract hasn't changed
[Fact]
public async Task GetProduct_ContractTest()
{
    var response = await _client.GetAsync("/api/products/1");
    var json = await response.Content.ReadAsStringAsync();

    // Verify required fields exist
    using var doc = JsonDocument.Parse(json);
    var root = doc.RootElement;

    root.TryGetProperty("id", out _).Should().BeTrue();
    root.TryGetProperty("name", out _).Should().BeTrue();
    root.TryGetProperty("price", out _).Should().BeTrue();
    root.TryGetProperty("createdAt", out _).Should().BeTrue();
}
\`\`\`
`,

    "architecture-testing": `# Architecture Testing

## ArchUnitNET

\`\`\`bash
dotnet add package TngTech.ArchUnitNET.xUnit
\`\`\`

## Layer Dependencies

\`\`\`csharp
using ArchUnitNET.Domain;
using ArchUnitNET.Loader;
using ArchUnitNET.Fluent;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

public class ArchitectureTests
{
    private static readonly Architecture Architecture = new ArchLoader()
        .LoadAssemblies(
            typeof(Customer).Assembly,           // Domain
            typeof(CustomerService).Assembly,    // Application
            typeof(CustomerRepository).Assembly, // Infrastructure
            typeof(CustomersController).Assembly // WebAPI
        )
        .Build();

    private readonly IObjectProvider<IType> DomainLayer = 
        Types().That().ResideInNamespace("MyApp.Domain").As("Domain Layer");

    private readonly IObjectProvider<IType> ApplicationLayer = 
        Types().That().ResideInNamespace("MyApp.Application").As("Application Layer");

    private readonly IObjectProvider<IType> InfrastructureLayer = 
        Types().That().ResideInNamespace("MyApp.Infrastructure").As("Infrastructure Layer");

    private readonly IObjectProvider<IType> PresentationLayer = 
        Types().That().ResideInNamespace("MyApp.WebAPI").As("Presentation Layer");

    [Fact]
    public void Domain_ShouldNotDependOnOtherLayers()
    {
        Types().That().Are(DomainLayer)
            .Should().NotDependOnAny(ApplicationLayer)
            .AndShould().NotDependOnAny(InfrastructureLayer)
            .AndShould().NotDependOnAny(PresentationLayer)
            .Check(Architecture);
    }

    [Fact]
    public void Application_ShouldOnlyDependOnDomain()
    {
        Types().That().Are(ApplicationLayer)
            .Should().NotDependOnAny(InfrastructureLayer)
            .AndShould().NotDependOnAny(PresentationLayer)
            .Check(Architecture);
    }

    [Fact]
    public void Infrastructure_ShouldNotDependOnPresentation()
    {
        Types().That().Are(InfrastructureLayer)
            .Should().NotDependOnAny(PresentationLayer)
            .Check(Architecture);
    }
}
\`\`\`

## Naming Conventions

\`\`\`csharp
[Fact]
public void Controllers_ShouldEndWithController()
{
    Classes().That()
        .AreAssignableTo(typeof(ControllerBase))
        .Should().HaveNameEndingWith("Controller")
        .Check(Architecture);
}

[Fact]
public void Services_ShouldEndWithService()
{
    Classes().That()
        .ImplementInterface(typeof(IService))
        .Should().HaveNameEndingWith("Service")
        .Check(Architecture);
}

[Fact]
public void Repositories_ShouldEndWithRepository()
{
    Classes().That()
        .ResideInNamespace("MyApp.Infrastructure.Data.Repositories")
        .Should().HaveNameEndingWith("Repository")
        .Check(Architecture);
}

[Fact]
public void Interfaces_ShouldStartWithI()
{
    Interfaces().Should()
        .HaveNameStartingWith("I")
        .Check(Architecture);
}
\`\`\`

## Dependency Rules

\`\`\`csharp
[Fact]
public void Controllers_ShouldNotDependOnRepositories()
{
    Classes().That()
        .AreAssignableTo(typeof(ControllerBase))
        .Should().NotDependOnAny(
            Classes().That().HaveNameEndingWith("Repository"))
        .Check(Architecture);
}

[Fact]
public void Domain_ShouldNotUseEntityFramework()
{
    Types().That().Are(DomainLayer)
        .Should().NotDependOnAny(
            Types().That().ResideInNamespace("Microsoft.EntityFrameworkCore"))
        .Check(Architecture);
}

[Fact]
public void Services_ShouldNotUseHttpContext()
{
    Classes().That()
        .ResideInNamespace("MyApp.Application.Services")
        .Should().NotDependOnAny(
            Types().That().ResideInNamespace("Microsoft.AspNetCore.Http"))
        .Check(Architecture);
}
\`\`\`

## CQRS Architecture Rules

\`\`\`csharp
[Fact]
public void Commands_ShouldBeInCommandsNamespace()
{
    Classes().That()
        .ImplementInterface(typeof(ICommand<>))
        .Should().ResideInNamespace("MyApp.Application.Commands", true)
        .Check(Architecture);
}

[Fact]
public void Queries_ShouldBeInQueriesNamespace()
{
    Classes().That()
        .ImplementInterface(typeof(IQuery<>))
        .Should().ResideInNamespace("MyApp.Application.Queries", true)
        .Check(Architecture);
}

[Fact]
public void CommandHandlers_ShouldHaveMatchingCommand()
{
    Classes().That()
        .HaveNameEndingWith("CommandHandler")
        .Should().ImplementInterface(typeof(ICommandHandler<,>))
        .Check(Architecture);
}
\`\`\`
`,
  };

  return topics[topic] || `Topic "${topic}" not found. Available topics: ${Object.keys(topics).join(", ")}`;
}
