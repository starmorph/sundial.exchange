import { NextResponse } from "next/server"

interface HeliusPerfSample {
    numSlots: number
    numTransactions: number
    samplePeriodSecs: number
    slot: number
}

interface StatsResponseBody {
    tps: number | null
    solPriceUsd: number | null
    tvlUsd: number | null
    volume24hUsd: number | null
}

export async function GET() {
    const heliusApiKey = process.env.HELIUS_API_KEY
    const heliusRpcUrl = heliusApiKey
        ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
        : "https://api.mainnet-beta.solana.com"

    const tpsPromise = (async () => {
        try {
            const res = await fetch(heliusRpcUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getRecentPerformanceSamples",
                    params: [1],
                }),
            })
            if (!res.ok) return null
            const json = (await res.json()) as { result?: HeliusPerfSample[] }
            const sample = json.result?.[0]
            if (!sample || sample.samplePeriodSecs <= 0) return null
            const tps = sample.numTransactions / sample.samplePeriodSecs
            return Math.round(tps)
        } catch {
            return null
        }
    })()

    const solPricePromise = (async () => {
        try {
            const res = await fetch(
                "https://coins.llama.fi/prices/current/coingecko:solana?searchWidth=2400",
                { next: { revalidate: 15 } },
            )
            if (!res.ok) return null
            const json = (await res.json()) as {
                coins?: Record<string, { price?: number }>
            }
            const price = json.coins?.["coingecko:solana"]?.price
            return typeof price === "number" ? price : null
        } catch {
            return null
        }
    })()

    const tvlPromise = (async () => {
        try {
            const res = await fetch("https://api.llama.fi/v2/chains", { next: { revalidate: 300 } })
            if (!res.ok) return null
            const chains = (await res.json()) as Array<{ name?: string; tvl?: number }>
            const sol = chains.find((c) => c.name === "Solana")
            return typeof sol?.tvl === "number" ? sol.tvl : null
        } catch {
            return null
        }
    })()

    const volumePromise = (async () => {
        try {
            const url =
                "https://api.llama.fi/overview/dexs?chain=Solana&excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true"
            const res = await fetch(url, { next: { revalidate: 120 } })
            if (!res.ok) return null
            const json = (await res.json()) as { total24h?: number }
            return typeof json.total24h === "number" ? json.total24h : null
        } catch {
            return null
        }
    })()

    const [tps, solPriceUsd, tvlUsd, volume24hUsd] = await Promise.all([
        tpsPromise,
        solPricePromise,
        tvlPromise,
        volumePromise,
    ])

    const body: StatsResponseBody = { tps, solPriceUsd, tvlUsd, volume24hUsd }

    return NextResponse.json(body, {
        headers: {
            // Allow fast polling; subrequests handle their own caching
            "Cache-Control": "no-store",
        },
    })
}


