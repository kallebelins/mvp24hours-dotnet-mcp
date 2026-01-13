# test-mcp.ps1
# Script para testar o MCP Server localmente

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Mvp24Hours .NET MCP Server - Testes" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# 1. Verificar Node.js
Write-Host "`n[1/5] Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Node.js nao encontrado. Instale o Node.js 18+" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

# 2. Instalar dependencias
Write-Host "`n[2/5] Instalando dependencias..." -ForegroundColor Yellow
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencias instaladas com sucesso" -ForegroundColor Green

# 3. Compilar projeto
Write-Host "`n[3/5] Compilando projeto TypeScript..." -ForegroundColor Yellow
npm run build --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha na compilacao" -ForegroundColor Red
    exit 1
}
Write-Host "Projeto compilado com sucesso" -ForegroundColor Green

# 4. Testar listagem de ferramentas
Write-Host "`n[4/5] Testando listagem de ferramentas (tools/list)..." -ForegroundColor Yellow
$toolsListRequest = '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
$response = echo $toolsListRequest | node dist/index.js 2>$null

if ($response -match '"tools"') {
    $toolCount = ([regex]::Matches($response, '"name":')).Count
    Write-Host "Ferramentas encontradas: $toolCount" -ForegroundColor Green
} else {
    Write-Host "ERRO: Resposta invalida do servidor" -ForegroundColor Red
    Write-Host $response
    exit 1
}

# 5. Testar chamada de ferramenta
Write-Host "`n[5/5] Testando chamada de ferramenta (mvp24h_get_started)..." -ForegroundColor Yellow
$callRequest = '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"mvp24h_get_started","arguments":{"focus":"overview"}}}'
$response = echo $callRequest | node dist/index.js 2>$null

if ($response -match '"result"' -or $response -match '"content"') {
    Write-Host "Ferramenta executada com sucesso" -ForegroundColor Green
} else {
    Write-Host "AVISO: Resposta pode conter erro" -ForegroundColor Yellow
}

# Resultado final
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "           TESTES CONCLUIDOS" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

Write-Host "`nProximos passos:" -ForegroundColor White
Write-Host "  1. Testar com MCP Inspector:" -ForegroundColor Gray
Write-Host "     npx @modelcontextprotocol/inspector node dist/index.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Configurar no Cursor IDE (~/.cursor/mcp.json):" -ForegroundColor Gray
Write-Host "     {" -ForegroundColor DarkGray
Write-Host '       "mcpServers": {' -ForegroundColor DarkGray
Write-Host '         "mvp24hours-dotnet": {' -ForegroundColor DarkGray
Write-Host '           "command": "node",' -ForegroundColor DarkGray
Write-Host "           `"args`": [`"$($PWD.Path -replace '\\', '/')/dist/index.js`"]" -ForegroundColor DarkGray
Write-Host '         }' -ForegroundColor DarkGray
Write-Host '       }' -ForegroundColor DarkGray
Write-Host "     }" -ForegroundColor DarkGray
Write-Host ""
