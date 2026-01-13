/**
 * AI Implementation Tool
 * 
 * Recommends AI implementation approach for .NET applications.
 */

export const aiImplementationSchema = {
  type: "object" as const,
  properties: {
    use_case: {
      type: "string",
      enum: [
        "chatbot",
        "qa-documents",
        "tool-augmented",
        "complex-reasoning",
        "multi-agent",
        "workflow",
        "human-oversight",
        "enterprise",
      ],
      description: "Primary AI use case",
    },
    approach: {
      type: "string",
      enum: ["semantic-kernel", "sk-graph", "agent-framework"],
      description: "Specific approach to get documentation for (optional)",
    },
    template: {
      type: "string",
      enum: [
        "chat-completion",
        "plugins",
        "rag-basic",
        "planners",
        "graph-executor",
        "react-agent",
        "chain-of-thought",
        "chatbot-memory",
        "multi-agent",
        "document-pipeline",
        "human-in-loop",
        "checkpointing",
        "streaming",
        "observability",
        "agent-basic",
        "agent-workflows",
        "agent-multi",
        "agent-middleware",
      ],
      description: "Specific template to retrieve",
    },
  },
  required: [],
};

interface AiImplementationArgs {
  use_case?: string;
  approach?: string;
  template?: string;
}

export async function aiImplementation(args: unknown): Promise<string> {
  const { use_case, approach, template } = args as AiImplementationArgs;

  // If a specific template is requested, return it
  if (template) {
    return getAiTemplate(template);
  }

  // If a specific approach is requested, return its overview
  if (approach) {
    return getApproachOverview(approach);
  }

  // Otherwise, provide decision guidance based on use case
  const recommendation = getRecommendation(use_case);
  return recommendation;
}

function getRecommendation(useCase?: string): string {
  let recommendedApproach = "semantic-kernel";
  let recommendedTemplate = "chat-completion";
  let reasoning: string[] = [];

  switch (useCase) {
    case "chatbot":
      recommendedApproach = "semantic-kernel";
      recommendedTemplate = "chat-completion";
      reasoning.push("Simple chatbot → Semantic Kernel Chat Completion");
      break;
    case "qa-documents":
      recommendedApproach = "semantic-kernel";
      recommendedTemplate = "rag-basic";
      reasoning.push("Document Q&A → Semantic Kernel RAG");
      break;
    case "tool-augmented":
      recommendedApproach = "semantic-kernel";
      recommendedTemplate = "plugins";
      reasoning.push("Tool-augmented AI → Semantic Kernel Plugins");
      break;
    case "complex-reasoning":
      recommendedApproach = "sk-graph";
      recommendedTemplate = "chain-of-thought";
      reasoning.push("Complex reasoning → SK Graph Chain of Thought");
      break;
    case "multi-agent":
      recommendedApproach = "sk-graph";
      recommendedTemplate = "multi-agent";
      reasoning.push("Multiple agents → SK Graph Multi-Agent");
      break;
    case "workflow":
      recommendedApproach = "sk-graph";
      recommendedTemplate = "graph-executor";
      reasoning.push("Workflow orchestration → SK Graph Executor");
      break;
    case "human-oversight":
      recommendedApproach = "sk-graph";
      recommendedTemplate = "human-in-loop";
      reasoning.push("Human oversight needed → SK Graph Human-in-the-Loop");
      break;
    case "enterprise":
      recommendedApproach = "agent-framework";
      recommendedTemplate = "agent-basic";
      reasoning.push("Enterprise grade → Microsoft Agent Framework");
      break;
    default:
      reasoning.push("No specific use case → Default to Semantic Kernel");
  }

  return `# AI Implementation Recommendation

## Recommended Approach: **${formatApproachName(recommendedApproach)}**
## Recommended Template: **${formatTemplateName(recommendedTemplate)}**

### Why?
${reasoning.map(r => `- ${r}`).join("\n")}

---

## AI Decision Matrix

### By Use Case

| Use Case | Recommended Approach | Template |
|----------|---------------------|----------|
| Simple chatbot | Semantic Kernel | Chat Completion |
| Q&A over documents | Semantic Kernel | RAG Basic |
| Tool-augmented AI | Semantic Kernel | Plugins & Functions |
| Complex reasoning | SK Graph | Chain of Thought |
| Agent with tools | SK Graph | ReAct Agent |
| Multi-step workflows | SK Graph | Graph Executor |
| Persistent conversations | SK Graph | Chatbot with Memory |
| Document processing | SK Graph | Document Pipeline |
| Multiple AI agents | SK Graph | Multi-Agent |
| Human oversight needed | SK Graph | Human-in-the-Loop |
| Enterprise agents | Agent Framework | Agent Framework Basic |

### Complexity vs Capability

| Approach | Complexity | Flexibility | State Management | Production Ready |
|----------|-----------|-------------|------------------|------------------|
| SK Chat Completion | Low | Low | None | ✅ Yes |
| SK Plugins | Low-Medium | Medium | None | ✅ Yes |
| SK RAG | Medium | Medium | None | ✅ Yes |
| SKG Graph Executor | Medium | High | ✅ Full | ✅ Yes |
| SKG ReAct Agent | High | Very High | ✅ Full | ✅ Yes |
| SKG Multi-Agent | Very High | Very High | ✅ Full | ✅ Yes |
| Agent Framework | Medium | High | Limited | ⚠️ Preview |

---

## Required Packages

### Semantic Kernel (Pure)
\`\`\`xml
<PackageReference Include="Microsoft.SemanticKernel" Version="1.*" />
<PackageReference Include="Microsoft.SemanticKernel.Connectors.OpenAI" Version="1.*" />
\`\`\`

### Semantic Kernel Graph
\`\`\`xml
<PackageReference Include="Microsoft.SemanticKernel" Version="1.*" />
<PackageReference Include="SemanticKernel.Graph" Version="1.*" />
\`\`\`

### Microsoft Agent Framework
\`\`\`xml
<PackageReference Include="Microsoft.Extensions.AI" Version="9.*-*" />
<PackageReference Include="Microsoft.Extensions.AI.OpenAI" Version="9.*-*" />
\`\`\`

---

## Configuration

### appsettings.json

\`\`\`json
{
  "AI": {
    "Provider": "OpenAI",
    "OpenAI": {
      "ApiKey": "\${OPENAI_API_KEY}",
      "ModelId": "gpt-4o",
      "EmbeddingModelId": "text-embedding-3-small"
    },
    "AzureOpenAI": {
      "Endpoint": "\${AZURE_OPENAI_ENDPOINT}",
      "ApiKey": "\${AZURE_OPENAI_API_KEY}",
      "DeploymentName": "gpt-4o"
    }
  }
}
\`\`\`

---

## Next Steps

1. **Get specific template**: \`mvp24h_ai_implementation({ template: "${recommendedTemplate}" })\`
2. **Learn about the approach**: \`mvp24h_ai_implementation({ approach: "${recommendedApproach}" })\`
`;
}

function getApproachOverview(approach: string): string {
  const approaches: Record<string, string> = {
    "semantic-kernel": `# Semantic Kernel (Pure)

## Overview

Microsoft Semantic Kernel is the foundation for AI orchestration in .NET. Use for standard AI integration scenarios.

## When to Use

✅ **Recommended For:**
- Simple chat/completion scenarios
- Plugin-based tool augmentation
- Basic RAG implementations
- MVP and prototypes
- Standard AI integrations

❌ **Not Recommended For:**
- Complex multi-step workflows
- State persistence requirements
- Multi-agent coordination
- Production monitoring needs

## Available Templates

| Template | Description |
|----------|-------------|
| chat-completion | Basic conversational AI |
| plugins | Tool integration with function calling |
| rag-basic | Document Q&A with retrieval |
| planners | Task decomposition (preview) |

## Quick Start

\`\`\`csharp
using Microsoft.SemanticKernel;

// Create kernel
var kernel = Kernel.CreateBuilder()
    .AddOpenAIChatCompletion("gpt-4o", Environment.GetEnvironmentVariable("OPENAI_API_KEY")!)
    .Build();

// Simple completion
var result = await kernel.InvokePromptAsync("Explain CQRS pattern in .NET");
Console.WriteLine(result);

// With plugins
kernel.ImportPluginFromType<TimePlugin>();
var response = await kernel.InvokePromptAsync("What time is it?");
\`\`\`

## Service Registration

\`\`\`csharp
// Program.cs
builder.Services.AddSingleton(sp =>
{
    var kernelBuilder = Kernel.CreateBuilder();
    kernelBuilder.AddOpenAIChatCompletion(
        modelId: configuration["AI:OpenAI:ModelId"]!,
        apiKey: configuration["AI:OpenAI:ApiKey"]!);
    return kernelBuilder.Build();
});
\`\`\`
`,

    "sk-graph": `# Semantic Kernel Graph

## Overview

Semantic Kernel Graph extends SK with graph-based workflow orchestration. Use for complex AI workflows.

## When to Use

✅ **Recommended For:**
- Complex AI workflows with multiple steps
- Conditional branching and routing
- State management across steps
- Production-grade AI systems
- Checkpointing and recovery
- Human-in-the-loop workflows
- Multi-agent systems
- Real-time monitoring

❌ **Not Recommended For:**
- Simple Q&A scenarios
- When simplicity is paramount

## Available Templates

| Template | Complexity | Description |
|----------|-----------|-------------|
| graph-executor | Medium | Workflow orchestration |
| react-agent | High | Reasoning + Acting loops |
| chain-of-thought | High | Step-by-step reasoning |
| chatbot-memory | High | Contextual conversations |
| multi-agent | Very High | Coordinated agent systems |
| document-pipeline | High | Document processing workflows |
| human-in-loop | High | Approval workflows |
| checkpointing | Medium | State persistence |
| streaming | Medium | Real-time events |
| observability | Medium | Metrics and monitoring |

## Quick Start

\`\`\`csharp
using SemanticKernel.Graph.Core;
using SemanticKernel.Graph.Nodes;
using SemanticKernel.Graph.Extensions;

// Create kernel with graph support
var builder = Kernel.CreateBuilder();
builder.AddOpenAIChatCompletion("gpt-4o", apiKey);
builder.AddGraphSupport();
var kernel = builder.Build();

// Create graph executor
var executor = new GraphExecutor("MyWorkflow", "Processes customer request");

// Add nodes
var classifyNode = new PromptGraphNode(
    "classify",
    "Classify the following request: {{$input}}",
    "classifier"
).StoreResultAs("classification");

var routeNode = new ConditionalGraphNode("route")
    .AddCondition("classification == 'support'", "support-handler")
    .AddCondition("classification == 'sales'", "sales-handler")
    .SetDefaultRoute("general-handler");

executor.AddNode(classifyNode);
executor.AddNode(routeNode);
executor.SetStartNode("classify");

// Execute
var arguments = new KernelArguments { ["input"] = "I need help with my order" };
var result = await executor.ExecuteAsync(kernel, arguments);
\`\`\`

## Key Concepts

### Nodes
- **FunctionGraphNode**: Executes a kernel function
- **PromptGraphNode**: Executes a prompt template
- **ConditionalGraphNode**: Routes based on conditions
- **ParallelGraphNode**: Executes nodes in parallel
- **HumanInputNode**: Waits for human input

### State Management
- Results stored in KernelArguments
- Checkpointing for recovery
- Thread-safe state updates

### Streaming
- Real-time event emission
- Progress monitoring
- Token streaming
`,

    "agent-framework": `# Microsoft Agent Framework

## Overview

The Microsoft Agent Framework provides high-level abstractions for building enterprise AI agents.

## When to Use

✅ **Recommended For:**
- Azure OpenAI integration
- Microsoft ecosystem alignment
- Enterprise agent development
- Unified AI abstractions
- Middleware pipelines

❌ **Not Recommended For:**
- Complex graph-based workflows (use SK Graph)
- Advanced checkpointing needs
- When still in preview is a concern

## Available Templates

| Template | Description |
|----------|-------------|
| agent-basic | Simple agent creation |
| agent-workflows | Workflow-based agents |
| agent-multi | Agent orchestration |
| agent-middleware | Request/response processing |

## Quick Start

\`\`\`csharp
using Microsoft.Extensions.AI;

// Create chat client
IChatClient client = new OpenAIChatClient(
    model: "gpt-4o",
    apiKey: Environment.GetEnvironmentVariable("OPENAI_API_KEY")!
);

// Simple completion
var response = await client.CompleteAsync("What is CQRS?");
Console.WriteLine(response.Message.Text);

// With tools
var toolClient = new ChatClientBuilder(client)
    .UseFunctionInvocation()
    .Build();

ChatOptions options = new()
{
    Tools = [AIFunctionFactory.Create(GetWeather)]
};

var result = await toolClient.CompleteAsync("What's the weather in Seattle?", options);
\`\`\`

## Middleware Pipeline

\`\`\`csharp
using Microsoft.Extensions.AI;

// Build pipeline with middleware
var client = new ChatClientBuilder(innerClient)
    .UseLogging()         // Log all requests/responses
    .UseRetry()           // Automatic retry on failure
    .UseFunctionInvocation()  // Tool/function calling
    .UseOpenTelemetry()   // Telemetry integration
    .Build();
\`\`\`

## Azure OpenAI Integration

\`\`\`csharp
using Azure.AI.OpenAI;
using Microsoft.Extensions.AI;

var azureClient = new AzureOpenAIClient(
    new Uri(configuration["AzureOpenAI:Endpoint"]!),
    new AzureKeyCredential(configuration["AzureOpenAI:ApiKey"]!)
);

IChatClient client = azureClient.AsChatClient("gpt-4o");
\`\`\`

## Note

The Agent Framework is currently in preview. For production systems with complex workflows, consider Semantic Kernel Graph.
`,
  };

  return approaches[approach] || `Approach "${approach}" not found.`;
}

function getAiTemplate(template: string): string {
  const templates: Record<string, string> = {
    "chat-completion": `# Semantic Kernel - Chat Completion Template

## Basic Chat Completion

\`\`\`csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

public class ChatService
{
    private readonly Kernel _kernel;
    private readonly IChatCompletionService _chatService;

    public ChatService(IConfiguration configuration)
    {
        _kernel = Kernel.CreateBuilder()
            .AddOpenAIChatCompletion(
                modelId: configuration["AI:OpenAI:ModelId"]!,
                apiKey: configuration["AI:OpenAI:ApiKey"]!)
            .Build();

        _chatService = _kernel.GetRequiredService<IChatCompletionService>();
    }

    public async Task<string> GetCompletionAsync(string userMessage)
    {
        var result = await _kernel.InvokePromptAsync(userMessage);
        return result.GetValue<string>() ?? string.Empty;
    }

    public async Task<string> GetChatResponseAsync(ChatHistory history, string userMessage)
    {
        history.AddUserMessage(userMessage);
        
        var response = await _chatService.GetChatMessageContentAsync(history);
        
        history.AddAssistantMessage(response.Content ?? string.Empty);
        
        return response.Content ?? string.Empty;
    }
}
\`\`\`

## Streaming Response

\`\`\`csharp
public async IAsyncEnumerable<string> StreamChatAsync(ChatHistory history, string userMessage)
{
    history.AddUserMessage(userMessage);

    var fullResponse = new StringBuilder();
    
    await foreach (var chunk in _chatService.GetStreamingChatMessageContentsAsync(history))
    {
        if (!string.IsNullOrEmpty(chunk.Content))
        {
            fullResponse.Append(chunk.Content);
            yield return chunk.Content;
        }
    }

    history.AddAssistantMessage(fullResponse.ToString());
}
\`\`\`

## Controller Integration

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ChatService _chatService;

    public ChatController(ChatService chatService) => _chatService = chatService;

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        var response = await _chatService.GetCompletionAsync(request.Message);
        return Ok(new { response });
    }

    [HttpPost("stream")]
    public async Task StreamChat([FromBody] ChatRequest request)
    {
        Response.ContentType = "text/event-stream";

        await foreach (var chunk in _chatService.StreamChatAsync(new ChatHistory(), request.Message))
        {
            await Response.WriteAsync($"data: {chunk}\\n\\n");
            await Response.Body.FlushAsync();
        }
    }
}
\`\`\`
`,

    "rag-basic": `# Semantic Kernel - RAG Basic Template

## Setup with Embeddings

\`\`\`csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Connectors.OpenAI;

public class RagService
{
    private readonly Kernel _kernel;
    private readonly ISemanticTextMemory _memory;
    private readonly IChatCompletionService _chatService;

    public RagService(IConfiguration configuration)
    {
        var apiKey = configuration["AI:OpenAI:ApiKey"]!;

        _kernel = Kernel.CreateBuilder()
            .AddOpenAIChatCompletion("gpt-4o", apiKey)
            .Build();

        _chatService = _kernel.GetRequiredService<IChatCompletionService>();

        // Setup memory with embeddings
        var memoryBuilder = new MemoryBuilder();
        memoryBuilder.WithOpenAITextEmbeddingGeneration("text-embedding-3-small", apiKey);
        memoryBuilder.WithMemoryStore(new VolatileMemoryStore());
        _memory = memoryBuilder.Build();
    }

    public async Task IndexDocumentAsync(string collection, string id, string text)
    {
        await _memory.SaveInformationAsync(collection, text, id);
    }

    public async Task<string> QueryAsync(string collection, string question, int topK = 3)
    {
        // Search for relevant documents
        var results = await _memory.SearchAsync(collection, question, topK).ToListAsync();

        if (!results.Any())
        {
            return "No relevant information found.";
        }

        // Build context from search results
        var context = string.Join("\\n\\n", results.Select(r => r.Metadata.Text));

        // Generate response with context
        var prompt = $"""
            Based on the following context, answer the question.
            
            Context:
            {context}
            
            Question: {question}
            
            Answer:
            """;

        var response = await _kernel.InvokePromptAsync(prompt);
        return response.GetValue<string>() ?? string.Empty;
    }
}
\`\`\`

## Document Processing

\`\`\`csharp
public class DocumentProcessor
{
    private readonly RagService _ragService;

    public DocumentProcessor(RagService ragService) => _ragService = ragService;

    public async Task ProcessPdfAsync(string collection, string filePath)
    {
        // Split document into chunks
        var chunks = await SplitDocumentAsync(filePath, chunkSize: 1000, overlap: 200);

        // Index each chunk
        for (int i = 0; i < chunks.Count; i++)
        {
            await _ragService.IndexDocumentAsync(
                collection,
                $"{Path.GetFileName(filePath)}-chunk-{i}",
                chunks[i]
            );
        }
    }

    private Task<List<string>> SplitDocumentAsync(string filePath, int chunkSize, int overlap)
    {
        // Implementation depends on document type
        // Use libraries like iTextSharp for PDF, DocumentFormat.OpenXml for Word, etc.
        throw new NotImplementedException();
    }
}
\`\`\`

## Vector Database Integration (Example with Qdrant)

\`\`\`csharp
using Microsoft.SemanticKernel.Connectors.Qdrant;

// Replace VolatileMemoryStore with Qdrant
var memoryBuilder = new MemoryBuilder();
memoryBuilder.WithOpenAITextEmbeddingGeneration("text-embedding-3-small", apiKey);
memoryBuilder.WithQdrantMemoryStore("http://localhost:6333", 1536);
_memory = memoryBuilder.Build();
\`\`\`
`,

    "graph-executor": `# Semantic Kernel Graph - Graph Executor Template

## Basic Workflow

\`\`\`csharp
using SemanticKernel.Graph.Core;
using SemanticKernel.Graph.Nodes;
using SemanticKernel.Graph.Extensions;

public class WorkflowService
{
    private readonly Kernel _kernel;

    public WorkflowService(IConfiguration configuration)
    {
        var builder = Kernel.CreateBuilder();
        builder.AddOpenAIChatCompletion(
            configuration["AI:OpenAI:ModelId"]!,
            configuration["AI:OpenAI:ApiKey"]!);
        builder.AddGraphSupport();
        _kernel = builder.Build();
    }

    public async Task<WorkflowResult> ExecuteAsync(string input)
    {
        var executor = new GraphExecutor("ContentWorkflow", "Processes and enhances content");

        // Node 1: Analyze input
        var analyzeNode = new PromptGraphNode(
            nodeId: "analyze",
            prompt: "Analyze the following content and identify key topics: {{$input}}",
            functionName: "analyzer"
        ).StoreResultAs("analysis");

        // Node 2: Generate summary
        var summaryNode = new PromptGraphNode(
            nodeId: "summarize",
            prompt: "Based on this analysis: {{$analysis}}, create a brief summary.",
            functionName: "summarizer"
        ).StoreResultAs("summary");

        // Node 3: Generate recommendations
        var recommendNode = new PromptGraphNode(
            nodeId: "recommend",
            prompt: "Based on this analysis: {{$analysis}}, suggest 3 improvements.",
            functionName: "recommender"
        ).StoreResultAs("recommendations");

        // Build graph
        executor.AddNode(analyzeNode);
        executor.AddNode(summaryNode);
        executor.AddNode(recommendNode);

        // Set edges
        analyzeNode.AddEdge("summarize");
        analyzeNode.AddEdge("recommend");

        executor.SetStartNode("analyze");

        // Execute
        var arguments = new KernelArguments { ["input"] = input };
        var result = await executor.ExecuteAsync(_kernel, arguments);

        return new WorkflowResult
        {
            Analysis = result["analysis"]?.ToString(),
            Summary = result["summary"]?.ToString(),
            Recommendations = result["recommendations"]?.ToString()
        };
    }
}

public record WorkflowResult
{
    public string? Analysis { get; init; }
    public string? Summary { get; init; }
    public string? Recommendations { get; init; }
}
\`\`\`

## Conditional Routing

\`\`\`csharp
// Node that classifies input
var classifyNode = new PromptGraphNode(
    "classify",
    "Classify this request as one of: support, sales, general. Request: {{$input}}",
    "classifier"
).StoreResultAs("category");

// Conditional routing node
var routeNode = new ConditionalGraphNode("route")
    .AddCondition("category.Contains('support')", "support-handler")
    .AddCondition("category.Contains('sales')", "sales-handler")
    .SetDefaultRoute("general-handler");

// Handler nodes
var supportNode = new PromptGraphNode(
    "support-handler",
    "As a support agent, help with: {{$input}}",
    "support"
).StoreResultAs("response");

var salesNode = new PromptGraphNode(
    "sales-handler",
    "As a sales representative, respond to: {{$input}}",
    "sales"
).StoreResultAs("response");

var generalNode = new PromptGraphNode(
    "general-handler",
    "Provide general assistance for: {{$input}}",
    "general"
).StoreResultAs("response");
\`\`\`

## Parallel Execution

\`\`\`csharp
// Parallel node executes multiple nodes simultaneously
var parallelNode = new ParallelGraphNode("parallel-analysis")
    .AddBranch("sentiment-analysis")
    .AddBranch("keyword-extraction")
    .AddBranch("topic-classification");

// Each branch runs independently
var sentimentNode = new PromptGraphNode(
    "sentiment-analysis",
    "Analyze sentiment of: {{$input}}",
    "sentiment"
).StoreResultAs("sentiment");

var keywordNode = new PromptGraphNode(
    "keyword-extraction",
    "Extract keywords from: {{$input}}",
    "keywords"
).StoreResultAs("keywords");

var topicNode = new PromptGraphNode(
    "topic-classification",
    "Classify topics in: {{$input}}",
    "topics"
).StoreResultAs("topics");
\`\`\`
`,

    "react-agent": `# Semantic Kernel Graph - ReAct Agent Template

## ReAct Pattern Implementation

\`\`\`csharp
using SemanticKernel.Graph.Core;
using SemanticKernel.Graph.Nodes;
using SemanticKernel.Graph.Agents;

public class ReActAgentService
{
    private readonly Kernel _kernel;

    public ReActAgentService(IConfiguration configuration)
    {
        var builder = Kernel.CreateBuilder();
        builder.AddOpenAIChatCompletion(
            configuration["AI:OpenAI:ModelId"]!,
            configuration["AI:OpenAI:ApiKey"]!);
        builder.AddGraphSupport();

        // Register tools
        builder.Plugins.AddFromType<SearchPlugin>();
        builder.Plugins.AddFromType<CalculatorPlugin>();
        builder.Plugins.AddFromType<WeatherPlugin>();

        _kernel = builder.Build();
    }

    public async Task<string> ProcessAsync(string question)
    {
        var agent = new ReActAgent(_kernel, new ReActAgentOptions
        {
            MaxIterations = 10,
            SystemPrompt = """
                You are a helpful assistant that can reason and act to answer questions.
                
                Available tools:
                - Search: Search the web for information
                - Calculate: Perform mathematical calculations
                - GetWeather: Get current weather for a location
                
                Think step by step, use tools when needed, and provide a final answer.
                """
        });

        var result = await agent.InvokeAsync(question);
        return result.FinalAnswer;
    }
}

// Tool definitions
public class SearchPlugin
{
    [KernelFunction("Search")]
    [Description("Search the web for information")]
    public async Task<string> SearchAsync(
        [Description("The search query")] string query)
    {
        // Implement actual search
        return $"Search results for: {query}";
    }
}

public class CalculatorPlugin
{
    [KernelFunction("Calculate")]
    [Description("Perform mathematical calculations")]
    public string Calculate(
        [Description("The mathematical expression")] string expression)
    {
        // Implement calculation
        var result = new DataTable().Compute(expression, null);
        return result?.ToString() ?? "Error";
    }
}

public class WeatherPlugin
{
    [KernelFunction("GetWeather")]
    [Description("Get current weather for a location")]
    public async Task<string> GetWeatherAsync(
        [Description("The city name")] string city)
    {
        // Implement weather API call
        return $"Weather in {city}: Sunny, 72°F";
    }
}
\`\`\`

## ReAct Loop Visualization

\`\`\`
┌─────────────────────────────────────────────────┐
│                  User Question                  │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                    THINK                        │
│   "I need to search for information about X"   │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                     ACT                         │
│           Call Search("X information")          │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                   OBSERVE                       │
│          "Search returned: ..."                 │
└─────────────────────┬───────────────────────────┘
                      │
              ┌───────▼───────┐
              │  Need more?   │
              └───────┬───────┘
                      │
         ┌────────────┴────────────┐
         │ YES                     │ NO
         │                         │
    Back to THINK           ┌──────▼──────┐
                            │ Final Answer │
                            └─────────────┘
\`\`\`
`,

    "multi-agent": `# Semantic Kernel Graph - Multi-Agent Template

## Multi-Agent System

\`\`\`csharp
using SemanticKernel.Graph.Core;
using SemanticKernel.Graph.Agents;

public class MultiAgentService
{
    private readonly Kernel _kernel;
    private readonly Agent _researcher;
    private readonly Agent _analyst;
    private readonly Agent _writer;
    private readonly Agent _supervisor;

    public MultiAgentService(IConfiguration configuration)
    {
        var builder = Kernel.CreateBuilder();
        builder.AddOpenAIChatCompletion(
            configuration["AI:OpenAI:ModelId"]!,
            configuration["AI:OpenAI:ApiKey"]!);
        builder.AddGraphSupport();
        _kernel = builder.Build();

        // Define specialized agents
        _researcher = CreateAgent("Researcher", """
            You are a research specialist. Your job is to:
            - Gather information from available sources
            - Identify key facts and data
            - Cite sources when possible
            """);

        _analyst = CreateAgent("Analyst", """
            You are a data analyst. Your job is to:
            - Analyze information provided by the researcher
            - Identify patterns and insights
            - Provide quantitative analysis when possible
            """);

        _writer = CreateAgent("Writer", """
            You are a content writer. Your job is to:
            - Take analysis and create clear, engaging content
            - Structure information logically
            - Write for the target audience
            """);

        _supervisor = CreateAgent("Supervisor", """
            You are the team supervisor. Your job is to:
            - Coordinate the team's work
            - Ensure quality of outputs
            - Make final decisions
            - Route tasks to appropriate team members
            """);
    }

    private Agent CreateAgent(string name, string systemPrompt)
    {
        return new Agent(_kernel, new AgentOptions
        {
            Name = name,
            SystemPrompt = systemPrompt
        });
    }

    public async Task<ResearchReport> GenerateReportAsync(string topic)
    {
        // Step 1: Supervisor plans the work
        var plan = await _supervisor.InvokeAsync(
            $"Create a research plan for: {topic}");

        // Step 2: Researcher gathers information
        var research = await _researcher.InvokeAsync(
            $"Research the following topic based on this plan:\\n{plan}\\n\\nTopic: {topic}");

        // Step 3: Analyst analyzes the research
        var analysis = await _analyst.InvokeAsync(
            $"Analyze this research and provide insights:\\n{research}");

        // Step 4: Writer creates the report
        var report = await _writer.InvokeAsync(
            $"Write a comprehensive report based on:\\n\\nResearch: {research}\\n\\nAnalysis: {analysis}");

        // Step 5: Supervisor reviews
        var finalReport = await _supervisor.InvokeAsync(
            $"Review and finalize this report:\\n{report}");

        return new ResearchReport
        {
            Topic = topic,
            Research = research,
            Analysis = analysis,
            Report = finalReport
        };
    }
}

public record ResearchReport
{
    public required string Topic { get; init; }
    public required string Research { get; init; }
    public required string Analysis { get; init; }
    public required string Report { get; init; }
}
\`\`\`

## Agent Communication Graph

\`\`\`csharp
// Using graph for agent coordination
var executor = new GraphExecutor("MultiAgentWorkflow", "Coordinates multiple agents");

// Agent nodes
var researchNode = new AgentGraphNode("research", _researcher)
    .WithInput("topic")
    .StoreResultAs("research_output");

var analysisNode = new AgentGraphNode("analyze", _analyst)
    .WithInput("research_output")
    .StoreResultAs("analysis_output");

var writeNode = new AgentGraphNode("write", _writer)
    .WithInputs("research_output", "analysis_output")
    .StoreResultAs("draft");

var reviewNode = new AgentGraphNode("review", _supervisor)
    .WithInput("draft")
    .StoreResultAs("final_report");

// Build graph with conditional review loop
executor.AddNode(researchNode);
executor.AddNode(analysisNode);
executor.AddNode(writeNode);
executor.AddNode(reviewNode);

// Conditional: if review fails, go back to writer
var checkNode = new ConditionalGraphNode("quality-check")
    .AddCondition("review_approved == true", "complete")
    .SetDefaultRoute("write"); // Loop back if not approved

executor.SetStartNode("research");
\`\`\`
`,

    "human-in-loop": `# Semantic Kernel Graph - Human-in-the-Loop Template

## Human Approval Workflow

\`\`\`csharp
using SemanticKernel.Graph.Core;
using SemanticKernel.Graph.Nodes;

public class HumanInLoopService
{
    private readonly Kernel _kernel;
    private readonly IApprovalStore _approvalStore;

    public HumanInLoopService(Kernel kernel, IApprovalStore approvalStore)
    {
        _kernel = kernel;
        _approvalStore = approvalStore;
    }

    public async Task<WorkflowInstance> StartWorkflowAsync(string content)
    {
        var workflowId = Guid.NewGuid();

        var executor = new GraphExecutor("ApprovalWorkflow", "Content approval process");

        // Step 1: AI generates content
        var generateNode = new PromptGraphNode(
            "generate",
            "Improve and expand this content: {{$input}}",
            "generator"
        ).StoreResultAs("generated_content");

        // Step 2: Human review checkpoint
        var reviewNode = new HumanInputNode(
            "human-review",
            prompt: "Please review the generated content and approve or request changes.",
            timeoutMinutes: 60
        ).StoreResultAs("review_decision");

        // Step 3: Conditional routing
        var routeNode = new ConditionalGraphNode("route-decision")
            .AddCondition("review_decision.approved == true", "finalize")
            .AddCondition("review_decision.changes_requested == true", "revise")
            .SetDefaultRoute("reject");

        // Step 4a: Finalize approved content
        var finalizeNode = new FunctionGraphNode(
            _kernel.CreateFunctionFromMethod(
                (string content) => $"APPROVED: {content}",
                "finalize"),
            "finalize"
        ).StoreResultAs("final_content");

        // Step 4b: Revise based on feedback
        var reviseNode = new PromptGraphNode(
            "revise",
            """
            Revise this content based on the feedback:
            
            Content: {{$generated_content}}
            Feedback: {{$review_decision.feedback}}
            
            Revised content:
            """,
            "revisor"
        ).StoreResultAs("generated_content"); // Loop back

        // Build graph
        executor.AddNode(generateNode);
        executor.AddNode(reviewNode);
        executor.AddNode(routeNode);
        executor.AddNode(finalizeNode);
        executor.AddNode(reviseNode);

        // Revision loops back to human review
        reviseNode.AddEdge("human-review");

        executor.SetStartNode("generate");

        // Start workflow (will pause at human-review)
        var arguments = new KernelArguments
        {
            ["input"] = content,
            ["workflow_id"] = workflowId
        };

        var state = await executor.StartAsync(_kernel, arguments);

        // Store pending approval
        await _approvalStore.CreateApprovalRequestAsync(new ApprovalRequest
        {
            WorkflowId = workflowId,
            NodeId = "human-review",
            Content = state["generated_content"]?.ToString(),
            Status = ApprovalStatus.Pending
        });

        return new WorkflowInstance
        {
            Id = workflowId,
            Status = "awaiting_approval",
            State = state
        };
    }

    public async Task<WorkflowInstance> SubmitApprovalAsync(
        Guid workflowId,
        bool approved,
        string? feedback = null)
    {
        var request = await _approvalStore.GetApprovalRequestAsync(workflowId);
        
        request.Status = approved ? ApprovalStatus.Approved : ApprovalStatus.ChangesRequested;
        request.Feedback = feedback;
        request.ReviewedAt = DateTime.UtcNow;

        await _approvalStore.UpdateApprovalRequestAsync(request);

        // Resume workflow with decision
        var executor = await GetExecutorAsync(workflowId);
        var state = await executor.ResumeAsync(_kernel, new KernelArguments
        {
            ["review_decision"] = new ReviewDecision
            {
                Approved = approved,
                ChangesRequested = !approved && !string.IsNullOrEmpty(feedback),
                Feedback = feedback
            }
        });

        return new WorkflowInstance
        {
            Id = workflowId,
            Status = state.IsComplete ? "completed" : "awaiting_approval",
            State = state
        };
    }
}

public record ReviewDecision
{
    public bool Approved { get; init; }
    public bool ChangesRequested { get; init; }
    public string? Feedback { get; init; }
}
\`\`\`
`,

    // Add more templates as needed...
  };

  return templates[template] || `Template "${template}" not found. Available templates: ${Object.keys(templates).join(", ")}`;
}

function formatApproachName(approach: string): string {
  const names: Record<string, string> = {
    "semantic-kernel": "Semantic Kernel",
    "sk-graph": "Semantic Kernel Graph",
    "agent-framework": "Microsoft Agent Framework",
  };
  return names[approach] || approach;
}

function formatTemplateName(template: string): string {
  return template
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
