/**
 * Agent Definition — Public SDK
 *
 * Agents are defined as Markdown files with YAML frontmatter.
 * This is the core spec for the Agentbot ecosystem.
 *
 * Example:
 *   ---
 *   name: researcher
 *   description: Deep research agent for web analysis
 *   model: openrouter/anthropic/claude-3.5-sonnet
 *   tools: [bash, read, write, web]
 *   permissions:
 *     bash: dangerous
 *     read: safe
 *     write: dangerous
 *   ---
 *   # Researcher Agent
 *
 *   You are a deep research agent...
 */

export interface AgentDefinition {
  /** Unique agent name (filename without .md) */
  name: string;
  /** Human-readable description */
  description: string;
  /** Model to use (e.g., openrouter/anthropic/claude-3.5-sonnet) */
  model: string;
  /** Available tools */
  tools: string[];
  /** Per-tool permission overrides */
  permissions: Record<string, PermissionLevel>;
  /** Agent instruction (markdown body) */
  instruction: string;
  /** File path where this definition was loaded from */
  source: string;
}

export type PermissionLevel = 'safe' | 'dangerous' | 'destructive';

export interface AgentConfig {
  /** Agent definitions directory */
  agentsDir: string;
  /** Default model for agents without explicit model */
  defaultModel: string;
  /** Global tool permissions */
  defaultPermissions: Record<string, PermissionLevel>;
}
