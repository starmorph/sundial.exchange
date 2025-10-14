# Sundial Exchange

A fast, secure, and user-friendly decentralized exchange (DEX) built on Solana with the best swap rates and lowest fees.

## Features

- **Fast Trading**: Built on Solana for lightning-fast transaction speeds
- **Best Rates**: Integrated with Jupiter for optimal swap routing
- **Low Fees**: Minimal transaction costs thanks to Solana's efficient blockchain
- **User-Friendly**: Modern, intuitive interface for seamless trading experience
- **Secure**: Non-custodial wallet integration for maximum security

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Package Manager**: pnpm
- **UI Components**: Radix UI / shadcn/ui
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Wallet Adapter
- **Swap Aggregator**: Jupiter Ultra
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## SEO Optimization

This project includes comprehensive SEO optimization:

- **Metadata**: Complete Open Graph and Twitter Card metadata
- **Sitemap**: Dynamic sitemap generation (`/sitemap.xml`)
- **Robots.txt**: Search engine crawler instructions
- **Manifest**: PWA manifest for mobile optimization
- **Structured Data**: JSON-LD schema for rich search results
- **Dynamic OG Images**: Automatically generated Open Graph images
- **Semantic HTML**: Proper heading hierarchy and ARIA labels

### SEO Configuration

Update the following files with your actual values:

1. **`app/layout.tsx`**: Update `metadataBase` URL and verification codes
2. **`app/sitemap.ts`**: Add additional pages as your app grows
3. **`public/manifest.json`**: Customize theme colors and icons
4. **Twitter Handle**: Update `@sundialexchange` in metadata

### Icons & Images Needed

Place the following files in the `/public` directory:

- `favicon.ico` - Browser favicon
- `icon.svg` - Vector icon
- `apple-touch-icon.png` - 180x180 Apple touch icon
- `icon-192.png` - 192x192 PWA icon
- `icon-512.png` - 512x512 PWA icon

## Project Structure

```
sundial.exchange/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── opengraph-image.tsx # OG image generator
│   └── jsonld.tsx          # Structured data
├── components/
│   ├── navbar.tsx
│   ├── swap-interface.tsx
│   ├── stats-bar.tsx
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── jupiter-ultra.ts    # Jupiter swap integration
│   ├── solana-tokens.ts    # Token definitions
│   └── utils.ts            # Utility functions
└── public/
    ├── robots.txt          # Crawler instructions
    └── manifest.json       # PWA manifest
```

## Development

### Code Style

- Follow Next.js 15 best practices
- Use TypeScript strict mode
- Prefer server components by default
- Use `cn()` utility for className merging
- Keep components modular and reusable

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Deployment

This project is optimized for deployment on Vercel:

```bash
pnpm build
```

The application will automatically generate:
- Optimized production build
- Dynamic sitemap
- Open Graph images
- Service worker (if PWA enabled)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ on Solana

