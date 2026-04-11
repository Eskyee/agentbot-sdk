/**
 * Tool Concurrency Classifier
 *
 * Classifies tools as read-only (parallelizable) or mutating (must serialize).
 * Based on the pattern: "Read-only tools parallelize. Write tools serialize."
 */

export type ConcurrencyClass = 'readonly' | 'mutating';

export interface ToolClassification {
  class: ConcurrencyClass;
  toolName: string;
  reason: string;
  parallelizable: boolean;
}

// Read-only tools — safe to run in parallel
const READONLY_TOOLS = new Set([
  // File reads
  'read', 'file_read', 'file_read_tool',
  // Search
  'grep', 'search', 'find', 'glob',
  // Web
  'web_search', 'web_fetch', 'web_read', 'http_get',
  // Memory reads
  'memory_search', 'memory_get', 'memory_read',
  // Think
  'think', 'reason', 'analyze',
  // Info
  'status', 'list', 'info', 'help',
]);

// Mutating tools — must serialize
const MUTATING_TOOLS = new Set([
  // File writes
  'write', 'file_write', 'file_write_tool', 'edit', 'append',
  // Shell
  'bash', 'shell', 'exec', 'command', 'run',
  // Memory writes
  'memory_set', 'memory_delete', 'memory_write',
  // HTTP mutations
  'http_post', 'http_put', 'http_delete', 'http_patch',
  // Git
  'git_commit', 'git_push', 'git_merge',
  // Deploy
  'deploy', 'restart', 'stop',
]);

export function classifyTool(toolName: string): ToolClassification {
  const lowerName = toolName.toLowerCase();

  if (READONLY_TOOLS.has(lowerName)) {
    return {
      class: 'readonly',
      toolName,
      reason: `${toolName} is read-only and safe to parallelize`,
      parallelizable: true,
    };
  }

  if (MUTATING_TOOLS.has(lowerName)) {
    return {
      class: 'mutating',
      toolName,
      reason: `${toolName} mutates state and must serialize`,
      parallelizable: false,
    };
  }

  // Default: treat unknown tools as mutating (safe default)
  return {
    class: 'mutating',
    toolName,
    reason: `${toolName} is unknown, treating as mutating (safe default)`,
    parallelizable: false,
  };
}

export function classifyTools(toolNames: string[]): ToolClassification[] {
  return toolNames.map(classifyTool);
}
