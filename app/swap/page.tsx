import { Navbar } from "@/components/navbar"
import { StatsBar } from "@/components/stats/stats-bar"
import SwapInterface from "@/components/swap/swap-interface"
import { TrendingTokens } from "@/components/stats/trending-tokens"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Swap Solana Tokens Without KYC | Jupiter Ultra Integration",
    description:
        "Non-custodial Solana token swaps with 34x sandwich protection. No KYC, no account required. Powered by Jupiter Ultra for best rates across Raydium, Orca, Meteora.",
    keywords: [
        'swap solana tokens without kyc',
        'non custodial solana swap',
        'jupiter ultra swap',
        'solana token swap no account',
        'solana dex no kyc',
    ],
    alternates: { canonical: '/swap' },
    openGraph: {
        title: 'Swap Solana Tokens Without KYC | Sundial Exchange',
        description: 'Non-custodial token swaps with 34x sandwich protection. Best rates via Jupiter Ultra.',
        url: 'https://sundial.exchange/swap',
    },
}

export default function SwapPage() {
    return (
        <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-[100vw]">
            <Navbar />
            <h1 className="sr-only">Swap Solana Tokens - Best DEX Rates Without KYC</h1>
            <div className="pt-12">
                <StatsBar />
                <TrendingTokens />
                <main className="flex items-center justify-center p-4 pt-8 w-full max-w-full">
                    <SwapInterface />
                </main>
            </div>
        </div>
    )
}

