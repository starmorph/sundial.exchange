"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TokenSelectorModal } from "@/components/token-selector-modal"
import { ChevronDown } from "lucide-react"
import type { Token } from "@/components/swap-interface"
import { TokenLogo } from "@/components/optimized-logo"

interface TokenSelectorProps {
  selectedToken: Token
  onSelectToken: (token: Token) => void
  tokens: Token[]
}

export function TokenSelector({ selectedToken, onSelectToken, tokens }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-12 gap-2 rounded-full border-border bg-secondary/50 px-4 hover:bg-secondary"
      >
        <TokenLogo
          logoURI={selectedToken.logoURI}
          symbol={selectedToken.symbol}
          icon={selectedToken.icon}
          size={24}
        />
        <span className="font-semibold">{selectedToken.symbol}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Button>

      <TokenSelectorModal
        open={open}
        onOpenChange={setOpen}
        tokens={tokens}
        selectedToken={selectedToken}
        onSelectToken={onSelectToken}
      />
    </div>
  )
}
