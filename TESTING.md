# Guia de Testes - Mvp24Hours .NET MCP Server

Este documento descreve como testar o MCP Server localmente antes de publicá-lo.

## Pré-requisitos

- **Node.js**: versão 18.0.0 ou superior
- **npm**: incluído com Node.js

Verificar instalação:

```bash
node --version   # Deve mostrar v18.x.x ou superior
npm --version    # Deve mostrar 9.x.x ou superior
```

---

## 1. Compilação do Projeto

Antes de testar, compile o projeto TypeScript:

```bash
# Instalar dependências
npm install

# Compilar para JavaScript
npm run build
```

Após a compilação, a pasta `dist/` será criada com os arquivos JavaScript.

### Modo de Desenvolvimento

Para recompilar automaticamente quando houver alterações:

```bash
npm run dev
```

---

## 2. Testando com MCP Inspector (Recomendado)

O **MCP Inspector** é a ferramenta oficial para testar servidores MCP. Ele fornece uma interface web interativa.

### Método 1: Usando Script (Recomendado)

Use o script incluído no projeto para iniciar o Inspector sem autenticação:

**PowerShell:**
```powershell
.\scripts\inspector.ps1
```

**Bash/Linux/Mac:**
```bash
./scripts/inspector.sh
```

### Método 2: Executar Manualmente

```bash
npx @modelcontextprotocol/inspector
```

O Inspector irá:
1. Iniciar em `http://localhost:6274`
2. Gerar um token de autenticação
3. Exibir um link com o token já preenchido

**Exemplo de saída:**
```
⚙️ Proxy server listening on 127.0.0.1:6277
🔑 Session token: abc123...
🔗 Open inspector with token pre-filled:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=abc123...
```

### Método 3: Sem Autenticação

Para desabilitar a autenticação completamente:

**PowerShell:**
```powershell
$env:DANGEROUSLY_OMIT_AUTH="true"; npx @modelcontextprotocol/inspector
```

**Bash/Linux/Mac:**
```bash
DANGEROUSLY_OMIT_AUTH=true npx @modelcontextprotocol/inspector
```

**CMD (Windows):**
```cmd
set DANGEROUSLY_OMIT_AUTH=true && npx @modelcontextprotocol/inspector
```

### Configurando o Servidor no Inspector

Após abrir o Inspector no navegador:

1. No campo **Command**, coloque: `node`
2. No campo **Arguments**, coloque o caminho absoluto: `D:/Github/mvp24hours-dotnet-mcp/dist/index.js`
3. Clique em **Connect**

> **Dica**: Substitua o caminho pelo caminho do seu projeto.

### O que o Inspector oferece

Após conectar, você terá acesso a:

1. **Tools Tab**: Lista todas as 15 ferramentas disponíveis
2. **Execute Tool**: Permite chamar ferramentas com parâmetros customizados
3. **View Response**: Mostra o resultado da execução em formato JSON

### Instalação Global (Opcional)

Para evitar a pergunta de instalação toda vez:

```bash
npm install -g @modelcontextprotocol/inspector
```

---

## 3. Exemplos de Chamadas de Teste

Use o MCP Inspector para testar as seguintes chamadas:

### 3.1. mvp24h_get_started

Ponto de entrada do framework.

```json
{
  "focus": "overview"
}
```

Valores válidos para `focus`:
- `overview` - Visão geral do framework
- `quick-start` - Início rápido
- `decision-tree` - Árvore de decisão

---

### 3.2. mvp24h_architecture_advisor

Recomenda arquitetura baseada em requisitos.

**Exemplo 1 - Projeto Simples:**
```json
{
  "complexity": "low",
  "team_size": "small"
}
```

**Exemplo 2 - Projeto Enterprise:**
```json
{
  "complexity": "high",
  "business_rules": "complex",
  "team_size": "large",
  "scalability": "high"
}
```

Parâmetros:
| Parâmetro | Valores | Descrição |
|-----------|---------|-----------|
| `complexity` | `low`, `medium`, `high` | Complexidade do projeto |
| `business_rules` | `simple`, `moderate`, `complex` | Complexidade das regras de negócio |
| `team_size` | `small`, `medium`, `large` | Tamanho da equipe |
| `scalability` | `low`, `medium`, `high` | Necessidade de escalabilidade |

---

### 3.3. mvp24h_database_advisor

Recomenda banco de dados e padrões.

**Exemplo - PostgreSQL com transações:**
```json
{
  "provider": "postgresql",
  "requirements": ["transactions", "complex-queries"]
}
```

**Exemplo - MongoDB para documentos:**
```json
{
  "provider": "mongodb",
  "requirements": ["document-storage", "flexible-schema"]
}
```

Provedores válidos: `sqlserver`, `postgresql`, `mysql`, `mongodb`, `redis`

---

### 3.4. mvp24h_cqrs_guide

Guia de CQRS/Mediator.

```json
{
  "topic": "commands"
}
```

Tópicos válidos:
- `overview` - Visão geral do CQRS
- `commands` - Comandos e handlers
- `queries` - Queries e handlers
- `notifications` - Notificações/eventos
- `pipeline-behaviors` - Behaviors do pipeline
- `validation` - Validação com FluentValidation
- `domain-events` - Eventos de domínio
- `integration-events` - Eventos de integração
- `saga` - Padrão Saga
- `event-sourcing` - Event Sourcing

---

### 3.5. mvp24h_ai_implementation

Implementação de IA com Semantic Kernel.

```json
{
  "use_case": "chatbot"
}
```

Casos de uso válidos:
- `chatbot` - Chat completion simples
- `rag` - Retrieval Augmented Generation
- `plugins` - Plugins do Semantic Kernel
- `multi-agent` - Sistema multi-agentes
- `workflows` - Workflows com agentes
- `human-in-the-loop` - Interação humana

---

### 3.6. mvp24h_modernization_guide

Padrões de modernização .NET 9.

```json
{
  "category": "resilience",
  "feature": "http-resilience"
}
```

Categorias e features:

| Categoria | Features |
|-----------|----------|
| `resilience` | `http-resilience`, `generic-resilience`, `rate-limiting` |
| `time` | `time-provider`, `periodic-timer` |
| `caching` | `hybrid-cache`, `output-caching` |
| `dependency-injection` | `keyed-services`, `options-pattern` |
| `apis` | `problem-details`, `minimal-apis`, `openapi` |
| `performance` | `source-generators` |
| `cloud` | `aspire` |

---

### 3.7. mvp24h_observability_setup

Configuração de observabilidade.

```json
{
  "component": "logging",
  "exporter": "jaeger"
}
```

Componentes: `logging`, `tracing`, `metrics`, `full-stack`

Exporters: `console`, `jaeger`, `zipkin`, `prometheus`, `application-insights`

---

### 3.8. mvp24h_messaging_patterns

Padrões de mensageria assíncrona.

```json
{
  "pattern": "rabbitmq"
}
```

Padrões válidos: `rabbitmq`, `hosted-services`, `pipeline`, `outbox`, `channels`

---

### 3.9. mvp24h_get_template

Obtém template específico.

```json
{
  "template_name": "cqrs"
}
```

Templates de arquitetura:
- `minimal-api`
- `simple-nlayers`
- `complex-nlayers`
- `cqrs`
- `event-driven`
- `hexagonal`
- `clean-architecture`
- `ddd`
- `microservices`

Templates de IA:
- `sk-chat-completion`
- `sk-plugins`
- `sk-rag`
- `skg-graph-executor`
- `skg-react-agent`
- `skg-multi-agent`
- `agent-framework-basic`

---

### 3.10. mvp24h_core_patterns

Padrões do módulo Core.

```json
{
  "topic": "guard-clauses"
}
```

Tópicos válidos:
- `guard-clauses` - Validação de argumentos
- `value-objects` - Value Objects
- `strongly-typed-ids` - IDs fortemente tipados
- `functional-patterns` - Programação funcional
- `smart-enums` - Enums inteligentes
- `entity-interfaces` - Interfaces de entidade
- `infrastructure` - Abstrações de infraestrutura
- `exceptions` - Exceções customizadas

---

### 3.11. mvp24h_infrastructure_guide

Guia de infraestrutura.

```json
{
  "topic": "pipeline"
}
```

Tópicos válidos:
- `pipeline` - Pipe and Filters
- `caching` - Cache com Redis
- `webapi` - Configuração WebAPI básica
- `webapi-advanced` - WebAPI avançado
- `cronjob` - Background jobs
- `application-services` - Camada de serviços

---

### 3.12. mvp24h_reference_guide

Documentação de referência.

```json
{
  "topic": "mapping"
}
```

Tópicos válidos:
- `mapping` - AutoMapper
- `validation` - FluentValidation
- `specification` - Specification Pattern
- `documentation` - Swagger/XML docs
- `migration` - EF Core Migrations

---

### 3.13. mvp24h_testing_patterns

Padrões de testes.

```json
{
  "topic": "unit-testing"
}
```

Tópicos válidos:
- `unit-testing` - xUnit, FluentAssertions
- `integration-testing` - WebApplicationFactory
- `mocking` - Moq, NSubstitute
- `test-containers` - Docker-based tests
- `api-testing` - Testes de API
- `architecture-testing` - ArchUnitNET

---

### 3.14. mvp24h_security_patterns

Padrões de segurança.

```json
{
  "topic": "jwt"
}
```

Tópicos válidos:
- `authentication` - Identity, OAuth
- `authorization` - Roles, Policies
- `jwt` - Tokens JWT
- `data-protection` - Criptografia
- `input-validation` - Sanitização
- `secrets-management` - Key Vault

---

### 3.15. mvp24h_containerization_patterns

Padrões de containerização.

```json
{
  "topic": "dockerfile"
}
```

Tópicos válidos:
- `dockerfile` - Multi-stage builds
- `docker-compose` - Ambiente local
- `kubernetes` - Deployments, Services
- `health-checks` - Probes
- `configuration` - ConfigMaps, Secrets

---

## 4. Teste via Linha de Comando (stdio)

Para testar rapidamente via terminal sem interface:

### Listar ferramentas disponíveis

**PowerShell:**
```powershell
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

**Bash/Linux/Mac:**
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

### Chamar uma ferramenta

**PowerShell:**
```powershell
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"mvp24h_get_started","arguments":{"focus":"overview"}}}' | node dist/index.js
```

---

## 5. Integração com IDEs

### Cursor IDE

Adicione ao arquivo `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mvp24hours-dotnet": {
      "command": "node",
      "args": ["D:/Github/mvp24hours-dotnet-mcp/dist/index.js"]
    }
  }
}
```

> **Importante**: Substitua o caminho pelo caminho absoluto do seu projeto.

### Claude Desktop

Adicione ao arquivo de configuração do Claude Desktop:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mvp24hours-dotnet": {
      "command": "node",
      "args": ["/caminho/absoluto/para/mvp24hours-dotnet-mcp/dist/index.js"]
    }
  }
}
```

---

## 6. Troubleshooting

### Erro: "Connection Error - Check if your MCP server is running"

Este erro ocorre quando o Inspector não consegue se conectar ao servidor MCP. Soluções:

1. **Use o script sem autenticação:**
   ```powershell
   .\scripts\inspector.ps1
   ```

2. **Configure manualmente no Inspector:**
   - Command: `node`
   - Arguments: caminho absoluto para `dist/index.js`

3. **Desabilite a autenticação via variável de ambiente:**
   ```powershell
   $env:DANGEROUSLY_OMIT_AUTH="true"; npx @modelcontextprotocol/inspector
   ```

4. **Use o link com token:**
   O Inspector exibe um link com o token já preenchido. Use esse link ao invés do `http://localhost:6274` puro.

### Erro: "Cannot find module"

```bash
# Recompile o projeto
npm run build
```

### Erro: "ENOENT: no such file or directory"

Verifique se está executando o comando na raiz do projeto e se a pasta `dist/` existe.

### Inspector não abre no navegador

- Verifique a URL exibida no terminal (geralmente `http://localhost:6274`)
- O Inspector agora usa a porta **6274** (não mais 5173)
- Verifique se a porta não está em uso

### Erro: "ERR_PARSE_ARGS_INVALID_OPTION_VALUE"

Este erro ocorre ao passar flags inválidas. Use a variável de ambiente ao invés de flags:

```powershell
# Correto
$env:DANGEROUSLY_OMIT_AUTH="true"; npx @modelcontextprotocol/inspector

# Incorreto (não funciona mais)
npx @modelcontextprotocol/inspector --no-auth
```

### Ferramentas retornam erro

Verifique se os parâmetros estão corretos consultando os schemas neste documento.

---

## 7. Checklist de Validação

Use este checklist para validar que o servidor está funcionando corretamente:

- [ ] `npm install` executa sem erros
- [ ] `npm run build` compila sem erros
- [ ] MCP Inspector inicia e lista 15 ferramentas
- [ ] `mvp24h_get_started` retorna visão geral
- [ ] `mvp24h_architecture_advisor` retorna recomendação
- [ ] `mvp24h_database_advisor` retorna configuração de banco
- [ ] `mvp24h_get_template` retorna código do template
- [ ] Integração com Cursor/Claude funciona

---

## 8. Scripts de Teste

O projeto inclui scripts prontos na pasta `scripts/`:

| Script | Descrição |
|--------|-----------|
| `scripts/test-mcp.ps1` | Testa compilação e ferramentas via linha de comando |
| `scripts/inspector.ps1` | Abre o MCP Inspector sem autenticação |
| `scripts/inspector.sh` | Versão Bash do inspector (Linux/Mac) |

### Teste Rápido (Linha de Comando)

**PowerShell:**
```powershell
.\scripts\test-mcp.ps1
```

### Teste Interativo (MCP Inspector)

**PowerShell:**
```powershell
.\scripts\inspector.ps1
```

**Bash/Linux/Mac:**
```bash
chmod +x scripts/inspector.sh
./scripts/inspector.sh
```

### Criando Scripts Personalizados

Se precisar criar scripts customizados:

**PowerShell (test-custom.ps1):**
```powershell
# Compilar
npm run build

# Testar tool list
$response = echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
Write-Host $response

# Testar ferramenta específica
$request = '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"mvp24h_get_started","arguments":{"focus":"overview"}}}'
$response = echo $request | node dist/index.js
Write-Host $response
```

**Bash (test-custom.sh):**
```bash
#!/bin/bash
# Compilar
npm run build

# Testar tool list
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js

# Testar ferramenta específica
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"mvp24h_get_started","arguments":{"focus":"overview"}}}' | node dist/index.js
```

---

## Próximos Passos

Após validar os testes:

1. **Publicar no NPM** (se ainda não publicado):
   ```bash
   npm publish --access public
   ```

2. **Testar versão publicada**:
   ```bash
   npx @modelcontextprotocol/inspector npx @mvp24hours/dotnet-mcp
   ```

3. **Documentar uso** no README principal
