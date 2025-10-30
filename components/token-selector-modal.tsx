"use client"

import { useState, useMemo, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TokenListItem } from "@/components/token-list-item"
import type { Token } from "@/components/swap-interface"
import { Search, Loader2 } from "lucide-react"
import { searchTokens } from "@/lib/jupiter-token-search"

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
  const [searchResults, setSearchResults] = useState<Token[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Reset search when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSearchResults([])
    }
  }, [open])

  // Debounced search effect
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        try {
          const results = await searchTokens(searchQuery)
          // Add balance 0 to search results (they're external tokens)
          const resultsWithBalance = results.map((token) => ({
            ...token,
            balance: 0,
            price: undefined,
          }))
          setSearchResults(resultsWithBalance)
        } catch (error) {
          console.error("Search error:", error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(searchTimer)
  }, [searchQuery])

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) {
      return tokens
    }

    const query = searchQuery.toLowerCase().trim()
    const localMatches = tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.mint.toLowerCase().includes(query),
    )

    // If we have search results from API, merge them with local matches
    if (searchResults.length > 0) {
      // Combine local and API results, remove duplicates based on mint address
      const combined = [...localMatches]
      const mints = new Set(localMatches.map((t) => t.mint))

      for (const result of searchResults) {
        if (!mints.has(result.mint)) {
          combined.push(result)
          mints.add(result.mint)
        }
      }

      return combined
    }

    return localMatches
  }, [tokens, searchQuery, searchResults])

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
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              type="text"
              placeholder="Search by name, symbol, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
              autoFocus
            />
          </div>
          {searchQuery.length >= 2 && (
            <p className="text-xs text-muted-foreground mt-2">
              {isSearching ? "Searching..." : `Showing ${filteredTokens.length} results`}
            </p>
          )}
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
