/**
 * Observability Setup Tool
 * 
 * Configures observability stack for .NET applications.
 * Uses real documentation from .md files instead of hardcoded content.
 */

import { loadDoc, loadDocs, docExists } from "../utils/doc-loader.js";

export const observabilitySetupSchema = {
  type: "object" as const,
  properties: {
    component: {
      type: "string",
      enum: [
        "overview",
        "logging",
        "tracing",
        "metrics",
        "exporters",
        "migration",
        "audit",
        "cqrs-tracing",
        "cqrs-telemetry",
      ],
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

// Mapping of components to documentation files
const componentToFiles: Record<string, string[]> = {
  overview: [
    "observability/home.md",
    "ai-context/observability-patterns.md",
  ],
  logging: [
    "observability/logging.md",
  ],
  tracing: [
    "observability/tracing.md",
  ],
  metrics: [
    "observability/metrics.md",
  ],
  exporters: [
    "observability/exporters.md",
  ],
  migration: [
    "observability/migration.md",
  ],
  audit: [
    "cqrs/observability/audit.md",
  ],
  "cqrs-tracing": [
    "cqrs/observability/tracing.md",
  ],
  "cqrs-telemetry": [
    "cqrs/observability/telemetry.md",
  ],
};

// Related topics for each main component
const relatedTopics: Record<string, string[]> = {
  overview: ["logging", "tracing", "metrics", "exporters"],
  logging: ["tracing", "metrics", "audit", "cqrs-tracing"],
  tracing: ["logging", "metrics", "cqrs-tracing", "cqrs-telemetry"],
  metrics: ["tracing", "cqrs-telemetry", "exporters"],
  exporters: ["logging", "tracing", "metrics"],
  migration: ["overview", "logging", "tracing"],
  audit: ["cqrs-tracing", "cqrs-telemetry", "logging"],
  "cqrs-tracing": ["audit", "cqrs-telemetry", "tracing"],
  "cqrs-telemetry": ["cqrs-tracing", "audit", "metrics"],
};

// Exporter-specific documentation sections
const exporterToFiles: Record<string, string[]> = {
  console: ["observability/exporters.md"],
  jaeger: ["observability/exporters.md", "observability/tracing.md"],
  zipkin: ["observability/exporters.md", "observability/tracing.md"],
  otlp: ["observability/exporters.md", "observability/tracing.md", "observability/metrics.md"],
  prometheus: ["observability/exporters.md", "observability/metrics.md"],
  "application-insights": ["observability/exporters.md", "observability/tracing.md", "observability/metrics.md"],
};

export async function observabilitySetup(args: unknown): Promise<string> {
  const { component, exporter } = args as ObservabilitySetupArgs;

  if (exporter) {
    return getExporterConfig(exporter);
  }

  if (component) {
    return getComponentDoc(component);
  }

  return getComponentDoc("overview");
}

function getComponentDoc(component: string): string {
  const files = componentToFiles[component];
  
  if (!files || files.length === 0) {
    return `# Component Not Found

The component "${component}" was not found. Available components:
${Object.keys(componentToFiles).map(c => `- ${c}`).join("\n")}`;
  }

  try {
    const content = loadDocs(files);
    const related = relatedTopics[component] || [];
    
    return `${content}

---

${getQuickReference()}

---

${related.length > 0 ? getRelatedTopicsSection(component) : ""}
`;
  } catch (error) {
    return `# Error Loading Documentation

Could not load documentation for component "${component}". Error: ${error}`;
  }
}

function getExporterConfig(exporter: string): string {
  const files = exporterToFiles[exporter];
  
  if (!files || files.length === 0) {
    return `# Exporter Not Found

The exporter "${exporter}" was not found. Available exporters:
${Object.keys(exporterToFiles).map(e => `- ${e}`).join("\n")}`;
  }

  try {
    const content = loadDocs(files);
    const exporterInfo = getExporterSummary(exporter);
    
    return `# ${exporterInfo.name} Configuration

## Overview
${exporterInfo.description}

## Required Packages
\`\`\`bash
${exporterInfo.packages.map(p => `dotnet add package ${p}`).join("\n")}
\`\`\`

---

${content}

---

${getQuickReference()}

---

## Related Exporters

Use \`mvp24h_observability_setup({ exporter: "..." })\` to explore:

${Object.entries(exporterToFiles)
  .filter(([e]) => e !== exporter)
  .map(([e]) => `- **${e}**: ${getExporterSummary(e).shortDescription}`)
  .join("\n")}
`;
  } catch (error) {
    return `# Error Loading Exporter Documentation

Could not load documentation for exporter "${exporter}". Error: ${error}`;
  }
}

function getExporterSummary(exporter: string): { 
  name: string; 
  description: string;
  shortDescription: string;
  packages: string[];
} {
  const exporters: Record<string, { name: string; description: string; shortDescription: string; packages: string[] }> = {
    console: {
      name: "Console Exporter",
      description: "Writes telemetry data to the console. Best for development and debugging.",
      shortDescription: "Development and debugging output",
      packages: ["OpenTelemetry.Exporter.Console"],
    },
    jaeger: {
      name: "Jaeger Exporter",
      description: "Exports traces to Jaeger distributed tracing backend. Open-source, supports all-in-one deployment for development.",
      shortDescription: "Open-source distributed tracing",
      packages: ["OpenTelemetry.Exporter.Jaeger"],
    },
    zipkin: {
      name: "Zipkin Exporter",
      description: "Exports traces to Zipkin distributed tracing system. Lightweight and easy to set up.",
      shortDescription: "Lightweight distributed tracing",
      packages: ["OpenTelemetry.Exporter.Zipkin"],
    },
    otlp: {
      name: "OTLP Exporter (OpenTelemetry Protocol)",
      description: "Exports telemetry using OpenTelemetry Protocol (OTLP). Compatible with Jaeger, Grafana Tempo, and OpenTelemetry Collector.",
      shortDescription: "Universal protocol for Jaeger, Tempo, Collector",
      packages: ["OpenTelemetry.Exporter.OpenTelemetryProtocol"],
    },
    prometheus: {
      name: "Prometheus Exporter",
      description: "Exposes metrics in Prometheus format via HTTP endpoint (/metrics). Best for metrics monitoring with Grafana.",
      shortDescription: "Metrics endpoint for Grafana dashboards",
      packages: ["OpenTelemetry.Exporter.Prometheus.AspNetCore"],
    },
    "application-insights": {
      name: "Azure Application Insights",
      description: "Exports telemetry to Azure Monitor / Application Insights. Full APM solution for Azure environments.",
      shortDescription: "Azure APM and monitoring",
      packages: ["Azure.Monitor.OpenTelemetry.AspNetCore"],
    },
  };

  return exporters[exporter] || exporters["otlp"];
}

function getQuickReference(): string {
  return `## Quick Reference - Observability Interfaces

### OpenTelemetry Configuration

| Method | Description |
|--------|-------------|
| \`AddMvp24HoursObservability()\` | All-in-one configuration for logging, tracing, metrics |
| \`AddMvp24HoursLogging()\` | Configure structured logging with ILogger |
| \`AddMvp24HoursTracing()\` | Configure distributed tracing |
| \`AddMvp24HoursMetrics()\` | Configure metrics collection |
| \`AddMvp24HoursOpenTelemetry()\` | Full OpenTelemetry configuration |

### Activity Sources (\`Mvp24Hours.Core.Observability\`)

| Source Name | Module |
|-------------|--------|
| \`Mvp24Hours.Core\` | Core operations |
| \`Mvp24Hours.Pipe\` | Pipeline execution |
| \`Mvp24Hours.Cqrs\` | Commands, Queries, Notifications |
| \`Mvp24Hours.EFCore\` | Database operations |
| \`Mvp24Hours.RabbitMQ\` | Messaging operations |
| \`Mvp24Hours.Caching\` | Cache operations |
| \`Mvp24Hours.CronJob\` | Scheduled jobs |
| \`Mvp24Hours.Infrastructure.Http\` | HTTP client calls |

### Semantic Tags (\`Mvp24Hours.Core.Observability.SemanticTags\`)

| Tag | Description |
|-----|-------------|
| \`CorrelationId\` | Request correlation identifier |
| \`CausationId\` | Event/command that caused current action |
| \`EnduserId\` | User identifier |
| \`TenantId\` | Multi-tenant identifier |
| \`DbSystem\` | Database type (sqlserver, postgresql, mongodb) |
| \`MessagingSystem\` | Messaging system (rabbitmq) |
| \`CacheHit\` | Cache operation result |

### Three Pillars of Observability

| Pillar | Purpose | Tools |
|--------|---------|-------|
| **Logging** | Record events and errors | ILogger, NLog, Serilog, OpenTelemetry |
| **Tracing** | Follow requests across services | OpenTelemetry, Jaeger, Zipkin, Tempo |
| **Metrics** | Measure performance | Prometheus, Application Insights, Grafana |

### NuGet Packages

\`\`\`bash
# Core observability
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.SqlClient

# Exporters (choose based on your backend)
dotnet add package OpenTelemetry.Exporter.Console          # Development
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol  # OTLP (Jaeger, Tempo)
dotnet add package OpenTelemetry.Exporter.Prometheus.AspNetCore  # Prometheus
dotnet add package Azure.Monitor.OpenTelemetry.AspNetCore  # Azure

# Logging providers
dotnet add package NLog.Web.AspNetCore
dotnet add package Serilog.AspNetCore
\`\`\`
`;
}

function getRelatedTopicsSection(currentComponent: string): string {
  const related = relatedTopics[currentComponent] || [];
  
  if (related.length === 0) return "";

  const componentDescriptions: Record<string, string> = {
    overview: "Complete observability overview with all three pillars",
    logging: "Structured logging with ILogger and OpenTelemetry",
    tracing: "Distributed tracing with OpenTelemetry and Activity API",
    metrics: "Performance metrics with Prometheus, Grafana",
    exporters: "Configure telemetry exporters (Jaeger, Zipkin, OTLP, Prometheus)",
    migration: "Migrate from TelemetryHelper to OpenTelemetry",
    audit: "Audit trail for CQRS commands and operations",
    "cqrs-tracing": "CorrelationId and distributed tracing for CQRS",
    "cqrs-telemetry": "Telemetry integration for Mediator (metrics and traces)",
  };

  return `## Related Topics

Use \`mvp24h_observability_setup({ component: "..." })\` to explore:

${related.map(t => `- **${t}**: ${componentDescriptions[t] || t}`).join("\n")}

### Related Tools

- \`mvp24h_cqrs_guide({ topic: "behaviors" })\` - Pipeline behaviors including telemetry
- \`mvp24h_modernization_guide({ category: "resilience" })\` - Resilience patterns with observability
- \`mvp24h_infrastructure_guide({ topic: "pipeline" })\` - Pipeline with tracing support
`;
}
