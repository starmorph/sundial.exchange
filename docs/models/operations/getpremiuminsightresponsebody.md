# GetPremiumInsightResponseBody

Premium AI forecast payload

## Example Usage

```typescript
import { GetPremiumInsightResponseBody } from "@starmorph/sundial-exchange-api-typescript/models/operations";

let value: GetPremiumInsightResponseBody = {
  forecast: "<value>",
  generatedAt: new Date("2023-06-11T18:14:32.513Z"),
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `forecast`                                                                                    | *string*                                                                                      | :heavy_check_mark:                                                                            | AI-authored summary of near-term Solana market expectations                                   |
| `generatedAt`                                                                                 | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_check_mark:                                                                            | UTC timestamp when the forecast was generated                                                 |