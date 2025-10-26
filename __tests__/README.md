# x402 Middleware Test Suite

Comprehensive test suite for the x402 payment gateway middleware.

## Running Tests

```bash
# Install dependencies first
pnpm install

# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## Test Coverage

### Unit Tests (`middleware.test.ts`)

Tests individual middleware functions and behaviors:

- ✅ **Origin Exemption** (7 tests)
  - Localhost exemption
  - Production domain exemption (sundial.exchange, www.sundial.exchange)
  - Referer header handling
  - External origin rejection

- ✅ **402 Response Generation** (5 tests)
  - Status code validation
  - x402 challenge structure
  - Output schema generation
  - Resource URL handling

- ✅ **Payment Verification** (4 tests)
  - Facilitator API integration
  - Valid/invalid payment handling
  - Error recovery

- ✅ **X-PAYMENT-RESPONSE Header** (2 tests)
  - Header generation on success
  - Header omission on failure

- ✅ **Payment Requirements** (4 tests)
  - USDC amount validation ($0.10)
  - Contract address verification
  - Timeout settings
  - Extra metadata

- ✅ **Multi-Endpoint Coverage** (10 tests)
  - All 5 API endpoints protected
  - Consistent behavior across endpoints

**Total: 32 unit tests**

### Integration Tests (`payment-flow.test.ts`)

Tests complete end-to-end payment flows:

- ✅ **Complete Payment Flow** (3 tests)
  - Full lifecycle: 402 → payment → verification → settlement → 200
  - Invalid payment rejection
  - Facilitator timeout handling

- ✅ **Facilitator API Integration** (2 tests)
  - Verification request format
  - Settlement request format

- ✅ **Error Recovery** (4 tests)
  - Network errors
  - HTTP 500 errors
  - Malformed responses
  - Partial failures (verification OK, settlement fails)

- ✅ **Concurrent Requests** (1 test)
  - Multiple parallel payment requests

- ✅ **Payment Amounts** (1 test)
  - Consistent pricing across endpoints

**Total: 11 integration tests**

## Test Architecture

### Mocking Strategy

- **Global fetch**: Mocked to simulate facilitator API responses
- **Environment variables**: Set in `jest.setup.js`
- **Base64 encoding**: Mocked `btoa`/`atob` for Node.js compatibility

### Key Test Scenarios

1. **Happy Path**: Request → 402 → Payment → Verification → Settlement → Success
2. **Exemption**: Internal requests bypass payment
3. **Invalid Payment**: Wrong signature/amount/network
4. **Facilitator Errors**: Network issues, timeouts, malformed responses
5. **Edge Cases**: Concurrent requests, partial failures

## Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## What's Tested

✅ Origin exemption logic  
✅ 402 response generation  
✅ Payment verification with facilitator  
✅ Settlement tracking  
✅ X-PAYMENT-RESPONSE header generation  
✅ Error handling and recovery  
✅ All API endpoints  
✅ Concurrent request handling  
✅ Payment amount consistency  

## What's NOT Tested (Out of Scope)

❌ Actual blockchain transactions (use testnet for this)  
❌ Real facilitator API (mocked for speed)  
❌ Next.js routing logic  
❌ API route implementations  

## Adding New Tests

When adding new features:

1. Add unit tests to `middleware.test.ts` for isolated functionality
2. Add integration tests to `payment-flow.test.ts` for end-to-end flows
3. Update this README with test count and coverage
4. Ensure tests are deterministic (no flaky tests!)

## Continuous Integration

These tests should run on:
- Every commit (pre-commit hook)
- Every pull request
- Before deployment to production

## Debugging Tests

```bash
# Run a specific test file
pnpm test middleware.test.ts

# Run tests matching a pattern
pnpm test --testNamePattern="Origin Exemption"

# Run with verbose output
pnpm test --verbose

# Run a single test
pnpm test -t "should bypass payment for localhost origin"
```

## Test Performance

- **Unit tests**: ~50ms total
- **Integration tests**: ~100ms total
- **Full suite**: ~150ms (very fast! 🚀)

Fast tests = happy developers ✨

