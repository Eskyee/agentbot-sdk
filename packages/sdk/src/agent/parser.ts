/**
 * Agent Parser — Markdown + YAML Frontmatter
 *
 * Parses agent definition files (.md) with YAML frontmatter
 * into structured AgentDefinition objects.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { AgentDefinition, PermissionLevel } from './definition';

export function parseAgentFile(filePath: string): AgentDefinition {
  const content = readFileSync(filePath, 'utf-8');
  return parseAgentContent(content, filePath);
}

export function parseAgentContent(content: string, source: string): AgentDefinition {
  const { frontmatter, body } = extractFrontmatter(content);

  return {
    name: frontmatter.name ?? inferName(source),
    description: frontmatter.description ?? '',
    model: frontmatter.model ?? 'openrouter/anthropic/claude-3.5-sonnet',
    tools: frontmatter.tools ?? [],
    permissions: frontmatter.permissions ?? {},
    instruction: body.trim(),
    source,
  };
}

function extractFrontmatter(content: string): {
  frontmatter: Record<string, any>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter = parseYaml(match[1]);
  return { frontmatter, body: match[2] };
}

function parseYaml(yaml: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yaml.split('\n');
  let currentKey: string | null = null;
  let currentArray: string[] = [];
  let currentObject: Record<string, string> = {};

  for (const line of lines) {
    // Top-level key: value
    const kvMatch = line.match(/^(\w+):\s*(.+)$/);
    if (kvMatch) {
      // Flush previous
      if (currentKey && currentArray.length > 0) {
        result[currentKey] = currentArray;
        currentArray = [];
      }
      if (currentKey && Object.keys(currentObject).length > 0) {
        result[currentKey] = { ...currentObject };
        currentObject = {};
      }

      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();

      // Array inline: [a, b, c]
      if (value.startsWith('[') && value.endsWith(']')) {
        result[currentKey] = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim());
        currentKey = null;
      }
      // Object inline: {a: 1, b: 2}
      else if (value.startsWith('{') && value.endsWith('}')) {
        const obj: Record<string, string> = {};
        value
          .slice(1, -1)
          .split(',')
          .forEach((pair) => {
            const [k, v] = pair.split(':').map((s) => s.trim());
            if (k && v) obj[k] = v;
          });
        result[currentKey] = obj;
        currentKey = null;
      }
      // Comment
      else if (value.startsWith('#')) {
        // Skip comments
      }
      // Simple value
      else {
        result[currentKey] = value.replace(/^["']|["']$/g, '');
        currentKey = null;
      }
    }
    // Indented line (part of current object/array)
    else if (line.match(/^\s+/) && currentKey) {
      const subMatch = line.trim().match(/^(\w+):\s*(.+)$/);
      if (subMatch) {
        currentObject[subMatch[1]] = subMatch[2].trim().replace(/^["']|["']$/g, '');
      }
      // Array item: - value
      const arrMatch = line.trim().match(/^-\s+(.+)$/);
      if (arrMatch) {
        currentArray.push(arrMatch[1].trim());
      }
    }
  }

  // Flush remaining
  if (currentKey && currentArray.length > 0) {
    result[currentKey] = currentArray;
  }
  if (currentKey && Object.keys(currentObject).length > 0) {
    result[currentKey] = { ...currentObject };
  }

  return result;
}

function inferName(filePath: string): string {
  const basename = filePath.split('/').pop() ?? 'agent';
  return basename.replace(/\.md$/, '');
}

export function loadAgentsFromDir(dirPath: string): AgentDefinition[] {
  if (!existsSync(dirPath)) return [];

  return readdirSync(dirPath)
    .filter((file) => extname(file) === '.md')
    .map((file) => parseAgentFile(join(dirPath, file)));
}
