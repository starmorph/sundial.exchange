"use client"

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool"
import { SundialPaymentModal } from "@/components/sundial-chat/payment-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toolMetadata } from "@/lib/ai/tools"
import { formatToolName } from "@/lib/ai/utils"
import { cn } from "@/lib/utils"
import { useChat, type UIMessage } from "@ai-sdk/react"
import { useWallet } from '@solana/wallet-adapter-react'
import type { ToolUIPart, UITools } from "ai"
import { DefaultChatTransport } from "ai"
import { Send, Sun } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export function SundialChatInterface() {
  const { connected, publicKey } = useWallet()
  const wallet = useWallet()
  const isConnected = connected && publicKey !== null
  const [input, setInput] = useState("")

  // Payment modal state
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean
    toolName: string
    amount: number
    toolCallId?: string
    toolArgs?: any
  }>({
    open: false,
    toolName: "",
    amount: 0,
  })

  // Store pending tool data
  const [pendingToolData, setPendingToolData] = useState<Map<string, any>>(new Map())

  const clearPendingToolData = useCallback((toolCallId: string) => {
    setPendingToolData((prev) => {
      if (!prev.has(toolCallId)) {
        return prev
      }
      const next = new Map(prev)
      next.delete(toolCallId)
      return next
    })
  }, [])

  const metadataRequiresPayment = useCallback((toolType: string) => {
    const toolName = toolType.replace(/^tool-/, "") as keyof typeof toolMetadata
    return Boolean(toolMetadata[toolName]?.requiresPayment)
  }, [])

  const extractToolArgs = useCallback((toolCall: unknown) => {
    if (!toolCall || typeof toolCall !== "object") {
      return {}
    }

    const candidate = (toolCall as Record<string, unknown>).args
      ?? (toolCall as Record<string, unknown>).input
      ?? (toolCall as Record<string, unknown>).parameters

    const fallback = (toolCall as Record<string, unknown>).arguments

    if (candidate && typeof candidate === "string") {
      try {
        return JSON.parse(candidate)
      } catch {
        return {}
      }
    }

    if (!candidate && typeof fallback === "string") {
      try {
        return JSON.parse(fallback)
      } catch {
        return {}
      }
    }

    if (candidate && typeof candidate === "object") {
      return candidate
    }

    return {}
  }, [])

  // USER MEMOS, STATE, USE-EFFECT, SETUP 
  const transport = useMemo(
    () => new DefaultChatTransport({
      api: "/api/chat",
      body: {
        walletAddress: publicKey?.toBase58() || null,
      },
    }),
    [publicKey],
  )

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (error: Error) => {
      console.error("[Chat] Error:", error)
      toast.error("Chat error: " + error.message)
    },
    onFinish: ({ message }) => {
      console.log("[Chat] Finished:", message)
    },
    onToolCall: ({ toolCall }) => {
      console.log("[Chat] Tool called:", toolCall)

      // Check if tool requires payment
      const metadata = toolMetadata[toolCall.toolName as keyof typeof toolMetadata]
      if (metadata?.requiresPayment && metadata.priceUSDC) {
        console.log("[Chat] Payment required for:", toolCall.toolName)

        const toolArgs = extractToolArgs(toolCall)

        clearPendingToolData(toolCall.toolCallId)

        // Show payment modal
        setPaymentModal({
          open: true,
          toolName: toolCall.toolName,
          amount: metadata.priceUSDC,
          toolCallId: toolCall.toolCallId,
          toolArgs,
        })
      }
    }
  })

  useEffect(() => {
    if (error) {
      console.error("[v0] useChat error:", error)
    }
  }, [error])

  const isLoading = status === "submitted" || status === "streaming"

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !isConnected) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleQuickAction = (message: string) => {
    if (!isConnected) return
    sendMessage({ text: message })
  }

  const handlePaymentComplete = useCallback(async (data: any) => {
    console.log("[Chat] Payment completed, got data:", data)
    toast.success(`Payment successful! Data received.`)

    if (paymentModal.toolCallId) {
      setPendingToolData((prev) => new Map(prev).set(paymentModal.toolCallId!, data))
    }

    setPaymentModal(prev => ({ ...prev, open: false, toolCallId: undefined, toolArgs: undefined }))
  }, [paymentModal.toolCallId])

  return (
    <>
      <SundialPaymentModal
        open={paymentModal.open}
        onOpenChange={(open) => setPaymentModal(prev => ({ ...prev, open }))}
        amount={paymentModal.amount}
        toolName={paymentModal.toolName}
        toolCallId={paymentModal.toolCallId}
        toolArgs={paymentModal.toolArgs}
        onPaymentComplete={handlePaymentComplete}
      />

      <div className="flex h-full flex-col overflow-hidden">
        <ScrollArea className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-3xl space-y-6 pt-8 pb-6">
            {messages.length === 0 && (
              <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30">
                  <Sun className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-foreground">Welcome to Sundial Chat</h2>
                <p className="mb-8 max-w-md text-muted-foreground">
                  Ask for analytics, x402 tips, or premium endpoints. Responses are powered by Vercel AI + OpenAI.
                </p>
                {!isConnected && (
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to start paying per-response with x402.
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent border-primary/30 text-foreground hover:bg-primary/10"
                    disabled={!isConnected}
                    onClick={() => handleQuickAction("What are Raydium's current volume and TVL stats?")}
                  >
                    📊 Raydium Stats
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-foreground hover:bg-primary/10 bg-transparent"
                    disabled={!isConnected}
                    onClick={() => handleQuickAction("Explain the x402 protocol and how it works")}
                  >
                    💳 Explain x402
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-foreground hover:bg-primary/10 bg-transparent"
                    disabled={!isConnected}
                    onClick={() => handleQuickAction("How does Sundial Exchange work?")}
                  >
                    ❓ How it works
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                Error: {error.message}
              </div>
            )}

            {messages.map((message: UIMessage) => {
              const toolParts = message.parts.filter((part): part is ToolUIPart<UITools> => part.type.startsWith("tool-"))

              return (
                <div key={message.id} className="space-y-3">
                  <div
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <Sun className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-5 py-4 shadow-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card/90 text-foreground",
                      )}
                    >
                      <p className="text-base leading-6 whitespace-pre-wrap">
                        {message.parts
                          .filter((part): part is { type: "text"; text: string } => part.type === "text")
                          .map((part) => part.text)
                          .join(" ")}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <span className="text-sm font-medium">You</span>
                      </div>
                    )}
                  </div>

                  {toolParts.map((part) => {
                    const toolName = formatToolName(part.type)
                    const isPaidTool = metadataRequiresPayment(part.type)
                    const pendingResult = part.toolCallId ? pendingToolData.get(part.toolCallId) : undefined
                    const displayOutput = pendingResult ?? part.output
                    const isAwaitingPayment = isPaidTool && !pendingResult

                    return (
                      <Tool
                        key={part.toolCallId ?? toolName}
                        defaultOpen={!isAwaitingPayment}
                        data-awaiting-payment={isAwaitingPayment ? "true" : undefined}
                        disabled={isAwaitingPayment}
                      >
                        <ToolHeader
                          title={toolName}
                          state={isAwaitingPayment ? "input-streaming" : part.state}
                          type={part.type}
                        />
                        <ToolContent>
                          <ToolInput input={part.input ?? {}} />
                          {isAwaitingPayment ? (
                            <div className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                              <p className="font-medium text-primary">Awaiting payment confirmation…</p>
                              <p className="text-muted-foreground">
                                Complete the Solana transaction in the payment modal to receive results.
                              </p>
                            </div>
                          ) : (
                            <ToolOutput errorText={part.errorText} output={displayOutput} />
                          )}
                        </ToolContent>
                      </Tool>
                    )
                  })}
                </div>
              )
            })}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Sun className="h-4 w-4 animate-pulse text-primary-foreground" />
                </div>
                <div className="rounded-2xl border border-border bg-card px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-border bg-card px-4 py-4">
          <form onSubmit={handleFormSubmit} className="mx-auto max-w-3xl">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  isConnected ? "Ask me anything or request an image..." : "Connect wallet to start chatting..."
                }
                disabled={!isConnected || isLoading}
                className="flex-1 bg-background border-primary/30 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                disabled={!isConnected || isLoading || !input?.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Responses settle via x402 micropayments. Premium endpoints like `/api/premium-insight` cost extra.
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
