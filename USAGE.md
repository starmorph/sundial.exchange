<!-- Start SDK Example Usage [usage] -->
```typescript
import { SundialExchangeApi } from "@starmorph/sundial-exchange-api-typescript";

const sundialExchangeApi = new SundialExchangeApi();

async function run() {
  const result = await sundialExchangeApi.dex.getDexOverview();

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->