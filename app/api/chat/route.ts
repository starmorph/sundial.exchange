import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText } from "ai"
import { z } from "zod"

import { getSolanaDexProtocols, getSolanaDexVolumes } from "@/lib/defillama-volumes"

const dexOverviewTool = {
    description: "Fetch current Solana DEX protocol summaries and historical volume data aggregated from DeFiLlama.",
    inputSchema: z.object({
        days: z
            .number()
            .int()
            .min(1)
            .max(90)
            .optional()
            .describe("Limit the volume timeline to the most recent N days (max 90)."),
    }),
    execute: async ({ days }: { days?: number }) => {
        const [protocols, volumes] = await Promise.all([
            getSolanaDexProtocols(),
            getSolanaDexVolumes(),
        ])

        const daysToInclude = days ? Math.min(days, volumes.length) : volumes.length
        const recentVolumes = days ? volumes.slice(volumeSliceStart(volumes.length, daysToInclude)) : volumes

        return {
            protocols,
            volumes: recentVolumes,
            generatedAt: new Date().toISOString(),
            windowDays: daysToInclude,
        }
    },
}

const volumeSliceStart = (totalLength: number, window: number): number => {
    if (window >= totalLength) {
        return 0
    }

    return totalLength - window
}

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
                "dex-overview": dexOverviewTool,
            },
        })

        return stream.toUIMessageStreamResponse()
    } catch (error) {
        console.error("[CHAT] Error:", error)
        return new Response("Chat error", { status: 500 })
    }
}
