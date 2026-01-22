import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FaqJsonLd } from "@/app/jsonld"

const faqs = [
    {
        question: "What is x402 micropayments?",
        answer: "x402 is a protocol that enables instant, frictionless micropayments for API access. Instead of monthly subscriptions, you pay only for what you use—as low as $0.001 per query. Payments are processed via USDC on Solana or Base networks with zero gas fees.",
    },
    {
        question: "How do I check Solana DEX volume?",
        answer: "Visit our DEX Analytics page at sundial.exchange/dex-analytics to see real-time volume data for all major Solana DEXs including Raydium, Orca, Meteora, and Jupiter. You can also use our AI chat or API for programmatic access.",
    },
    {
        question: "How to get crypto analytics without a subscription?",
        answer: "Sundial Exchange uses x402 micropayments—pay per query instead of monthly fees. Get real-time stats for $0.10, pool analytics for $0.001, or AI market forecasts for $10. No credit cards, no accounts, no KYC required.",
    },
    {
        question: "What is the TVL of Raydium?",
        answer: "Check the current Raydium TVL and other metrics on our analytics page at sundial.exchange/dex-analytics/raydium. We provide real-time data powered by DeFiLlama with historical charts and chain breakdowns.",
    },
    {
        question: "Can AI agents use Sundial Exchange?",
        answer: "Yes! Sundial is built for AI agent integration. Our x402-enabled API allows autonomous agents to pay for data access without human intervention. The API is ERC-8004 compliant for reputation scoring and requires no authentication.",
    },
    {
        question: "How do I swap tokens on Solana without KYC?",
        answer: "Connect your Solana wallet to sundial.exchange/swap and trade instantly. We use Jupiter Ultra for best rates across all DEXs with 34x sandwich protection. No accounts, no KYC, no custody of your funds—your keys, your crypto.",
    },
]

export function FaqSection() {
    return (
        <section className="py-24 border-t border-border">
            <FaqJsonLd faqs={faqs} />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <Badge className="bg-primary text-black border-primary mb-6 font-bold tracking-wide shadow-lg shadow-primary/50">
                        FAQ
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                        Everything you need to know about Sundial Exchange
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Card key={index} className="border-border bg-card hover:border-primary/30 transition-colors">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-white mb-3">
                                    {faq.question}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
