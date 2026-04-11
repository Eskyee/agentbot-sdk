/**
 * Agentbot Types — Shared Type Definitions
 */

export interface Agent {
  name: string;
  description: string;
  model: string;
  tools: string[];
  permissions: Record<string, string>;
  instruction: string;
}

export interface Tool {
  name: string;
  description: string;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface Workflow {
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  agent: string;
  input: string;
  output?: string;
}

export interface Memory {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  search(query: string): Promise<string[]>;
}
