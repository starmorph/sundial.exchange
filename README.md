# sundial-exchange-api-typescript

Developer-friendly, idiomatic Typescript SDK for the *sundial-exchange-api-typescript* API.

<div align="left">
    <a href="https://www.scalar.com/?utm_source=sundial-exchange-api-typescript&utm_campaign=typescript"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20scalar+speakeasy-212015?style=for-the-badge&logo=scalar&labelColor=252525" /></a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" style="width: 100px; height: 28px;" />
    </a>
</div>

<br />

## Summary

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


For more information about the API: [Complete API documentation and guides](https://github.com/dylanboudro/sundial.exchange)
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [@starmorph/sundial-exchange-api-typescript](#starmorphsundial-exchange-api-typescript)
  * [Overview](#overview)
  * [Payment Gateway (x402 Protocol)](#payment-gateway-x402-protocol)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)
* [Development](#development)
  * [Maturity](#maturity)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @starmorph/sundial-exchange-api-typescript
```

### PNPM

```bash
pnpm add @starmorph/sundial-exchange-api-typescript
```

### Bun

```bash
bun add @starmorph/sundial-exchange-api-typescript
```

### Yarn

```bash
yarn add @starmorph/sundial-exchange-api-typescript zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.dex.getDexOverview();

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [dex](docs/sdks/dex/README.md)

* [getDexOverview](docs/sdks/dex/README.md#getdexoverview) - Get Solana DEX overview
* [getPoolAnalytics](docs/sdks/dex/README.md#getpoolanalytics) - Get liquidity and volume analytics for a specific Solana pool
* [getDexProtocolBySlug](docs/sdks/dex/README.md#getdexprotocolbyslug) - Get DEX protocol details

### [logging](docs/sdks/logging/README.md)

* [postSwapLog](docs/sdks/logging/README.md#postswaplog) - Log a swap event

### [premium](docs/sdks/premium/README.md)

* [getPremiumInsight](docs/sdks/premium/README.md#getpremiuminsight) - Generate premium Solana market forecast (AI + DeFiLlama data)

### [stats](docs/sdks/stats/README.md)

* [getStats](docs/sdks/stats/README.md#getstats) - Get near real-time platform stats


### [trending](docs/sdks/trending/README.md)

* [getTrendingTokens](docs/sdks/trending/README.md#gettrendingtokens) - Get trending token pricing data

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`dexGetDexOverview`](docs/sdks/dex/README.md#getdexoverview) - Get Solana DEX overview
- [`dexGetDexProtocolBySlug`](docs/sdks/dex/README.md#getdexprotocolbyslug) - Get DEX protocol details
- [`dexGetPoolAnalytics`](docs/sdks/dex/README.md#getpoolanalytics) - Get liquidity and volume analytics for a specific Solana pool
- [`loggingPostSwapLog`](docs/sdks/logging/README.md#postswaplog) - Log a swap event
- [`premiumGetPremiumInsight`](docs/sdks/premium/README.md#getpremiuminsight) - Generate premium Solana market forecast (AI + DeFiLlama data)
- [`statsGetStats`](docs/sdks/stats/README.md#getstats) - Get near real-time platform stats
- [`trendingGetTrendingTokens`](docs/sdks/trending/README.md#gettrendingtokens) - Get trending token pricing data

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.dex.getDexOverview({
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
});

async function run() {
  const result = await sundialExchangeApi.dex.getDexOverview();

  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

[`SundialExchangeAPIError`](./src/models/errors/sundialexchangeapierror.ts) is the base class for all HTTP error responses. It has the following properties:

| Property            | Type       | Description                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `error.message`     | `string`   | Error message                                                                           |
| `error.statusCode`  | `number`   | HTTP response status code eg `404`                                                      |
| `error.headers`     | `Headers`  | HTTP response headers                                                                   |
| `error.body`        | `string`   | HTTP body. Can be empty string if no body is returned.                                  |
| `error.rawResponse` | `Response` | Raw HTTP response                                                                       |
| `error.data$`       |            | Optional. Some errors may contain structured data. [See Error Classes](#error-classes). |

### Example
```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";
import * as errors from "@starmorph/sundial-exchange-api-typescript/models/errors";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  try {
    const result = await sundialExchangeApi.dex.getDexOverview();

    console.log(result);
  } catch (error) {
    // The base class for HTTP error responses
    if (error instanceof errors.SundialExchangeAPIError) {
      console.log(error.message);
      console.log(error.statusCode);
      console.log(error.body);
      console.log(error.headers);

      // Depending on the method different errors may be thrown
      if (error instanceof errors.X402Challenge) {
        console.log(error.data$.x402Version); // errors.X402Version
        console.log(error.data$.error); // string
        console.log(error.data$.accepts); // X402PaymentMethod[]
      }
    }
  }
}

run();

```

### Error Classes
**Primary errors:**
* [`SundialExchangeAPIError`](./src/models/errors/sundialexchangeapierror.ts): The base class for HTTP error responses.
  * [`X402Challenge`](docs/models/errors/x402challenge.md): x402 payment challenge containing payment requirements. The challenge includes options for both Base and Solana networks. Clients can choose which network to use for payment. Status code `402`.

<details><summary>Less common errors (7)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/httpclienterrors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/httpclienterrors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/httpclienterrors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/httpclienterrors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/httpclienterrors.ts): Unrecognised or unexpected error.


**Inherit from [`SundialExchangeAPIError`](./src/models/errors/sundialexchangeapierror.ts)**:
* [`ErrorResponse`](docs/models/errors/errorresponse.md): Applicable to 5 of 7 methods.*
* [`ResponseValidationError`](./src/models/errors/responsevalidationerror.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>

\* Check [the method documentation](#available-resources-and-operations) to see if the error is applicable.
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Index

You can override the default server globally by passing a server index to the `serverIdx: number` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the indexes associated with the available servers:

| #   | Server                     | Description                   |
| --- | -------------------------- | ----------------------------- |
| 0   | `https://sundial.exchange` | Production                    |
| 1   | `http://localhost:3000`    | Local development             |
| 2   | `/`                        | Relative to deployment origin |

#### Example

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi({
  serverIdx: 2,
});

async function run() {
  const result = await sundialExchangeApi.dex.getDexOverview();

  console.log(result);
}

run();

```

### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi({
  serverURL: "http://localhost:3000",
});

async function run() {
  const result = await sundialExchangeApi.dex.getDexOverview();

  console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";
import { HTTPClient } from "@starmorph/sundial-exchange-api-typescript/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new SundialExchangeApi({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sdk = new SundialExchangeApi({ debugLogger: console });
```
<!-- End Debugging [debug] -->

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation. 
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release.

### SDK Created by [Scalar](https://www.scalar.com/?utm_source=sundial-exchange-api-typescript&utm_campaign=typescript)