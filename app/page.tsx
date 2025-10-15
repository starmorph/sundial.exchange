import { Navbar } from "@/components/navbar"
import { StatsBar } from "@/components/stats-bar"
import SwapInterface from "@/components/swap-interface"
import { TrendingTokens } from "@/components/trending-tokens"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sundial Exchange | Solana DEX | Fast, Secure Decentralized Trading ",
  description:
    "Swap Solana tokens instantly with the best rates on Sundial Exchange. Access trending tokens, real-time stats, and seamless DeFi trading.",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-[100vw]">
      <Navbar />
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
