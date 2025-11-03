# GetDexProtocolBySlugResponse

## Example Usage

```typescript
import { GetDexProtocolBySlugResponse } from "@starmorph/sundial-exchange-api-typescript/models/operations";

let value: GetDexProtocolBySlugResponse = {};
```

## Fields

| Field                                                                                                                | Type                                                                                                                 | Required                                                                                                             | Description                                                                                                          | Example                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `headers`                                                                                                            | Record<string, *string*[]>                                                                                           | :heavy_check_mark:                                                                                                   | N/A                                                                                                                  |                                                                                                                      |
| `result`                                                                                                             | [components.DexProtocolSummary](../../models/components/dexprotocolsummary.md)                                       | :heavy_check_mark:                                                                                                   | N/A                                                                                                                  | {<br/>"slug": "raydium",<br/>"displayName": "Raydium",<br/>"url": "https://raydium.io",<br/>"tvl": 54200000,<br/>"total24h": 128500000<br/>} |