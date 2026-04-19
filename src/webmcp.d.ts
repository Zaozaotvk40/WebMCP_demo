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

export interface RegisterToolOptions {
  signal?: AbortSignal;
}

export interface ModelContext {
  registerTool(tool: WebMCPTool, options?: RegisterToolOptions): void;
  provideContext(ctx: { tools: WebMCPTool[] }): void;
  /**
   * @deprecated Removed in Chrome 149+. Use the AbortSignal option of
   * `registerTool` instead: `registerTool(tool, { signal: controller.signal })`
   * then call `controller.abort()` to unregister.
   */
  unregisterTool?(name: string): void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}
