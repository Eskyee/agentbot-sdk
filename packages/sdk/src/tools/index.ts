/**
 * Agentbot Tools — Plugin Interface
 *
 * Define tools that agents can use.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface ToolParameter {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: unknown;
}

export function defineTool(def: ToolDefinition): ToolDefinition {
  return def;
}
