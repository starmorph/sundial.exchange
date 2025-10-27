import { generateAIForecast } from "@/lib/ai-forecast"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const forecast = await generateAIForecast()
        return NextResponse.json({ forecast, generatedAt: new Date().toISOString() })
    } catch (error) {
        console.error("[PREMIUM] Forecast generation failed:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
