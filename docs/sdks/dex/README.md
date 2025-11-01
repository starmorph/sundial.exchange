# Dex
(*dex*)

## Overview

DEX data endpoints

### Available Operations

* [getDexOverview](#getdexoverview) - Get Solana DEX overview
* [getPoolAnalytics](#getpoolanalytics) - Get liquidity and volume analytics for a specific Solana pool
* [getDexProtocolBySlug](#getdexprotocolbyslug) - Get DEX protocol details

## getDexOverview

Returns Solana DEX protocol summaries and aggregated volume timeline for Solana DEXs.

### Example Usage

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.dex.getDexOverview();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SundialExchangeApiCore } from "@starmorph/sundial-exchange-api-typescript/core.js";
import { dexGetDexOverview } from "@starmorph/sundial-exchange-api-typescript/funcs/dexGetDexOverview.js";

// Use `SundialExchangeApiCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const sundialExchangeApi = new SundialExchangeApiCore();

async function run() {
  const res = await dexGetDexOverview(sundialExchangeApi);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dexGetDexOverview failed:", res.error);
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

**Promise\<[operations.GetDexOverviewResponse](../../models/operations/getdexoverviewresponse.md)\>**

### Errors

| Error Type           | Status Code          | Content Type         |
| -------------------- | -------------------- | -------------------- |
| errors.X402Challenge | 402                  | application/json     |
| errors.ErrorResponse | 500                  | application/json     |
| errors.APIError      | 4XX, 5XX             | \*/\*                |

## getPoolAnalytics

Returns time-sensitive liquidity, fee, and reserve metrics for a given Solana pool sourced from the Jupiter Ultra API.

Pricing: requires a 0.001 USDC x402 payment on Solana per request.


### Example Usage

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.dex.getPoolAnalytics({
    poolId: "9wFFqz4haWkYox2dXkbZ7P3V7g9E3G7Ayd6A8aXjRY3F",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SundialExchangeApiCore } from "@starmorph/sundial-exchange-api-typescript/core.js";
import { dexGetPoolAnalytics } from "@starmorph/sundial-exchange-api-typescript/funcs/dexGetPoolAnalytics.js";

// Use `SundialExchangeApiCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const sundialExchangeApi = new SundialExchangeApiCore();

async function run() {
  const res = await dexGetPoolAnalytics(sundialExchangeApi, {
    poolId: "9wFFqz4haWkYox2dXkbZ7P3V7g9E3G7Ayd6A8aXjRY3F",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dexGetPoolAnalytics failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetPoolAnalyticsRequest](../../models/operations/getpoolanalyticsrequest.md)                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.GetPoolAnalyticsResponse](../../models/operations/getpoolanalyticsresponse.md)\>**

### Errors

| Error Type           | Status Code          | Content Type         |
| -------------------- | -------------------- | -------------------- |
| errors.ErrorResponse | 400                  | application/json     |
| errors.X402Challenge | 402                  | application/json     |
| errors.ErrorResponse | 502                  | application/json     |
| errors.APIError      | 4XX, 5XX             | \*/\*                |

## getDexProtocolBySlug

Get DEX protocol details

### Example Usage

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.dex.getDexProtocolBySlug({
    slug: "raydium",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SundialExchangeApiCore } from "@starmorph/sundial-exchange-api-typescript/core.js";
import { dexGetDexProtocolBySlug } from "@starmorph/sundial-exchange-api-typescript/funcs/dexGetDexProtocolBySlug.js";

// Use `SundialExchangeApiCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const sundialExchangeApi = new SundialExchangeApiCore();

async function run() {
  const res = await dexGetDexProtocolBySlug(sundialExchangeApi, {
    slug: "raydium",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dexGetDexProtocolBySlug failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetDexProtocolBySlugRequest](../../models/operations/getdexprotocolbyslugrequest.md)                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.GetDexProtocolBySlugResponse](../../models/operations/getdexprotocolbyslugresponse.md)\>**

### Errors

| Error Type           | Status Code          | Content Type         |
| -------------------- | -------------------- | -------------------- |
| errors.ErrorResponse | 400                  | application/json     |
| errors.X402Challenge | 402                  | application/json     |
| errors.ErrorResponse | 500                  | application/json     |
| errors.APIError      | 4XX, 5XX             | \*/\*                |