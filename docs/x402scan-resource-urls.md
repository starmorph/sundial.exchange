# x402scan.com Resource URLs for Submission

## ✅ Your 402 Responses Now Match x402scan Schema!

Your middleware has been updated to include the stricter schema required by x402scan with:
- ✅ `input` field with HTTP method and parameters
- ✅ `output` field with response structure
- ✅ `queryParams` for endpoints that accept them
- ✅ `bodyFields` for POST endpoints
- ✅ All 46 tests passing

## Resource URLs to Submit

Submit **each endpoint individually** to x402scan:

### 1. Real-time Statistics
```
https://sundial.exchange/api/stats
```

**Method:** GET  
**Description:** Get real-time Solana network statistics including TPS, SOL price, TVL, and 24h changes  
**Use Case:** Trading dashboards, market monitoring  
**Example Response:**
```json
{
  "tps": 2847,
  "solPriceUsd": 142.30,
  "tvlUsd": 1200000000,
  "volume24hUsd": 847000000,
  "solChange24hPct": 3.2,
  "tvlChange24hPct": 5.1,
  "volume24hChangePct": 12.3
}
```

---

### 2. Trending Tokens
```
https://sundial.exchange/api/trending?hours=24
```

**Method:** GET  
**Query Parameters:**
- `hours` (optional): Number of hours to look back (default: 24)

**Description:** Get trending Solana tokens with 24h price changes and historical data  
**Use Case:** Token discovery, trading signals  
**Example Response:**
```json
[
  {
    "symbol": "BONK",
    "currentPrice": 0.000018,
    "change24h": 47.3,
    "prices": [
      { "timestamp": 1234567890, "price": 0.000012 },
      { "timestamp": 1234567891, "price": 0.000018 }
    ]
  }
]
```

---

### 3. DEX Overview
```
https://sundial.exchange/api/dex/overview
```

**Method:** GET  
**Description:** Get overview of all Solana DEX protocols with aggregated volumes  
**Use Case:** DEX comparison, market research  
**Example Response:**
```json
{
  "protocols": [
    {
      "name": "Raydium",
      "slug": "raydium",
      "total24h": 312000000,
      "totalAllTime": 45000000000
    }
  ],
  "volumes": [
    {
      "date": "2024-01-01",
      "totalVolume": 847000000
    }
  ]
}
```

---

### 4. Specific DEX Protocol
```
https://sundial.exchange/api/dex/protocol/raydium
```

**Method:** GET  
**Path Parameter:** `{slug}` - Protocol identifier (e.g., raydium, orca, meteora)  
**Description:** Get detailed statistics for a specific DEX protocol  
**Use Case:** Protocol-specific analytics  

**Other protocol examples:**
- `https://sundial.exchange/api/dex/protocol/orca`
- `https://sundial.exchange/api/dex/protocol/meteora`
- `https://sundial.exchange/api/dex/protocol/phoenix`

---

### 5. Swap Event Logging
```
https://sundial.exchange/api/swap-log
```

**Method:** POST  
**Content-Type:** application/json  
**Description:** Log swap events for tracking and analytics  
**Use Case:** Trading history, portfolio tracking  
**Example Request:**
```json
{
  "event": {
    "tokenIn": "SOL",
    "tokenOut": "USDC",
    "amountIn": "1.0",
    "amountOut": "142.30",
    "timestamp": 1234567890
  }
}
```

---

## x402 Challenge Example

When you hit any endpoint without payment, you get:

```json
{
  "x402Version": 1,
  "error": "X-PAYMENT header is required",
  "accepts": [
    {
      "scheme": "exact",
      "network": "base",
      "maxAmountRequired": "100000",
      "resource": "https://sundial.exchange/api/stats",
      "description": "Access /api/stats - Sundial Exchange API (Base)",
      "mimeType": "application/json",
      "payTo": "0xde7ae42f066940c50efeed40fd71dde630148c0a",
      "maxTimeoutSeconds": 300,
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "outputSchema": {
        "input": {
          "type": "http",
          "method": "GET"
        },
        "output": {
          "type": "object",
          "properties": {
            "tps": { "type": "number", "description": "Transactions per second" },
            "solPriceUsd": { "type": "number", "description": "SOL price in USD" },
            "tvlUsd": { "type": "number", "description": "Total value locked in USD" },
            "volume24hUsd": { "type": "number", "description": "24h volume in USD" },
            "solChange24hPct": { "type": "number", "description": "24h SOL price change %" },
            "tvlChange24hPct": { "type": "number", "description": "24h TVL change %" },
            "volume24hChangePct": { "type": "number", "description": "24h volume change %" }
          }
        }
      },
      "extra": {
        "name": "USD Coin",
        "version": "2"
      }
    },
    {
      "scheme": "exact",
      "network": "solana",
      "maxAmountRequired": "100000",
      "resource": "https://sundial.exchange/api/stats",
      "description": "Access /api/stats - Sundial Exchange API (Solana)",
      "mimeType": "application/json",
      "payTo": "Aia9ukbSndCSrTnv8geoSjeJcY6Q5GvdsMSo1busrr5K",
      "maxTimeoutSeconds": 300,
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "outputSchema": {
        "input": {
          "type": "http",
          "method": "GET"
        },
        "output": {
          "type": "object",
          "properties": {
            "tps": { "type": "number", "description": "Transactions per second" },
            "solPriceUsd": { "type": "number", "description": "SOL price in USD" },
            "tvlUsd": { "type": "number", "description": "Total value locked in USD" },
            "volume24hUsd": { "type": "number", "description": "24h volume in USD" },
            "solChange24hPct": { "type": "number", "description": "24h SOL price change %" },
            "tvlChange24hPct": { "type": "number", "description": "24h TVL change %" },
            "volume24hChangePct": { "type": "number", "description": "24h volume change %" }
          }
        }
      },
      "extra": {
        "name": "USD Coin",
        "version": "2"
      }
    }
  ]
}
```

## Schema Validation ✅

Your responses now include all required fields per x402scan spec:

### Required Fields (You Have All)
- ✅ `scheme`: "exact"
- ✅ `network`: "base" or "solana"
- ✅ `maxAmountRequired`: "100000" (string)
- ✅ `resource`: Full URL
- ✅ `description`: Human-readable
- ✅ `mimeType`: "application/json"
- ✅ `payTo`: Wallet address
- ✅ `maxTimeoutSeconds`: 300
- ✅ `asset`: USDC contract address

### Optional Fields (You Have These Too)
- ✅ `outputSchema`: With `input` and `output`
  - ✅ `input.type`: "http"
  - ✅ `input.method`: "GET" or "POST"
  - ✅ `input.queryParams`: For endpoints with parameters
  - ✅ `input.bodyFields`: For POST endpoints
  - ✅ `output`: Response structure with types
- ✅ `extra`: Additional metadata (USDC name, version)

## Test Your Endpoints

Before submitting, test that 402 responses work:

```bash
# Test /api/stats
curl -i https://sundial.exchange/api/stats

# Test /api/trending
curl -i https://sundial.exchange/api/trending?hours=24

# Test /api/dex/overview
curl -i https://sundial.exchange/api/dex/overview

# Test /api/dex/protocol/{slug}
curl -i https://sundial.exchange/api/dex/protocol/raydium

# All should return 402 with proper challenge
```

## Submission Checklist

- [x] 402 responses include `outputSchema` with `input` and `output` fields
- [x] `input` specifies HTTP method
- [x] `input` includes `queryParams` for GET endpoints with params
- [x] `input` includes `bodyFields` for POST endpoints
- [x] `output` describes response structure
- [x] All required fields present (scheme, network, etc.)
- [x] Both Base and Solana payment options available
- [x] Tests passing (46/46)
- [ ] Submit each endpoint to x402scan.com

## Priority Order for Submission

Submit in this order based on usefulness:

1. **`/api/stats`** - Most useful (real-time network data)
2. **`/api/trending?hours=24`** - Second most useful (trading signals)
3. **`/api/dex/overview`** - Great for market analysis
4. **`/api/dex/protocol/raydium`** - Protocol-specific (example)
5. **`/api/swap-log`** - Utility endpoint

## Expected Validation

x402scan will:
1. ✅ Hit your endpoint without payment
2. ✅ Receive 402 response
3. ✅ Validate schema structure
4. ✅ Check `outputSchema.input` exists
5. ✅ Check `outputSchema.output` exists
6. ✅ Verify `scheme`, `network`, `asset` fields
7. ✅ Test payment flow (they may actually pay!)
8. ✅ List your resource if all checks pass

## After Submission

Once listed, users on x402scan.com will see:
- Your endpoint URL
- Description
- Price ($0.10 USDC)
- Supported networks (Base, Solana)
- Input parameters
- Output structure
- "Try it" button that handles payment automatically

This makes your API discoverable to:
- 🤖 AI agents looking for DEX data
- 📊 Developers building trading tools
- 🔬 Researchers analyzing Solana
- 💼 Enterprises needing market data

## Support

If x402scan has questions:
- OpenAPI Spec: https://sundial.exchange/openapi.yaml
- GitHub: https://github.com/dylanboudro/sundial.exchange
- Website: https://sundial.exchange
- Documentation: See `/docs` folder

---

**You're ready to submit!** Your 402 responses are fully x402scan compatible. 🚀

