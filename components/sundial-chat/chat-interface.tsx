"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useChat, type UIMessage } from "@ai-sdk/react"
import { useWallet } from '@solana/wallet-adapter-react'
import { ImageIcon, Send, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function SundialChatInterface() {
  const isComingSoon = true
  const { connected, publicKey } = useWallet()
  const isConnected = connected && publicKey !== null

  const [input, setInput] = useState('')

  const { messages, sendMessage, regenerate, status, error } = useChat({
    onError: (error: Error) => {
      console.error("[v0] Chat error:", error)
    },
    onFinish: ({ message }: { message: UIMessage }) => {
      console.log("[v0] Chat finished:", message)
    },
    onToolCall: ({ toolCall }) => {
      console.log("Tool called:", toolCall)
    }
  })

  useEffect(() => {
    if (error) {
      console.error("[v0] useChat error:", error)
    }
  }, [error])

  const isLoading = status === 'submitted' || status === 'streaming'

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isComingSoon) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 && (
              <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30">
                  <Sun className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-foreground">Welcome to Sundial Chat <span className="text-primary">COMING SOON!</span></h2>
                <p className="mb-8 max-w-md text-muted-foreground">
                  Your AI assistant powered by Solana micropayments. Generate images for just 0.01 USDC per request.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent border-primary/30 text-foreground hover:bg-primary/10"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Generate an image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-foreground hover:bg-primary/10 bg-transparent"
                  >
                    Explain x402 protocol
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-foreground hover:bg-primary/10 bg-transparent"
                  >
                    How does this work?
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                Error: {error.message}
              </div>
            )}

            {messages.map((message: UIMessage) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Sun className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border border-border",
                  )}
                >
                  <p className="text-sm leading-relaxed">{(message.parts?.[0] as { text: string })?.text || ''}</p>
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <span className="text-sm font-medium">You</span>
                  </div>
                )}
              </div>
            ))}

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

        <div className="border-t border-border bg-card px-4 py-4">
          <form onSubmit={handleFormSubmit} className="mx-auto max-w-3xl">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
              Image generation costs 0.01 USDC per request via x402 protocol on Solana
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
