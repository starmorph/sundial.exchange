# Trending
(*trending*)

## Overview

Trending token data

### Available Operations

* [getTrendingTokens](#gettrendingtokens) - Get trending token pricing data

## getTrendingTokens

Returns time-series pricing data for trending Solana tokens over a specified lookback window (default 24 hours), including current prices and 24h price changes.

### Example Usage

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.trending.getTrendingTokens({});

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SundialExchangeApiCore } from "@starmorph/sundial-exchange-api-typescript/core.js";
import { trendingGetTrendingTokens } from "@starmorph/sundial-exchange-api-typescript/funcs/trendingGetTrendingTokens.js";

// Use `SundialExchangeApiCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const sundialExchangeApi = new SundialExchangeApiCore();

async function run() {
  const res = await trendingGetTrendingTokens(sundialExchangeApi, {});
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("trendingGetTrendingTokens failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetTrendingTokensRequest](../../models/operations/gettrendingtokensrequest.md)                                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.GetTrendingTokensResponse](../../models/operations/gettrendingtokensresponse.md)\>**

### Errors

| Error Type           | Status Code          | Content Type         |
| -------------------- | -------------------- | -------------------- |
| errors.X402Challenge | 402                  | application/json     |
| errors.ErrorResponse | 500                  | application/json     |
| errors.APIError      | 4XX, 5XX             | \*/\*                |