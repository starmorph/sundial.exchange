# Logging
(*logging*)

## Overview

Event ingestion/logging

### Available Operations

* [postSwapLog](#postswaplog) - Log a swap event

## postSwapLog

Accepts arbitrary JSON payloads to be logged server-side. Returns no content.

### Example Usage

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.logging.postSwapLog({
    "txHash": "0xabc123...",
    "user": "A1b2C3d4E5f6G7h8i9J0kLmNoPqRsTuVwXyZ12345",
    "base": "SOL",
    "quote": "USDC",
    "amountBase": 12.5,
    "amountQuote": 1975.33,
    "timestamp": "2025-10-31T23:59:59Z",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SundialExchangeApiCore } from "@starmorph/sundial-exchange-api-typescript/core.js";
import { loggingPostSwapLog } from "@starmorph/sundial-exchange-api-typescript/funcs/loggingPostSwapLog.js";

// Use `SundialExchangeApiCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const sundialExchangeApi = new SundialExchangeApiCore();

async function run() {
  const res = await loggingPostSwapLog(sundialExchangeApi, {
    "txHash": "0xabc123...",
    "user": "A1b2C3d4E5f6G7h8i9J0kLmNoPqRsTuVwXyZ12345",
    "base": "SOL",
    "quote": "USDC",
    "amountBase": 12.5,
    "amountQuote": 1975.33,
    "timestamp": "2025-10-31T23:59:59Z",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("loggingPostSwapLog failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [{ [k: string]: any }](../../models/.md)                                                                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.PostSwapLogResponse](../../models/operations/postswaplogresponse.md)\>**

### Errors

| Error Type           | Status Code          | Content Type         |
| -------------------- | -------------------- | -------------------- |
| errors.X402Challenge | 402                  | application/json     |
| errors.APIError      | 4XX, 5XX             | \*/\*                |