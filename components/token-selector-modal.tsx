"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TokenListItem } from "@/components/token-list-item"
import type { Token } from "@/components/swap-interface"
import { Search } from "lucide-react"

interface TokenSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tokens: Token[]
  selectedToken: Token
  onSelectToken: (token: Token) => void
}

export function TokenSelectorModal({
  open,
  onOpenChange,
  tokens,
  selectedToken,
  onSelectToken,
}: TokenSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) {
      return tokens
    }

    const query = searchQuery.toLowerCase().trim()
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.mint.toLowerCase().includes(query),
    )
  }, [tokens, searchQuery])

  // Quick select tokens
  const quickSelectTokens = useMemo(() => {
    return {
      sol: tokens.find((t) => t.symbol === "SOL"),
      usdc: tokens.find((t) => t.symbol === "USDC"),
      jup: tokens.find((t) => t.symbol === "JUP"),
    }
  }, [tokens])

  const handleSelectToken = (token: Token) => {
    onSelectToken(token)
    onOpenChange(false)
    setSearchQuery("")
  }

  const handleQuickSelect = (token: Token | undefined) => {
    if (token) {
      handleSelectToken(token)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Select a token</DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, symbol, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
              autoFocus
            />
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Quick select:</span>
            {quickSelectTokens.sol && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(quickSelectTokens.sol)}
                className="h-8 px-3 rounded-full"
              >
                <span className="mr-1.5">◎</span> SOL
              </Button>
            )}
            {quickSelectTokens.usdc && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(quickSelectTokens.usdc)}
                className="h-8 px-3 rounded-full"
              >
                <span className="mr-1.5">💵</span> USDC
              </Button>
            )}
            {quickSelectTokens.jup && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(quickSelectTokens.jup)}
                className="h-8 px-3 rounded-full"
              >
                <span className="mr-1.5">🪐</span> JUP
              </Button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Token List */}
        <ScrollArea className="h-[400px]">
          <div className="px-3 py-2">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <TokenListItem
                  key={token.mint}
                  token={token}
                  onSelect={handleSelectToken}
                  showBalance={true}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No tokens found</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Info */}
        <div className="border-t border-border px-6 py-3 bg-secondary/30">
          <p className="text-xs text-muted-foreground text-center">
            Showing {filteredTokens.length} of {tokens.length} tokens
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
