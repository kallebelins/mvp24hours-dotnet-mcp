/**
 * Containerization Patterns Tool
 * 
 * Provides Docker and Kubernetes patterns for .NET applications.
 */

export const containerizationPatternsSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
        "dockerfile",
        "docker-compose",
        "kubernetes",
        "health-checks",
        "configuration",
      ],
      description: "Containerization topic to get documentation for",
    },
  },
  required: [],
};

interface ContainerizationPatternsArgs {
  topic?: string;
}

export async function containerizationPatterns(args: unknown): Promise<string> {
  const { topic } = args as ContainerizationPatternsArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

function getOverview(): string {
  return `# Containerization Patterns

## Overview

Docker and Kubernetes patterns for .NET applications.

## Available Topics

| Topic | Description |
|-------|-------------|
| \`dockerfile\` | Multi-stage builds, optimization |
| \`docker-compose\` | Local development, service orchestration |
| \`kubernetes\` | Deployments, services, config |
| \`health-checks\` | Liveness, readiness probes |
| \`configuration\` | ConfigMaps, secrets, environment |

## Quick Start

\`\`\`bash
# Build image
docker build -t myapp:latest .

# Run locally
docker run -p 8080:8080 myapp:latest

# Docker Compose
docker-compose up -d
\`\`\`

Use \`mvp24h_containerization_patterns({ topic: "..." })\` for detailed documentation.
`;
}

function getTopicDoc(topic: string): string {
  const topics: Record<string, string> = {
    dockerfile: `# Dockerfile Best Practices

## Multi-Stage Build

\`\`\`dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore (cached layer)
COPY ["src/MyApp.WebAPI/MyApp.WebAPI.csproj", "MyApp.WebAPI/"]
COPY ["src/MyApp.Core/MyApp.Core.csproj", "MyApp.Core/"]
COPY ["src/MyApp.Infrastructure/MyApp.Infrastructure.csproj", "MyApp.Infrastructure/"]
RUN dotnet restore "MyApp.WebAPI/MyApp.WebAPI.csproj"

# Copy everything and build
COPY src/ .
WORKDIR "/src/MyApp.WebAPI"
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Copy published app
COPY --from=publish /app/publish .

# Set environment
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "MyApp.WebAPI.dll"]
\`\`\`

## Optimized for Layer Caching

\`\`\`dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# 1. Copy only project files first
COPY *.sln .
COPY src/*/*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p src/\${file%.*}/ && mv $file src/\${file%.*}/; done

# 2. Restore (cached if csproj unchanged)
RUN dotnet restore

# 3. Copy source and build
COPY . .
RUN dotnet publish src/MyApp.WebAPI/MyApp.WebAPI.csproj -c Release -o /app --no-restore

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS final
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "MyApp.WebAPI.dll"]
\`\`\`

## AOT (Native) Build

\`\`\`dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . .
RUN dotnet publish -c Release -r linux-x64 -p:PublishAot=true -o /app

# Use distroless or minimal base
FROM mcr.microsoft.com/dotnet/runtime-deps:9.0-alpine AS final
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["./MyApp.WebAPI"]
\`\`\`

## .dockerignore

\`\`\`
**/.git
**/.vs
**/.vscode
**/bin
**/obj
**/publish
**/*.user
**/*.log
**/node_modules
Dockerfile*
docker-compose*
.dockerignore
*.md
.gitignore
\`\`\`

## Security Scanning

\`\`\`bash
# Scan image for vulnerabilities
docker scout cves myapp:latest

# Or use Trivy
trivy image myapp:latest
\`\`\`
`,

    "docker-compose": `# Docker Compose

## Development Environment

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: src/MyApp.WebAPI/Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=db;Database=myapp;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True
      - Redis__Configuration=redis:6379
      - RabbitMQ__HostName=rabbitmq
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
      rabbitmq:
        condition: service_healthy
    networks:
      - myapp-network

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong!Passw0rd
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql
    healthcheck:
      test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -Q "SELECT 1"
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - myapp-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - myapp-network

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=guest
      - RABBITMQ_DEFAULT_PASS=guest
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    networks:
      - myapp-network

  seq:
    image: datalust/seq:latest
    ports:
      - "5341:80"
    environment:
      - ACCEPT_EULA=Y
    volumes:
      - seq-data:/data
    networks:
      - myapp-network

volumes:
  sqlserver-data:
  redis-data:
  rabbitmq-data:
  seq-data:

networks:
  myapp-network:
    driver: bridge
\`\`\`

## Override for Development

\`\`\`yaml
# docker-compose.override.yml
version: '3.8'

services:
  api:
    build:
      target: build
    volumes:
      - ./src:/src
      - ~/.nuget/packages:/root/.nuget/packages:ro
    environment:
      - DOTNET_USE_POLLING_FILE_WATCHER=1
    command: dotnet watch run --project MyApp.WebAPI/MyApp.WebAPI.csproj
\`\`\`

## Production Override

\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    image: myregistry.azurecr.io/myapp:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
\`\`\`

## Commands

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Rebuild and start
docker-compose up -d --build

# Stop and remove
docker-compose down

# With production override
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
\`\`\`
`,

    kubernetes: `# Kubernetes

## Deployment

\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-api
  labels:
    app: myapp-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp-api
  template:
    metadata:
      labels:
        app: myapp-api
    spec:
      containers:
      - name: api
        image: myregistry.azurecr.io/myapp:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: connection-string
        envFrom:
        - configMapRef:
            name: myapp-config
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
      imagePullSecrets:
      - name: acr-secret
\`\`\`

## Service

\`\`\`yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-api-service
spec:
  type: ClusterIP
  selector:
    app: myapp-api
  ports:
  - port: 80
    targetPort: 8080
\`\`\`

## Ingress

\`\`\`yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.myapp.com
    secretName: myapp-tls
  rules:
  - host: api.myapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-api-service
            port:
              number: 80
\`\`\`

## ConfigMap

\`\`\`yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
data:
  ASPNETCORE_ENVIRONMENT: "Production"
  Logging__LogLevel__Default: "Information"
  Redis__Configuration: "redis-service:6379"
\`\`\`

## Secret

\`\`\`yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
type: Opaque
stringData:
  connection-string: "Server=db;Database=myapp;User Id=sa;Password=secret"
  jwt-key: "your-secret-jwt-key"
\`\`\`

## Horizontal Pod Autoscaler

\`\`\`yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
\`\`\`

## Apply All

\`\`\`bash
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml
\`\`\`
`,

    "health-checks": `# Health Checks

## ASP.NET Core Health Checks

\`\`\`csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy(), tags: new[] { "live" })
    .AddSqlServer(
        connectionString,
        name: "database",
        tags: new[] { "ready" })
    .AddRedis(
        redisConnectionString,
        name: "redis",
        tags: new[] { "ready" })
    .AddRabbitMQ(
        rabbitConnectionString,
        name: "rabbitmq",
        tags: new[] { "ready" });

var app = builder.Build();

// Liveness - Is the app running?
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("live"),
    ResponseWriter = WriteResponse
});

// Readiness - Can the app serve requests?
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = WriteResponse
});

// Full health check
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = WriteResponse
});

static Task WriteResponse(HttpContext context, HealthReport report)
{
    context.Response.ContentType = "application/json";
    
    var result = JsonSerializer.Serialize(new
    {
        status = report.Status.ToString(),
        checks = report.Entries.Select(e => new
        {
            name = e.Key,
            status = e.Value.Status.ToString(),
            description = e.Value.Description,
            duration = e.Value.Duration
        })
    });

    return context.Response.WriteAsync(result);
}
\`\`\`

## Custom Health Check

\`\`\`csharp
public class ExternalApiHealthCheck : IHealthCheck
{
    private readonly HttpClient _httpClient;

    public ExternalApiHealthCheck(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("ExternalApi");
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/health", cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                return HealthCheckResult.Healthy("External API is responsive");
            }

            return HealthCheckResult.Degraded(
                $"External API returned {response.StatusCode}");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(
                "External API is unreachable",
                exception: ex);
        }
    }
}

// Registration
builder.Services.AddHealthChecks()
    .AddCheck<ExternalApiHealthCheck>("external-api", tags: new[] { "ready" });
\`\`\`

## Kubernetes Probes

\`\`\`yaml
# In deployment.yaml
spec:
  containers:
  - name: api
    livenessProbe:
      httpGet:
        path: /health/live
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
    startupProbe:
      httpGet:
        path: /health/live
        port: 8080
      initialDelaySeconds: 0
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 30  # 30 * 5 = 150s max startup time
\`\`\`

## Health Check UI

\`\`\`bash
dotnet add package AspNetCore.HealthChecks.UI
dotnet add package AspNetCore.HealthChecks.UI.InMemory.Storage
\`\`\`

\`\`\`csharp
// Program.cs
builder.Services
    .AddHealthChecksUI()
    .AddInMemoryStorage();

app.MapHealthChecksUI(options =>
{
    options.UIPath = "/health-ui";
});
\`\`\`
`,

    configuration: `# Configuration in Containers

## Environment Variables

\`\`\`csharp
// Program.cs
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();  // Override with env vars
\`\`\`

\`\`\`yaml
# docker-compose.yml
services:
  api:
    environment:
      # Simple values
      - ASPNETCORE_ENVIRONMENT=Production
      # Nested config (use __ for hierarchy)
      - ConnectionStrings__DefaultConnection=Server=db;Database=myapp
      - Logging__LogLevel__Default=Information
      - MyApp__FeatureFlags__NewCheckout=true
\`\`\`

## ConfigMap Volume Mount

\`\`\`yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-appsettings
data:
  appsettings.Production.json: |
    {
      "Logging": {
        "LogLevel": {
          "Default": "Information"
        }
      },
      "AllowedHosts": "*"
    }
---
# deployment.yaml
spec:
  containers:
  - name: api
    volumeMounts:
    - name: config-volume
      mountPath: /app/appsettings.Production.json
      subPath: appsettings.Production.json
  volumes:
  - name: config-volume
    configMap:
      name: myapp-appsettings
\`\`\`

## Secrets as Files

\`\`\`yaml
# deployment.yaml
spec:
  containers:
  - name: api
    volumeMounts:
    - name: secrets-volume
      mountPath: /app/secrets
      readOnly: true
    env:
    - name: SecretsPath
      value: /app/secrets
  volumes:
  - name: secrets-volume
    secret:
      secretName: myapp-secrets
\`\`\`

\`\`\`csharp
// Program.cs - Read secrets from files
builder.Configuration.AddKeyPerFile(
    directoryPath: builder.Configuration["SecretsPath"] ?? "/app/secrets",
    optional: true);
\`\`\`

## Graceful Shutdown

\`\`\`csharp
// Program.cs
var app = builder.Build();

var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();

lifetime.ApplicationStopping.Register(() =>
{
    // Stop accepting new requests
    // Complete in-flight requests
    app.Logger.LogInformation("Application is stopping...");
});

lifetime.ApplicationStopped.Register(() =>
{
    app.Logger.LogInformation("Application stopped");
});

// In Kubernetes, set terminationGracePeriodSeconds
\`\`\`

\`\`\`yaml
# deployment.yaml
spec:
  terminationGracePeriodSeconds: 30
  containers:
  - name: api
    lifecycle:
      preStop:
        exec:
          command: ["/bin/sh", "-c", "sleep 5"]
\`\`\`

## Resource Limits

\`\`\`yaml
# deployment.yaml
spec:
  containers:
  - name: api
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
\`\`\`

\`\`\`csharp
// Respect memory limits in .NET
// .NET automatically reads CGroup limits in containers
// Configure GC for containers
Environment.SetEnvironmentVariable("DOTNET_GCHeapHardLimit", "0x1E000000"); // 500MB
\`\`\`
`,
  };

  return topics[topic] || `Topic "${topic}" not found. Available topics: ${Object.keys(topics).join(", ")}`;
}
