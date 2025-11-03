# Premium
(*premium*)

## Overview

Premium paid endpoints for automated due diligence and stress-testing bots

### Available Operations

* [getPremiumInsight](#getpremiuminsight) - Generate premium Solana market forecast (AI + DeFiLlama data)

## getPremiumInsight

Produces a high-value, AI-generated 24–48 hour Solana market outlook derived from DeFiLlama token trends and liquidity signals. Ideal for automated testers evaluating premium x402 integrations, MEV defense, or treasury risk models.

The response includes:
- Aggregated sentiment on SOL momentum (bullish/bearish & projected range)
- Top trending Solana tokens with catalyst commentary
- Notable whale/liquidity anomalies observed in the last 24h

**Pricing:** Requires a $10.00 USDC x402 payment (Base or Solana) per invocation.
**x402 canonical price:** `10000000` (USDC has 6 decimals, 10.00 → 10,000,000)

> **Note for human users:** This feed is experimental and optimised for autonomous QA clients. Use at your own discretion.


### Example Usage

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.premium.getPremiumInsight();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SundialExchangeApiCore } from "@starmorph/sundial-exchange-api-typescript/core.js";
import { premiumGetPremiumInsight } from "@starmorph/sundial-exchange-api-typescript/funcs/premiumGetPremiumInsight.js";

// Use `SundialExchangeApiCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const sundialExchangeApi = new SundialExchangeApiCore();

async function run() {
  const res = await premiumGetPremiumInsight(sundialExchangeApi);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("premiumGetPremiumInsight failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.GetPremiumInsightResponse](../../models/operations/getpremiuminsightresponse.md)\>**

### Errors

| Error Type           | Status Code          | Content Type         |
| -------------------- | -------------------- | -------------------- |
| errors.X402Challenge | 402                  | application/json     |
| errors.ErrorResponse | 500                  | application/json     |
| errors.APIError      | 4XX, 5XX             | \*/\*                |