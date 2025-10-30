"use client"

import { Message, MessageContent, MessageAvatar } from "@/components/ai-elements/message"
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool"
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block"
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion"
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputButton,
  PromptInputTools,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputProvider
} from "@/components/ai-elements/prompt-input"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning"
import { Loader } from "@/components/ai-elements/loader"
import { Response } from "@/components/ai-elements/response"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Sun, TrendingUp, Wallet, Coins, ArrowRightLeft } from "lucide-react"

export default function AIElementsGalleryPage() {
  const [promptText, setPromptText] = useState("")

  const handlePromptSubmit = (message: any, event: any) => {
    console.log("Submitted:", message)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">AI Elements Gallery</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A comprehensive showcase of all shadcn AI elements available in Sundial Exchange,
          demonstrated with realistic DEX and trading scenarios.
        </p>
      </div>

      {/* Table of Contents */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Gallery Sections</CardTitle>
          <CardDescription>Jump to any component category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#messaging" className="text-sm hover:text-primary transition-colors">1. Messaging Components</a>
            <a href="#tools" className="text-sm hover:text-primary transition-colors">2. Tool Execution</a>
            <a href="#code" className="text-sm hover:text-primary transition-colors">3. Code Display</a>
            <a href="#input" className="text-sm hover:text-primary transition-colors">4. Input Components</a>
            <a href="#suggestions" className="text-sm hover:text-primary transition-colors">5. Suggestions</a>
            <a href="#reasoning" className="text-sm hover:text-primary transition-colors">6. Reasoning & Thinking</a>
            <a href="#loaders" className="text-sm hover:text-primary transition-colors">7. Loaders & Shimmers</a>
            <a href="#response" className="text-sm hover:text-primary transition-colors">8. Response Formatting</a>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-16">
        {/* Section 1: Messaging Components */}
        <section id="messaging">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Badge variant="outline">Message, MessageContent, MessageAvatar</Badge>
          </h2>
          <p className="text-muted-foreground mb-6">
            Display chat messages between users and AI assistants with avatars and styled content.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Trading Conversation Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Message */}
              <Message from="user">
                <MessageAvatar
                  src="/api/placeholder/32/32"
                  name="User"
                />
                <MessageContent variant="contained">
                  What's the best time to swap SOL to USDC based on current market conditions?
                </MessageContent>
              </Message>

              {/* Assistant Message */}
              <Message from="assistant">
                <MessageAvatar
                  src="/api/placeholder/32/32"
                  name="Sundial AI"
                />
                <MessageContent variant="flat">
                  Based on current market analysis, SOL is trading at $98.45 with moderate volatility.
                  The 24-hour volume suggests good liquidity. Consider setting a limit order if you're
                  not in a rush, or execute immediately if you need guaranteed execution.
                </MessageContent>
              </Message>

              {/* Another User Message */}
              <Message from="user">
                <MessageAvatar
                  src="/api/placeholder/32/32"
                  name="User"
                />
                <MessageContent variant="contained">
                  Execute a swap of 5 SOL to USDC with 0.5% slippage
                </MessageContent>
              </Message>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Section 2: Tool Execution */}
        <section id="tools">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Badge variant="outline">Tool, ToolHeader, ToolContent, ToolInput, ToolOutput</Badge>
          </h2>
          <p className="text-muted-foreground mb-6">
            Display tool execution status, inputs, and outputs for AI agent actions.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>DEX Tools in Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Completed Swap Tool */}
              <Tool defaultOpen>
                <ToolHeader
                  title="Execute Swap"
                  type="tool-swap"
                  state="output-available"
                />
                <ToolContent>
                  <ToolInput input={{
                    fromToken: "SOL",
                    toToken: "USDC",
                    amount: 5,
                    slippage: 0.5,
                    wallet: "7xKJ...9mP3"
                  }} />
                  <ToolOutput
                    output={{
                      success: true,
                      txSignature: "5J7K8mN2pQ4rS6tU8vW0xY1zA3bC5dE7fG9hI",
                      inputAmount: "5 SOL",
                      outputAmount: "492.25 USDC",
                      priceImpact: "0.12%",
                      fee: "0.0025 SOL"
                    }}
                    errorText={undefined}
                  />
                </ToolContent>
              </Tool>

              {/* Running Price Check Tool */}
              <Tool defaultOpen>
                <ToolHeader
                  title="Get Token Price"
                  type="tool-price"
                  state="input-available"
                />
                <ToolContent>
                  <ToolInput input={{
                    token: "JUP",
                    currency: "USD"
                  }} />
                  <div className="p-4">
                    <Loader className="mx-auto" />
                    <p className="text-center text-muted-foreground text-sm mt-2">
                      Fetching latest price data...
                    </p>
                  </div>
                </ToolContent>
              </Tool>

              {/* Error State Tool */}
              <Tool defaultOpen>
                <ToolHeader
                  title="Check Portfolio Balance"
                  type="tool-balance"
                  state="output-error"
                />
                <ToolContent>
                  <ToolInput input={{
                    wallet: "InvalidAddress123"
                  }} />
                  <ToolOutput
                    output={null}
                    errorText="Invalid wallet address format. Please provide a valid Solana address."
                  />
                </ToolContent>
              </Tool>

              {/* Pending Tool */}
              <Tool disabled>
                <ToolHeader
                  title="Analyze Trading History"
                  type="tool-history"
                  state="input-streaming"
                />
                <ToolContent>
                  <div className="p-4 text-center text-muted-foreground">
                    Waiting for input parameters...
                  </div>
                </ToolContent>
              </Tool>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Section 3: Code Display */}
        <section id="code">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Badge variant="outline">CodeBlock, CodeBlockCopyButton</Badge>
          </h2>
          <p className="text-muted-foreground mb-6">
            Syntax-highlighted code blocks with copy functionality for sharing transaction data and code snippets.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Data Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* JSON Transaction */}
              <div>
                <h3 className="text-sm font-medium mb-2">Swap Transaction JSON</h3>
                <CodeBlock
                  code={JSON.stringify({
                    signature: "5J7K8mN2pQ4rS6tU8vW0xY1zA3bC5dE7fG9hI0jK2lM4nO6pQ8rS",
                    blockTime: 1704067200,
                    slot: 245678901,
                    transaction: {
                      message: {
                        accountKeys: ["7xKJ...9mP3", "EPjF...H9VX"],
                        instructions: [{
                          programId: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
                          data: "SwapExactTokensForTokens"
                        }]
                      }
                    }
                  }, null, 2)}
                  language="json"
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              </div>

              {/* TypeScript Code */}
              <div>
                <h3 className="text-sm font-medium mb-2">Jupiter Swap Integration</h3>
                <CodeBlock
                  code={`import { Connection, PublicKey } from '@solana/web3.js';

async function executeSwap(
  fromToken: string,
  toToken: string,
  amount: number
) {
  const quote = await getJupiterOrder({
    inputMint: fromToken,
    outputMint: toToken,
    amount: amount * 1e9, // Convert to lamports
    slippageBps: 50
  });

  return await executeJupiterOrder(quote);
}`}
                  language="typescript"
                  showLineNumbers
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              </div>

              {/* Shell Command */}
              <div>
                <h3 className="text-sm font-medium mb-2">CLI Transaction Query</h3>
                <CodeBlock
                  code={`solana confirm -v 5J7K8mN2pQ4rS6tU8vW0xY1zA3bC5dE7fG9hI0jK2lM4nO6pQ8rS`}
                  language="bash"
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Section 4: Input Components */}
        <section id="input">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Badge variant="outline">PromptInput & Related Components</Badge>
          </h2>
          <p className="text-muted-foreground mb-6">
            Advanced input components with attachment support, submit buttons, and action menus.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Chat Input for DEX Assistant</CardTitle>
              <CardDescription>
                Try the interactive prompt input with all features enabled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptInputProvider initialInput="">
                <PromptInput
                  onSubmit={handlePromptSubmit}
                  accept="image/*"
                  multiple
                >
                  <PromptInputBody>
                    <PromptInputAttachments>
                      {(attachment) => (
                        <PromptInputAttachment key={attachment.id} data={attachment} />
                      )}
                    </PromptInputAttachments>
                    <PromptInputTextarea
                      placeholder="Ask about trading, portfolio analysis, or market insights..."
                    />
                    <PromptInputFooter>
                      <PromptInputTools>
                        <PromptInputButton>
                          <Wallet className="size-4" />
                        </PromptInputButton>
                        <PromptInputButton>
                          <TrendingUp className="size-4" />
                        </PromptInputButton>
                      </PromptInputTools>
                      <PromptInputSubmit />
                    </PromptInputFooter>
                  </PromptInputBody>
                </PromptInput>
              </PromptInputProvider>

              <div className="mt-4 text-sm text-muted-foreground">
                <p className="font-medium mb-2">Example prompts to try:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>What's the current price of SOL?</li>
                  <li>Analyze my portfolio performance</li>
                  <li>Show me the best liquidity pools for USDC</li>
                  <li>Execute a swap of 10 SOL to USDC</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Section 5: Suggestions */}
        <section id="suggestions">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Badge variant="outline">Suggestions, Suggestion</Badge>
          </h2>
          <p className="text-muted-foreground mb-6">
            Quick action suggestions to guide users through common DEX operations.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Trading Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
                  <Suggestions>
                    <Suggestion
                      suggestion="Check SOL price"
                      onClick={(s) => console.log(s)}
                    >
                      <Coins className="size-4 mr-2" />
                      Check SOL price
                    </Suggestion>
                    <Suggestion
                      suggestion="Swap SOL to USDC"
                      onClick={(s) => console.log(s)}
                    >
                      <ArrowRightLeft className="size-4 mr-2" />
                      Swap SOL to USDC
                    </Suggestion>
                    <Suggestion
                      suggestion="View portfolio"
                      onClick={(s) => console.log(s)}
                    >
                      <Wallet className="size-4 mr-2" />
                      View portfolio
                    </Suggestion>
                    <Suggestion
                      suggestion="Market analysis"
                      onClick={(s) => console.log(s)}
                    >
                      <TrendingUp className="size-4 mr-2" />
                      Market analysis
                    </Suggestion>
                  </Suggestions>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Popular Token Pairs</h3>
                  <Suggestions>
                    <Suggestion suggestion="SOL/USDC" onClick={(s) => console.log(s)} />
                    <Suggestion suggestion="JUP/SOL" onClick={(s) => console.log(s)} />
                    <Suggestion suggestion="RAY/USDC" onClick={(s) => console.log(s)} />
                    <Suggestion suggestion="ORCA/SOL" onClick={(s) => console.log(s)} />
                    <Suggestion suggestion="BONK/USDC" onClick={(s) => console.log(s)} />
                  </Suggestions>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Common Questions</h3>
                  <Suggestions>
                    <Suggestion
                      suggestion="What's the current gas fee?"
                      onClick={(s) => console.log(s)}
                      variant="secondary"
                    />
                    <Suggestion
                      suggestion="How do I reduce slippage?"
                      onClick={(s) => console.log(s)}
                      variant="secondary"
                    />
                    <Suggestion
                      suggestion="Explain liquidity pools"
                      onClick={(s) => console.log(s)}
                      variant="secondary"
                    />
                  </Suggestions>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Section 6: Reasoning & Thinking */}
        <section id="reasoning">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Badge variant="outline">Reasoning, ReasoningTrigger, ReasoningContent</Badge>
          </h2>
          <p className="text-muted-foreground mb-6">
            Show AI reasoning process for complex trading decisions and market analysis.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Trade Analysis Reasoning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Completed Reasoning */}
              <Reasoning defaultOpen={false} isStreaming={false} duration={3}>
                <ReasoningTrigger />
                <ReasoningContent>
                  {`I analyzed the current market conditions for SOL/USDC:

1. Price Action: SOL is currently at $98.45, up 2.3% in the last 24h
2. Volume Analysis: 24h volume of $1.2B indicates strong liquidity
3. Technical Indicators: RSI at 58 suggests neutral momentum
4. Liquidity Depth: Order book shows good depth on both sides
5. Slippage Estimation: For a 5 SOL swap, expected slippage is 0.08%

Conclusion: Current conditions are favorable for executing the swap with minimal price impact.`}
                </ReasoningContent>
              </Reasoning>

              {/* Active Reasoning (Streaming) */}
              <Reasoning defaultOpen={true} isStreaming={true}>
                <ReasoningTrigger />
                <ReasoningContent>
                  {`Analyzing portfolio allocation...

Current holdings:
- SOL: 45% ($4,500)
- USDC: 30% ($3,000)
- JUP: 15% ($1,500)
- Other: 10% ($1,000)

Calculating risk metrics...`}
                </ReasoningContent>
              </Reasoning>

              {/* Another Completed Example */}
              <Reasoning defaultOpen={false} isStreaming={false} duration={5}>
                <ReasoningTrigger />
                <ReasoningContent>
                  {`Evaluated optimal swap routing for 100 SOL to USDC:

Route Options Analyzed:
1. Direct Route (SOL → USDC):
   - Price: $98.42/SOL
   - Fee: 0.3%
   - Total: $9,812.58

2. Split Route (SOL → RAY → USDC):
   - Price: $98.38/SOL
   - Fee: 0.6%
   - Total: $9,779.12

3. Jupiter Aggregated Route:
   - Price: $98.51/SOL
   - Fee: 0.25%
   - Total: $9,826.39

Recommendation: Use Jupiter aggregated route for best price execution.`}
                </ReasoningContent>
              </Reasoning>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Section 7: Loaders & Shimmers */}
        <section id="loaders">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Badge variant="outline">Loader, Shimmer</Badge>
          </h2>
          <p className="text-muted-foreground mb-6">
            Loading states and shimmer effects for real-time data fetching.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Loading States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Loader Component */}
                <div>
                  <h3 className="text-sm font-medium mb-4">Loader Spinner</h3>
                  <div className="flex items-center justify-center gap-8 p-8 border rounded-lg">
                    <div className="text-center">
                      <Loader size={16} />
                      <p className="text-xs text-muted-foreground mt-2">Small (16px)</p>
                    </div>
                    <div className="text-center">
                      <Loader size={24} />
                      <p className="text-xs text-muted-foreground mt-2">Medium (24px)</p>
                    </div>
                    <div className="text-center">
                      <Loader size={32} />
                      <p className="text-xs text-muted-foreground mt-2">Large (32px)</p>
                    </div>
                  </div>
                </div>

                {/* Shimmer Text Effects */}
                <div>
                  <h3 className="text-sm font-medium mb-4">Shimmer Text (Loading States)</h3>
                  <div className="space-y-3 p-6 border rounded-lg bg-card">
                    <div>
                      <Shimmer as="h2" className="text-2xl font-bold" duration={2}>
                        Fetching latest SOL price...
                      </Shimmer>
                    </div>
                    <div>
                      <Shimmer as="p" className="text-lg" duration={1.5}>
                        Loading portfolio data...
                      </Shimmer>
                    </div>
                    <div>
                      <Shimmer as="span" className="text-base" duration={2.5}>
                        Analyzing market trends...
                      </Shimmer>
                    </div>
                    <div>
                      <Shimmer as="p" className="text-sm" duration={1.8}>
                        Calculating optimal route...
                      </Shimmer>
                    </div>
                  </div>
                </div>

                {/* Real-world Loading Scenarios */}
                <div>
                  <h3 className="text-sm font-medium mb-4">Real-world Loading Scenarios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Price Update</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Loader size={16} />
                          <Shimmer className="text-sm">
                            Updating real-time prices...
                          </Shimmer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Transaction Confirmation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Loader size={16} />
                          <Shimmer className="text-sm">
                            Waiting for blockchain confirmation...
                          </Shimmer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Section 8: Response Formatting */}
        <section id="response">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Badge variant="outline">Response</Badge>
          </h2>
          <p className="text-muted-foreground mb-6">
            Format AI responses with proper markdown rendering and structure.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Formatted Trading Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Response>
                  {`# Market Analysis Report

## Current Market Overview

The Solana DeFi ecosystem is showing strong momentum with **$1.2B** in 24-hour trading volume across major DEXs.

### Top Performing Tokens
- **SOL**: +2.3% ($98.45)
- **JUP**: +5.7% ($1.23)
- **RAY**: +1.8% ($2.15)

### Key Metrics
- Total Value Locked (TVL): $847M
- Active Wallets (24h): 234,567
- Average Transaction Fee: 0.00025 SOL

> **Trading Tip**: Consider the current low volatility period for executing larger swaps with minimal slippage.

### Recommended Actions
1. Monitor SOL/USDC for breakout above $100
2. Check JUP liquidity pools for yield opportunities
3. Review portfolio rebalancing if SOL holdings exceed 50%`}
                </Response>

                <Separator />

                <Response>
                  {`## Your Portfolio Summary

**Total Value**: $10,000 USD

| Token | Amount | Value | Allocation |
|-------|--------|-------|------------|
| SOL   | 45.5   | $4,500 | 45%       |
| USDC  | 3,000  | $3,000 | 30%       |
| JUP   | 1,220  | $1,500 | 15%       |
| RAY   | 465    | $1,000 | 10%       |

**24h Change**: +$234 (+2.34%)

\`\`\`
Risk Score: 6.5/10 (Moderate)
Diversification: 7/10 (Good)
Liquidity: 9/10 (Excellent)
\`\`\`

*Last updated: ${new Date().toLocaleString()}*`}
                </Response>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Note */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              All components shown above are fully functional and can be integrated into the Sundial /chat page
              or any other agentic interface. They are built with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>shadcn/ui</strong> - Base component library with Radix UI primitives</li>
              <li><strong>ai-elements</strong> - Specialized AI/chat components from the ai-elements package</li>
              <li><strong>Tailwind CSS</strong> - Utility-first styling with theme support</li>
              <li><strong>TypeScript</strong> - Type-safe component props and usage</li>
            </ul>
            <Separator />
            <div className="text-sm">
              <p className="font-medium mb-2">Components Location:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                /components/ai-elements/*
              </code>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-2">Total Components Available:</p>
              <Badge variant="secondary">30 AI Elements</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
