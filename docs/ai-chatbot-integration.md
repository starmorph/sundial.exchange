# AI Chatbot Integration Guide

## Overview

Integrate an AI chatbot with wallet connection that can autonomously pay to access the Sundial Exchange API via x402 protocol.

## Architecture

```
┌─────────────────┐
│  User Interface │
│   (Chat UI)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   AI Chatbot    │◄────►│ Wallet       │
│   (LLM Agent)   │      │ (Base/Solana)│
└────────┬────────┘      └──────────────┘
         │
         │ x402 Payment ($0.10 USDC)
         ▼
┌─────────────────┐
│ Sundial API     │
│ (Your Backend)  │
└─────────────────┘
```

## Components Needed

### 1. Chat Interface (`/app/chat/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { WalletConnect } from '@/components/chat/WalletConnect'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const wallet = useWallet()

  const handleSend = async () => {
    if (!wallet.connected) {
      toast.error('Connect wallet to use AI agent')
      return
    }

    // Add user message
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])

    // Call AI agent API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input,
        walletAddress: wallet.publicKey?.toString(),
        history: messages
      })
    })

    const data = await response.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
  }

  return (
    <div className="chat-container">
      <WalletConnect />
      <div className="messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>
      <ChatInput value={input} onChange={setInput} onSend={handleSend} />
    </div>
  )
}
```

### 2. AI Agent Backend (`/app/api/chat/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

// Tool: Query Sundial API with x402 payment
async function querySundialAPI(endpoint: string, walletAdapter: any) {
  const client = createX402Client({
    wallet: walletAdapter,
    network: 'solana'
  })

  // Automatically pays $0.10 and returns data
  const response = await client.fetch(`https://sundial.exchange${endpoint}`)
  return response.json()
}

export async function POST(req: NextRequest) {
  const { message, walletAddress, history } = await req.json()

  // AI agent with tools
  const result = await generateText({
    model: openai('gpt-4'),
    messages: [
      {
        role: 'system',
        content: `You are a Solana DEX analytics assistant. You can query real-time 
                  DEX data using the Sundial Exchange API. Each query costs $0.10 USDC 
                  which you'll pay from the user's wallet.`
      },
      ...history,
      { role: 'user', content: message }
    ],
    tools: {
      getStats: {
        description: 'Get real-time Solana network statistics (TPS, SOL price, TVL)',
        parameters: z.object({}),
        execute: async () => {
          return await querySundialAPI('/api/stats', walletAdapter)
        }
      },
      getTrending: {
        description: 'Get trending tokens with 24h price changes',
        parameters: z.object({
          hours: z.number().default(24)
        }),
        execute: async ({ hours }) => {
          return await querySundialAPI(`/api/trending?hours=${hours}`, walletAdapter)
        }
      },
      getDexOverview: {
        description: 'Get overview of all Solana DEX protocols',
        parameters: z.object({}),
        execute: async () => {
          return await querySundialAPI('/api/dex/overview', walletAdapter)
        }
      },
      getProtocol: {
        description: 'Get detailed stats for a specific DEX protocol',
        parameters: z.object({
          slug: z.string().describe('Protocol slug (e.g., raydium, orca)')
        }),
        execute: async ({ slug }) => {
          return await querySundialAPI(`/api/dex/protocol/${slug}`, walletAdapter)
        }
      }
    }
  })

  return NextResponse.json({ response: result.text })
}
```

### 3. Wallet Integration

Since you have the UI and chat working, you just need to add x402 client:

**Option A: Use x402-solana (Quick)**

```typescript
import { createX402Client } from 'x402-solana/client'
import { useWallet } from '@solana/wallet-adapter-react'

function useX402Client() {
  const wallet = useWallet()
  
  const client = useMemo(() => {
    if (!wallet.connected || !wallet.publicKey) return null
    
    return createX402Client({
      wallet: {
        address: wallet.publicKey.toString(),
        signTransaction: wallet.signTransaction
      },
      network: 'solana',
      maxPaymentAmount: BigInt(100_000) // $0.10 max
    })
  }, [wallet.connected, wallet.publicKey])
  
  return client
}
```

**Option B: Custom Implementation (More Control)**

```typescript
async function payAndFetch(endpoint: string, wallet: WalletAdapter) {
  // 1. Make initial request
  const response = await fetch(`https://sundial.exchange${endpoint}`)
  
  // 2. If 402, create payment
  if (response.status === 402) {
    const challenge = await response.json()
    
    // Create Solana transaction for USDC payment
    const payment = await createSolanaPayment(challenge, wallet)
    
    // 3. Retry with payment
    return fetch(`https://sundial.exchange${endpoint}`, {
      headers: { 'X-PAYMENT': payment }
    })
  }
  
  return response
}
```

## File Structure

```
app/
├── chat/
│   ├── page.tsx                 # Main chat interface
│   └── layout.tsx               # Chat-specific layout
├── api/
│   └── chat/
│       └── route.ts             # AI agent backend
components/
├── chat/
│   ├── ChatMessage.tsx          # Message bubble component
│   ├── ChatInput.tsx            # Input with send button
│   ├── WalletConnect.tsx        # Wallet connection UI
│   ├── PaymentNotice.tsx        # "$0.10 will be charged" notice
│   └── TypingIndicator.tsx      # "AI is thinking..." animation
lib/
├── x402-client.ts               # x402 payment client wrapper
└── ai/
    ├── tools.ts                 # AI tool definitions
    └── prompts.ts               # System prompts
```

## Example Conversations

### Conversation 1: Market Overview

**User:** "What's happening in Solana DEX markets today?"

**AI:** *[Calls getStats() - pays $0.10]*

"Here's the current Solana market snapshot:
- Network TPS: 2,847 transactions/second
- SOL Price: $142.30 (+3.2% in 24h)
- Total DEX TVL: $1.2B (+5.1% in 24h)
- 24h DEX Volume: $847M

The market is showing strong momentum with increased activity across all major DEXs."

### Conversation 2: Token Discovery

**User:** "Show me the top 3 trending tokens right now"

**AI:** *[Calls getTrending() - pays $0.10]*

"Here are the top 3 trending tokens:

1. **BONK** - $0.000018 (+47.3% in 24h)
2. **WIF** - $1.83 (+23.8% in 24h)  
3. **JTO** - $2.91 (+18.2% in 24h)

BONK is leading with massive gains. Would you like more details on any of these?"

### Conversation 3: Protocol Comparison

**User:** "Compare Raydium and Orca volumes"

**AI:** *[Calls getProtocol('raydium') - pays $0.10]*
*[Calls getProtocol('orca') - pays $0.10]*

"Here's the comparison:

**Raydium:**
- 24h Volume: $312M
- 7d Volume: $2.1B
- Market Share: 37%

**Orca:**
- 24h Volume: $156M
- 7d Volume: $1.3B  
- Market Share: 18%

Raydium has 2x the volume and double the market share. It's the dominant Solana DEX."

### Conversation 4: Multi-Step Analysis

**User:** "I want to analyze all major Solana DEXs"

**AI:** *[Calls getDexOverview() - pays $0.10]*

"I've analyzed all 12 major Solana DEXs. Here are the key insights:

**Top 3 by Volume:**
1. Raydium: $312M (37%)
2. Orca: $156M (18%)
3. Meteora: $98M (12%)

**Fastest Growing:**
- Phoenix: +156% week-over-week
- Meteora: +89% week-over-week

**Most Stable:**
- Orca: Only 2% volatility
- Raydium: 5% volatility

Would you like detailed stats on any specific protocol?"

## Payment UX Best Practices

### 1. Show Payment Confirmation

```typescript
<PaymentNotice>
  💰 This query will cost $0.10 USDC from your wallet
  <Button onClick={handleApprove}>Approve Payment</Button>
  <Button onClick={handleCancel}>Cancel</Button>
</PaymentNotice>
```

### 2. Loading States

```typescript
{isPayingAndFetching && (
  <div className="flex items-center gap-2">
    <Spinner />
    <span>Processing payment and fetching data...</span>
  </div>
)}
```

### 3. Payment Success Feedback

```typescript
<Toast>
  ✅ Paid $0.10 USDC • Tx: {txHash.slice(0, 8)}...
</Toast>
```

### 4. Error Handling

```typescript
try {
  const data = await client.fetch('/api/stats')
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    toast.error('Not enough USDC in wallet')
  } else if (error.code === 'USER_REJECTED') {
    toast.error('Payment cancelled')
  } else {
    toast.error('Payment failed - please try again')
  }
}
```

## Integration Steps

### Step 1: Set Up Chat Route

```bash
# Create chat page
mkdir -p app/chat
touch app/chat/page.tsx

# Create API route
mkdir -p app/api/chat
touch app/api/chat/route.ts
```

### Step 2: Install Dependencies

```bash
# AI SDK
pnpm add ai @ai-sdk/openai

# x402 client (optional)
pnpm add x402-solana

# Wallet adapter (if not installed)
pnpm add @solana/wallet-adapter-react @solana/wallet-adapter-wallets
```

### Step 3: Port Your UI

Since you already have the UI and chat working:

1. Copy your existing chat UI components
2. Add x402 client initialization
3. Wrap API calls with payment handler
4. Add payment confirmation modals
5. Test with real wallet

### Step 4: Configure AI Model

```typescript
// Use your preferred LLM
import { openai } from '@ai-sdk/openai'        // OpenAI
import { anthropic } from '@ai-sdk/anthropic'  // Claude
import { google } from '@ai-sdk/google'        // Gemini

const model = openai('gpt-4')  // or anthropic('claude-3-5-sonnet-20241022')
```

### Step 5: Test Flow

1. Connect wallet (Solana)
2. Ask: "What's the SOL price?"
3. AI calls `/api/stats` (pays $0.10)
4. Returns data
5. User sees response + payment confirmation

## Advanced Features

### 1. Payment Batching

```typescript
// Pay $1.00 for 10 queries
const client = createX402Client({
  wallet,
  network: 'solana',
  paymentStrategy: 'batch',
  batchSize: 10
})
```

### 2. Query History

```typescript
// Show what user paid for
<QueryHistory>
  {queries.map(q => (
    <div>
      {q.question} → {q.endpoint} → $0.10 USDC
    </div>
  ))}
</QueryHistory>
```

### 3. Spending Limit

```typescript
const [spentToday, setSpentToday] = useState(0)

if (spentToday >= 10) {
  return <div>Daily limit reached ($1.00)</div>
}
```

### 4. Voice Input

```typescript
import { useSpeechRecognition } from 'react-speech-recognition'

const { transcript, listening } = useSpeechRecognition()

<Button onClick={startListening}>
  {listening ? '🎤 Listening...' : '🎙️ Ask with voice'}
</Button>
```

## Benefits of This Approach

1. **Autonomous Payments** 💰
   - AI agent pays automatically
   - No manual approval needed
   - Seamless UX

2. **Natural Interface** 💬
   - Ask questions in plain English
   - AI translates to API calls
   - User doesn't see technical details

3. **Cost Transparency** 📊
   - Shows cost before query
   - Track spending in UI
   - Export payment history

4. **First Mover** 🚀
   - First Solana DEX API with AI chat
   - Unique value proposition
   - Great for marketing

## Marketing Angle

**"Chat with Solana DEX Data"**

Instead of:
```bash
curl https://sundial.exchange/api/stats
```

Users get:
```
You: "What's the SOL price?"
AI: "$142.30, up 3.2% today! 📈"
```

Much more accessible for non-technical users!

## Next Steps

1. ✅ OpenAPI spec updated (done!)
2. ✅ x402 payment gateway ready (done!)
3. 📋 Port your existing chat UI into this repo
4. 🔌 Add x402 client wrapper
5. 🤖 Connect AI agent to API
6. 🎨 Polish UX (payment confirmations, loading states)
7. 🚀 Launch!

Once live, you'll have the **first AI chatbot that autonomously pays for Solana DEX data** - that's a powerful demo and marketing tool! 🎯

