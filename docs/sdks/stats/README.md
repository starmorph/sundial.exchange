# Stats
(*stats*)

## Overview

Platform and market stats

### Available Operations

* [getStats](#getstats) - Get near real-time platform stats

## getStats

Returns TPS, SOL price, TVL, and 24h volume plus 24h change percentages when available.

### Example Usage

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.stats.getStats();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SundialExchangeApiCore } from "@starmorph/sundial-exchange-api-typescript/core.js";
import { statsGetStats } from "@starmorph/sundial-exchange-api-typescript/funcs/statsGetStats.js";

// Use `SundialExchangeApiCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const sundialExchangeApi = new SundialExchangeApiCore();

async function run() {
  const res = await statsGetStats(sundialExchangeApi);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("statsGetStats failed:", res.error);
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

**Promise\<[operations.GetStatsResponse](../../models/operations/getstatsresponse.md)\>**

### Errors

| Error Type           | Status Code          | Content Type         |
| -------------------- | -------------------- | -------------------- |
| errors.X402Challenge | 402                  | application/json     |
| errors.APIError      | 4XX, 5XX             | \*/\*                |