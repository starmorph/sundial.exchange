# 🔍 Debug Deployment - Find the Mismatch

## What We're Checking

The facilitator is returning `400: Invalid request`. This usually means one of these fields doesn't match:

1. **`authorization.to`** must match our **`paymentRequirements.payTo`**
2. **`authorization.value`** must match our **`paymentRequirements.maxAmountRequired`**
3. **`authorization.asset`** (implied) must match our **`paymentRequirements.asset`**

## New Logging

I added detailed logging to check:
- Full payment proof payload
- Authorization 'to' address vs our 'payTo'
- Authorization 'value' vs our 'maxAmountRequired'

## Deploy

```bash
git add middleware.ts
git commit -m "Add debug logging for payment proof"
git push
```

## Test Again

After deployment, try x402scan again. The logs will show:

```
[x402] Payment proof network: base
[x402] Payment proof scheme: exact
[x402] Payment proof payload: {"authorization":{...full object...},"signature":"0x..."}
[x402] Authorization 'to' address: 0x...
[x402] Our 'payTo' address: 0x...
[x402] Match: true/false  ← KEY!
[x402] Authorization value: 100000
[x402] Our maxAmountRequired: 100000
```

## What to Look For

If **Match: false** → The addresses don't match! x402scan might be registering a different recipient.

If **Authorization value ≠ maxAmountRequired** → The price doesn't match!

**Share those logs and we'll know exactly what's wrong!** 🔍

