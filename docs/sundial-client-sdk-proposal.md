# Sundial Client SDK Proposal

## Overview

Build a TypeScript SDK that makes it easy for developers to consume the Sundial Exchange API with automatic x402 payment handling on both Base and Solana networks.

## Package Name

`@sundial/api-client` or `sundial-exchange-sdk`

## Target Users

1. **DApp Developers** - Building DEX analytics dashboards
2. **AI Agents** - Autonomous trading bots needing DEX data
3. **Data Scientists** - Analyzing Solana DEX trends
4. **Mobile Apps** - iOS/Android apps needing DEX stats

## Core Features

### 1. Automatic x402 Payment Handling

```typescript
import { SundialClient } from '@sundial/api-client'

// Initialize with wallet (Base or Solana)
const client = new SundialClient({
  wallet: userWallet,  // Any EVM or Solana wallet
  network: 'base',     // or 'solana'
  apiKey: 'optional-for-rate-limits' // Future feature
})

// Methods automatically pay $0.10 USDC
const stats = await client.getStats()
const trending = await client.getTrending({ hours: 24 })
const overview = await client.getDexOverview()
const protocol = await client.getProtocol('raydium')
```

### 2. Type-Safe API

```typescript
interface SundialSDK {
  // Stats
  getStats(): Promise<StatsResponse>
  
  // Trending tokens
  getTrending(params: { hours: number }): Promise<NormalizedTrendingToken[]>
  
  // DEX data
  getDexOverview(): Promise<{
    protocols: DexProtocolSummary[]
    volumes: DexVolumeData[]
  }>
  
  getProtocol(slug: string): Promise<{
    summary: DexProtocolSummary
    volumes: DexVolumeData[]
  }>
  
  // Logging
  logSwap(event: SwapEventPayload): Promise<void>
}
```

### 3. Multi-Network Support

```typescript
// Base network (lower fees, EVM wallets)
const baseClient = new SundialClient({
  wallet: metamaskWallet,
  network: 'base'
})

// Solana network (native for Solana users)
const solanaClient = new SundialClient({
  wallet: phantomWallet,
  network: 'solana'
})

// Auto-detect best network
const smartClient = new SundialClient({
  wallet: walletAdapter,
  network: 'auto' // Chooses based on wallet type
})
```

### 4. Payment Caching (Optional)

```typescript
const client = new SundialClient({
  wallet: userWallet,
  network: 'base',
  paymentStrategy: 'batch', // Pay once for multiple requests
  batchSize: 10 // $1.00 for 10 requests instead of $0.10 each
})

// Only pays once
await client.getStats()
await client.getTrending({ hours: 24 })
await client.getDexOverview()
// ... (7 more free requests)
```

### 5. React Hooks (Optional)

```typescript
import { useSundialClient } from '@sundial/api-client/react'

function MyComponent() {
  const client = useSundialClient({
    wallet: useWallet(),
    network: 'base'
  })
  
  const { data, loading, error, refetch } = useStats()
  const { data: trending } = useTrending({ hours: 24 })
  
  return (
    <div>
      <p>TPS: {data?.tps}</p>
      <p>SOL Price: ${data?.solPriceUsd}</p>
    </div>
  )
}
```

## Architecture

```
packages/sundial-client/
├── src/
│   ├── client/
│   │   ├── SundialClient.ts        # Main client class
│   │   ├── payment-handler.ts      # x402 payment logic
│   │   └── network-adapter.ts      # Base/Solana abstraction
│   ├── types/
│   │   ├── api-types.ts            # Generated from OpenAPI
│   │   └── client-types.ts         # Client-specific types
│   ├── utils/
│   │   ├── wallet-adapter.ts       # Universal wallet interface
│   │   └── cache.ts                # Payment caching
│   ├── react/                      # Optional React hooks
│   │   ├── provider.tsx
│   │   ├── useStats.ts
│   │   ├── useTrending.ts
│   │   └── useDexData.ts
│   └── index.ts
├── tests/
├── examples/
│   ├── vanilla-js/
│   ├── react/
│   ├── next-js/
│   └── ai-agent/
└── README.md
```

## Implementation Options

### Option A: Use x402-solana as Base (Quick)

**Pros:**
- ✅ Fast to build (wrap existing x402-solana)
- ✅ PayAI maintains payment logic
- ✅ Focus on API-specific features

**Cons:**
- ❌ Limited to Solana initially
- ❌ Dependency on x402-solana updates
- ❌ Larger bundle size

```typescript
// Wrap x402-solana with Sundial-specific methods
import { createX402Client } from 'x402-solana/client'

export class SundialClient {
  private x402Client
  
  constructor(config) {
    this.x402Client = createX402Client({
      wallet: config.wallet,
      network: config.network
    })
  }
  
  async getStats() {
    return this.x402Client.fetch('https://sundial.exchange/api/stats')
  }
  
  async getTrending(params) {
    return this.x402Client.fetch(
      `https://sundial.exchange/api/trending?hours=${params.hours}`
    )
  }
}
```

### Option B: Build Custom (Full Control)

**Pros:**
- ✅ Full control over UX
- ✅ Support Base + Solana
- ✅ Smaller bundle size
- ✅ Optimized for your API

**Cons:**
- ❌ More work upfront
- ❌ Maintain payment logic yourself
- ❌ Need to test thoroughly

```typescript
// Custom implementation with universal wallet adapter
export class SundialClient {
  private wallet: UniversalWalletAdapter
  private network: 'base' | 'solana'
  
  async makeRequest(endpoint: string, options?: RequestOptions) {
    const response = await fetch(`https://sundial.exchange${endpoint}`)
    
    // Handle 402 Payment Required
    if (response.status === 402) {
      const challenge = await response.json()
      const payment = await this.createPayment(challenge)
      
      // Retry with payment
      return fetch(`https://sundial.exchange${endpoint}`, {
        headers: { 'X-PAYMENT': payment }
      })
    }
    
    return response
  }
  
  private async createPayment(challenge: X402Challenge) {
    // Network-specific payment creation
    if (this.network === 'base') {
      return this.createBasePayment(challenge)
    } else {
      return this.createSolanaPayment(challenge)
    }
  }
}
```

### Option C: Hybrid Approach (Recommended)

Start with Option A for Solana users, add Base support later:

**Phase 1: MVP (Week 1-2)**
- Use x402-solana for Solana payments
- Add Sundial-specific API methods
- Type-safe responses
- Basic documentation

**Phase 2: Base Support (Week 3-4)**
- Add Base network payment handling
- Universal wallet adapter
- Network auto-detection

**Phase 3: Advanced Features (Week 5-6)**
- React hooks
- Payment batching
- Caching layer
- AI agent helpers

## Example Usage

### For DApp Developers

```typescript
import { SundialClient } from '@sundial/api-client'
import { useWallet } from '@solana/wallet-adapter-react'

function TradingDashboard() {
  const wallet = useWallet()
  const client = new SundialClient({ wallet, network: 'solana' })
  
  useEffect(() => {
    async function loadData() {
      const [stats, trending, overview] = await Promise.all([
        client.getStats(),
        client.getTrending({ hours: 24 }),
        client.getDexOverview()
      ])
      
      setDashboardData({ stats, trending, overview })
    }
    loadData()
  }, [])
}
```

### For AI Agents

```typescript
import { SundialClient } from '@sundial/api-client'
import { SolanaAgentKit } from '@solana/kit'

const agent = new SolanaAgentKit({
  wallet: process.env.AGENT_PRIVATE_KEY,
  rpc: process.env.RPC_URL
})

const sundial = new SundialClient({
  wallet: agent.wallet,
  network: 'solana'
})

// Agent autonomously pays for data
const trending = await sundial.getTrending({ hours: 1 })
const topToken = trending[0]

if (topToken.change24h > 10) {
  await agent.trade({
    mint: topToken.mint,
    amount: '100',
    slippage: 0.5
  })
}
```

### For Data Scientists

```typescript
import { SundialClient } from '@sundial/api-client'

const client = new SundialClient({
  wallet: loadWallet(),
  network: 'base',
  paymentStrategy: 'batch',
  batchSize: 100 // $10 for 100 requests
})

// Fetch historical data
const protocols = ['raydium', 'orca', 'meteora']
const data = await Promise.all(
  protocols.map(p => client.getProtocol(p))
)

// Analyze volumes, fees, trends
const analysis = analyzeProtocolPerformance(data)
```

## Monetization Benefits

### 1. **Lower Barrier to Entry**
- Easy SDK = More API users
- More users = More $0.10 payments
- Better DX = Stickier customers

### 2. **Premium Features**
```typescript
// Free tier: Pay-per-request
const client = new SundialClient({ wallet })
await client.getStats() // $0.10

// Paid tier: Subscription
const client = new SundialClient({ 
  apiKey: 'sk_live_xxx',
  tier: 'pro' // $50/month unlimited
})
await client.getStats() // Free (included in sub)
```

### 3. **Enterprise Offerings**
- White-label SDK for institutions
- Custom rate limits
- Priority support
- SLA guarantees

## Distribution

### NPM Package

```bash
npm install @sundial/api-client
# or
pnpm add @sundial/api-client
# or
yarn add @sundial/api-client
```

### CDN (For Browser)

```html
<script src="https://unpkg.com/@sundial/api-client"></script>
<script>
  const client = new Sundial.Client({ wallet, network: 'base' })
  const stats = await client.getStats()
</script>
```

### Documentation Site

```
https://docs.sundial.exchange/sdk

├── Getting Started
├── Installation
├── Authentication (Wallets)
├── API Reference
│   ├── getStats()
│   ├── getTrending()
│   ├── getDexOverview()
│   └── getProtocol()
├── Examples
│   ├── React Dashboard
│   ├── AI Trading Agent
│   ├── Data Analytics
│   └── Mobile App
├── Payment & Pricing
└── Troubleshooting
```

## Success Metrics

Track SDK adoption:
- NPM downloads/week
- Active API consumers
- Payment success rate
- Network preference (Base vs Solana)
- Average requests per user

## Timeline Estimate

**Option A (Wrap x402-solana):**
- Week 1: Core SDK + API methods
- Week 2: Testing + Documentation
- Week 3: Examples + Launch

**Option B (Custom Build):**
- Week 1-2: Payment handling (Base + Solana)
- Week 3: Core SDK + API methods
- Week 4: Testing + Documentation
- Week 5: React hooks (optional)
- Week 6: Examples + Launch

**Option C (Hybrid):**
- Week 1: MVP with x402-solana
- Week 2: Documentation + Launch MVP
- Week 3-4: Add Base support
- Week 5: React hooks
- Week 6: Advanced features

## Next Steps

1. **Decide on approach** (A, B, or C)
2. **Set up monorepo** structure
3. **Generate types** from OpenAPI spec
4. **Build core client** class
5. **Write tests** (unit + integration)
6. **Create examples** (React, vanilla, agent)
7. **Write docs** (installation, API reference, guides)
8. **Launch** on NPM with announcement

## Conclusion

A well-designed SDK will:
- ✅ Lower friction for API consumers
- ✅ Drive more $0.10 payments
- ✅ Establish Sundial as developer-friendly
- ✅ Enable AI agent integration
- ✅ Differentiate from competitors

**Recommendation:** Start with **Option C (Hybrid)** - Quick MVP using x402-solana, then add Base support and advanced features based on user feedback.

