import { type UIMessage } from "ai";

/**
 * Extract the latest user message text from a message array
 */
export function extractLatestUserMessage(messages: UIMessage[]): string {
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
        return ""
    }

    const textParts = lastUserMessage.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)

    return textParts.join(" ")
}

/**
 * Format tool name for display
 */
export function formatToolName(toolKey: string): string {
    const key = toolKey.startsWith("tool-") ? toolKey.substring(5) : toolKey
    return key
        .split("-")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ")
}

/**
 * Validate wallet address format
 */
export function isValidSolanaAddress(address: string): boolean {
    // Basic Solana address validation (32-44 base58 characters)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

