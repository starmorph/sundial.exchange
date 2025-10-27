import { dexOverviewTool } from "./dex-overview";

/**
 * Central registry of all AI tools available to the chat interface.
 * Add new tools here to make them available in the chat route.
 */
export const tools = {
    "dex-overview": dexOverviewTool,
}

export type ToolName = keyof typeof tools

/**
 * Tool metadata for UI display and logging
 */
export const toolMetadata: Record<ToolName, { displayName: string; category: string; requiresPayment: boolean }> = {
    "dex-overview": {
        displayName: "DEX Overview",
        category: "Analytics",
        requiresPayment: false,
    },
}

