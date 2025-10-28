import { NextRequest, NextResponse } from "next/server"

import { getDexProtocolSummary } from "@/lib/defillama-volumes"

const MAX_DEX_QUERIES = 3
const PRICE_USDC = 0.01

/**
 * x402-Protected DEX Overview Endpoint
 * 
 * This endpoint requires x402 payment before returning data.
 * Price: 0.01 USDC per request (up to 3 DEXs)
 * 
 * Usage:
 * POST /api/dex/overview
 * Body: { protocols: string[] }
 * Headers: x402 payment headers
 */
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json()
        const { protocols } = body as { protocols?: string[] }

        // Validate input
        if (!protocols || !Array.isArray(protocols) || protocols.length === 0) {
            return NextResponse.json(
                { error: "Missing or invalid protocols array" },
                { status: 400 }
            )
        }

        if (protocols.length > MAX_DEX_QUERIES) {
            return NextResponse.json(
                { error: `Maximum ${MAX_DEX_QUERIES} protocols allowed per request` },
                { status: 400 }
            )
        }

        // Fetch DEX data
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

        // Return data with payment confirmation
        return NextResponse.json(
            {
                dexes: results,
                count: results.length,
                paymentSettled: true,
                generatedAt: new Date().toISOString(),
            },
            {
                status: 200,
                headers: {
                    "X-Payment-Settled": req.headers.get("x-payment-validated") === "true" ? "true" : "false",
                    "X-Payment-Network": req.headers.get("x-payment-network") ?? "",
                    "X-Payment-Tx": req.headers.get("x-payment-tx") ?? "",
                }
            }
        )
    } catch (error) {
        console.error("[DEX_OVERVIEW] Error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

/**
 * GET method returns pricing info without requiring payment
 */
export async function GET() {
    return NextResponse.json({
        endpoint: "/api/dex/overview",
        method: "POST",
        priceUSDC: PRICE_USDC,
        maxProtocols: MAX_DEX_QUERIES,
        paymentRequired: true,
        paymentProtocol: "x402",
        network: "solana",
        description: "Get real-time DEX protocol analytics with x402 micropayment",
    })
}
