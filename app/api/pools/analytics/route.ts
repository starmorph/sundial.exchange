import { NextResponse } from "next/server"

import { getPoolAnalytics } from "@/lib/jupiter-ultra"

export async function GET(request: Request) {
    const url = new URL(request.url)
    const poolId = url.searchParams.get("poolId")

    if (!poolId) {
        return NextResponse.json({ error: "poolId query parameter is required" }, { status: 400 })
    }

    try {
        const snapshot = await getPoolAnalytics(poolId)

        const response = NextResponse.json(
            {
                poolId: snapshot.poolId,
                poolName: snapshot.poolName,
                metrics: snapshot.metrics,
                reserves: snapshot.reserves,
                priceImpactBps: snapshot.priceImpactBps,
                updatedAtUnix: snapshot.updatedAtUnix,
                fetchedAt: snapshot.fetchedAt,
                raw: snapshot.raw,
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
                },
            },
        )

        response.headers.set(
            "X-402-Output-Schema",
            JSON.stringify({
                input: {
                    type: "http",
                    method: "GET",
                    queryParams: {
                        poolId: {
                            type: "string",
                            required: true,
                            description: "Solana pool address (base58)",
                        },
                    },
                },
                output: {
                    type: "object",
                    properties: {
                        poolId: { type: "string" },
                        poolName: { type: "string" },
                        metrics: { type: "object" },
                        reserves: { type: "object" },
                        priceImpactBps: { type: "number", nullable: true },
                        updatedAtUnix: { type: "number" },
                        fetchedAt: { type: "string" },
                    },
                },
                priceUsd: 0.001,
                network: "solana",
                currency: "USDC",
                description: "Returns Jupiter pool liquidity, volume, fees, and reserve analytics",
            }),
        )

        return response
    } catch (error) {
        console.error(`[POOL ANALYTICS] Failed to fetch pool ${poolId}:`, error)
        return NextResponse.json({ error: "Failed to load pool analytics" }, { status: 502 })
    }
}

