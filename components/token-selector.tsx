"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TokenSelectorModal } from "@/components/token-selector-modal"
import { ChevronDown } from "lucide-react"
import type { Token } from "@/components/swap-interface"
import Image from "next/image"

interface TokenSelectorProps {
  selectedToken: Token
  onSelectToken: (token: Token) => void
  tokens: Token[]
}

export function TokenSelector({ selectedToken, onSelectToken, tokens }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset image error state when token changes
  const handleOpen = (newOpen: boolean) => {
    if (newOpen) {
      setImageError(false)
    }
    setOpen(newOpen)
  }

  const handleTokenSelect = (token: Token) => {
    setImageError(false) // Reset error state for new token
    onSelectToken(token)
  }

  return (
    <div className="flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-12 gap-2 rounded-full border-border bg-secondary/50 px-4 hover:bg-secondary"
      >
        {selectedToken.logoURI && !imageError ? (
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
            <Image
              key={selectedToken.mint} // Force re-render on token change
              src={selectedToken.logoURI}
              alt={selectedToken.symbol}
              width={24}
              height={24}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <span className="text-xl">{selectedToken.icon}</span>
        )}
        <span className="font-semibold">{selectedToken.symbol}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Button>

      <TokenSelectorModal
        open={open}
        onOpenChange={handleOpen}
        tokens={tokens}
        selectedToken={selectedToken}
        onSelectToken={handleTokenSelect}
      />
    </div>
  )
}
