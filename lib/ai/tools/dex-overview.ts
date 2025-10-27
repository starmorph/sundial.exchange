import { z } from "zod"

import { getDexProtocolSummary } from "@/lib/defillama-volumes"

const MAX_DEX_QUERIES = 3

export const dexOverviewTool = {
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

