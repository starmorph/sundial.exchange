import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText } from "ai"
import { z } from "zod"

import { getDexProtocolSummary } from "@/lib/defillama-volumes"

const dexOverviewTool = {
    description: "Fetch detailed information for a specific Solana DEX protocol from DeFiLlama. Use this to get volume metrics, TVL, and other stats for DEXs like 'raydium', 'orca', 'jupiter', 'meteora', etc.",
    inputSchema: z.object({
        protocol: z
            .string()
            .describe("The DEX protocol name (e.g., 'raydium', 'orca', 'jupiter', 'meteora', 'phoenix'). Use lowercase."),
    }),
    execute: async ({ protocol }: { protocol: string }) => {
        const protocolData = await getDexProtocolSummary(protocol.toLowerCase())

        if (!protocolData) {
            return {
                error: `Could not find data for DEX protocol: ${protocol}`,
                suggestion: "Try 'raydium', 'orca', 'jupiter', or 'meteora'",
                generatedAt: new Date().toISOString(),
            }
        }

        return {
            protocol: protocolData.name,
            displayName: protocolData.displayName,
            total24h: protocolData.total24h,
            total7d: protocolData.total7d,
            total30d: protocolData.total30d,
            totalAllTime: protocolData.totalAllTime,
            change_1d: protocolData.change_1d,
            change_7d: protocolData.change_7d,
            tvl: protocolData.tvl,
            chains: protocolData.chains,
            generatedAt: new Date().toISOString(),
        }
    },
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
