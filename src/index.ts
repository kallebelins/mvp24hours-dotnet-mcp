#!/usr/bin/env node

/**
 * Mvp24Hours .NET MCP Server
 * 
 * This MCP server provides intelligent documentation routing for AI agents
 * working with the Mvp24Hours .NET framework. Instead of loading all documentation
 * at once, it provides specialized tools that return only relevant content.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { architectureAdvisor, architectureAdvisorSchema } from "./tools/architecture-advisor.js";
import { databaseAdvisor, databaseAdvisorSchema } from "./tools/database-advisor.js";
import { cqrsGuide, cqrsGuideSchema } from "./tools/cqrs-guide.js";
import { aiImplementation, aiImplementationSchema } from "./tools/ai-implementation.js";
import { modernizationGuide, modernizationGuideSchema } from "./tools/modernization-guide.js";
import { observabilitySetup, observabilitySetupSchema } from "./tools/observability-setup.js";
import { messagingPatterns, messagingPatternsSchema } from "./tools/messaging-patterns.js";
import { getTemplate, getTemplateSchema } from "./tools/get-template.js";
import { getStarted, getStartedSchema } from "./tools/get-started.js";
import { corePatterns, corePatternsSchema } from "./tools/core-patterns.js";
import { infrastructureGuide, infrastructureGuideSchema } from "./tools/infrastructure-guide.js";
import { referenceGuide, referenceGuideSchema } from "./tools/reference-guide.js";
import { testingPatterns, testingPatternsSchema } from "./tools/testing-patterns.js";
import { securityPatterns, securityPatternsSchema } from "./tools/security-patterns.js";
import { containerizationPatterns, containerizationPatternsSchema } from "./tools/containerization-patterns.js";
import { loadDoc, docExists } from "./utils/doc-loader.js";

const server = new Server(
  {
    name: "mvp24hours-dotnet-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "mvp24h_get_started",
        description: `Get an overview of Mvp24Hours framework and determine the best starting point.
Use this tool FIRST when the user wants to create a new .NET project or asks about Mvp24Hours.
Returns: Framework overview, quick decision tree, and recommended next steps.`,
        inputSchema: getStartedSchema,
      },
      {
        name: "mvp24h_architecture_advisor",
        description: `Recommends the best architecture template based on project requirements.
Use when the user needs to choose between: Minimal API, Simple N-Layers, Complex N-Layers, 
CQRS, Event-Driven, Hexagonal, Clean Architecture, DDD, or Microservices.
Returns: Recommended template with decision rationale and project structure.`,
        inputSchema: architectureAdvisorSchema,
      },
      {
        name: "mvp24h_database_advisor",
        description: `Recommends database technology and patterns based on data requirements.
Use when choosing between: SQL Server, PostgreSQL, MySQL, MongoDB, Redis.
Also covers: EF Core, Dapper, Repository pattern, Unit of Work, hybrid approaches.
Returns: Database selection, NuGet packages, configuration, and implementation patterns.`,
        inputSchema: databaseAdvisorSchema,
      },
      {
        name: "mvp24h_cqrs_guide",
        description: `Provides CQRS/Mediator pattern implementation guidance.
Topics: Commands, Queries, Notifications, Domain Events, Integration Events, 
Pipeline Behaviors, Validation, Saga Pattern, Event Sourcing, Resilience patterns.
Returns: Specific documentation for the requested CQRS topic.`,
        inputSchema: cqrsGuideSchema,
      },
      {
        name: "mvp24h_ai_implementation",
        description: `Recommends AI implementation approach for .NET applications.
Covers: Semantic Kernel (Pure), Semantic Kernel Graph, Microsoft Agent Framework.
Use cases: Chatbots, RAG, Multi-agent systems, Workflows, Human-in-the-loop.
Returns: AI decision matrix, recommended approach, and implementation template.`,
        inputSchema: aiImplementationSchema,
      },
      {
        name: "mvp24h_modernization_guide",
        description: `Provides .NET 9 modernization patterns and features.
Categories: Resilience (HTTP, Generic, Rate Limiting), Time (TimeProvider, PeriodicTimer),
Caching (HybridCache, Output Caching), DI (Keyed Services, Options), 
APIs (ProblemDetails, Minimal APIs, OpenAPI), Performance (Source Generators), Cloud (Aspire).
Returns: Feature documentation with implementation examples.`,
        inputSchema: modernizationGuideSchema,
      },
      {
        name: "mvp24h_observability_setup",
        description: `Configures observability stack for .NET applications.
Components: Logging (NLog, OpenTelemetry), Tracing, Metrics, Exporters.
Integrations: Jaeger, Zipkin, Prometheus, Application Insights.
Returns: Setup instructions, configuration, and best practices.`,
        inputSchema: observabilitySetupSchema,
      },
      {
        name: "mvp24h_messaging_patterns",
        description: `Implements async messaging and background processing patterns.
Patterns: RabbitMQ integration, Hosted Services, Pipeline pattern, Outbox pattern.
Returns: Implementation templates and configuration.`,
        inputSchema: messagingPatternsSchema,
      },
      {
        name: "mvp24h_get_template",
        description: `Retrieves a specific architecture template by name.
Available templates: minimal-api, simple-nlayers, complex-nlayers, cqrs, 
event-driven, hexagonal, clean-architecture, ddd, microservices,
sk-chat-completion, sk-plugins, sk-rag, skg-graph-executor, skg-react-agent,
skg-multi-agent, agent-framework-basic, and more.
Returns: Complete template code and project structure.`,
        inputSchema: getTemplateSchema,
      },
      {
        name: "mvp24h_core_patterns",
        description: `Provides documentation for Mvp24Hours Core module patterns.
Topics: guard-clauses, value-objects, strongly-typed-ids, functional-patterns,
smart-enums, entity-interfaces, infrastructure abstractions, exceptions.
Returns: Core pattern documentation with code examples.`,
        inputSchema: corePatternsSchema,
      },
      {
        name: "mvp24h_infrastructure_guide",
        description: `Provides documentation for Pipeline, Caching, WebAPI, and CronJob patterns.
Topics: pipeline (Pipe and Filters), caching (Redis), webapi, webapi-advanced,
cronjob (background jobs), application-services (service layer).
Returns: Infrastructure pattern documentation with implementation examples.`,
        inputSchema: infrastructureGuideSchema,
      },
      {
        name: "mvp24h_reference_guide",
        description: `Provides reference documentation for supporting patterns.
Topics: mapping (AutoMapper), validation (FluentValidation), specification pattern,
documentation (Swagger/XML docs), migration (EF Core migrations).
Returns: Reference documentation with code examples.`,
        inputSchema: referenceGuideSchema,
      },
      {
        name: "mvp24h_testing_patterns",
        description: `Provides testing patterns and best practices for .NET applications.
Topics: unit-testing (xUnit, FluentAssertions), integration-testing (WebApplicationFactory),
mocking (Moq, NSubstitute), test-containers (Docker-based tests), api-testing,
architecture-testing (ArchUnitNET).
Returns: Testing documentation with code examples.`,
        inputSchema: testingPatternsSchema,
      },
      {
        name: "mvp24h_security_patterns",
        description: `Provides security patterns and best practices for .NET applications.
Topics: authentication (Identity, OAuth), authorization (roles, policies),
jwt (token generation, refresh), data-protection (encryption),
input-validation (sanitization), secrets-management (Key Vault).
Returns: Security documentation with implementation examples.`,
        inputSchema: securityPatternsSchema,
      },
      {
        name: "mvp24h_containerization_patterns",
        description: `Provides Docker and Kubernetes patterns for .NET applications.
Topics: dockerfile (multi-stage builds), docker-compose (local development),
kubernetes (deployments, services, config), health-checks (probes),
configuration (ConfigMaps, secrets).
Returns: Containerization documentation with YAML/Dockerfile examples.`,
        inputSchema: containerizationPatternsSchema,
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "mvp24h_get_started":
        return { content: [{ type: "text", text: await getStarted(args) }] };
      
      case "mvp24h_architecture_advisor":
        return { content: [{ type: "text", text: await architectureAdvisor(args) }] };
      
      case "mvp24h_database_advisor":
        return { content: [{ type: "text", text: await databaseAdvisor(args) }] };
      
      case "mvp24h_cqrs_guide":
        return { content: [{ type: "text", text: await cqrsGuide(args) }] };
      
      case "mvp24h_ai_implementation":
        return { content: [{ type: "text", text: await aiImplementation(args) }] };
      
      case "mvp24h_modernization_guide":
        return { content: [{ type: "text", text: await modernizationGuide(args) }] };
      
      case "mvp24h_observability_setup":
        return { content: [{ type: "text", text: await observabilitySetup(args) }] };
      
      case "mvp24h_messaging_patterns":
        return { content: [{ type: "text", text: await messagingPatterns(args) }] };
      
      case "mvp24h_get_template":
        return { content: [{ type: "text", text: await getTemplate(args) }] };
      
      case "mvp24h_core_patterns":
        return { content: [{ type: "text", text: await corePatterns(args) }] };
      
      case "mvp24h_infrastructure_guide":
        return { content: [{ type: "text", text: await infrastructureGuide(args) }] };
      
      case "mvp24h_reference_guide":
        return { content: [{ type: "text", text: await referenceGuide(args) }] };
      
      case "mvp24h_testing_patterns":
        return { content: [{ type: "text", text: await testingPatterns(args) }] };
      
      case "mvp24h_security_patterns":
        return { content: [{ type: "text", text: await securityPatterns(args) }] };
      
      case "mvp24h_containerization_patterns":
        return { content: [{ type: "text", text: await containerizationPatterns(args) }] };
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// List available resources (documentation files)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      // Getting Started & Overview
      {
        uri: "mvp24hours://docs/overview",
        name: "Mvp24Hours Overview",
        description: "Framework overview and getting started guide",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/getting-started",
        name: "Getting Started",
        description: "Quick start guide for Mvp24Hours framework",
        mimeType: "text/markdown",
      },
      
      // Decision Matrices
      {
        uri: "mvp24hours://docs/decision-matrix",
        name: "Decision Matrix",
        description: "Architecture and technology selection guide",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-decision-matrix",
        name: "AI Decision Matrix",
        description: "AI implementation approach selection guide",
        mimeType: "text/markdown",
      },
      
      // Architecture Templates (matches template: mvp24hours://docs/template/{templateName})
      {
        uri: "mvp24hours://docs/architecture-templates",
        name: "Architecture Templates",
        description: "Overview of all architecture templates available",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/minimal-api",
        name: "Template: Minimal API",
        description: "Minimal API project structure and implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/simple-nlayers",
        name: "Template: Simple N-Layers",
        description: "Simple N-Layers architecture template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/complex-nlayers",
        name: "Template: Complex N-Layers",
        description: "Complex N-Layers architecture template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/cqrs",
        name: "Template: CQRS",
        description: "CQRS architecture template with Mediator pattern",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/event-driven",
        name: "Template: Event-Driven",
        description: "Event-driven architecture template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/hexagonal",
        name: "Template: Hexagonal",
        description: "Hexagonal (Ports & Adapters) architecture template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/clean-architecture",
        name: "Template: Clean Architecture",
        description: "Clean Architecture template with dependency inversion",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/ddd",
        name: "Template: DDD",
        description: "Domain-Driven Design template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/template/microservices",
        name: "Template: Microservices",
        description: "Microservices architecture template",
        mimeType: "text/markdown",
      },
      
      // AI Templates - Semantic Kernel (matches template: mvp24hours://docs/ai-template/{templateName})
      {
        uri: "mvp24hours://docs/ai-template/sk-chat-completion",
        name: "Template: SK Chat Completion",
        description: "Semantic Kernel chat completion template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/sk-plugins",
        name: "Template: SK Plugins",
        description: "Semantic Kernel plugins template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/sk-rag",
        name: "Template: SK RAG",
        description: "Semantic Kernel RAG template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/sk-planners",
        name: "Template: SK Planners",
        description: "Semantic Kernel planners template",
        mimeType: "text/markdown",
      },
      
      // AI Templates - Semantic Kernel Graph (matches template: mvp24hours://docs/ai-template/{templateName})
      {
        uri: "mvp24hours://docs/ai-template/skg-graph-executor",
        name: "Template: SKG Graph Executor",
        description: "Semantic Kernel Graph executor template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-react-agent",
        name: "Template: SKG ReAct Agent",
        description: "Semantic Kernel Graph ReAct agent template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-multi-agent",
        name: "Template: SKG Multi-Agent",
        description: "Semantic Kernel Graph multi-agent template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-human-in-loop",
        name: "Template: SKG Human-in-Loop",
        description: "Semantic Kernel Graph human-in-the-loop template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-streaming",
        name: "Template: SKG Streaming",
        description: "Semantic Kernel Graph streaming template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-checkpointing",
        name: "Template: SKG Checkpointing",
        description: "Semantic Kernel Graph checkpointing template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-chatbot-memory",
        name: "Template: SKG Chatbot Memory",
        description: "Semantic Kernel Graph chatbot with memory template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-observability",
        name: "Template: SKG Observability",
        description: "Semantic Kernel Graph observability template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-chain-of-thought",
        name: "Template: SKG Chain of Thought",
        description: "Semantic Kernel Graph chain of thought template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/skg-document-pipeline",
        name: "Template: SKG Document Pipeline",
        description: "Semantic Kernel Graph document pipeline template",
        mimeType: "text/markdown",
      },
      
      // AI Templates - Agent Framework (matches template: mvp24hours://docs/ai-template/{templateName})
      {
        uri: "mvp24hours://docs/ai-template/agent-framework-basic",
        name: "Template: Agent Framework Basic",
        description: "Microsoft Agent Framework basic template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/agent-framework-multi-agent",
        name: "Template: Agent Framework Multi-Agent",
        description: "Microsoft Agent Framework multi-agent template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/agent-framework-workflows",
        name: "Template: Agent Framework Workflows",
        description: "Microsoft Agent Framework workflows template",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/ai-template/agent-framework-middleware",
        name: "Template: Agent Framework Middleware",
        description: "Microsoft Agent Framework middleware template",
        mimeType: "text/markdown",
      },
      
      // Core Patterns
      {
        uri: "mvp24hours://docs/core/overview",
        name: "Core Module Overview",
        description: "Mvp24Hours.Core module overview",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/core/guard-clauses",
        name: "Guard Clauses",
        description: "Guard clauses for defensive programming",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/core/value-objects",
        name: "Value Objects",
        description: "Value objects implementation patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/core/strongly-typed-ids",
        name: "Strongly Typed IDs",
        description: "Strongly typed ID implementations",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/core/functional-patterns",
        name: "Functional Patterns",
        description: "Functional programming patterns (Result, Option)",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/core/smart-enums",
        name: "Smart Enums",
        description: "Smart enumeration patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/core/entity-interfaces",
        name: "Entity Interfaces",
        description: "Entity interfaces and base classes",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/core/exceptions",
        name: "Exception Handling",
        description: "Exception handling patterns",
        mimeType: "text/markdown",
      },
      
      // Database Patterns
      {
        uri: "mvp24hours://docs/database/relational",
        name: "Relational Databases",
        description: "SQL Server, PostgreSQL, MySQL patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/database/nosql",
        name: "NoSQL Databases",
        description: "MongoDB, Redis patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/database/efcore-advanced",
        name: "EF Core Advanced",
        description: "Advanced Entity Framework Core patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/database/mongodb-advanced",
        name: "MongoDB Advanced",
        description: "Advanced MongoDB patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/database/repository",
        name: "Repository Pattern",
        description: "Repository pattern implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/database/unit-of-work",
        name: "Unit of Work",
        description: "Unit of Work pattern implementation",
        mimeType: "text/markdown",
      },
      
      // CQRS Patterns
      {
        uri: "mvp24hours://docs/cqrs/overview",
        name: "CQRS Overview",
        description: "CQRS and Mediator pattern overview",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/cqrs/commands",
        name: "CQRS Commands",
        description: "Command pattern implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/cqrs/queries",
        name: "CQRS Queries",
        description: "Query pattern implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/cqrs/notifications",
        name: "CQRS Notifications",
        description: "Notification pattern implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/cqrs/domain-events",
        name: "Domain Events",
        description: "Domain events implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/cqrs/pipeline-behaviors",
        name: "Pipeline Behaviors",
        description: "MediatR pipeline behaviors",
        mimeType: "text/markdown",
      },
      
      // Infrastructure
      {
        uri: "mvp24hours://docs/pipeline",
        name: "Pipeline Pattern",
        description: "Pipe and Filters pattern implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/webapi",
        name: "Web API",
        description: "Web API patterns and configuration",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/webapi-advanced",
        name: "Web API Advanced",
        description: "Advanced Web API patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/cronjob",
        name: "Background Jobs",
        description: "Background job and CronJob patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/application-services",
        name: "Application Services",
        description: "Service layer patterns",
        mimeType: "text/markdown",
      },
      
      // Messaging
      {
        uri: "mvp24hours://docs/broker",
        name: "Message Broker",
        description: "RabbitMQ integration basics",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/broker-advanced",
        name: "Message Broker Advanced",
        description: "Advanced messaging patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/messaging-patterns",
        name: "Messaging Patterns",
        description: "Async messaging and event patterns",
        mimeType: "text/markdown",
      },
      
      // Modernization (.NET 9)
      {
        uri: "mvp24hours://docs/modernization/overview",
        name: "Modernization Overview",
        description: ".NET 9 modernization patterns overview",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/http-resilience",
        name: "HTTP Resilience",
        description: "HTTP client resilience patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/generic-resilience",
        name: "Generic Resilience",
        description: "Generic resilience patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/rate-limiting",
        name: "Rate Limiting",
        description: "Rate limiting patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/hybrid-cache",
        name: "Hybrid Cache",
        description: "HybridCache implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/output-caching",
        name: "Output Caching",
        description: "Output caching patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/keyed-services",
        name: "Keyed Services",
        description: "Keyed services DI pattern",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/time-provider",
        name: "Time Provider",
        description: "TimeProvider abstraction",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/minimal-apis",
        name: "Minimal APIs",
        description: "Minimal API patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/modernization/aspire",
        name: ".NET Aspire",
        description: ".NET Aspire cloud patterns",
        mimeType: "text/markdown",
      },
      
      // Observability
      {
        uri: "mvp24hours://docs/observability/overview",
        name: "Observability Overview",
        description: "Observability patterns overview",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/observability/logging",
        name: "Logging",
        description: "Logging patterns with NLog/OpenTelemetry",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/observability/tracing",
        name: "Distributed Tracing",
        description: "Distributed tracing patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/observability/metrics",
        name: "Metrics",
        description: "Metrics collection patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/observability/exporters",
        name: "Telemetry Exporters",
        description: "Jaeger, Zipkin, Prometheus exporters",
        mimeType: "text/markdown",
      },
      
      // Reference
      {
        uri: "mvp24hours://docs/mapping",
        name: "Object Mapping",
        description: "AutoMapper patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/validation",
        name: "Validation",
        description: "FluentValidation patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/specification",
        name: "Specification Pattern",
        description: "Specification pattern implementation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/documentation",
        name: "API Documentation",
        description: "Swagger/OpenAPI documentation",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/migration",
        name: "EF Core Migrations",
        description: "Database migration patterns",
        mimeType: "text/markdown",
      },
      
      // Testing
      {
        uri: "mvp24hours://docs/testing/overview",
        name: "Testing Overview",
        description: "Testing patterns overview",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/testing/unit-testing",
        name: "Unit Testing",
        description: "xUnit and FluentAssertions patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/testing/integration-testing",
        name: "Integration Testing",
        description: "WebApplicationFactory patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/testing/mocking",
        name: "Mocking",
        description: "Moq and NSubstitute patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/testing/test-containers",
        name: "Test Containers",
        description: "Docker-based testing",
        mimeType: "text/markdown",
      },
      
      // Security
      {
        uri: "mvp24hours://docs/security/overview",
        name: "Security Overview",
        description: "Security patterns overview",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/security/authentication",
        name: "Authentication",
        description: "Authentication patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/security/authorization",
        name: "Authorization",
        description: "Authorization patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/security/jwt",
        name: "JWT Tokens",
        description: "JWT token patterns",
        mimeType: "text/markdown",
      },
      
      // Containerization
      {
        uri: "mvp24hours://docs/containerization/overview",
        name: "Containerization Overview",
        description: "Docker and Kubernetes patterns overview",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/containerization/dockerfile",
        name: "Dockerfile Patterns",
        description: "Multi-stage Dockerfile patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/containerization/docker-compose",
        name: "Docker Compose",
        description: "Docker Compose for local development",
        mimeType: "text/markdown",
      },
      {
        uri: "mvp24hours://docs/containerization/kubernetes",
        name: "Kubernetes",
        description: "Kubernetes deployment patterns",
        mimeType: "text/markdown",
      },
    ],
  };
});

// List resource templates (dynamic URI patterns)
server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
  return {
    resourceTemplates: [
      {
        uriTemplate: "mvp24hours://docs/template/{templateName}",
        name: "Architecture Template",
        description: "Get a specific architecture template by name. Available: minimal-api, simple-nlayers, complex-nlayers, cqrs, event-driven, hexagonal, clean-architecture, ddd, microservices",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/ai-template/{templateName}",
        name: "AI Template",
        description: "Get a specific AI template. Available: sk-chat-completion, sk-plugins, sk-rag, sk-planners, skg-graph-executor, skg-react-agent, skg-multi-agent, agent-framework-basic",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/core/{topic}",
        name: "Core Pattern",
        description: "Get core module documentation. Topics: overview, guard-clauses, value-objects, strongly-typed-ids, functional-patterns, smart-enums, entity-interfaces, exceptions",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/database/{topic}",
        name: "Database Pattern",
        description: "Get database documentation. Topics: relational, nosql, efcore-advanced, mongodb-advanced, repository, unit-of-work",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/cqrs/{topic}",
        name: "CQRS Pattern",
        description: "Get CQRS documentation. Topics: overview, commands, queries, notifications, domain-events, pipeline-behaviors",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/modernization/{feature}",
        name: "Modernization Feature",
        description: "Get .NET 9 modernization documentation. Features: overview, http-resilience, generic-resilience, rate-limiting, hybrid-cache, output-caching, keyed-services, time-provider, minimal-apis, aspire",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/observability/{component}",
        name: "Observability Component",
        description: "Get observability documentation. Components: overview, logging, tracing, metrics, exporters",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/testing/{topic}",
        name: "Testing Pattern",
        description: "Get testing documentation. Topics: overview, unit-testing, integration-testing, mocking, test-containers",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/security/{topic}",
        name: "Security Pattern",
        description: "Get security documentation. Topics: overview, authentication, authorization, jwt",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mvp24hours://docs/containerization/{topic}",
        name: "Containerization Pattern",
        description: "Get containerization documentation. Topics: overview, dockerfile, docker-compose, kubernetes",
        mimeType: "text/markdown",
      },
    ],
  };
});

// Resource URI to file path mapping (matches resource template patterns)
const resourceMapping: Record<string, string> = {
  // Overview & Getting Started
  "mvp24hours://docs/overview": "home.md",
  "mvp24hours://docs/getting-started": "getting-started.md",
  
  // Decision Matrices
  "mvp24hours://docs/decision-matrix": "ai-context/decision-matrix.md",
  "mvp24hours://docs/ai-decision-matrix": "ai-context/ai-decision-matrix.md",
  
  // Architecture Templates (matches template: mvp24hours://docs/template/{templateName})
  "mvp24hours://docs/architecture-templates": "ai-context/architecture-templates.md",
  "mvp24hours://docs/template/minimal-api": "ai-context/structure-minimal-api.md",
  "mvp24hours://docs/template/simple-nlayers": "ai-context/structure-simple-nlayers.md",
  "mvp24hours://docs/template/complex-nlayers": "ai-context/structure-complex-nlayers.md",
  "mvp24hours://docs/template/cqrs": "ai-context/template-cqrs.md",
  "mvp24hours://docs/template/event-driven": "ai-context/template-event-driven.md",
  "mvp24hours://docs/template/hexagonal": "ai-context/template-hexagonal.md",
  "mvp24hours://docs/template/clean-architecture": "ai-context/template-clean-architecture.md",
  "mvp24hours://docs/template/ddd": "ai-context/template-ddd.md",
  "mvp24hours://docs/template/microservices": "ai-context/template-microservices.md",
  
  // AI Templates - Semantic Kernel (matches template: mvp24hours://docs/ai-template/{templateName})
  "mvp24hours://docs/ai-template/sk-chat-completion": "ai-context/template-sk-chat-completion.md",
  "mvp24hours://docs/ai-template/sk-plugins": "ai-context/template-sk-plugins.md",
  "mvp24hours://docs/ai-template/sk-rag": "ai-context/template-sk-rag-basic.md",
  "mvp24hours://docs/ai-template/sk-planners": "ai-context/template-sk-planners.md",
  
  // AI Templates - Semantic Kernel Graph (matches template: mvp24hours://docs/ai-template/{templateName})
  "mvp24hours://docs/ai-template/skg-graph-executor": "ai-context/template-skg-graph-executor.md",
  "mvp24hours://docs/ai-template/skg-react-agent": "ai-context/template-skg-react-agent.md",
  "mvp24hours://docs/ai-template/skg-multi-agent": "ai-context/template-skg-multi-agent.md",
  "mvp24hours://docs/ai-template/skg-human-in-loop": "ai-context/template-skg-human-in-loop.md",
  "mvp24hours://docs/ai-template/skg-streaming": "ai-context/template-skg-streaming.md",
  "mvp24hours://docs/ai-template/skg-checkpointing": "ai-context/template-skg-checkpointing.md",
  "mvp24hours://docs/ai-template/skg-chatbot-memory": "ai-context/template-skg-chatbot-memory.md",
  "mvp24hours://docs/ai-template/skg-observability": "ai-context/template-skg-observability.md",
  "mvp24hours://docs/ai-template/skg-chain-of-thought": "ai-context/template-skg-chain-of-thought.md",
  "mvp24hours://docs/ai-template/skg-document-pipeline": "ai-context/template-skg-document-pipeline.md",
  
  // AI Templates - Agent Framework (matches template: mvp24hours://docs/ai-template/{templateName})
  "mvp24hours://docs/ai-template/agent-framework-basic": "ai-context/template-agent-framework-basic.md",
  "mvp24hours://docs/ai-template/agent-framework-multi-agent": "ai-context/template-agent-framework-multi-agent.md",
  "mvp24hours://docs/ai-template/agent-framework-workflows": "ai-context/template-agent-framework-workflows.md",
  "mvp24hours://docs/ai-template/agent-framework-middleware": "ai-context/template-agent-framework-middleware.md",
  
  // Core Patterns
  "mvp24hours://docs/core/overview": "core/home.md",
  "mvp24hours://docs/core/guard-clauses": "core/guard-clauses.md",
  "mvp24hours://docs/core/value-objects": "core/value-objects.md",
  "mvp24hours://docs/core/strongly-typed-ids": "core/strongly-typed-ids.md",
  "mvp24hours://docs/core/functional-patterns": "core/functional-patterns.md",
  "mvp24hours://docs/core/smart-enums": "core/smart-enums.md",
  "mvp24hours://docs/core/entity-interfaces": "core/entity-interfaces.md",
  "mvp24hours://docs/core/exceptions": "core/exceptions.md",
  
  // Database Patterns
  "mvp24hours://docs/database/relational": "database/relational.md",
  "mvp24hours://docs/database/nosql": "database/nosql.md",
  "mvp24hours://docs/database/efcore-advanced": "database/efcore-advanced.md",
  "mvp24hours://docs/database/mongodb-advanced": "database/mongodb-advanced.md",
  "mvp24hours://docs/database/repository": "database/use-repository.md",
  "mvp24hours://docs/database/unit-of-work": "database/use-unitofwork.md",
  
  // CQRS Patterns
  "mvp24hours://docs/cqrs/overview": "cqrs/home.md",
  "mvp24hours://docs/cqrs/commands": "cqrs/commands.md",
  "mvp24hours://docs/cqrs/queries": "cqrs/queries.md",
  "mvp24hours://docs/cqrs/notifications": "cqrs/notifications.md",
  "mvp24hours://docs/cqrs/domain-events": "cqrs/domain-events.md",
  "mvp24hours://docs/cqrs/pipeline-behaviors": "cqrs/pipeline-behaviors.md",
  
  // Infrastructure
  "mvp24hours://docs/pipeline": "pipeline.md",
  "mvp24hours://docs/webapi": "webapi.md",
  "mvp24hours://docs/webapi-advanced": "webapi-advanced.md",
  "mvp24hours://docs/cronjob": "cronjob.md",
  "mvp24hours://docs/application-services": "application-services.md",
  
  // Messaging
  "mvp24hours://docs/broker": "broker.md",
  "mvp24hours://docs/broker-advanced": "broker-advanced.md",
  "mvp24hours://docs/messaging-patterns": "ai-context/messaging-patterns.md",
  
  // Modernization (.NET 9)
  "mvp24hours://docs/modernization/overview": "ai-context/modernization-patterns.md",
  "mvp24hours://docs/modernization/http-resilience": "modernization/http-resilience.md",
  "mvp24hours://docs/modernization/generic-resilience": "modernization/generic-resilience.md",
  "mvp24hours://docs/modernization/rate-limiting": "modernization/rate-limiting.md",
  "mvp24hours://docs/modernization/hybrid-cache": "modernization/hybrid-cache.md",
  "mvp24hours://docs/modernization/output-caching": "modernization/output-caching.md",
  "mvp24hours://docs/modernization/keyed-services": "modernization/keyed-services.md",
  "mvp24hours://docs/modernization/time-provider": "modernization/time-provider.md",
  "mvp24hours://docs/modernization/minimal-apis": "modernization/minimal-apis.md",
  "mvp24hours://docs/modernization/aspire": "modernization/aspire.md",
  
  // Observability
  "mvp24hours://docs/observability/overview": "observability/home.md",
  "mvp24hours://docs/observability/logging": "observability/logging.md",
  "mvp24hours://docs/observability/tracing": "observability/tracing.md",
  "mvp24hours://docs/observability/metrics": "observability/metrics.md",
  "mvp24hours://docs/observability/exporters": "observability/exporters.md",
  
  // Reference
  "mvp24hours://docs/mapping": "mapping.md",
  "mvp24hours://docs/validation": "validation.md",
  "mvp24hours://docs/specification": "specification.md",
  "mvp24hours://docs/documentation": "documentation.md",
  "mvp24hours://docs/migration": "migration.md",
  
  // Testing
  "mvp24hours://docs/testing/overview": "ai-context/testing-patterns.md",
  "mvp24hours://docs/testing/unit-testing": "ai-context/testing-patterns.md",
  "mvp24hours://docs/testing/integration-testing": "ai-context/testing-patterns.md",
  "mvp24hours://docs/testing/mocking": "ai-context/testing-patterns.md",
  "mvp24hours://docs/testing/test-containers": "ai-context/testing-patterns.md",
  
  // Security
  "mvp24hours://docs/security/overview": "ai-context/security-patterns.md",
  "mvp24hours://docs/security/authentication": "ai-context/security-patterns.md",
  "mvp24hours://docs/security/authorization": "ai-context/security-patterns.md",
  "mvp24hours://docs/security/jwt": "ai-context/security-patterns.md",
  
  // Containerization
  "mvp24hours://docs/containerization/overview": "ai-context/containerization-patterns.md",
  "mvp24hours://docs/containerization/dockerfile": "ai-context/containerization-patterns.md",
  "mvp24hours://docs/containerization/docker-compose": "ai-context/containerization-patterns.md",
  "mvp24hours://docs/containerization/kubernetes": "ai-context/containerization-patterns.md",
};

// Dynamic template mappings for resource templates
const templateMappings: Record<string, Record<string, string>> = {
  // Architecture templates: mvp24hours://docs/template/{templateName}
  "template": {
    "minimal-api": "ai-context/structure-minimal-api.md",
    "simple-nlayers": "ai-context/structure-simple-nlayers.md",
    "complex-nlayers": "ai-context/structure-complex-nlayers.md",
    "cqrs": "ai-context/template-cqrs.md",
    "event-driven": "ai-context/template-event-driven.md",
    "hexagonal": "ai-context/template-hexagonal.md",
    "clean-architecture": "ai-context/template-clean-architecture.md",
    "ddd": "ai-context/template-ddd.md",
    "microservices": "ai-context/template-microservices.md",
  },
  // AI templates: mvp24hours://docs/ai-template/{templateName}
  "ai-template": {
    "sk-chat-completion": "ai-context/template-sk-chat-completion.md",
    "sk-plugins": "ai-context/template-sk-plugins.md",
    "sk-rag": "ai-context/template-sk-rag-basic.md",
    "sk-planners": "ai-context/template-sk-planners.md",
    "skg-graph-executor": "ai-context/template-skg-graph-executor.md",
    "skg-react-agent": "ai-context/template-skg-react-agent.md",
    "skg-multi-agent": "ai-context/template-skg-multi-agent.md",
    "skg-human-in-loop": "ai-context/template-skg-human-in-loop.md",
    "skg-streaming": "ai-context/template-skg-streaming.md",
    "skg-checkpointing": "ai-context/template-skg-checkpointing.md",
    "skg-chatbot-memory": "ai-context/template-skg-chatbot-memory.md",
    "skg-observability": "ai-context/template-skg-observability.md",
    "skg-chain-of-thought": "ai-context/template-skg-chain-of-thought.md",
    "skg-document-pipeline": "ai-context/template-skg-document-pipeline.md",
    "agent-framework-basic": "ai-context/template-agent-framework-basic.md",
    "agent-framework-multi-agent": "ai-context/template-agent-framework-multi-agent.md",
    "agent-framework-workflows": "ai-context/template-agent-framework-workflows.md",
    "agent-framework-middleware": "ai-context/template-agent-framework-middleware.md",
  },
  // Core patterns: mvp24hours://docs/core/{topic}
  "core": {
    "overview": "core/home.md",
    "guard-clauses": "core/guard-clauses.md",
    "value-objects": "core/value-objects.md",
    "strongly-typed-ids": "core/strongly-typed-ids.md",
    "functional-patterns": "core/functional-patterns.md",
    "smart-enums": "core/smart-enums.md",
    "entity-interfaces": "core/entity-interfaces.md",
    "exceptions": "core/exceptions.md",
  },
  // Database patterns: mvp24hours://docs/database/{topic}
  "database": {
    "relational": "database/relational.md",
    "nosql": "database/nosql.md",
    "efcore-advanced": "database/efcore-advanced.md",
    "mongodb-advanced": "database/mongodb-advanced.md",
    "repository": "database/use-repository.md",
    "unit-of-work": "database/use-unitofwork.md",
  },
  // CQRS patterns: mvp24hours://docs/cqrs/{topic}
  "cqrs": {
    "overview": "cqrs/home.md",
    "commands": "cqrs/commands.md",
    "queries": "cqrs/queries.md",
    "notifications": "cqrs/notifications.md",
    "domain-events": "cqrs/domain-events.md",
    "pipeline-behaviors": "cqrs/pipeline-behaviors.md",
  },
  // Modernization: mvp24hours://docs/modernization/{feature}
  "modernization": {
    "overview": "ai-context/modernization-patterns.md",
    "http-resilience": "modernization/http-resilience.md",
    "generic-resilience": "modernization/generic-resilience.md",
    "rate-limiting": "modernization/rate-limiting.md",
    "hybrid-cache": "modernization/hybrid-cache.md",
    "output-caching": "modernization/output-caching.md",
    "keyed-services": "modernization/keyed-services.md",
    "time-provider": "modernization/time-provider.md",
    "minimal-apis": "modernization/minimal-apis.md",
    "aspire": "modernization/aspire.md",
  },
  // Observability: mvp24hours://docs/observability/{component}
  "observability": {
    "overview": "observability/home.md",
    "logging": "observability/logging.md",
    "tracing": "observability/tracing.md",
    "metrics": "observability/metrics.md",
    "exporters": "observability/exporters.md",
  },
  // Testing: mvp24hours://docs/testing/{topic}
  "testing": {
    "overview": "ai-context/testing-patterns.md",
    "unit-testing": "ai-context/testing-patterns.md",
    "integration-testing": "ai-context/testing-patterns.md",
    "mocking": "ai-context/testing-patterns.md",
    "test-containers": "ai-context/testing-patterns.md",
  },
  // Security: mvp24hours://docs/security/{topic}
  "security": {
    "overview": "ai-context/security-patterns.md",
    "authentication": "ai-context/security-patterns.md",
    "authorization": "ai-context/security-patterns.md",
    "jwt": "ai-context/security-patterns.md",
  },
  // Containerization: mvp24hours://docs/containerization/{topic}
  "containerization": {
    "overview": "ai-context/containerization-patterns.md",
    "dockerfile": "ai-context/containerization-patterns.md",
    "docker-compose": "ai-context/containerization-patterns.md",
    "kubernetes": "ai-context/containerization-patterns.md",
  },
};

// Helper function to resolve dynamic URI to file path
function resolveTemplateUri(uri: string): string | null {
  // Pattern: mvp24hours://docs/{category}/{param}
  const match = uri.match(/^mvp24hours:\/\/docs\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  
  const [, category, param] = match;
  const categoryMappings = templateMappings[category];
  if (!categoryMappings) return null;
  
  return categoryMappings[param] || null;
}

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  // First, try static mapping
  let filePath = resourceMapping[uri];
  
  // If not found, try dynamic template resolution
  if (!filePath) {
    filePath = resolveTemplateUri(uri) || "";
  }
  
  if (filePath && docExists(filePath)) {
    try {
      const content = loadDoc(filePath);
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: content,
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: `Error loading resource: ${message}`,
          },
        ],
      };
    }
  }
  
  // Fallback for unmapped resources with helpful message
  const availableTemplates = Object.keys(templateMappings).map(cat => {
    const params = Object.keys(templateMappings[cat]).join(", ");
    return `- mvp24hours://docs/${cat}/{param} - Available: ${params}`;
  }).join("\n");
  
  return {
    contents: [
      {
        uri,
        mimeType: "text/markdown",
        text: `Resource not found: ${uri}

## Available Resource Templates

${availableTemplates}

## Example URIs
- mvp24hours://docs/template/cqrs
- mvp24hours://docs/ai-template/sk-chat-completion
- mvp24hours://docs/core/guard-clauses
- mvp24hours://docs/database/relational
- mvp24hours://docs/modernization/http-resilience

## Available Tools
- mvp24h_get_started: Framework overview
- mvp24h_architecture_advisor: Architecture selection
- mvp24h_database_advisor: Database selection
- mvp24h_cqrs_guide: CQRS/Mediator patterns
- mvp24h_ai_implementation: AI implementation
- mvp24h_get_template: Specific templates`,
      },
    ],
  };
});

// List available prompts (templates)
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "create-dotnet-project",
        description: "Guide to create a new .NET project with Mvp24Hours framework",
        arguments: [
          {
            name: "project_type",
            description: "Type of project: api, webapp, console, worker",
            required: true,
          },
          {
            name: "architecture",
            description: "Architecture pattern: minimal-api, simple-nlayers, complex-nlayers, cqrs, hexagonal, clean-architecture, ddd, microservices",
            required: false,
          },
        ],
      },
      {
        name: "implement-cqrs",
        description: "Guide to implement CQRS pattern with MediatR",
        arguments: [
          {
            name: "component",
            description: "CQRS component: command, query, notification, domain-event, pipeline-behavior",
            required: true,
          },
        ],
      },
      {
        name: "setup-database",
        description: "Guide to setup database with repository pattern",
        arguments: [
          {
            name: "database",
            description: "Database type: sqlserver, postgresql, mysql, mongodb, redis",
            required: true,
          },
          {
            name: "orm",
            description: "ORM choice: efcore, dapper, hybrid",
            required: false,
          },
        ],
      },
      {
        name: "add-ai-capabilities",
        description: "Guide to add AI capabilities using Semantic Kernel or Agent Framework",
        arguments: [
          {
            name: "approach",
            description: "AI approach: semantic-kernel, sk-graph, agent-framework",
            required: true,
          },
          {
            name: "use_case",
            description: "Use case: chatbot, rag, multi-agent, workflow",
            required: false,
          },
        ],
      },
      {
        name: "setup-observability",
        description: "Guide to setup logging, tracing, and metrics",
        arguments: [
          {
            name: "component",
            description: "Component: logging, tracing, metrics, all",
            required: true,
          },
          {
            name: "exporter",
            description: "Exporter: jaeger, zipkin, prometheus, application-insights",
            required: false,
          },
        ],
      },
      {
        name: "modernize-dotnet",
        description: "Guide to modernize .NET application with .NET 9 features",
        arguments: [
          {
            name: "feature",
            description: "Feature: resilience, caching, keyed-services, minimal-apis, aspire",
            required: true,
          },
        ],
      },
      {
        name: "containerize-app",
        description: "Guide to containerize .NET application with Docker and Kubernetes",
        arguments: [
          {
            name: "target",
            description: "Target: dockerfile, docker-compose, kubernetes",
            required: true,
          },
        ],
      },
    ],
  };
});

// Get prompt content
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "create-dotnet-project": {
      const projectType = args?.project_type || "api";
      const architecture = args?.architecture || "simple-nlayers";
      return {
        description: `Create a new .NET ${projectType} project with ${architecture} architecture`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to create a new .NET ${projectType} project using the ${architecture} architecture pattern with Mvp24Hours framework.

Please help me:
1. Set up the project structure
2. Configure the necessary NuGet packages
3. Implement the base architecture
4. Add common patterns (repository, validation, logging)

Use the mvp24h_get_started and mvp24h_architecture_advisor tools to get the relevant documentation.`,
            },
          },
        ],
      };
    }

    case "implement-cqrs": {
      const component = args?.component || "command";
      return {
        description: `Implement CQRS ${component} pattern`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to implement the CQRS ${component} pattern in my .NET application.

Please help me:
1. Understand the ${component} pattern
2. Create the necessary classes and interfaces
3. Configure MediatR pipeline
4. Add validation and error handling

Use the mvp24h_cqrs_guide tool with topic "${component}" to get the implementation details.`,
            },
          },
        ],
      };
    }

    case "setup-database": {
      const database = args?.database || "sqlserver";
      const orm = args?.orm || "efcore";
      return {
        description: `Setup ${database} database with ${orm}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to setup ${database} database using ${orm} in my .NET application.

Please help me:
1. Configure the database connection
2. Implement the repository pattern
3. Setup Unit of Work
4. Add migrations (if applicable)

Use the mvp24h_database_advisor tool to get the configuration and implementation details.`,
            },
          },
        ],
      };
    }

    case "add-ai-capabilities": {
      const approach = args?.approach || "semantic-kernel";
      const useCase = args?.use_case || "chatbot";
      return {
        description: `Add AI capabilities using ${approach} for ${useCase}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to add AI capabilities to my .NET application using ${approach} for a ${useCase} use case.

Please help me:
1. Choose the right AI approach
2. Configure the necessary packages
3. Implement the AI integration
4. Add proper error handling and observability

Use the mvp24h_ai_implementation tool to get the implementation template and guidance.`,
            },
          },
        ],
      };
    }

    case "setup-observability": {
      const component = args?.component || "all";
      const exporter = args?.exporter || "jaeger";
      return {
        description: `Setup ${component} observability with ${exporter}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to setup ${component} observability in my .NET application using ${exporter} as the exporter.

Please help me:
1. Configure OpenTelemetry
2. Setup ${component === "all" ? "logging, tracing, and metrics" : component}
3. Configure the ${exporter} exporter
4. Add proper instrumentation

Use the mvp24h_observability_setup tool to get the configuration details.`,
            },
          },
        ],
      };
    }

    case "modernize-dotnet": {
      const feature = args?.feature || "resilience";
      return {
        description: `Modernize .NET app with ${feature}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to modernize my .NET application using the ${feature} feature from .NET 9.

Please help me:
1. Understand the ${feature} feature
2. Configure the necessary packages
3. Implement the pattern
4. Add best practices

Use the mvp24h_modernization_guide tool to get the implementation details.`,
            },
          },
        ],
      };
    }

    case "containerize-app": {
      const target = args?.target || "dockerfile";
      return {
        description: `Containerize app with ${target}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to containerize my .NET application using ${target}.

Please help me:
1. Create an optimized ${target} configuration
2. Setup multi-stage builds (if applicable)
3. Configure health checks
4. Add production best practices

Use the mvp24h_containerization_patterns tool to get the configuration templates.`,
            },
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mvp24Hours .NET MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
