"use client"

import { SwapCard } from "@/components/swap-card"
import { Button } from "@/components/ui/button"
import { executeJupiterOrder, getHoldings, getJupiterOrder } from "@/lib/jupiter-ultra"
import { fromTokenAmount, SOLANA_TOKENS, toTokenAmount, type SolanaToken } from "@/lib/solana-tokens"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { VersionedTransaction } from "@solana/web3.js"
import { ArrowDownUp, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export type Token = SolanaToken & {
  balance: number
  price?: number
}

export default function SwapInterface() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()

  const [orderType, setOrderType] = useState<"instant" | "limit">("instant")
  const [tokens, setTokens] = useState<Token[]>([])
  const [sellToken, setSellToken] = useState<Token | null>(null)
  const [buyToken, setBuyToken] = useState<Token | null>(null)
  const [sellAmount, setSellAmount] = useState("")
  const [buyAmount, setBuyAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [isFetchingQuote, setIsFetchingQuote] = useState(false)
  const [swapError, setSwapError] = useState<string | null>(null)
  const [currentQuote, setCurrentQuote] = useState<any>(null)

  useEffect(() => {
    const initTokens = SOLANA_TOKENS.map((token) => ({
      ...token,
      balance: 0,
      price: token.symbol === "USDC" || token.symbol === "USDT" ? 1.0 : undefined,
    }))
    setTokens(initTokens)
    setSellToken(initTokens[1]) // USDC
    setBuyToken(initTokens[0]) // SOL
  }, [])

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalances()
    }
  }, [connected, publicKey])

  const fetchBalances = async () => {
    if (!publicKey) return

    try {
      console.log("[v0] Fetching balances using Jupiter Ultra API for wallet:", publicKey.toString())

      const holdings = await getHoldings(publicKey.toString())
      console.log("[v0] Holdings received:", holdings)

      // Create a map of mint addresses to balances
      const balanceMap = new Map<string, number>()

      // Add SOL balance (native token)
      balanceMap.set("So11111111111111111111111111111111111111112", holdings.uiAmount)

      // Parse token holdings
      if (holdings.tokens) {
        Object.entries(holdings.tokens).forEach(([mint, accounts]) => {
          // Sum up all accounts for this token mint
          const totalBalance = accounts.reduce((sum, account) => sum + account.uiAmount, 0)
          balanceMap.set(mint, totalBalance)
        })
      }

      // Update tokens with fetched balances
      setTokens((prevTokens) =>
        prevTokens.map((token) => {
          const balance = balanceMap.get(token.mint) || 0
          return { ...token, balance }
        }),
      )

      console.log("[v0] Balances updated successfully")
    } catch (error) {
      console.error("[v0] Error fetching balances from Jupiter Ultra API:", error)
      // Fallback to mock balances on error
      setTokens((prevTokens) =>
        prevTokens.map((token) => ({
          ...token,
          balance: token.symbol === "SOL" ? 1.0 : token.symbol === "USDC" ? 100 : 50,
        })),
      )
    }
  }

  useEffect(() => {
    if (sellAmount && sellToken && buyToken && connected && publicKey) {
      fetchQuote()
    }
  }, [sellAmount, sellToken, buyToken, connected, publicKey])

  const fetchQuote = async () => {
    if (!sellAmount || !sellToken || !buyToken || !publicKey) return

    setIsFetchingQuote(true)
    setSwapError(null)

    try {
      const amountInSmallestUnit = toTokenAmount(Number(sellAmount), sellToken.decimals)

      console.log("[v0] Fetching quote from Jupiter Ultra API:", {
        inputMint: sellToken.mint,
        outputMint: buyToken.mint,
        amount: amountInSmallestUnit,
      })

      const quote = await getJupiterOrder({
        inputMint: sellToken.mint,
        outputMint: buyToken.mint,
        amount: amountInSmallestUnit,
        taker: publicKey.toString(),
        slippageBps: 50, // 0.5% slippage
      })

      console.log("[v0] Quote received from Jupiter Ultra API:", quote)
      setCurrentQuote(quote)

      const outputAmount = fromTokenAmount(quote.outAmount, buyToken.decimals)
      setBuyAmount(outputAmount.toFixed(6))
    } catch (error) {
      console.error("[v0] Error fetching quote from Jupiter Ultra API:", error)
      setSwapError("Failed to fetch quote")
    } finally {
      setIsFetchingQuote(false)
    }
  }

  const handleSwapTokens = () => {
    if (!sellToken || !buyToken) return

    const tempToken = sellToken
    const tempAmount = sellAmount
    setSellToken(buyToken)
    setBuyToken(tempToken)
    setSellAmount(buyAmount)
    setBuyAmount(tempAmount)
  }

  const handleSellAmountChange = (value: string) => {
    setSellAmount(value)
    if (!value) {
      setBuyAmount("")
      setCurrentQuote(null)
    }
  }

  const handleBuyAmountChange = (value: string) => {
    setBuyAmount(value)
  }

  const handleMaxClick = () => {
    if (!sellToken) return
    const maxAmount = sellToken.balance.toString()
    handleSellAmountChange(maxAmount)
  }

  const handlePercentageClick = (percentage: number) => {
    if (!sellToken) return
    const amount = (sellToken.balance * (percentage / 100)).toString()
    handleSellAmountChange(amount)
  }

  const exchangeRate =
    currentQuote && sellAmount && buyAmount
      ? `1 ${sellToken?.symbol} ≈ ${(Number(buyAmount) / Number(sellAmount)).toFixed(4)} ${buyToken?.symbol}`
      : sellToken && buyToken
        ? `1 ${sellToken.symbol} ≈ ... ${buyToken.symbol}`
        : ""

  const getSwapButtonState = () => {
    if (!connected) {
      return { text: "Connect Wallet", disabled: false, variant: "default" as const, action: "connect" }
    }

    if (isSwapping) {
      return { text: "Swapping...", disabled: true, variant: "default" as const, action: "swap" }
    }

    if (isFetchingQuote) {
      return { text: "Fetching Quote...", disabled: true, variant: "default" as const, action: "swap" }
    }

    if (!sellAmount || Number(sellAmount) === 0) {
      return { text: "Enter Amount", disabled: true, variant: "secondary" as const, action: "swap" }
    }

    if (sellToken && Number(sellAmount) > sellToken.balance) {
      return {
        text: `Insufficient ${sellToken.symbol} Balance`,
        disabled: true,
        variant: "destructive" as const,
        action: "swap",
      }
    }

    if (swapError) {
      return { text: swapError, disabled: true, variant: "destructive" as const, action: "swap" }
    }

    if (!currentQuote) {
      return { text: "Getting Quote...", disabled: true, variant: "default" as const, action: "swap" }
    }

    return { text: "Swap", disabled: false, variant: "default" as const, action: "swap" }
  }

  const handleSwap = async () => {
    if (!connected || !publicKey || !signTransaction || !currentQuote) {
      return
    }

    setIsSwapping(true)
    setSwapError(null)

    try {
      console.log("[v0] Starting swap with Jupiter Ultra API, quote:", currentQuote)

      // Deserialize the transaction
      const transaction = VersionedTransaction.deserialize(Buffer.from(currentQuote.transaction, "base64"))

      console.log("[v0] Transaction deserialized, requesting wallet signature...")

      // Sign the transaction using wallet adapter
      const signedTransaction = await signTransaction(transaction)

      console.log("[v0] Transaction signed by wallet, executing via Jupiter Ultra API...")

      // Serialize the signed transaction
      const signedTransactionBase64 = Buffer.from(signedTransaction.serialize()).toString("base64")

      // Execute the swap using Jupiter Ultra API
      const result = await executeJupiterOrder(signedTransactionBase64, currentQuote.requestId)

      console.log("[v0] Jupiter Ultra API execution result:", result)

      if (result.status === "Success" && result.signature) {
        console.log("[v0] Swap successful! Transaction signature:", result.signature)
        console.log(`[v0] View on Solscan: https://solscan.io/tx/${result.signature}`)

        // Reset amounts and refresh balances
        setSellAmount("")
        setBuyAmount("")
        setCurrentQuote(null)

        // Wait a bit for blockchain to update, then refresh balances
        setTimeout(() => {
          fetchBalances()
        }, 2000)
      } else {
        setSwapError(result.error || "Swap failed")
        console.error("[v0] Swap failed:", result)
      }
    } catch (error: any) {
      console.error("[v0] Error during swap execution:", error)
      setSwapError(error.message || "Swap failed")
    } finally {
      setIsSwapping(false)
    }
  }

  const swapButtonState = getSwapButtonState()

  if (!sellToken || !buyToken) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={orderType === "instant" ? "default" : "ghost"}
            onClick={() => setOrderType("instant")}
            className="rounded-full bg-secondary text-foreground hover:bg-secondary/80 data-[state=active]:bg-secondary"
          >
            Instant
          </Button>

        </div>
        <div className="flex items-center gap-2">

          {/* <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-secondary"
            onClick={fetchBalances}
            disabled={!connected}
          >
            <RefreshCw className="h-4 w-4" />
          </Button> */}
        </div>
      </div>

      {/* Swap Cards */}
      <div className="relative">
        <SwapCard
          label="Sell"
          amount={sellAmount}
          onAmountChange={handleSellAmountChange}
          token={sellToken}
          onTokenChange={setSellToken}
          tokens={tokens}
          showMaxButton
          onMaxClick={handleMaxClick}
          onPercentageClick={handlePercentageClick}
        />

        {/* Swap Button */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwapTokens}
            className="h-10 w-10 rounded-full border-2 border-background bg-secondary hover:bg-secondary/80"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <SwapCard
          label="Buy"
          amount={buyAmount}
          onAmountChange={handleBuyAmountChange}
          token={buyToken}
          onTokenChange={setBuyToken}
          tokens={tokens}
        />
      </div>

      {/* Big Swap Action Button */}
      <Button
        onClick={connected ? handleSwap : undefined}
        disabled={swapButtonState.disabled}
        className="w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        {(isSwapping || isFetchingQuote) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {swapButtonState.text}
      </Button>

      {/* Exchange Rate */}
      {exchangeRate && <div className="text-sm text-muted-foreground">{exchangeRate}</div>}
    </div>
  )
}
