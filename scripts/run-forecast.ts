import { generateAIForecast } from "@/lib/ai-forecast"
import "dotenv/config"

async function main() {
    const forecast = await generateAIForecast()
    console.log(forecast)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})

