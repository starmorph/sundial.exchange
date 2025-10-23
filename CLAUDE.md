# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
pnpm dev          # Start development server on http://localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
```

## Project Architecture

### Core Structure
This is a **Next.js 15** Solana DEX (decentralized exchange) built with TypeScript. The application uses:

- **App Router** with React Server Components by default
- **Tailwind CSS** with shadcn/ui component library
- **Solana Web3.js** for blockchain interactions
- **Jupiter Ultra API** for swap routing and execution
- **Radix UI** primitives for accessible components

### Key Integration: Jupiter Ultra
The core swap functionality integrates with Jupiter Ultra API (`lib/jupiter-ultra.ts:1`):
- `getJupiterOrder()` - Get swap quotes and transaction data
- `executeJupiterOrder()` - Execute signed transactions
- `getHoldings()` - Fetch user token balances

### State Management
- Uses React hooks for local component state
- Solana Wallet Adapter for wallet connection state
- No global state management library (Redux/Zustand)

### Component Architecture
- **Main Components**: `components/swap-interface.tsx` (core trading UI), `components/swap-card.tsx` (individual swap form), `components/navbar.tsx`
- **UI Components**: Located in `components/ui/` - shadcn/ui components with Radix UI primitives
- **Layout**: App-level layout in `app/layout.tsx:1` with wallet provider, analytics, and global metadata

### Data Fetching Patterns
- Token data from `lib/solana-tokens.ts:1` (static token definitions)
- External APIs: DeFiLlama for analytics (`lib/defillama*.ts`), Helius for RPC (`lib/helius.ts:1`)
- Client-side fetching with native `fetch()` API

### Routing & Pages
- `/` - Main swap interface
- `/dex-analytics` - DEX analytics dashboard
- `/live` - Live trading data
- `/stablecoins` - Stablecoin analytics
- Static pages: `/terms-of-service`, `/privacy-policy`

## Development Guidelines

### TypeScript Configuration
- Strict mode enabled with path mapping (`@/*` → root)
- Target ES6 with Next.js plugin for App Router support

### Next.js Configuration
- ESLint and TypeScript errors ignored during builds (configured for rapid development)
- Security headers configured for production
- Image optimization disabled for broader hosting compatibility

### Styling Approach
- Tailwind CSS with custom configuration
- Component styling via `cn()` utility from `lib/utils.ts:1`
- Dark/light theme support via `next-themes`

### Environment Variables
Required for full functionality:
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_ULTRA_REFERRAL_ACCOUNT=
NEXT_PUBLIC_ULTRA_REFERRAL_FEE_BPS=50
```

## API Integration Notes

### Jupiter Ultra API
- Base URL: `https://lite-api.jup.ag/ultra/v1`
- Handles swap routing, quotes, and execution
- Includes referral fee system for revenue sharing

### Analytics & Tracking
- Vercel Analytics for performance monitoring
- Google Analytics integration
- Custom event tracking for swap actions

### SEO & Metadata
- Comprehensive OpenGraph and Twitter Card metadata in `app/layout.tsx:15`
- Dynamic sitemap generation
- Structured data with JSON-LD schema