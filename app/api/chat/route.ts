import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { logAssistantResponse, logChatError, logUserMessage } from "@/lib/ai-message-logger"
import { AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config"
import { tools } from "@/lib/ai/tools"
import { extractLatestUserMessage } from "@/lib/ai/utils"

export async function POST(req: Request) {
    let walletAddress: string | null = null
    let userMessage = ""

    try {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY env var missing")
        }

        const openai = createOpenAI({ apiKey })

        const body = await req.json()
        const { messages, walletAddress: wallet } = body as {
            messages: UIMessage[]
            walletAddress?: string
        }

        walletAddress = wallet || null
        const modelMessages = convertToModelMessages(messages)

        userMessage = extractLatestUserMessage(messages)
        logUserMessage(walletAddress, userMessage)

        const stream = await streamText({
            model: openai(AI_CONFIG.model),
            messages: modelMessages,
            system: SYSTEM_PROMPT,
            tools,
            temperature: AI_CONFIG.temperature,
            onFinish: ({ text, toolCalls }) => {
                const toolNames = toolCalls?.map((tc) => tc.toolName) || []
                logAssistantResponse(walletAddress, userMessage, text, toolNames)
            },
        })

        return stream.toUIMessageStreamResponse()
    } catch (error) {
        console.error("[CHAT] Error:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        logChatError(walletAddress, userMessage, errorMessage)
        return new Response("Chat error", { status: 500 })
    }
}
