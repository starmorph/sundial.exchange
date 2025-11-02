"use client"

import type { Token } from "@/components/swap/swap-interface"
import { TokenSelectorModal } from "@/components/token-selector/token-selector-modal"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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
        {selectedToken.logoURI ? (
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={selectedToken.logoURI}
              alt={selectedToken.symbol}
              width={24}
              height={24}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<span class="text-xl">${selectedToken.icon}</span>`
                }
              }}
            />
          </div>
        ) : (
          <span className="text-2xl">{selectedToken.icon}</span>
        )}
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
