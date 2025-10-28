import { z } from "zod"

/**
 * Paid DEX Overview Tool with x402 Payment
 * 
 * This tool requires x402 micropayment before execution.
 * When the AI calls this tool, the frontend will:
 * 1. Detect the tool requires payment (via toolMetadata)
 * 2. Show payment modal to user
 * 3. User approves x402 payment
 * 4. Tool executes and returns data
 * 
 * Price: 0.01 USDC per query (up to 3 DEXs)
 */

const MAX_DEX_QUERIES = 3
const PRICE_USDC = 0.01

export const dexOverviewPaidTool = {
    description: `[PAID - ${PRICE_USDC} USDC] Fetch detailed real-time information for up to ${MAX_DEX_QUERIES} Solana DEX protocols from DeFiLlama. Get volume metrics, TVL, price changes, and chain distribution for DEXs like 'raydium', 'orca', 'jupiter', 'meteora', etc. This requires x402 micropayment. Maximum ${MAX_DEX_QUERIES} DEXs per query.`,
    inputSchema: z.object({
        protocols: z
            .array(z.string())
            .min(1)
            .max(MAX_DEX_QUERIES)
            .describe(`Array of DEX protocol names (1-${MAX_DEX_QUERIES}). Examples: ['raydium'], ['orca', 'jupiter'], ['meteora', 'phoenix', 'raydium']. Use lowercase names.`),
    }),
    execute: async ({ protocols }: { protocols: string[] }) => {
        if (protocols.length > MAX_DEX_QUERIES) {
            return {
                error: `Too many DEXs requested. Maximum ${MAX_DEX_QUERIES} allowed, but ${protocols.length} were requested.`,
                suggestion: `Please limit your request to ${MAX_DEX_QUERIES} DEXs at a time.`,
                generatedAt: new Date().toISOString(),
            }
        }

        // Return placeholder - actual data fetched by frontend after payment
        return {
            status: "payment_required",
            message: `Fetching real-time data for ${protocols.join(", ")}. Payment approval required.`,
            protocols,
            priceUSDC: PRICE_USDC,
            generatedAt: new Date().toISOString(),
        }
    },
}

export const DEX_OVERVIEW_PAID_METADATA = {
    requiresPayment: true,
    priceUSDC: PRICE_USDC,
    endpoint: "/api/dex/overview",
    maxQueries: MAX_DEX_QUERIES,
}

