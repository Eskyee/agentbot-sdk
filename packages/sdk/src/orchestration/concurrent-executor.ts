/**
 * Concurrent Executor
 *
 * Executes batches: Promise.all for parallel, sequential for serial.
 * Handles errors, timeouts, and result aggregation.
 */

import { ExecutionBatch, ToolCall, ClassifiedTool } from './batch-partitioner';

export interface ToolResult {
  toolId: string;
  toolName: string;
  success: boolean;
  result?: unknown;
  error?: string;
  durationMs: number;
}

export interface ExecutionResult {
  results: ToolResult[];
  totalDurationMs: number;
  parallelBatchesExecuted: number;
  serialBatchesExecuted: number;
}

export type ToolExecutor = (tool: ToolCall) => Promise<unknown>;

export async function executeConcurrent(
  batches: ExecutionBatch[],
  executor: ToolExecutor,
  options: { timeoutMs?: number } = {}
): Promise<ExecutionResult> {
  const startTime = Date.now();
  const results: ToolResult[] = [];
  let parallelBatchesExecuted = 0;
  let serialBatchesExecuted = 0;

  for (const batch of batches) {
    if (batch.type === 'parallel') {
      const batchResults = await Promise.all(
        batch.tools.map((ct) => executeSingleTool(ct, executor, options.timeoutMs))
      );
      results.push(...batchResults);
      parallelBatchesExecuted++;
    } else {
      for (const ct of batch.tools) {
        const result = await executeSingleTool(ct, executor, options.timeoutMs);
        results.push(result);
      }
      serialBatchesExecuted++;
    }
  }

  return {
    results,
    totalDurationMs: Date.now() - startTime,
    parallelBatchesExecuted,
    serialBatchesExecuted,
  };
}

async function executeSingleTool(
  classifiedTool: ClassifiedTool,
  executor: ToolExecutor,
  timeoutMs?: number
): Promise<ToolResult> {
  const start = Date.now();

  try {
    const result = timeoutMs
      ? await withTimeout(executor(classifiedTool.tool), timeoutMs)
      : await executor(classifiedTool.tool);

    return {
      toolId: classifiedTool.tool.id,
      toolName: classifiedTool.tool.name,
      success: true,
      result,
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      toolId: classifiedTool.tool.id,
      toolName: classifiedTool.tool.name,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - start,
    };
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

export function dryRun(batches: ExecutionBatch[]): string[] {
  const lines: string[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const toolNames = batch.tools.map((t) => t.tool.name).join(', ');

    if (batch.type === 'parallel') {
      lines.push(`Batch ${i + 1} [PARALLEL]: ${toolNames}`);
    } else {
      lines.push(`Batch ${i + 1} [SERIAL]: ${toolNames}`);
    }
  }

  return lines;
}
