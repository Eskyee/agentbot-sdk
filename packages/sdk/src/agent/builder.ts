/**
 * Agent Builder — Programmatic Agent Creation
 *
 * Create agents in code instead of markdown files.
 */

import { AgentDefinition, PermissionLevel } from './definition';

export interface AgentBuilderOptions {
  name: string;
  description: string;
  model?: string;
  tools?: string[];
  permissions?: Record<string, PermissionLevel>;
  instruction: string;
}

export function createAgent(options: AgentBuilderOptions): AgentDefinition {
  return {
    name: options.name,
    description: options.description,
    model: options.model || 'openrouter/anthropic/claude-3.5-sonnet',
    tools: options.tools || ['bash', 'read', 'write', 'think', 'memory'],
    permissions: options.permissions || {},
    instruction: options.instruction,
    source: '<programmatic>',
  };
}

/**
 * Export agent definition to markdown+YAML format
 */
export function agentToMarkdown(agent: AgentDefinition): string {
  const tools = `[${agent.tools.join(', ')}]`;

  let permissions = '';
  if (Object.keys(agent.permissions).length > 0) {
    permissions = '\npermissions:\n';
    for (const [tool, level] of Object.entries(agent.permissions)) {
      permissions += `  ${tool}: ${level}\n`;
    }
  }

  return `---
name: ${agent.name}
description: ${agent.description}
model: ${agent.model}
tools: ${tools}${permissions}
---

${agent.instruction}`;
}
