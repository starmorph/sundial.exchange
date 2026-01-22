import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "AI Crypto Analytics Chat | Ask About Solana DEX Data",
    description:
        "Chat with AI to get real-time Solana DEX analytics. Ask about Raydium TVL, Meteora volume, trending tokens. Micropaid queries via x402 protocol.",
    keywords: [
        'ai crypto analytics chat',
        'ai agent crypto data',
        'ask ai about solana',
        'crypto trading ai assistant',
        'x402 ai queries',
        'solana defi ai',
    ],
    alternates: { canonical: '/chat' },
    openGraph: {
        title: 'AI Crypto Analytics Chat | Sundial Exchange',
        description: 'Chat with AI for real-time Solana DEX analytics. Micropaid queries via x402.',
        url: 'https://sundial.exchange/chat',
    },
}

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
