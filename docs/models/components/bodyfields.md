# BodyFields

## Example Usage

```typescript
import { BodyFields } from "@starmorph/sundial-exchange-api-typescript/models/components";

let value: BodyFields = {};
```

## Fields

| Field                                                          | Type                                                           | Required                                                       | Description                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `type`                                                         | *string*                                                       | :heavy_minus_sign:                                             | Field type                                                     |
| `required`                                                     | *components.X402PaymentMethodRequired*                         | :heavy_minus_sign:                                             | Whether field is required                                      |
| `description`                                                  | *string*                                                       | :heavy_minus_sign:                                             | Field description                                              |
| `properties`                                                   | [components.Properties](../../models/components/properties.md) | :heavy_minus_sign:                                             | Nested object properties                                       |