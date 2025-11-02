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
    const title = `${dexId} Analytics on Solana | Sundial`
    const description = `View ${dexId} DEX analytics on Solana: volume history, market share and chain breakdown.`
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
                    url: "/opengraph-image.png",
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/opengraph-image.png"],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true },
        },
        keywords: [
            `${dexId} analytics`,
            `${dexId} volume solana`,
            `${dexId} market share solana`,
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


