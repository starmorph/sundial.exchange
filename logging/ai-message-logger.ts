/**
 * AI Message Logger
 * Logs chat interactions for analytics and monitoring
 */

export interface AIMessageLog {
    timestamp: string
    walletAddress: string | null
    userMessage: string
    assistantMessage?: string
    toolCalls?: string[]
    error?: string
}

/**
 * Logs an AI chat message interaction
 */
export function logAIMessage(log: AIMessageLog): void {
    const logEntry = {
        ...log,
        timestamp: log.timestamp || new Date().toISOString(),
    }

    console.log("[AI-MESSAGE-LOG]", JSON.stringify(logEntry, null, 2))
}

/**
 * Logs a user message to the AI chat
 */
export function logUserMessage(walletAddress: string | null, message: string): void {
    logAIMessage({
        timestamp: new Date().toISOString(),
        walletAddress,
        userMessage: message,
    })
}

/**
 * Logs an assistant response
 */
export function logAssistantResponse(
    walletAddress: string | null,
    userMessage: string,
    assistantMessage: string,
    toolCalls?: string[],
): void {
    logAIMessage({
        timestamp: new Date().toISOString(),
        walletAddress,
        userMessage,
        assistantMessage,
        toolCalls,
    })
}

/**
 * Logs a chat error
 */
export function logChatError(walletAddress: string | null, userMessage: string, error: string): void {
    logAIMessage({
        timestamp: new Date().toISOString(),
        walletAddress,
        userMessage,
        error,
    })
}

