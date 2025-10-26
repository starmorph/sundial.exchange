# Changelog

All notable changes to the Sundial Exchange API will be documented in this file.

## [1.1.0] - 2025-10-26

### Added
- **x402scan.com compatibility**: Updated all 402 responses to include stricter `outputSchema` format
  - `outputSchema.input` now includes HTTP method, queryParams, bodyFields, and headerFields
  - `outputSchema.output` now properly describes response structure
  - Enables x402scan to present UI for invoking resources from within their app
- Added comprehensive field definitions for all endpoints:
  - `/api/stats` - GET with full response schema
  - `/api/trending` - GET with queryParams (hours parameter)
  - `/api/dex/overview` - GET with protocol and volume schemas
  - `/api/dex/protocol/{slug}` - GET with dynamic route support
  - `/api/swap-log` - POST with bodyFields schema
- Updated OpenAPI spec with detailed x402scan-compatible schema documentation

### Changed
- Enhanced `X402PaymentMethod` schema with detailed input/output definitions
- Improved OpenAPI examples to show complete x402scan-compatible 402 responses
- Updated middleware to generate x402scan-compatible schemas for all endpoints

### Technical
- All 46 tests passing with new schema format
- Middleware now passes HTTP method to `getOutputSchema()` function
- Dynamic route handling for `/api/dex/protocol/{slug}` endpoints

## [1.0.3] - 2025-10-26

### Changed
- Added disclaimer about API being in beta with potential data inaccuracies
- Updated OpenAPI description with clearer feature overview
- Normalized whitespace in OpenAPI YAML

## [1.0.0] - 2025-10-26

### Added
- Initial release with x402 payment gateway
- Dual network support (Base + Solana)
- 5 API endpoints for Solana DEX analytics:
  - `GET /api/stats` - Real-time Solana statistics
  - `GET /api/trending` - Trending tokens
  - `GET /api/dex/overview` - All DEX protocols overview
  - `GET /api/dex/protocol/{slug}` - Specific DEX protocol data
  - `POST /api/swap-log` - Swap event logging
- PayAI facilitator integration
- Frontend exemptions for sundial.exchange origins
- Comprehensive test suite (46 tests)
- Complete OpenAPI 3.1 specification

### Features
- $0.10 USDC per request pricing
- Zero gas fees (covered by PayAI)
- Real-time data from DeFiLlama and Helius
- Type-safe responses
- AI agent-friendly
- Production-ready middleware

---

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

## Links

- [OpenAPI Specification](./openapi.yaml)
- [x402scan Submission Guide](./docs/x402scan-submission.md)
- [API Documentation](https://sundial.exchange)
- [GitHub Repository](https://github.com/dylanboudro/sundial.exchange)

