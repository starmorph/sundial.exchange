import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText } from "ai"
import { z } from "zod"

import { logAssistantResponse, logChatError, logUserMessage } from "@/lib/ai-message-logger"
import { getDexProtocolSummary } from "@/lib/defillama-volumes"

const MAX_DEX_QUERIES = 3

const dexOverviewTool = {
    description: `Fetch detailed information for up to ${MAX_DEX_QUERIES} Solana DEX protocols from DeFiLlama. Use this to get volume metrics, TVL, and other stats for DEXs like 'raydium', 'orca', 'jupiter', 'meteora', etc. IMPORTANT: You can only query up to ${MAX_DEX_QUERIES} DEXs at once to prevent performance issues.`,
    inputSchema: z.object({
        protocols: z
            .array(z.string())
            .max(MAX_DEX_QUERIES)
            .describe(`Array of DEX protocol names (max ${MAX_DEX_QUERIES}). Examples: ['raydium'], ['orca', 'jupiter'], ['meteora', 'phoenix', 'raydium']. Use lowercase.`),
    }),
    execute: async ({ protocols }: { protocols: string[] }) => {
        if (protocols.length > MAX_DEX_QUERIES) {
            return {
                error: `Too many DEXs requested. Maximum ${MAX_DEX_QUERIES} allowed, but ${protocols.length} were requested.`,
                suggestion: `Please limit your request to ${MAX_DEX_QUERIES} DEXs at a time.`,
                generatedAt: new Date().toISOString(),
            }
        }

        const results = await Promise.all(
            protocols.map(async (protocol) => {
                const protocolData = await getDexProtocolSummary(protocol.toLowerCase())

                if (!protocolData) {
                    return {
                        protocol,
                        error: `Could not find data for: ${protocol}`,
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
                }
            }),
        )

        return {
            dexes: results,
            count: results.length,
            generatedAt: new Date().toISOString(),
        }
    },
}

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
        const { messages, walletAddress: wallet } = body

        walletAddress = wallet || null
        const modelMessages = convertToModelMessages(messages)

        // Extract the latest user message for logging
        const lastUserMessage = messages
            .filter((m: any) => m.role === "user")
            .pop()
        userMessage = lastUserMessage?.text || lastUserMessage?.content || ""

        // Log the incoming user message
        logUserMessage(walletAddress, userMessage)

        const stream = await streamText({
            model: openai("gpt-4o-mini"),
            messages: modelMessages,
            system:
                "You are Sundial, a Solana-focused AI assistant. Keep responses concise, helpful, and refer to x402 payments when relevant.",
            tools: {
                "dex-overview": dexOverviewTool,
            },
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
