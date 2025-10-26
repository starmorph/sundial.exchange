# Solana Network Integration

The x402 payment gateway now supports **both Base and Solana networks** for API payments.

## Overview

Clients can choose to pay with USDC on either:
- **Base** (Ethereum L2)
- **Solana**

Both networks use the [PayAI facilitator](https://facilitator.payai.network/) for gasless payments.

## Configuration

### Environment Variables

```env
# Base wallet address (EVM)
X402_RECIPIENT_ADDRESS=0xYourBaseWalletAddress

# Solana wallet address
X402_RECIPIENT_ADDRESS_SOLANA=YourSolanaWalletAddress

# Facilitator URL (optional, defaults to PayAI)
FACILITATOR_URL=https://facilitator.payai.network
```

### Default Values

If environment variables are not set, the middleware uses these defaults:
- Base: `0xde7ae42f066940c50efeed40fd71dde630148c0a`
- Solana: `Aia9ukbSndCSrTnv8geoSjeJcY6Q5GvdsMSo1busrr5K`

## Payment Flow

### 1. Client Receives 402 Challenge

When a client makes an unauthenticated request, they receive a `402 Payment Required` response with **both payment options**:

```json
{
  "x402Version": 1,
  "error": "X-PAYMENT header is required",
  "accepts": [
    {
      "scheme": "exact",
      "network": "base",
      "maxAmountRequired": "100000",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "payTo": "0xde7ae42f066940c50efeed40fd71dde630148c0a",
      "description": "Access /api/stats - Sundial Exchange API (Base)",
      ...
    },
    {
      "scheme": "exact",
      "network": "solana",
      "maxAmountRequired": "100000",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "payTo": "Aia9ukbSndCSrTnv8geoSjeJcY6Q5GvdsMSo1busrr5K",
      "description": "Access /api/stats - Sundial Exchange API (Solana)",
      ...
    }
  ]
}
```

### 2. Client Chooses Network

The client selects which network to use and creates a payment accordingly. The payment header includes the network choice:

```json
{
  "network": "solana",  // or "base"
  "signature": "...",
  ...
}
```

### 3. Middleware Routes to Correct Network

The middleware extracts the network from the payment header and:
1. Uses the appropriate recipient address
2. Verifies with the correct USDC contract
3. Settles on the chosen network

## USDC Contracts

### Base
- Address: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Standard: ERC-20
- Name: USD Coin

### Solana
- Address: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- Standard: SPL Token
- Name: USD Coin

## PayAI Facilitator

The middleware uses [PayAI's facilitator](https://facilitator.payai.network/) which provides:

✅ **Mainnet Support**: Both Base and Solana mainnets  
✅ **Gasless Transactions**: No network fees for buyers or merchants  
✅ **No API Keys**: Drop-in setup with just a facilitator URL  
✅ **Multi-Network**: Consistent API across networks  
✅ **Fast Settlement**: Under 1 second when chain confirms  

### Facilitator Endpoints

- Verify: `POST https://facilitator.payai.network/verify`
- Settle: `POST https://facilitator.payai.network/settle`
- List: `GET https://facilitator.payai.network/list`
- Supported: `GET https://facilitator.payai.network/supported`

## Testing

### Check Supported Networks

```bash
npx tsx scripts/check-x402-support.ts
```

### Run Test Suite

```bash
# Run all tests (46 tests including Solana)
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

### Test Coverage

The test suite includes:
- ✅ Dual network challenge generation
- ✅ Base payment verification
- ✅ Solana payment verification
- ✅ Correct USDC contract selection
- ✅ Network-specific recipient routing
- ✅ Transaction hash tracking per network

## Implementation Details

### Network Detection

The middleware inspects the `X-PAYMENT` header to determine which network the client chose:

```typescript
function getPaymentNetwork(paymentHeader: string): { 
  network: string
  payTo: string
  asset: string 
} | null {
  const decoded = JSON.parse(atob(paymentHeader))
  const network = decoded.network
  
  if (network === "base") {
    return { 
      network: "base", 
      payTo: RECIPIENT_ADDRESS, 
      asset: USDC_BASE 
    }
  } else if (network === "solana") {
    return { 
      network: "solana", 
      payTo: RECIPIENT_ADDRESS_SOLANA, 
      asset: USDC_SOLANA 
    }
  }
  return null
}
```

### Dynamic Verification

Both verification and settlement use network-specific parameters:

```typescript
const networkInfo = getPaymentNetwork(paymentHeader)

await fetch(`${FACILITATOR_BASE_URL}/verify`, {
  method: "POST",
  body: JSON.stringify({
    x402Version: 1,
    paymentHeader,
    paymentRequirements: {
      scheme: "exact",
      network: networkInfo.network,  // "base" or "solana"
      asset: networkInfo.asset,      // USDC contract
      payTo: networkInfo.payTo,      // Recipient address
      maxAmountRequired: "100000",
      ...
    },
  }),
})
```

## Benefits

### For Users
- **Choice**: Pick your preferred network (Base or Solana)
- **Gasless**: No transaction fees for payments
- **Fast**: Quick settlement on both networks

### For Developers
- **Simple**: Same API regardless of network
- **Reliable**: PayAI handles network complexity
- **Scalable**: Free tier includes 100K settlements/month

## Migration Notes

If you're upgrading from Base-only:

1. **Add Solana wallet** to environment variables
2. **Update tests** to expect 2 payment options instead of 1
3. **No code changes** required - middleware handles both automatically

## Resources

- [PayAI Facilitator](https://facilitator.payai.network/)
- [PayAI Documentation](https://facilitator.payai.network/)
- [x402 Protocol Spec](https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works)
- [Base Network](https://base.org/)
- [Solana](https://solana.com/)

