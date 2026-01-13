# Mvp24Hours .NET MCP Server

> Intelligent documentation routing for AI agents working with the Mvp24Hours .NET framework.

## Problem Solved

The Mvp24Hours framework has extensive documentation covering:
- Multiple architecture templates (Minimal API, N-Layers, CQRS, DDD, Microservices, etc.)
- Multiple database options (SQL Server, PostgreSQL, MongoDB, Redis)
- AI implementation approaches (Semantic Kernel, SK Graph, Agent Framework)
- .NET 9 modernization patterns
- CQRS/Mediator patterns
- Observability and messaging

**The problem**: Loading all documentation at once overwhelms AI agents, causing them to lose context or provide incomplete answers.

**The solution**: This MCP server provides specialized tools that act as "intelligent routers", returning only the relevant documentation based on specific queries.

## Installation

### From NPM (Recommended)

```bash
npm install -g @mvp24hours/dotnet-mcp
```

### From Source

```bash
git clone https://github.com/kallebelins/mvp24hours-dotnet-mcp
cd mvp24hours-dotnet-mcp
npm install
npm run build
```

## Configuration

### Cursor IDE

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mvp24hours-dotnet": {
      "command": "npx",
      "args": ["@mvp24hours/dotnet-mcp"]
    }
  }
}
```

Or if installed from source:

```json
{
  "mcpServers": {
    "mvp24hours-dotnet": {
      "command": "node",
      "args": ["path/to/mvp24hours-dotnet-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "mvp24hours-dotnet": {
      "command": "npx",
      "args": ["@mvp24hours/dotnet-mcp"]
    }
  }
}
```

## Available Tools

| Tool | Purpose |
|------|---------|
| `mvp24h_get_started` | Framework overview and quick start |
| `mvp24h_architecture_advisor` | Recommends architecture based on requirements |
| `mvp24h_database_advisor` | Recommends database and patterns |
| `mvp24h_cqrs_guide` | CQRS/Mediator documentation |
| `mvp24h_ai_implementation` | AI approach selection (SK, SKG, Agent Framework) |
| `mvp24h_modernization_guide` | .NET 9 features and patterns |
| `mvp24h_observability_setup` | OpenTelemetry configuration |
| `mvp24h_messaging_patterns` | Async messaging (RabbitMQ, Channels) |
| `mvp24h_core_patterns` | Core module (Guard Clauses, Value Objects, etc.) |
| `mvp24h_infrastructure_guide` | Pipeline, Caching, WebAPI, CronJob |
| `mvp24h_reference_guide` | Mapping, Validation, Specification, Migration |
| `mvp24h_get_template` | Retrieves specific template code |

## Usage Examples

### Getting Started

```
User: I want to create a .NET project with Mvp24Hours

AI calls: mvp24h_get_started({ focus: "overview" })
→ Returns: Framework overview, quick reference, and next steps
```

### Choosing Architecture

```
User: I need to create an enterprise app with complex business rules

AI calls: mvp24h_architecture_advisor({
  complexity: "high",
  business_rules: "complex",
  team_size: "large"
})
→ Returns: Clean Architecture recommendation with project structure
```

### Database Configuration

```
User: I need to use PostgreSQL with transactions

AI calls: mvp24h_database_advisor({
  provider: "postgresql",
  requirements: ["transactions", "complex-queries"]
})
→ Returns: PostgreSQL setup, EF Core config, Unit of Work pattern
```

### AI Implementation

```
User: I want to add a chatbot to my app

AI calls: mvp24h_ai_implementation({ use_case: "chatbot" })
→ Returns: Semantic Kernel Chat Completion template
```

### Getting Specific Template

```
User: Show me the CQRS template

AI calls: mvp24h_get_template({ template_name: "cqrs" })
→ Returns: Complete CQRS project structure and code
```

## Tool Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Request                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    mvp24h_get_started                           │
│                 (Overview & Direction)                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  architecture   │  │    database     │  │      ai         │
│    advisor      │  │    advisor      │  │ implementation  │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    mvp24h_get_template                          │
│                   (Specific Code)                               │
└─────────────────────────────────────────────────────────────────┘
```

## Architecture

```
src/
├── index.ts                    # MCP Server entry point
├── tools/
│   ├── get-started.ts          # Framework overview
│   ├── architecture-advisor.ts # Architecture selection
│   ├── database-advisor.ts     # Database configuration
│   ├── cqrs-guide.ts           # CQRS/Mediator patterns
│   ├── ai-implementation.ts    # AI approach selection
│   ├── modernization-guide.ts  # .NET 9 features
│   ├── observability-setup.ts  # Telemetry configuration
│   ├── messaging-patterns.ts   # Async messaging
│   ├── core-patterns.ts        # Core module patterns
│   ├── infrastructure-guide.ts # Pipeline, WebAPI, CronJob
│   ├── reference-guide.ts      # Mapping, Validation, Specification
│   └── get-template.ts         # Template retrieval
└── utils/
    └── doc-loader.ts           # Documentation loader
```

## Why Multiple Tools?

Instead of one large tool that dumps all documentation, specialized tools:

1. **Reduce context size**: Each tool returns only relevant content
2. **Improve accuracy**: Focused responses are more precise
3. **Enable decision trees**: Tools can recommend other tools
4. **Support iteration**: Users can drill down progressively

## Related Projects

- [Mvp24Hours .NET Framework](https://github.com/kallebelins/mvp24hours-dotnet)
- [Mvp24Hours .NET Samples](https://github.com/kallebelins/mvp24hours-dotnet-samples)
- [Semantic Kernel Graph](https://github.com/kallebelins/semantic-kernel-graph)

## License

MIT License - See [LICENSE](LICENSE) for details.
