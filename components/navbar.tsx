"use client"

import dynamic from "next/dynamic"

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
)

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="text-sm font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sundial.exchange
          </div>
        </div>

        <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !rounded-lg !h-9 !px-4 !text-sm !font-medium transition-colors" />
      </div>
    </nav>
  )
}
