# x402scan Integration Debugging

## The Problem

When using x402scan UI to pay for API access:
1. ✅ x402scan shows payment request correctly ($0.10 USDC on Base)
2. ✅ You approve the transaction
3. ✅ USDC balance changes (payment sent)
4. ❌ **You get another 402 response instead of the API data**

## Root Cause Analysis

Getting a 402 response after paying means one of these issues:

### 1. **Resource URL Mismatch** (Most Likely)

The x402 protocol requires the `resource` field in the payment to **exactly match** the resource being requested.

**Your submission:**
```
https://sundial.exchange/api/stats
```

**If there's a redirect or DNS difference:**
```
https://www.sundial.exchange/api/stats  ← Mismatch!
```

The payment is **valid for the exact URL you submitted**, but if there's any:
- www vs non-www redirect
- http vs https redirect
- trailing slash difference
- Query parameter changes

Then the verification will fail.

### 2. **x402scan Not Sending X-PAYMENT Header**

After completing the payment transaction, x402scan should send another request with the `X-PAYMENT` header containing the signed payment proof. If this header is missing or malformed, our middleware returns 402.

### 3. **Facilitator Verification Failing**

Even if the payment header is sent correctly, the facilitator (PayAI) might reject the verification if:
- Payment has expired (300 second timeout)
- Payment amount doesn't match exactly
- Network mismatch
- Signature invalid

## Diagnostic Steps

### Step 1: Check Vercel Logs

After you try to use the API through x402scan, check your Vercel deployment logs:

1. Go to https://vercel.com/dylanboudro/sundial-exchange
2. Click "Logs" or "Functions"
3. Look for `[x402]` log messages

**What to look for:**

```
[x402] No payment header found, returning 402
```
↑ This means x402scan didn't send the X-PAYMENT header

```
[x402] Payment header received: eyJ...
[x402] Verifying payment for resource: https://www.sundial.exchange/api/stats
[x402] Trying verification with base network...
[x402] base verification response (200): {"isValid":false,"invalidReason":"..."}
```
↑ This means the payment was sent but verification failed

### Step 2: Test with cURL (Manual Payment)

To isolate the issue, let's test manually:

```bash
# 1. Get the 402 challenge
curl -i https://sundial.exchange/api/stats

# Expected: 402 response with payment details
```

### Step 3: Check DNS Resolution

```bash
# Test if there are redirects
curl -I https://sundial.exchange/api/stats
curl -I https://www.sundial.exchange/api/stats

# Both should return the same status without redirects
```

### Step 4: Compare Resource URLs

Check your x402scan submission. If you submitted:
- `https://sundial.exchange/api/stats` (no www)

But Vercel logs show:
- `resource: https://www.sundial.exchange/api/stats` (with www)

Then that's the issue!

## Solutions

### Solution 1: Fix DNS/Redirect Configuration

Ensure that both `sundial.exchange` and `www.sundial.exchange` resolve to the same endpoint **without redirects**:

```typescript
// In your Vercel config or Next.js middleware
// Ensure no automatic www redirects
```

Check `vercel.json` or Vercel dashboard:
- Should have both domains configured
- Should NOT have redirect rules between them

### Solution 2: Normalize Resource URL in Middleware

Update middleware to always use a canonical URL:

```typescript
function create402Response(request: NextRequest): NextResponse {
    const url = new URL(request.url)
    
    // Normalize to always use www (or no www)
    const canonicalOrigin = "https://sundial.exchange"  // Choose one!
    const resource = `${canonicalOrigin}${url.pathname}${url.search}`
    
    // ... rest of code
}
```

**⚠️ Warning:** This must match what x402scan submits!

### Solution 3: Resubmit with Correct URL

If you submitted `https://sundial.exchange/api/stats` but the actual endpoint is `https://www.sundial.exchange/api/stats`, resubmit with the correct URL.

To find the correct URL:
```bash
curl -i https://sundial.exchange/api/stats 2>&1 | grep -i location

# If you see a Location header, that's a redirect
# Submit the final URL to x402scan
```

## Current Setup

Our middleware now includes debug logging that will show:

1. **Payment Header Status**
   ```
   [x402] Payment header received: ...
   ```

2. **Resource Being Verified**
   ```
   [x402] Verifying payment for resource: https://...
   ```

3. **Network Attempts**
   ```
   [x402] Trying verification with base network...
   [x402] base verification response (200): {...}
   ```

4. **Verification Result**
   ```
   [x402] Verification result: { isValid: true, network: 'base' }
   ```

5. **Settlement Result**
   ```
   [x402] Settlement result: { success: true, txHash: '0x...' }
   ```

## Next Actions

1. ✅ Deploy the updated middleware (with logging)
2. 📋 Try x402scan again
3. 📋 Check Vercel logs immediately after
4. 📋 Share the `[x402]` log output here
5. 🔧 Fix based on what the logs reveal

## Expected Working Flow

When everything works correctly, Vercel logs should show:

```
[x402] Payment header received: eyJhbG...
[x402] Verifying payment for resource: https://sundial.exchange/api/stats
[x402] Trying verification with base network...
[x402] base verification response (200): {"isValid":true}
[x402] Payment verified successfully on base!
[x402] Verification result: { isValid: true, network: 'base', invalidReason: null }
[x402] Settlement result: { success: true, txHash: '0xabc123...', error: null }
```

Then the API should return actual data!

## Common x402scan Issues

### Issue: "Invalid payment amount"
**Cause:** Price mismatch
**Fix:** Ensure `maxAmountRequired` is `"100000"` (0.10 USDC with 6 decimals)

### Issue: "Payment expired"
**Cause:** Took too long to pay
**Fix:** x402scan should handle this, but check `maxTimeoutSeconds: 300`

### Issue: "Resource mismatch"
**Cause:** URL doesn't match exactly
**Fix:** See Solution 2 or 3 above

### Issue: "Invalid network"
**Cause:** x402scan only supports Base (not Solana yet)
**Fix:** Our middleware tries Base first, this should work

## Remove Debug Logs (Later)

Once working, remove the `console.log` statements for production:

```bash
# Search for all debug logs
grep -n "console.log" middleware.ts

# Remove them manually or run:
sed -i '' '/console.log.*\[x402\]/d' middleware.ts
```

## Test Script

Here's a test script to validate locally:

```bash
#!/bin/bash

echo "Testing x402 implementation..."

# Test 1: Get 402 challenge
echo "\n1. Testing 402 challenge..."
RESPONSE=$(curl -s https://sundial.exchange/api/stats)
echo "$RESPONSE" | jq .

# Test 2: Check resource URL
echo "\n2. Resource URL from challenge:"
echo "$RESPONSE" | jq -r '.accepts[0].resource'

# Test 3: Check for redirects
echo "\n3. Checking for redirects..."
curl -I https://sundial.exchange/api/stats 2>&1 | grep -i "location\|HTTP"
curl -I https://www.sundial.exchange/api/stats 2>&1 | grep -i "location\|HTTP"

echo "\n✅ If no 'Location' headers above, DNS is correct!"
echo "✅ If resource URL matches your x402scan submission, you're good!"
```

---

**Deploy and test again!** The logs will tell us exactly what's happening. 🔍

