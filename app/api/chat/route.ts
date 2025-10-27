import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText } from "ai"

import { createDexOverviewTool } from "@/lib/tools/dex-overview"

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY env var missing")
        }

        const openai = createOpenAI({ apiKey })

        const { messages } = await req.json()
        const modelMessages = convertToModelMessages(messages)

        const stream = await streamText({
            model: openai("gpt-4o-mini"),
            messages: modelMessages,
            system:
                "You are Sundial, a Solana-focused AI assistant. Keep responses concise, helpful, and refer to x402 payments when relevant.",
            tools: {
                getDexOverview: createDexOverviewTool(),
            },
        })

        return stream.toUIMessageStreamResponse()
    } catch (error) {
        console.error("[CHAT] Error:", error)
        return new Response("Chat error", { status: 500 })
    }
}
