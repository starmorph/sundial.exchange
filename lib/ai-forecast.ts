import { fetchTrendingTokensData } from "@/lib/defillama"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateAIForecast(): Promise<string> {
    const trendingData = await fetchTrendingTokensData(24)
    const prompt = `You are a Solana DeFi analyst. Given the following token trend dataset (JSON): ${JSON.stringify(
        trendingData,
    )}
Summarize likely 24-48 hour market movements with:
- Expected SOL momentum (bullish/bearish, recent trends, 24hr change, etc.)
- Top 3 trending tokens and catalysts
- Potential whale signals or liquidity risks
Keep it under 180 words. add quick disclaimer at the end: "This is not financial advice."`

    try {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY env var missing")
        }

        const openai = createOpenAI({ apiKey })

        const { text } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt,
            temperature: 0.6,
        })

        const trimmed = text.trim()

        if (!trimmed) {
            return "No forecast generated."
        }

        return trimmed
    } catch (error) {
        console.error("[AI_FORECAST] Error generating forecast:", error)
        throw new Error("AI forecast generation failed")
    }
}
