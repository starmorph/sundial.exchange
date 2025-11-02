# NormalizedTrendingToken

## Example Usage

```typescript
import { NormalizedTrendingToken } from "@starmorph/sundial-exchange-api-typescript/models/components";

let value: NormalizedTrendingToken = {
  symbol: "SOL",
  currentPrice: 158.32,
  change24h: 2.45,
  prices: [
    {
      timestamp: 1730314800,
      price: 154.1,
    },
    {
      timestamp: 1730401200,
      price: 158.32,
    },
  ],
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `symbol`                                                                       | *string*                                                                       | :heavy_check_mark:                                                             | N/A                                                                            |
| `currentPrice`                                                                 | *number*                                                                       | :heavy_check_mark:                                                             | N/A                                                                            |
| `change24h`                                                                    | *number*                                                                       | :heavy_check_mark:                                                             | N/A                                                                            |
| `prices`                                                                       | [components.PriceHistoryPoint](../../models/components/pricehistorypoint.md)[] | :heavy_check_mark:                                                             | N/A                                                                            |