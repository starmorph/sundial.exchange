import { getSolanaDexProtocols } from "@/lib/data/defillama-volumes"
import type { Metadata } from "next"
import { JsonLd } from "../../jsonld"

type Params = { dexId: string }

export async function generateStaticParams(): Promise<Params[]> {
    const protocols = await getSolanaDexProtocols()
    return (protocols || [])
        .filter((p) => !!p.slug)
        .map((p) => ({ dexId: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { dexId } = await params
    const baseUrl = "https://sundial.exchange"

    // Format display name from slug (e.g., "raydium-amm" -> "Raydium AMM")
    const displayName = dexId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const title = `${displayName} Analytics | Solana DEX Volume & TVL Data`
    // Description must be 120-160 characters for Ahrefs
    const description = `Track ${displayName} on Solana with real-time 24h volume, 7d trends, TVL metrics, and historical charts. Compare market share across all Solana DEX protocols.`
    const url = `${baseUrl}/dex-analytics/${dexId}`

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            siteName: "Sundial Exchange",
            type: "article",
            images: [
                {
                    url: `/dex-analytics/${dexId}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: `${displayName} Analytics on Sundial Exchange`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`/dex-analytics/${dexId}/opengraph-image`],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true },
        },
        keywords: [
            `${dexId} analytics`,
            `${dexId} volume solana`,
            `${dexId} tvl`,
            `${dexId} 24h volume`,
            `${displayName.toLowerCase()} dex analytics`,
            "solana dex protocol analytics",
            "solana defi dex metrics",
        ],
    }
}

export default function DexIdLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd />
            {children}
        </>
    )
}


