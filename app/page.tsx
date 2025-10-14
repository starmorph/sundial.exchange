import SwapInterface from "@/components/swap-interface"
import { StatsBar } from "@/components/stats-bar"
import { TrendingTokens } from "@/components/trending-tokens"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StatsBar />
      <TrendingTokens />
      <main className="flex items-center justify-center p-4 pt-8">
        <SwapInterface />
      </main>
    </div>
  )
}
