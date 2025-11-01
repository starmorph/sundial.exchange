# X402Challenge

x402 payment challenge containing payment requirements.
The challenge includes options for both Base and Solana networks.
Clients can choose which network to use for payment.


## Example Usage

```typescript
import { X402Challenge } from "@starmorph/sundial-exchange-api-typescript/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `x402Version`                                                                  | [errors.X402Version](../../models/errors/x402version.md)                       | :heavy_check_mark:                                                             | Version of x402 protocol                                                       |                                                                                |
| `error`                                                                        | *string*                                                                       | :heavy_check_mark:                                                             | Error message indicating payment is required                                   | X-PAYMENT header is required                                                   |
| `accepts`                                                                      | [components.X402PaymentMethod](../../models/components/x402paymentmethod.md)[] | :heavy_check_mark:                                                             | Array of accepted payment methods (Base and Solana)                            |                                                                                |