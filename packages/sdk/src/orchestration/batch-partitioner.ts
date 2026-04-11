/**
 * Batch Partitioner
 *
 * Groups consecutive read-only tool calls into parallel batches.
 * Mutating tools create serial boundaries.
 */

import { classifyTool, ConcurrencyClass } from './tool-classifier';

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface ClassifiedTool {
  tool: ToolCall;
  class: ConcurrencyClass;
  parallelizable: boolean;
}

export interface ExecutionBatch {
  type: 'parallel' | 'serial';
  tools: ClassifiedTool[];
}

export function partitionBatches(tools: ToolCall[]): ExecutionBatch[] {
  if (tools.length === 0) return [];

  const batches: ExecutionBatch[] = [];
  let currentBatch: ClassifiedTool[] = [];
  let currentType: 'parallel' | 'serial' = 'parallel';

  for (const tool of tools) {
    const classification = classifyTool(tool.name);
    const classified: ClassifiedTool = {
      tool,
      class: classification.class,
      parallelizable: classification.parallelizable,
    };

    if (classification.parallelizable && currentType === 'parallel') {
      // Add to current parallel batch
      currentBatch.push(classified);
    } else if (!classification.parallelizable) {
      // Mutating tool — flush current batch, add serial batch
      if (currentBatch.length > 0) {
        batches.push({ type: currentType, tools: [...currentBatch] });
        currentBatch = [];
      }
      batches.push({ type: 'serial', tools: [classified] });
      currentType = 'parallel'; // Reset to parallel after serial
    } else {
      // Switch from serial to parallel — flush and start new batch
      if (currentBatch.length > 0) {
        batches.push({ type: currentType, tools: [...currentBatch] });
      }
      currentBatch = [classified];
      currentType = 'parallel';
    }
  }

  // Flush remaining
  if (currentBatch.length > 0) {
    batches.push({ type: currentType, tools: currentBatch });
  }

  return batches;
}

export interface PartitionStats {
  totalTools: number;
  parallelBatches: number;
  serialBatches: number;
  maxParallelism: number;
  parallelizableRatio: number;
}

export function getPartitionStats(batches: ExecutionBatch[]): PartitionStats {
  const parallelBatches = batches.filter((b) => b.type === 'parallel');
  const serialBatches = batches.filter((b) => b.type === 'serial');
  const totalTools = batches.reduce((sum, b) => sum + b.tools.length, 0);
  const parallelizableTools = parallelBatches.reduce(
    (sum, b) => sum + b.tools.length,
    0
  );

  return {
    totalTools,
    parallelBatches: parallelBatches.length,
    serialBatches: serialBatches.length,
    maxParallelism: Math.max(...parallelBatches.map((b) => b.tools.length), 0),
    parallelizableRatio: totalTools > 0 ? parallelizableTools / totalTools : 0,
  };
}
