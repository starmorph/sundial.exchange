# GetTrendingTokensRequest

## Example Usage

```typescript
import { GetTrendingTokensRequest } from "@starmorph/sundial-exchange-api-typescript/models/operations";

let value: GetTrendingTokensRequest = {};
```

## Fields

| Field                                           | Type                                            | Required                                        | Description                                     | Example                                         |
| ----------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| `hours`                                         | *number*                                        | :heavy_minus_sign:                              | Lookback window in hours (> 0). Defaults to 24. | 24                                              |