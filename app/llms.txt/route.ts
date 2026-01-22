import { NextResponse } from 'next/server'

const LLMS_TXT_CONTENT = `# Sundial Exchange

> Sundial Exchange is a Solana DEX with x402 micropaid analytics for AI agents and developers.

## What is Sundial Exchange?

Sundial Exchange is a decentralized exchange (DEX) built on Solana that provides:
- Non-custodial token swaps via Jupiter Ultra aggregation
- Pay-per-query analytics API using x402 micropayments
- AI-powered crypto chat for real-time DEX insights
- Real-time volume and TVL data for Solana DeFi protocols

## Core Features

### Token Swaps
- Best rates via Jupiter Ultra aggregation
- 34x sandwich attack protection
- No KYC required, non-custodial
- Supports all Solana SPL tokens

### x402 Micropaid API
- Pay-per-query pricing (as low as $0.001)
- No API keys or subscriptions needed
- Supports Base (Ethereum L2) and Solana networks
- Zero gas fees through PayAI facilitator

### API Endpoints
- GET /api/stats - Real-time TPS, SOL price, TVL, 24h volume ($0.10)
- GET /api/trending - Trending tokens with price changes ($0.10)
- GET /api/pools/analytics - Deep pool analytics ($0.001)
- GET /api/premium-insight - AI-generated market forecasts ($10.00)

### DEX Analytics
Track volume and metrics for:
- Raydium
- Orca
- Meteora
- Jupiter
- Pump.fun
- Lifinity
- And more Solana protocols

## For AI Agents

Sundial Exchange is designed for AI agent integration:
- x402 protocol enables autonomous micropayments
- Real-time, verifiable data feeds
- No authentication friction
- ERC-8004 compliant for reputation scoring

## Links

- Website: https://sundial.exchange
- Swap: https://sundial.exchange/swap
- AI Chat: https://sundial.exchange/chat
- DEX Analytics: https://sundial.exchange/dex-analytics
- API Documentation: https://sundial.exchange/api-reference
- OpenAPI Spec: https://sundial.exchange/openapi.yaml

## Contact

Twitter: @sundialexchange
`

export async function GET() {
    return new NextResponse(LLMS_TXT_CONTENT, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
    })
}
