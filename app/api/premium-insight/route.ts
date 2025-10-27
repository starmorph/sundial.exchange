import { generateAIForecast } from "@/lib/ai-forecast"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { payment } = await req.json()

    if (!payment || Number(payment.amount ?? 0) < 10) {
        return NextResponse.json(
            {
                error: "Payment required: $10 via x402",
                details: "Invoke with a valid x402 payment proof covering the $10 premium insight fee.",
            },
            { status: 402 },
        )
    }

    try {
        const forecast = await generateAIForecast()
        return NextResponse.json({ forecast, generatedAt: new Date().toISOString() })
    } catch (error) {
        console.error("[PREMIUM] Forecast generation failed:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
