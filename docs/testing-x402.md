# Testing x402 Payment Gateway

## How to Test

### 1. Start the development server

```bash
pnpm dev
```

### 2. Test without payment (should return 402)

```bash
curl -i http://localhost:3000/api/stats
```

**Expected Response:**
```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "x402Version": 1,
  "error": "X-PAYMENT header is required",
  "accepts": [
    {
      "scheme": "exact",
      "network": "base",
      "maxAmountRequired": "100000",  // 0.10 USDC (6 decimals)
      "resource": "http://localhost:3000/api/stats",
      "description": "",
      "mimeType": "application/json",
      "payTo": "0xDE7Ae42F066940c50EfeEd40Fd71DdE630148C0a",
      "maxTimeoutSeconds": 300,
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // USDC on Base
      "outputSchema": {
        "input": {
          "type": "http",
          "method": "GET",
          "discoverable": true
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

**What this means:**
- ✅ Payment gateway is working!
- 💰 External callers need to pay **0.10 USDC** on Base network
- 📍 Recipient: `0xDE7Ae42F066940c50EfeEd40Fd71DdE630148C0a`
- 🔗 Asset: USDC contract on Base (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)

### 3. Test from your frontend (should bypass payment)

Your own frontend is exempted from payment requirements. Test it:

```bash
# With Origin header (simulates browser request from your site)
curl -s http://localhost:3000/api/stats -H "Origin: http://localhost:3000" | jq .tps
```

**Expected:** Returns actual data (e.g., `2986` TPS), not a 402 error.

**Exempted domains:**
- ✅ `http://localhost:3000` (development)
- ✅ `https://sundial.exchange` (production)
- ✅ `https://www.sundial.exchange` (production with www)

When users access your website, their browser automatically sends the `Origin` or `Referer` header, so they get free API access. External API consumers without these headers must pay.

### 4. Test with payment (for external clients)

External clients need to:

1. Receive the 402 response with payment details
2. Create a payment using their Base wallet (USDC)
3. Submit the payment proof via the facilitator
4. Retry the request with `X-PAYMENT` header containing the payment proof

Example flow for external clients using [x402 SDK](https://docs.cdp.coinbase.com/x402/quickstart-for-buyers):

```javascript
import { createWallet } from '@coinbase/x402'

// 1. Get 402 response
const response = await fetch('https://sundial.exchange/api/stats')
const challenge = await response.json()

// 2. Create payment with wallet
const wallet = createWallet()
const payment = await wallet.pay(challenge)

// 3. Retry with payment
const paidResponse = await fetch('https://sundial.exchange/api/stats', {
  headers: {
    'X-PAYMENT': payment.proof
  }
})

const data = await paidResponse.json()
```

## What Bypasses Payment?

✅ **Your own frontend domains:**
- `http://localhost:3000` (development)
- `https://sundial.exchange` (production)
- `https://www.sundial.exchange` (production with www)

When requests include an `Origin` or `Referer` header matching these domains, payment is bypassed automatically.

❌ **What requires payment:**
- Direct API calls without Origin/Referer headers (e.g., curl, Postman)
- API calls from other websites/domains
- AI agents and bots consuming your API
- Any programmatic access from external sources

## Payment Flow Details

### What Happens When Someone Pays:

1. **Client** receives 402 response with payment challenge
2. **Client** creates payment and sends request with `X-PAYMENT` header
3. **Middleware** verifies payment with x402.org facilitator
4. **Middleware** settles payment on blockchain
5. **Middleware** adds `X-PAYMENT-RESPONSE` header with transaction details
6. **Client** receives API response + settlement proof

### X-PAYMENT-RESPONSE Header

Successful payments include a `X-PAYMENT-RESPONSE` header (base64 encoded JSON):

```json
{
  "success": true,
  "txHash": "0x1234...",
  "networkId": "base",
  "timestamp": "2025-10-26T..."
}
```

Clients can use the `txHash` to verify the payment on [BaseScan](https://basescan.org).

### Check Supported Networks

To see what networks the facilitator supports:

```bash
npx tsx scripts/check-x402-support.ts
```

This will show if Solana support is available!

## Moving to Production

To accept real payments on Base mainnet:

1. Already configured in `middleware.ts` with `network: "base"`
2. Set `X402_RECIPIENT_ADDRESS` to your real Base wallet in production env vars
3. Deploy to Vercel/production
4. External API consumers will pay $0.10 in USDC on Base per request
5. Settlement details returned in `X-PAYMENT-RESPONSE` header

## Network Details

- **Network**: Base (Ethereum L2 by Coinbase)
- **Token**: USDC
- **Transaction fees**: ~$0.01 per payment
- **Recipient**: `0xde7ae42f066940c50efeed40fd71dde630148c0a` (or your configured address)

## References

- [x402 Documentation](https://docs.cdp.coinbase.com/x402/quickstart-for-sellers)
- [Base Network](https://base.org)
- [Get Base Wallet](https://www.coinbase.com/wallet)

