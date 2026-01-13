/**
 * Messaging Patterns Tool
 * 
 * Implements async messaging and background processing patterns.
 */

export const messagingPatternsSchema = {
  type: "object" as const,
  properties: {
    pattern: {
      type: "string",
      enum: ["overview", "rabbitmq", "hosted-service", "outbox", "channels"],
      description: "Messaging pattern to implement",
    },
  },
  required: [],
};

interface MessagingPatternsArgs {
  pattern?: string;
}

export async function messagingPatterns(args: unknown): Promise<string> {
  const { pattern } = args as MessagingPatternsArgs;

  if (pattern) {
    return getPatternDoc(pattern);
  }

  return getOverview();
}

function getOverview(): string {
  return `# Messaging Patterns

## Overview

Patterns for asynchronous communication and background processing.

## Available Patterns

| Pattern | Use Case | Complexity |
|---------|----------|------------|
| **RabbitMQ** | Inter-service communication, event-driven | Medium |
| **Hosted Service** | Background tasks, scheduled jobs | Low |
| **Outbox** | Reliable event publishing | High |
| **Channels** | In-process async queues | Low |

## Quick Decision Guide

### Need inter-service messaging?
→ Use \`mvp24h_messaging_patterns({ pattern: "rabbitmq" })\`

### Need background processing?
→ Use \`mvp24h_messaging_patterns({ pattern: "hosted-service" })\`

### Need guaranteed event delivery?
→ Use \`mvp24h_messaging_patterns({ pattern: "outbox" })\`

### Need in-process producer/consumer?
→ Use \`mvp24h_messaging_patterns({ pattern: "channels" })\`

## Comparison

| Feature | Direct API | RabbitMQ | Hosted Service |
|---------|:----------:|:--------:|:--------------:|
| Synchronous | ✅ | ❌ | ❌ |
| Fire & forget | ❌ | ✅ | ✅ |
| Guaranteed delivery | ✅ | ✅ | ⚠️ |
| Load balancing | ❌ | ✅ | ❌ |
| Multiple consumers | ❌ | ✅ | ❌ |
`;
}

function getPatternDoc(pattern: string): string {
  const patterns: Record<string, string> = {
    rabbitmq: `# RabbitMQ Integration

## Installation

\`\`\`bash
dotnet add package Mvp24Hours.Infrastructure.RabbitMQ
dotnet add package RabbitMQ.Client
\`\`\`

## Configuration

### appsettings.json

\`\`\`json
{
  "RabbitMQ": {
    "HostName": "localhost",
    "Port": 5672,
    "UserName": "guest",
    "Password": "guest",
    "VirtualHost": "/",
    "Exchange": "my-app",
    "ExchangeType": "topic",
    "DispatchConsumersAsync": true
  }
}
\`\`\`

### Program.cs

\`\`\`csharp
using Mvp24Hours.Extensions;

builder.Services.AddMvp24HoursRabbitMQ(builder.Configuration);
\`\`\`

## Publisher

\`\`\`csharp
using Mvp24Hours.Infrastructure.RabbitMQ;

public class OrderService
{
    private readonly IMvpRabbitMQClient _rabbitMQ;

    public OrderService(IMvpRabbitMQClient rabbitMQ)
    {
        _rabbitMQ = rabbitMQ;
    }

    public async Task CreateOrderAsync(Order order)
    {
        // Save order...

        // Publish event
        await _rabbitMQ.PublishAsync(
            routingKey: "order.created",
            message: new OrderCreatedEvent
            {
                OrderId = order.Id,
                CustomerId = order.CustomerId,
                Total = order.Total,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}

public record OrderCreatedEvent
{
    public Guid OrderId { get; init; }
    public Guid CustomerId { get; init; }
    public decimal Total { get; init; }
    public DateTime CreatedAt { get; init; }
}
\`\`\`

## Consumer

\`\`\`csharp
using Mvp24Hours.Infrastructure.RabbitMQ;

public class OrderCreatedConsumer : IMvpRabbitMQConsumerAsync
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OrderCreatedConsumer> _logger;

    public OrderCreatedConsumer(
        IServiceProvider serviceProvider,
        ILogger<OrderCreatedConsumer> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public string RoutingKey => "order.created";
    public string QueueName => "notification-service.order-created";
    public string Exchange => "my-app";

    public async Task<bool> ReceivedAsync(object message, string token)
    {
        try
        {
            var @event = JsonSerializer.Deserialize<OrderCreatedEvent>(
                message.ToString()!);

            if (@event is null) return false;

            _logger.LogInformation(
                "Processing OrderCreatedEvent: {OrderId}",
                @event.OrderId);

            using var scope = _serviceProvider.CreateScope();
            var emailService = scope.ServiceProvider
                .GetRequiredService<IEmailService>();

            await emailService.SendOrderConfirmationAsync(
                @event.OrderId,
                @event.CustomerId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process OrderCreatedEvent");
            return false;
        }
    }
}
\`\`\`

### Register Consumer

\`\`\`csharp
// Program.cs
builder.Services.AddMvp24HoursRabbitMQConsumer<OrderCreatedConsumer>();
\`\`\`

## Retry with Dead Letter

\`\`\`csharp
public class ResilientConsumer : IMvpRabbitMQConsumerAsync
{
    public int RetryCount => 3;
    public TimeSpan RetryDelay => TimeSpan.FromSeconds(5);
    public string DeadLetterExchange => "my-app.dlx";
    public string DeadLetterRoutingKey => "order.created.dlq";

    // ... rest of implementation
}
\`\`\`
`,

    "hosted-service": `# Hosted Service Pattern

## Basic Background Service

\`\`\`csharp
public class BackgroundWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<BackgroundWorker> _logger;

    public BackgroundWorker(
        IServiceProvider serviceProvider,
        ILogger<BackgroundWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Background worker starting");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessWorkAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in background worker");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }

        _logger.LogInformation("Background worker stopping");
    }

    private async Task ProcessWorkAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var repository = scope.ServiceProvider
            .GetRequiredService<IOrderRepository>();

        var pendingOrders = await repository.GetPendingOrdersAsync(stoppingToken);

        foreach (var order in pendingOrders)
        {
            if (stoppingToken.IsCancellationRequested) break;

            _logger.LogInformation("Processing order {OrderId}", order.Id);
            // Process order...
        }
    }
}

// Registration
builder.Services.AddHostedService<BackgroundWorker>();
\`\`\`

## Timed Background Service

\`\`\`csharp
public class ScheduledCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ScheduledCleanupService> _logger;
    private readonly PeriodicTimer _timer;

    public ScheduledCleanupService(
        IServiceProvider serviceProvider,
        ILogger<ScheduledCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _timer = new PeriodicTimer(TimeSpan.FromHours(1));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (await _timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await CleanupOldRecordsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cleanup failed");
            }
        }
    }

    private async Task CleanupOldRecordsAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<MyDbContext>();

        var cutoffDate = DateTime.UtcNow.AddDays(-30);
        
        await context.AuditLogs
            .Where(x => x.CreatedAt < cutoffDate)
            .ExecuteDeleteAsync(stoppingToken);

        _logger.LogInformation("Cleaned up records older than {CutoffDate}", cutoffDate);
    }

    public override void Dispose()
    {
        _timer.Dispose();
        base.Dispose();
    }
}
\`\`\`

## Queue Processing Service

\`\`\`csharp
public class QueueProcessorService : BackgroundService
{
    private readonly Channel<WorkItem> _channel;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<QueueProcessorService> _logger;

    public QueueProcessorService(
        Channel<WorkItem> channel,
        IServiceProvider serviceProvider,
        ILogger<QueueProcessorService> logger)
    {
        _channel = channel;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var item in _channel.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                await ProcessItemAsync(item, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process work item {ItemId}", item.Id);
            }
        }
    }

    private async Task ProcessItemAsync(WorkItem item, CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var processor = scope.ServiceProvider.GetRequiredService<IWorkItemProcessor>();
        await processor.ProcessAsync(item, stoppingToken);
    }
}

// Registration
builder.Services.AddSingleton(Channel.CreateBounded<WorkItem>(new BoundedChannelOptions(100)
{
    FullMode = BoundedChannelFullMode.Wait
}));
builder.Services.AddHostedService<QueueProcessorService>();
\`\`\`
`,

    outbox: `# Outbox Pattern

## Overview

The Outbox pattern ensures reliable event publishing by storing events in the same transaction as business data.

## Implementation

### Outbox Entity

\`\`\`csharp
public class OutboxMessage
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int RetryCount { get; set; }
    public string? Error { get; set; }
}
\`\`\`

### DbContext Configuration

\`\`\`csharp
public class MyDbContext : DbContext
{
    public DbSet<OutboxMessage> OutboxMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OutboxMessage>(entity =>
        {
            entity.HasIndex(e => e.ProcessedAt)
                .HasFilter("[ProcessedAt] IS NULL");
        });
    }
}
\`\`\`

### Outbox Service

\`\`\`csharp
public interface IOutboxService
{
    Task AddMessageAsync<T>(T message, CancellationToken cancellationToken = default);
}

public class OutboxService : IOutboxService
{
    private readonly MyDbContext _context;

    public OutboxService(MyDbContext context) => _context = context;

    public async Task AddMessageAsync<T>(T message, CancellationToken cancellationToken = default)
    {
        var outboxMessage = new OutboxMessage
        {
            Id = Guid.NewGuid(),
            Type = typeof(T).AssemblyQualifiedName!,
            Payload = JsonSerializer.Serialize(message),
            CreatedAt = DateTime.UtcNow
        };

        await _context.OutboxMessages.AddAsync(outboxMessage, cancellationToken);
    }
}
\`\`\`

### Usage in Service

\`\`\`csharp
public class OrderService
{
    private readonly MyDbContext _context;
    private readonly IOutboxService _outbox;

    public OrderService(MyDbContext context, IOutboxService outbox)
    {
        _context = context;
        _outbox = outbox;
    }

    public async Task CreateOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        // Create order
        var order = new Order { /* ... */ };
        await _context.Orders.AddAsync(order, cancellationToken);

        // Add event to outbox (same transaction)
        await _outbox.AddMessageAsync(new OrderCreatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId
        }, cancellationToken);

        // Single commit - both order and event
        await _context.SaveChangesAsync(cancellationToken);
    }
}
\`\`\`

### Outbox Processor

\`\`\`csharp
public class OutboxProcessor : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OutboxProcessor> _logger;

    public OutboxProcessor(
        IServiceProvider serviceProvider,
        ILogger<OutboxProcessor> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var timer = new PeriodicTimer(TimeSpan.FromSeconds(5));

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await ProcessOutboxAsync(stoppingToken);
        }
    }

    private async Task ProcessOutboxAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        var publisher = scope.ServiceProvider.GetRequiredService<IMvpRabbitMQClient>();

        var messages = await context.OutboxMessages
            .Where(m => m.ProcessedAt == null && m.RetryCount < 5)
            .OrderBy(m => m.CreatedAt)
            .Take(100)
            .ToListAsync(stoppingToken);

        foreach (var message in messages)
        {
            try
            {
                var type = Type.GetType(message.Type);
                var payload = JsonSerializer.Deserialize(message.Payload, type!);

                await publisher.PublishAsync(
                    routingKey: type!.Name,
                    message: payload!
                );

                message.ProcessedAt = DateTime.UtcNow;
                _logger.LogInformation("Published outbox message {Id}", message.Id);
            }
            catch (Exception ex)
            {
                message.RetryCount++;
                message.Error = ex.Message;
                _logger.LogError(ex, "Failed to publish outbox message {Id}", message.Id);
            }
        }

        await context.SaveChangesAsync(stoppingToken);
    }
}
\`\`\`
`,

    channels: `# Channels (Producer/Consumer)

## Overview

System.Threading.Channels provides high-performance in-process messaging.

## Basic Setup

\`\`\`csharp
// Create bounded channel (backpressure)
var channel = Channel.CreateBounded<WorkItem>(new BoundedChannelOptions(100)
{
    FullMode = BoundedChannelFullMode.Wait,
    SingleReader = false,
    SingleWriter = false
});

// Or unbounded channel
var unboundedChannel = Channel.CreateUnbounded<WorkItem>();
\`\`\`

## Producer/Consumer Pattern

\`\`\`csharp
// Work item
public record WorkItem(Guid Id, string Type, object Data);

// Producer service
public class WorkItemProducer
{
    private readonly Channel<WorkItem> _channel;

    public WorkItemProducer(Channel<WorkItem> channel) => _channel = channel;

    public async Task EnqueueAsync(WorkItem item, CancellationToken cancellationToken = default)
    {
        await _channel.Writer.WriteAsync(item, cancellationToken);
    }

    public bool TryEnqueue(WorkItem item)
    {
        return _channel.Writer.TryWrite(item);
    }
}

// Consumer service (background)
public class WorkItemConsumer : BackgroundService
{
    private readonly Channel<WorkItem> _channel;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<WorkItemConsumer> _logger;

    public WorkItemConsumer(
        Channel<WorkItem> channel,
        IServiceProvider serviceProvider,
        ILogger<WorkItemConsumer> logger)
    {
        _channel = channel;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var item in _channel.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                await ProcessItemAsync(item, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process {ItemId}", item.Id);
            }
        }
    }

    private async Task ProcessItemAsync(WorkItem item, CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        
        var handler = item.Type switch
        {
            "email" => scope.ServiceProvider.GetRequiredService<IEmailHandler>(),
            "sms" => scope.ServiceProvider.GetRequiredService<ISmsHandler>(),
            _ => throw new InvalidOperationException($"Unknown type: {item.Type}")
        };

        await handler.HandleAsync(item.Data, stoppingToken);
    }
}
\`\`\`

## Registration

\`\`\`csharp
// Program.cs
builder.Services.AddSingleton(Channel.CreateBounded<WorkItem>(
    new BoundedChannelOptions(1000)
    {
        FullMode = BoundedChannelFullMode.Wait
    }));

builder.Services.AddSingleton<WorkItemProducer>();
builder.Services.AddHostedService<WorkItemConsumer>();
\`\`\`

## Multiple Consumers

\`\`\`csharp
// Parallel processing with multiple consumers
public class ParallelWorkItemConsumer : BackgroundService
{
    private readonly Channel<WorkItem> _channel;
    private readonly int _workerCount = 4;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var workers = Enumerable.Range(0, _workerCount)
            .Select(_ => ProcessAsync(stoppingToken))
            .ToArray();

        await Task.WhenAll(workers);
    }

    private async Task ProcessAsync(CancellationToken stoppingToken)
    {
        await foreach (var item in _channel.Reader.ReadAllAsync(stoppingToken))
        {
            // Process item
        }
    }
}
\`\`\`

## Usage in Controller

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly WorkItemProducer _producer;

    public TasksController(WorkItemProducer producer) => _producer = producer;

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] TaskRequest request)
    {
        var workItem = new WorkItem(
            Guid.NewGuid(),
            request.Type,
            request.Data);

        await _producer.EnqueueAsync(workItem);

        return Accepted(new { workItem.Id });
    }
}
\`\`\`
`,
  };

  return patterns[pattern] || `Pattern "${pattern}" not found.`;
}
