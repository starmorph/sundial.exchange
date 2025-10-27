import { fetchTrendingTokensData } from "@/lib/defillama"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateAIForecast(): Promise<string> {
    const trendingData = await fetchTrendingTokensData(24)
    const prompt = `You are a Solana DeFi analyst. Given the following token trend dataset (JSON): ${JSON.stringify(
        trendingData,
    )}
Summarize likely 24-48 hour market movements with:
- Expected SOL momentum (bullish/bearish, target % range)
- Top 3 trending tokens and catalysts
- Potential whale signals or liquidity risks
Keep it under 180 words.`

    try {
        const { text } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt,
            temperature: 0.6,
        })

        return text.trim()
    } catch (error) {
        console.error("[AI_FORECAST] Error generating forecast:", error)
        throw new Error("AI forecast generation failed")
    }
}
