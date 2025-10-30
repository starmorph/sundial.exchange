"use client"

import type { Token } from "@/components/swap-interface"
import { TokenSelector } from "@/components/token-selector"
import { Button } from "@/components/ui/button"

interface SwapCardProps {
  label: string
  amount: string
  onAmountChange: (value: string) => void
  token: Token
  onTokenChange: (token: Token) => void
  tokens: Token[]
  showMaxButton?: boolean
  onMaxClick?: () => void
  onPercentageClick?: (percentage: number) => void
}

export function SwapCard({
  label,
  amount,
  onAmountChange,
  token,
  onTokenChange,
  tokens,
  showMaxButton,
  onMaxClick,
  onPercentageClick,
}: SwapCardProps) {
  const usdValue =
    amount && token.price
      ? `$${(Number(amount) * token.price).toFixed(2)}`
      : token.price
        ? "$0.00"
        : ""

  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 my-2 space-y-4 overflow-visible shadow-sm hover:border-border/60 transition-colors">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>

      <div className="flex items-center justify-between gap-4 overflow-visible">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className="flex-1 bg-transparent text-5xl font-light text-foreground outline-none placeholder:text-muted-foreground/30 min-w-0"
        />
        <TokenSelector selectedToken={token} onSelectToken={onTokenChange} tokens={tokens} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{usdValue}</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Balance: {token.balance.toFixed(4)}</span>
          {showMaxButton && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPercentageClick?.(50)}
                className="h-6 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary font-medium"
              >
                Half
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMaxClick}
                className="h-6 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary font-medium"
              >
                Max
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
