# DexProtocolSummary

## Example Usage

```typescript
import { DexProtocolSummary } from "@starmorph/sundial-exchange-api-typescript/models/components";

let value: DexProtocolSummary = {
  displayName: "Raydium",
  url: "https://raydium.io",
  slug: "raydium",
  tvl: 54200000,
  total24h: 128500000,
};
```

## Fields

| Field                                    | Type                                     | Required                                 | Description                              |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| `name`                                   | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `displayName`                            | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `disabled`                               | *boolean*                                | :heavy_minus_sign:                       | N/A                                      |
| `logo`                                   | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `address`                                | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `url`                                    | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `description`                            | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `audits`                                 | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `category`                               | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `twitter`                                | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `auditLinks`                             | *string*[]                               | :heavy_minus_sign:                       | N/A                                      |
| `forkedFrom`                             | *string*[]                               | :heavy_minus_sign:                       | N/A                                      |
| `geckoId`                                | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `chains`                                 | *string*[]                               | :heavy_minus_sign:                       | N/A                                      |
| `module`                                 | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `protocolType`                           | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `methodology`                            | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `latestFetchIsOk`                        | *boolean*                                | :heavy_minus_sign:                       | N/A                                      |
| `slug`                                   | *string*                                 | :heavy_minus_sign:                       | N/A                                      |
| `tvl`                                    | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `chainTvls`                              | Record<string, *number*>                 | :heavy_minus_sign:                       | N/A                                      |
| `change1h`                               | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `change1d`                               | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `change7d`                               | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `fdv`                                    | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `mcap`                                   | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `total24h`                               | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `total48hto24h`                          | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `total7d`                                | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `total14dto7d`                           | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `total60dto30d`                          | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `total30d`                               | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `totalAllTime`                           | *number*                                 | :heavy_minus_sign:                       | N/A                                      |
| `breakdown24h`                           | Record<string, Record<string, *number*>> | :heavy_minus_sign:                       | N/A                                      |