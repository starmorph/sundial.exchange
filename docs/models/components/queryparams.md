# QueryParams

## Example Usage

```typescript
import { QueryParams } from "@starmorph/sundial-exchange-api-typescript/models/components";

let value: QueryParams = {};
```

## Fields

| Field                         | Type                          | Required                      | Description                   |
| ----------------------------- | ----------------------------- | ----------------------------- | ----------------------------- |
| `type`                        | *string*                      | :heavy_minus_sign:            | Parameter type                |
| `required`                    | *components.RequiredT*        | :heavy_minus_sign:            | Whether parameter is required |
| `description`                 | *string*                      | :heavy_minus_sign:            | Parameter description         |
| `enum`                        | *string*[]                    | :heavy_minus_sign:            | Allowed values                |