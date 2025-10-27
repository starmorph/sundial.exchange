import { type Tool } from "ai"
import { z } from "zod"

const DexOverviewInputSchema = z.object({}).describe("No parameters required.")

const DexOverviewResultSchema = z.object({
    endpoint: z.literal("/api/dex/overview"),
    label: z.literal("Solana DEX Overview"),
    description: z.literal("Pay $0.10 USDC on Solana to fetch protocols and volume analytics."),
    network: z.literal("solana"),
    currency: z.literal("USDC"),
    priceUsd: z.number(),
    priceMicros: z.number(),
})

export type DexOverviewToolResult = z.infer<typeof DexOverviewResultSchema>

export function createDexOverviewTool(): Tool<z.infer<typeof DexOverviewInputSchema>, DexOverviewToolResult> {
    return {
        description: "Initiate a paid Solana DEX overview request via x402.",
        inputSchema: DexOverviewInputSchema,
        async execute() {
            return DexOverviewResultSchema.parse({
                endpoint: "/api/dex/overview",
                label: "Solana DEX Overview",
                description: "Pay $0.10 USDC on Solana to fetch protocols and volume analytics.",
                network: "solana",
                currency: "USDC",
                priceUsd: 0.1,
                priceMicros: 100_000,
            })
        },
    }
}

