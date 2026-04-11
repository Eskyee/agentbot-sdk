/**
 * Agentbot Plugin Interface
 *
 * Plugins extend agents with new capabilities.
 * Implement this interface to create a plugin.
 */

export interface PluginContext {
  /** Agent name that's using this plugin */
  agentName: string;
  /** Log a message */
  log: (message: string) => void;
  /** Read from agent memory */
  memory: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
  };
}

export interface Plugin {
  /** Unique plugin name */
  name: string;
  /** Human-readable description */
  description: string;
  /** Plugin version */
  version: string;

  /** Called when plugin is loaded */
  init?: (ctx: PluginContext) => Promise<void>;

  /** Tools this plugin provides */
  tools: PluginTool[];

  /** Called when agent starts a task */
  onTaskStart?: (task: string, ctx: PluginContext) => Promise<void>;

  /** Called when agent finishes a task */
  onTaskEnd?: (task: string, result: unknown, ctx: PluginContext) => Promise<void>;

  /** Called when plugin is unloaded */
  shutdown?: (ctx: PluginContext) => Promise<void>;
}

export interface PluginTool {
  /** Tool name (used in agent definitions) */
  name: string;
  /** What this tool does */
  description: string;
  /** Parameters the tool accepts */
  parameters: Record<string, PluginParameter>;
  /** Execute the tool */
  execute: (args: Record<string, unknown>, ctx: PluginContext) => Promise<unknown>;
}

export interface PluginParameter {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: unknown;
}

/**
 * Helper to create a plugin with type safety
 */
export function definePlugin(plugin: Plugin): Plugin {
  return plugin;
}

/**
 * Helper to create a tool with type safety
 */
export function defineTool(tool: PluginTool): PluginTool {
  return tool;
}
