"use client"

import { Button } from "@/components/ui/button"
import type { Token } from "@/components/swap-interface"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface TokenListItemProps {
  token: Token
  onSelect: (token: Token) => void
  showBalance?: boolean
}

export function TokenListItem({ token, onSelect, showBalance = true }: TokenListItemProps) {
  const abbreviatedAddress = `${token.mint.slice(0, 4)}...${token.mint.slice(-4)}`
  const heliusExplorerUrl = `https://orbx.helius.xyz/address/${token.mint}`

  const handleAddressClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(heliusExplorerUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Button
      variant="ghost"
      onClick={() => onSelect(token)}
      className="w-full h-auto p-3 flex items-center justify-between gap-3 hover:bg-secondary/80 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Token Logo */}
        <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-secondary">
          {token.logoURI ? (
            <Image
              src={token.logoURI}
              alt={token.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to emoji icon if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl">${token.icon}</div>`
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">{token.icon}</div>
          )}
        </div>

        {/* Token Info */}
        <div className="flex flex-col items-start flex-1 min-w-0">
          <div className="flex items-center gap-2 w-full">
            <span className="font-semibold text-foreground">{token.symbol}</span>
            <span className="text-xs text-muted-foreground truncate">{token.name}</span>
          </div>
          <button
            onClick={handleAddressClick}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="font-mono">{abbreviatedAddress}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Balance */}
      {showBalance && (
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-medium text-foreground">{token.balance.toFixed(4)}</div>
          <div className="text-xs text-muted-foreground">Balance</div>
        </div>
      )}
    </Button>
  )
}
