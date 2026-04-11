#!/bin/bash
# Agentbot Installer — One command to get started
# Usage: curl -fsSL agentbot.sh/install | bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
error() { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${BLUE}[i]${NC} $*"; }

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🤖 Agentbot Installer           ║${NC}"
echo -e "${BLUE}║     Run your own AI agent            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Check Docker
if ! command -v docker &>/dev/null; then
    error "Docker is required. Install it first: https://docs.docker.com/get-docker/"
fi
log "Docker found"

# Check for API key
if [ -z "${OPENROUTER_API_KEY:-}" ]; then
    echo ""
    info "You need an OpenRouter API key to run agents."
    info "Get one at: https://openrouter.ai/keys"
    echo ""
    read -p "Enter your OpenRouter API key: " API_KEY
    if [ -z "$API_KEY" ]; then
        error "API key is required."
    fi
else
    API_KEY="$OPENROUTER_API_KEY"
fi

# Create agent directory
INSTALL_DIR="${HOME}/.agentbot"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Save config
cat > .env << EOF
OPENROUTER_API_KEY=$API_KEY
AGENTBOT_ENV=local
EOF
log "Config saved to $INSTALL_DIR/.env"

# Create starter agent
cat > agent.md << 'EOF'
---
name: my-agent
description: My first AI agent
model: openrouter/anthropic/claude-3.5-sonnet
tools: [bash, read, write, think, memory]
permissions:
  bash: dangerous
  read: safe
  write: dangerous
  think: safe
  memory: safe
---

# My Agent

You are a helpful AI assistant. You can read and write files, run commands, and think through problems.
EOF
log "Created starter agent"

# Pull and run
info "Starting Agentbot..."
docker run -d \
    --name agentbot \
    --env-file .env \
    -v "$INSTALL_DIR:/app/agents" \
    -p 3000:3000 \
    ghcr.io/openclaw/openclaw:latest

echo ""
log "Agentbot is running!"
echo ""
echo -e "  Dashboard:  ${BLUE}http://localhost:3000${NC}"
echo -e "  Agent:      ${BLUE}$INSTALL_DIR/agent.md${NC}"
echo -e "  Config:     ${BLUE}$INSTALL_DIR/.env${NC}"
echo ""
echo -e "  ${YELLOW}Edit agent.md to customize your agent.${NC}"
echo -e "  ${YELLOW}Your API key stays on your machine. We don't touch the costs.${NC}"
echo ""
