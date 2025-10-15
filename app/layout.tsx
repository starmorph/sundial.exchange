import { SolanaWalletProvider } from "@/components/wallet-provider"
import { Analytics } from "@vercel/analytics/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"
import { JsonLd } from "./jsonld"


export const metadata: Metadata = {
  metadataBase: new URL("https://sundial.exchange"),
  title: {
    default: "Sundial Exchange - Solana DEX | Fast, Secure Decentralized Trading",
    template: "%s | Sundial Exchange",
  },
  description:
    "Trade Solana tokens instantly on Sundial Exchange. A fast, secure, and user-friendly decentralized exchange (DEX) built on Solana with the best swap rates and lowest fees.",
  keywords: [
    "Solana DEX",
    "decentralized exchange",
    "Solana trading",
    "crypto swap",
    "SPL tokens",
    "DeFi",
    "blockchain",
    "cryptocurrency exchange",
    "Solana DeFi",
    "token swap",
    "Sundial Exchange",
  ],
  authors: [{ name: "Sundial Exchange" }],
  creator: "Sundial Exchange",
  publisher: "Sundial Exchange",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sundial.exchange",
    title: "Sundial Exchange – Solana DEX | Best Rates, Low Fees",
    description:
      "Instant, secure token swaps on Solana with optimal routing, low fees, and a streamlined trading experience.",
    siteName: "Sundial Exchange",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sundial Exchange – Solana DEX | Best Rates, Low Fees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sundial Exchange – Solana DEX | Best Rates, Low Fees",
    description:
      "Instant, secure token swaps on Solana with optimal routing, low fees, and a streamlined trading experience.",
    images: ["/opengraph-image"],
    creator: "@sundialexchange",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
  },
  category: "finance",
  alternates: {
    canonical: "https://sundial.exchange",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SolanaWalletProvider>{children}</SolanaWalletProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
