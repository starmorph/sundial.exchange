# SundialExchangeApi SDK

## Overview

Sundial Exchange API: Real-time Solana DEX analytics API powered by x402 payments.

## Overview

Access comprehensive Solana DEX data including:
- 📊 Real-time statistics (TPS, SOL price, TVL)
- 🔥 Trending tokens with 24h price changes
- 🏦 Protocol summaries and volumes (Raydium, Orca, Meteora, etc.)
- 📈 Historical volume data across all major Solana DEXs
- 🤖 **Premium AI forecasts** synthesised from DeFiLlama market data (requires $10 x402 payment)

*disclaimer:* this api is not yet production ready and is subject to change. There may be data inaccuracies or missing data e.g. retrieving 7day volume from a specific dex may not be available.

## Payment Gateway (x402 Protocol)

External API requests require a **$0.10 USDC** payment via the [x402 protocol](https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works). The `/api/premium-insight` endpoint is priced at **$10.00 USDC** to reflect the additional AI inference cost and premium analytics payload.

| Endpoint | Price (USDC) |
| --- | ---: |
| `/api/stats` | 0.10 |
| `/api/trending` | 0.10 |
| `/api/dex/*` | 0.10 |
| `/api/pools/{id}/analytics` | 0.001 |
| `/api/premium-insight` | **10.00** |

### Supported Networks

Clients can choose to pay on either:
- **Base** (Ethereum L2) - USDC contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Solana** - USDC contract: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

Payments are processed through the [PayAI facilitator](https://facilitator.payai.network/) with **zero gas fees** for both buyers and merchants.

### Payment Recipients

- **Base**: `0xde7ae42f066940c50efeed40fd71dde630148c0a`
- **Solana**: `Aia9ukbSndCSrTnv8geoSjeJcY6Q5GvdsMSo1busrr5K`

### Free Access

The following origins are exempt from payment requirements:
- `http://localhost:3000` (development)
- `https://sundial.exchange` (production)
- `https://www.sundial.exchange` (production with www)

Users browsing the Sundial Exchange website get free API access!


Complete API documentation and guides
<https://github.com/dylanboudro/sundial.exchange>

### Available Operations
