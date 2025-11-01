# GetDexOverviewResponseBody

Overview data

## Example Usage

```typescript
import { GetDexOverviewResponseBody } from "@starmorph/sundial-exchange-api-typescript/models/operations";

let value: GetDexOverviewResponseBody = {
  protocols: [
    {
      displayName: "Raydium",
      url: "https://raydium.io",
      slug: "raydium",
      tvl: 54200000,
      total24h: 128500000,
    },
  ],
  volumes: [
    {},
  ],
};
```

## Fields

| Field                                                                            | Type                                                                             | Required                                                                         | Description                                                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `protocols`                                                                      | [components.DexProtocolSummary](../../models/components/dexprotocolsummary.md)[] | :heavy_check_mark:                                                               | N/A                                                                              |
| `volumes`                                                                        | [components.DexVolumeData](../../models/components/dexvolumedata.md)[]           | :heavy_check_mark:                                                               | N/A                                                                              |