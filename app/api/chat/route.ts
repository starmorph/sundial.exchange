import { createOpenAI } from "@ai-sdk/openai"
import { withTracing } from "@posthog/ai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { logAssistantResponse, logChatError, logUserMessage } from "@/lib/ai-message-logger"
import { AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config"
import { tools } from "@/lib/ai/tools"
import { extractLatestUserMessage } from "@/lib/ai/utils"
import createPosthogClient from "@/lib/posthog"

export async function POST(req: Request) {
    let walletAddress: string | null = null
    let userMessage = ""
    let posthogClient = createPosthogClient()

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

        const baseModel = openai(AI_CONFIG.model)
        const model = posthogClient
            ? withTracing(baseModel, posthogClient, {
                posthogDistinctId: walletAddress ?? undefined,
                posthogProperties: {
                    walletAddress,
                    route: "chat",
                    hasTools: Object.keys(tools).length > 0,
                    temperature: AI_CONFIG.temperature,
                },
            })
            : baseModel

        const stream = await streamText({
            model,
            messages: modelMessages,
            system: SYSTEM_PROMPT,
            tools,
            temperature: AI_CONFIG.temperature,
            onFinish: ({ text, toolCalls }) => {
                const toolNames = toolCalls?.map((tc) => tc.toolName) || []
                logAssistantResponse(walletAddress, userMessage, text, toolNames)
            },
        })

        const response = stream.toUIMessageStreamResponse()

        if (posthogClient) {
            queueMicrotask(() => {
                posthogClient!
                    .shutdown()
                    .catch((error) => console.error("[PostHog] shutdown error:", error))
            })
        }

        return response
    } catch (error) {
        console.error("[CHAT] Error:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        logChatError(walletAddress, userMessage, errorMessage)
        if (posthogClient) {
            await posthogClient.shutdown().catch(() => { })
        }
        return new Response("Chat error", { status: 500 })
    }
}
