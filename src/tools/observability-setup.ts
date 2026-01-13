/**
 * Observability Setup Tool
 * 
 * Configures observability stack for .NET applications.
 */

export const observabilitySetupSchema = {
  type: "object" as const,
  properties: {
    component: {
      type: "string",
      enum: ["overview", "logging", "tracing", "metrics", "exporters", "migration"],
      description: "Observability component to configure",
    },
    exporter: {
      type: "string",
      enum: ["console", "jaeger", "zipkin", "otlp", "prometheus", "application-insights"],
      description: "Specific exporter to configure",
    },
  },
  required: [],
};

interface ObservabilitySetupArgs {
  component?: string;
  exporter?: string;
}

export async function observabilitySetup(args: unknown): Promise<string> {
  const { component, exporter } = args as ObservabilitySetupArgs;

  if (exporter) {
    return getExporterConfig(exporter);
  }

  if (component) {
    return getComponentDoc(component);
  }

  return getOverview();
}

function getOverview(): string {
  return `# Observability Setup

## Overview

Complete observability for .NET applications using OpenTelemetry.

## Three Pillars of Observability

| Pillar | Purpose | Tools |
|--------|---------|-------|
| **Logging** | Record events and errors | NLog, Serilog, OpenTelemetry |
| **Tracing** | Follow requests across services | OpenTelemetry, Jaeger, Zipkin |
| **Metrics** | Measure performance | Prometheus, Application Insights |

## Quick Setup

\`\`\`bash
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.SqlClient
dotnet add package OpenTelemetry.Exporter.Console
\`\`\`

## Basic Configuration

\`\`\`csharp
// Program.cs
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource
        .AddService(serviceName: "MyService", serviceVersion: "1.0.0"))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSqlClientInstrumentation()
        .AddConsoleExporter())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddConsoleExporter());
\`\`\`

## Next Steps

- Logging: \`mvp24h_observability_setup({ component: "logging" })\`
- Tracing: \`mvp24h_observability_setup({ component: "tracing" })\`
- Metrics: \`mvp24h_observability_setup({ component: "metrics" })\`
- Exporters: \`mvp24h_observability_setup({ component: "exporters" })\`
`;
}

function getComponentDoc(component: string): string {
  const components: Record<string, string> = {
    logging: `# Logging Configuration

## OpenTelemetry Logging

\`\`\`csharp
// Program.cs
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService(serviceName: "MyService"));
    
    options.IncludeFormattedMessage = true;
    options.IncludeScopes = true;
    
    options.AddConsoleExporter();
});
\`\`\`

## NLog Integration

### Installation

\`\`\`bash
dotnet add package NLog.Web.AspNetCore
dotnet add package NLog.Extensions.Logging
\`\`\`

### Configuration

\`\`\`xml
<!-- nlog.config -->
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      autoReload="true"
      internalLogLevel="Info">

  <extensions>
    <add assembly="NLog.Web.AspNetCore"/>
  </extensions>

  <targets>
    <target xsi:type="Console" name="console"
            layout="\${longdate}|\${level:uppercase=true}|\${logger}|\${message} \${exception:format=tostring}" />
    
    <target xsi:type="File" name="file"
            fileName="logs/app-\${shortdate}.log"
            layout="\${longdate}|\${level:uppercase=true}|\${logger}|\${message} \${exception:format=tostring}" />
    
    <target xsi:type="File" name="jsonFile"
            fileName="logs/app-\${shortdate}.json">
      <layout xsi:type="JsonLayout" includeAllProperties="true">
        <attribute name="time" layout="\${longdate}" />
        <attribute name="level" layout="\${level:upperCase=true}" />
        <attribute name="logger" layout="\${logger}" />
        <attribute name="message" layout="\${message}" />
        <attribute name="exception" layout="\${exception:format=tostring}" />
        <attribute name="traceId" layout="\${aspnet-TraceIdentifier}" />
      </layout>
    </target>
  </targets>

  <rules>
    <logger name="*" minlevel="Info" writeTo="console" />
    <logger name="*" minlevel="Warning" writeTo="file" />
    <logger name="*" minlevel="Debug" writeTo="jsonFile" />
  </rules>
</nlog>
\`\`\`

### Program.cs

\`\`\`csharp
using NLog.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Host.UseNLog();
\`\`\`

## Structured Logging

\`\`\`csharp
public class OrderService
{
    private readonly ILogger<OrderService> _logger;

    public OrderService(ILogger<OrderService> logger) => _logger = logger;

    public async Task ProcessOrderAsync(Order order)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object>
        {
            ["OrderId"] = order.Id,
            ["CustomerId"] = order.CustomerId
        });

        _logger.LogInformation(
            "Processing order {OrderId} for customer {CustomerId} with {ItemCount} items",
            order.Id, order.CustomerId, order.Items.Count);

        try
        {
            // Process order...
            _logger.LogInformation("Order {OrderId} processed successfully", order.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process order {OrderId}", order.Id);
            throw;
        }
    }
}
\`\`\`
`,

    tracing: `# Distributed Tracing

## Setup

\`\`\`bash
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.SqlClient
dotnet add package OpenTelemetry.Instrumentation.EntityFrameworkCore
\`\`\`

## Configuration

\`\`\`csharp
// Program.cs
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource
        .AddService(
            serviceName: builder.Configuration["ServiceName"] ?? "MyService",
            serviceVersion: "1.0.0")
        .AddAttributes(new Dictionary<string, object>
        {
            ["environment"] = builder.Environment.EnvironmentName
        }))
    .WithTracing(tracing => tracing
        // Auto-instrumentation
        .AddAspNetCoreInstrumentation(options =>
        {
            options.RecordException = true;
            options.Filter = httpContext => 
                !httpContext.Request.Path.StartsWithSegments("/health");
        })
        .AddHttpClientInstrumentation(options =>
        {
            options.RecordException = true;
        })
        .AddSqlClientInstrumentation(options =>
        {
            options.SetDbStatementForText = true;
            options.RecordException = true;
        })
        .AddEntityFrameworkCoreInstrumentation()
        
        // Exporters
        .AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri("http://localhost:4317");
        }));
\`\`\`

## Custom Spans

\`\`\`csharp
using System.Diagnostics;

public class PaymentService
{
    private static readonly ActivitySource ActivitySource = new("MyService.PaymentService");

    public async Task<PaymentResult> ProcessPaymentAsync(Payment payment)
    {
        using var activity = ActivitySource.StartActivity("ProcessPayment");
        activity?.SetTag("payment.id", payment.Id);
        activity?.SetTag("payment.amount", payment.Amount);
        activity?.SetTag("payment.currency", payment.Currency);

        try
        {
            // Validate
            using (var validateActivity = ActivitySource.StartActivity("ValidatePayment"))
            {
                await ValidatePaymentAsync(payment);
            }

            // Process
            using (var processActivity = ActivitySource.StartActivity("ChargePayment"))
            {
                var result = await ChargeAsync(payment);
                activity?.SetTag("payment.transaction_id", result.TransactionId);
                return result;
            }
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.RecordException(ex);
            throw;
        }
    }
}
\`\`\`

## Propagation

Trace context is automatically propagated through HTTP headers:
- \`traceparent\`: W3C trace context
- \`tracestate\`: Additional vendor-specific data

\`\`\`csharp
// HttpClient automatically propagates context
var response = await _httpClient.GetAsync("http://other-service/api/data");

// Manual propagation if needed
var propagator = Propagators.DefaultTextMapPropagator;
var context = new PropagationContext(Activity.Current?.Context ?? default, Baggage.Current);
propagator.Inject(context, request.Headers, (headers, key, value) => headers.Add(key, value));
\`\`\`
`,

    metrics: `# Metrics Configuration

## Setup

\`\`\`bash
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Runtime
dotnet add package OpenTelemetry.Exporter.Prometheus.AspNetCore
\`\`\`

## Configuration

\`\`\`csharp
// Program.cs
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        // Built-in instrumentation
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        
        // Custom meters
        .AddMeter("MyService.Orders")
        .AddMeter("MyService.Payments")
        
        // Prometheus exporter
        .AddPrometheusExporter());

var app = builder.Build();
app.MapPrometheusScrapingEndpoint(); // /metrics endpoint
\`\`\`

## Custom Metrics

\`\`\`csharp
using System.Diagnostics.Metrics;

public class OrderMetrics
{
    private readonly Counter<long> _ordersCreated;
    private readonly Counter<long> _ordersFailed;
    private readonly Histogram<double> _orderProcessingTime;
    private readonly ObservableGauge<int> _pendingOrders;

    private int _pendingOrderCount;

    public OrderMetrics(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create("MyService.Orders");

        _ordersCreated = meter.CreateCounter<long>(
            "orders.created",
            unit: "{orders}",
            description: "Number of orders created");

        _ordersFailed = meter.CreateCounter<long>(
            "orders.failed",
            unit: "{orders}",
            description: "Number of failed orders");

        _orderProcessingTime = meter.CreateHistogram<double>(
            "orders.processing_time",
            unit: "ms",
            description: "Order processing time");

        _pendingOrders = meter.CreateObservableGauge(
            "orders.pending",
            () => _pendingOrderCount,
            unit: "{orders}",
            description: "Number of pending orders");
    }

    public void RecordOrderCreated(string orderType)
    {
        _ordersCreated.Add(1, new KeyValuePair<string, object?>("order.type", orderType));
    }

    public void RecordOrderFailed(string orderType, string reason)
    {
        _ordersFailed.Add(1,
            new KeyValuePair<string, object?>("order.type", orderType),
            new KeyValuePair<string, object?>("failure.reason", reason));
    }

    public void RecordProcessingTime(double milliseconds, string orderType)
    {
        _orderProcessingTime.Record(milliseconds,
            new KeyValuePair<string, object?>("order.type", orderType));
    }

    public void SetPendingOrders(int count) => _pendingOrderCount = count;
}

// Registration
builder.Services.AddSingleton<OrderMetrics>();
\`\`\`

## Usage

\`\`\`csharp
public class OrderService
{
    private readonly OrderMetrics _metrics;
    private readonly Stopwatch _stopwatch = new();

    public OrderService(OrderMetrics metrics) => _metrics = metrics;

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        _stopwatch.Restart();

        try
        {
            var order = await ProcessOrderAsync(request);
            
            _stopwatch.Stop();
            _metrics.RecordOrderCreated(request.OrderType);
            _metrics.RecordProcessingTime(_stopwatch.ElapsedMilliseconds, request.OrderType);
            
            return order;
        }
        catch (Exception ex)
        {
            _metrics.RecordOrderFailed(request.OrderType, ex.GetType().Name);
            throw;
        }
    }
}
\`\`\`
`,

    exporters: `# Telemetry Exporters

## Console Exporter (Development)

\`\`\`csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddConsoleExporter())
    .WithMetrics(metrics => metrics.AddConsoleExporter());
\`\`\`

## OTLP Exporter (OpenTelemetry Collector)

\`\`\`bash
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
\`\`\`

\`\`\`csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri("http://localhost:4317");
            options.Protocol = OtlpExportProtocol.Grpc;
        }))
    .WithMetrics(metrics => metrics
        .AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri("http://localhost:4317");
        }));
\`\`\`

## Jaeger

\`\`\`bash
dotnet add package OpenTelemetry.Exporter.Jaeger
\`\`\`

\`\`\`csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddJaegerExporter(options =>
        {
            options.AgentHost = "localhost";
            options.AgentPort = 6831;
        }));
\`\`\`

## Zipkin

\`\`\`bash
dotnet add package OpenTelemetry.Exporter.Zipkin
\`\`\`

\`\`\`csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddZipkinExporter(options =>
        {
            options.Endpoint = new Uri("http://localhost:9411/api/v2/spans");
        }));
\`\`\`

## Prometheus

\`\`\`bash
dotnet add package OpenTelemetry.Exporter.Prometheus.AspNetCore
\`\`\`

\`\`\`csharp
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddPrometheusExporter());

var app = builder.Build();
app.MapPrometheusScrapingEndpoint(); // Exposes /metrics
\`\`\`

## Azure Application Insights

\`\`\`bash
dotnet add package Azure.Monitor.OpenTelemetry.AspNetCore
\`\`\`

\`\`\`csharp
builder.Services.AddOpenTelemetry()
    .UseAzureMonitor(options =>
    {
        options.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
    });
\`\`\`
`,
    migration: `# Migration from TelemetryHelper to OpenTelemetry

## Step 1: Add Packages

\`\`\`bash
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
\`\`\`

## Step 2: Configure OpenTelemetry

\`\`\`csharp
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService("MyService"))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddSource("MyService.Orders")
        .AddOtlpExporter())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddMeter("MyService.Orders")
        .AddOtlpExporter());
\`\`\`

## Step 3: Create Custom Instrumentation

\`\`\`csharp
public class OrderInstrumentation
{
    public static readonly ActivitySource ActivitySource = new("MyService.Orders");
    private readonly Counter<long> _ordersProcessed;
    private readonly Histogram<double> _processingTime;

    public OrderInstrumentation(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create("MyService.Orders");
        _ordersProcessed = meter.CreateCounter<long>("orders.processed");
        _processingTime = meter.CreateHistogram<double>("orders.processing_time", "ms");
    }
}
\`\`\`

## Migration Mapping

| TelemetryHelper | OpenTelemetry |
|-----------------|---------------|
| TrackEvent | Activity with tags |
| TrackMetric | Meter Counter/Histogram |
| TrackException | Activity.RecordException |
| TrackDependency | Auto-instrumentation |
| TrackRequest | Auto-instrumentation |
`,
  };

  return components[component] || `Component "${component}" not found.`;
}

function getExporterConfig(exporter: string): string {
  // Simplified - would return specific exporter documentation
  return getComponentDoc("exporters");
}
