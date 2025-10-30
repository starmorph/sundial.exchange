import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { logAssistantResponse, logChatError, logUserMessage } from "@/lib/ai-message-logger"
import { AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config"
import { tools } from "@/lib/ai/tools"
import { extractLatestUserMessage } from "@/lib/ai/utils"
import { retrieveContext } from "@/lib/rag/vector-store"

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
        const { messages, walletAddress: wallet, documentId } = body as {
            messages: UIMessage[]
            walletAddress?: string
            documentId?: string
        }

        walletAddress = wallet || null
        const modelMessages = convertToModelMessages(messages)

        userMessage = extractLatestUserMessage(messages)
        logUserMessage(walletAddress, userMessage)

        // Retrieve RAG context if document is provided
        let systemPrompt = SYSTEM_PROMPT
        if (documentId && userMessage) {
            try {
                const relevantChunks = await retrieveContext(
                    userMessage,
                    apiKey,
                    5, // top 5 chunks
                    documentId
                )

                if (relevantChunks.length > 0) {
                    const contextText = relevantChunks
                        .map((chunk, idx) => `[Context ${idx + 1}]\n${chunk.text}`)
                        .join("\n\n")

                    systemPrompt = `${SYSTEM_PROMPT}

DOCUMENT CONTEXT:
You have access to the following relevant information from an uploaded PDF document. Use this context to answer the user's question accurately.

${contextText}

When answering, prioritize information from the document context. If the answer isn't in the context, you can use your general knowledge but clearly indicate when you're doing so.`
                }
            } catch (error) {
                console.error("[RAG] Failed to retrieve context:", error)
                // Continue without RAG context
            }
        }

        const stream = await streamText({
            model: openai(AI_CONFIG.model),
            messages: modelMessages,
            system: systemPrompt,
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
