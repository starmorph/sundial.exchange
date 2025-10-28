"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useWallet } from '@solana/wallet-adapter-react'
import { AlertCircle, Loader2, Wallet } from "lucide-react"
import { useState } from "react"

interface SundialPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  toolName: string
  toolCallId?: string
  toolArgs?: any
  onPaymentComplete?: (data: any) => void
}

export function SundialPaymentModal({
  open,
  onOpenChange,
  amount,
  toolName,
  toolCallId,
  toolArgs,
  onPaymentComplete,
}: SundialPaymentModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { publicKey, connected, signTransaction } = useWallet()

  const handleConfirm = async () => {
    if (!publicKey || !signTransaction) return

    setIsProcessing(true)

    try {
      console.log("[Payment] Starting x402 payment flow...")
      console.log("[Payment] Amount:", amount, "USDC")
      console.log("[Payment] Tool args:", toolArgs)

      // Use x402-solana client (same as pool analytics which works)
      const { createX402Client } = await import("x402-solana")

      const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_API_KEY
        ? `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`
        : undefined

      console.log("[Payment] Creating x402 client...")
      const client = createX402Client({
        wallet: {
          address: publicKey.toString(),
          signTransaction,
        },
        network: "solana",
        maxPaymentAmount: BigInt(Math.ceil(amount * 2 * 1_000_000)),
        rpcUrl,
      })

      // Get endpoint
      const endpoint = toolName === "dex-overview-paid"
        ? "/api/dex/overview"
        : "/api/dex/overview"

      // Use localhost in dev, production domain in prod
      const baseUrl = process.env.NODE_ENV === "production"
        ? "https://sundial.exchange"
        : window.location.origin

      console.log("[Payment] Making x402 fetch to:", `${baseUrl}${endpoint}`)

      // Use client.fetch() - it handles 402, creates tx, signs, and retries
      const response = await client.fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(toolArgs ?? {}),
      })

      console.log("[Payment] Got response, status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[Payment] API error:", errorText)
        throw new Error(`API returned ${response.status}: ${errorText.substring(0, 100)}`)
      }

      const data = await response.json()
      console.log("[Payment] Success! Data:", data)

      if (dontShowAgain) {
        localStorage.setItem("hidePaymentModal", "true")
      }

      onOpenChange(false)
      onPaymentComplete?.(data)
    } catch (error) {
      console.error("[Payment] Error:", error)
      alert(`Payment failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const hasInsufficientBalance = false

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Payment Required
          </DialogTitle>
          <DialogDescription>This action requires a micropayment via the x402 protocol</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tool</span>
              <span className="font-mono text-sm font-medium">{toolName}</span>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cost</span>
              <span className="font-mono text-lg font-semibold text-primary">{amount.toFixed(2)} USDC</span>
            </div>
            <div className="flex items-center justify-between border-t border-primary/20 pt-2">
              <span className="text-sm text-muted-foreground">Network</span>
              <span className="font-mono text-sm font-medium text-primary">Solana</span>
            </div>
          </div>

          {hasInsufficientBalance && (
            <div className="flex gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">Insufficient balance. Please add funds to your wallet.</p>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 rounded-lg border border-primary/50 bg-primary/10 p-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm text-primary">Processing transaction on Solana...</p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label
              htmlFor="dont-show"
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't show this again for this session
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="border-primary/30"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || hasInsufficientBalance}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${amount.toFixed(2)} USDC`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
