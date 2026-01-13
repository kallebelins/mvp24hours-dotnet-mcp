#!/bin/bash
# inspector.sh
# Script para iniciar o MCP Inspector sem autenticação

echo "============================================"
echo "   Mvp24Hours MCP Inspector"
echo "============================================"

# Verificar se está na pasta correta
INDEX_PATH="dist/index.js"
if [ ! -f "$INDEX_PATH" ]; then
    # Tentar subir um nível (caso esteja na pasta scripts)
    cd ..
    if [ ! -f "$INDEX_PATH" ]; then
        echo "ERRO: Arquivo dist/index.js não encontrado."
        echo "Execute 'npm run build' primeiro."
        exit 1
    fi
fi

# Verificar Node.js
echo ""
echo "[1/3] Verificando Node.js..."
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "ERRO: Node.js não encontrado. Instale o Node.js 18+"
    exit 1
fi
echo "Node.js: $NODE_VERSION"

# Verificar se o projeto está compilado
echo ""
echo "[2/3] Verificando compilação..."
if [ ! -f "$INDEX_PATH" ]; then
    echo "Projeto não compilado. Compilando..."
    npm run build --silent
    if [ $? -ne 0 ]; then
        echo "ERRO: Falha na compilação"
        exit 1
    fi
fi
echo "Projeto compilado"

# Obter caminho absoluto
ABSOLUTE_PATH=$(cd "$(dirname "$INDEX_PATH")" && pwd)/$(basename "$INDEX_PATH")

# Iniciar Inspector
echo ""
echo "[3/3] Iniciando MCP Inspector..."
echo ""
echo "============================================"
echo "  INSTRUÇÕES"
echo "============================================"
echo ""
echo "1. Acesse a URL que aparecerá abaixo"
echo "2. Na interface do Inspector:"
echo "   - Command: node"
echo "   - Arguments: $ABSOLUTE_PATH"
echo "3. Clique em 'Connect'"
echo ""
echo "============================================"
echo ""

# Executar o Inspector sem autenticação
DANGEROUSLY_OMIT_AUTH=true npx @modelcontextprotocol/inspector
