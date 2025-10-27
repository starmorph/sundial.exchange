import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        const stream = await streamText({
            model: openai("gpt-4o-mini"),
            messages,
            system: "You are Sundial, a Solana-focused AI assistant. Keep responses concise, helpful, and refer to x402 payments when relevant.",
        })

        return stream.toTextStreamResponse()
    } catch (error) {
        console.error("[CHAT] Error:", error)
        return new Response("Chat error", { status: 500 })
    }
}
