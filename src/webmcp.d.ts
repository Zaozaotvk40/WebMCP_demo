export {};

export interface WebMCPToolContent {
  type: 'text';
  text: string;
}

export interface WebMCPToolResponse {
  content?: WebMCPToolContent[];
  structuredContent?: unknown;
  isError?: boolean;
}

export interface WebMCPTool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  execute: (
    input: Record<string, unknown>,
    agent?: unknown,
  ) => WebMCPToolResponse | Promise<WebMCPToolResponse>;
}

export interface ModelContext {
  registerTool(tool: WebMCPTool): void;
  unregisterTool(name: string): void;
  provideContext(ctx: { tools: WebMCPTool[] }): void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}
