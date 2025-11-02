# OutputSchema

Schema describing the input and output format per x402scan specification.
Allows x402scan to present a UI for invoking resources from within the app.


## Example Usage

```typescript
import { OutputSchema } from "@starmorph/sundial-exchange-api-typescript/models/components";

let value: OutputSchema = {};
```

## Fields

| Field                                                | Type                                                 | Required                                             | Description                                          |
| ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| `input`                                              | [components.Input](../../models/components/input.md) | :heavy_minus_sign:                                   | HTTP request parameters                              |
| `output`                                             | Record<string, *any*>                                | :heavy_minus_sign:                                   | Response structure definition                        |