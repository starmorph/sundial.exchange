import { dexOverviewTool } from "./dex-overview";
import { DEX_OVERVIEW_PAID_METADATA, dexOverviewPaidTool } from "./dex-overview-paid";

/**
 * Central registry of all AI tools available to the chat interface.
 * Add new tools here to make them available in the chat route.
 */
export const tools = {
    "dex-overview": dexOverviewTool,
    "dex-overview-paid": dexOverviewPaidTool,
}

export type ToolName = keyof typeof tools

/**
 * Tool metadata for UI display and logging
 * Used by the frontend to determine if payment modal should be shown
 */
export const toolMetadata: Record<ToolName, {
    displayName: string
    category: string
    requiresPayment: boolean
    priceUSDC?: number
    endpoint?: string
}> = {
    "dex-overview": {
        displayName: "DEX Overview",
        category: "Analytics",
        requiresPayment: false,
    },
    "dex-overview-paid": {
        displayName: "DEX Overview (Paid)",
        category: "Premium Analytics",
        requiresPayment: true,
        priceUSDC: DEX_OVERVIEW_PAID_METADATA.priceUSDC,
        endpoint: DEX_OVERVIEW_PAID_METADATA.endpoint,
    },
}

