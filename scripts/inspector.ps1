# inspector.ps1
# Script para iniciar o MCP Inspector sem autenticação

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Mvp24Hours MCP Inspector" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Verificar se está na pasta correta
$indexPath = "dist/index.js"
if (-not (Test-Path $indexPath)) {
    # Tentar subir um nível (caso esteja na pasta scripts)
    Set-Location ..
    if (-not (Test-Path $indexPath)) {
        Write-Host "ERRO: Arquivo dist/index.js nao encontrado." -ForegroundColor Red
        Write-Host "Execute 'npm run build' primeiro." -ForegroundColor Yellow
        exit 1
    }
}

# Verificar Node.js
Write-Host "`n[1/3] Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Node.js nao encontrado. Instale o Node.js 18+" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

# Verificar se o projeto está compilado
Write-Host "`n[2/3] Verificando compilacao..." -ForegroundColor Yellow
if (-not (Test-Path $indexPath)) {
    Write-Host "Projeto nao compilado. Compilando..." -ForegroundColor Yellow
    npm run build --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Falha na compilacao" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Projeto compilado" -ForegroundColor Green

# Obter caminho absoluto
$absolutePath = (Resolve-Path $indexPath).Path -replace '\\', '/'

# Iniciar Inspector
Write-Host "`n[3/3] Iniciando MCP Inspector..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  INSTRUCOES" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Acesse a URL que aparecera abaixo" -ForegroundColor Gray
Write-Host "2. Na interface do Inspector:" -ForegroundColor Gray
Write-Host "   - Command: node" -ForegroundColor Cyan
Write-Host "   - Arguments: $absolutePath" -ForegroundColor Cyan
Write-Host "3. Clique em 'Connect'" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Definir variável de ambiente para desabilitar autenticação
$env:DANGEROUSLY_OMIT_AUTH = "true"

# Executar o Inspector
npx @modelcontextprotocol/inspector
