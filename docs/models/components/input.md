# Input

HTTP request parameters

## Example Usage

```typescript
import { Input } from "@starmorph/sundial-exchange-api-typescript/models/components";

let value: Input = {
  type: "http",
  method: "PUT",
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `type`                                                                             | [components.Type](../../models/components/type.md)                                 | :heavy_check_mark:                                                                 | Request type                                                                       |
| `method`                                                                           | [components.Method](../../models/components/method.md)                             | :heavy_check_mark:                                                                 | HTTP method                                                                        |
| `bodyType`                                                                         | [components.BodyType](../../models/components/bodytype.md)                         | :heavy_minus_sign:                                                                 | Body content type (for POST/PUT/PATCH)                                             |
| `queryParams`                                                                      | Record<string, [components.QueryParams](../../models/components/queryparams.md)>   | :heavy_minus_sign:                                                                 | Query parameter definitions                                                        |
| `bodyFields`                                                                       | Record<string, [components.BodyFields](../../models/components/bodyfields.md)>     | :heavy_minus_sign:                                                                 | Body field definitions (for POST/PUT/PATCH)                                        |
| `headerFields`                                                                     | Record<string, [components.HeaderFields](../../models/components/headerfields.md)> | :heavy_minus_sign:                                                                 | Custom header field definitions                                                    |