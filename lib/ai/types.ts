import type { z } from "zod"

/**
 * Base structure for an AI tool matching Vercel AI SDK specification
 * @see https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling
 */
export interface AITool<TInput = unknown, TOutput = unknown> {
    description: string
    inputSchema: z.ZodSchema<TInput>
    execute: (input: TInput) => Promise<TOutput>
}

/**
 * Tool execution result
 */
export interface ToolResult<T = unknown> {
    success: boolean
    data?: T
    error?: string
    generatedAt: string
}

/**
 * Payment metadata for x402 tools
 */
export interface ToolPaymentMetadata {
    requiresPayment: boolean
    priceUSDC?: number
    endpoint?: string
}

/**
 * Enhanced tool with payment metadata
 */
export type PayableAITool<TInput = unknown, TOutput = unknown> = AITool<TInput, TOutput> & {
    payment?: ToolPaymentMetadata
}

