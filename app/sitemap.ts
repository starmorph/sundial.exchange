import { getSolanaDexProtocols } from "@/lib/data/defillama-volumes"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://sundial.exchange"

    const staticEntries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/swap`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/chat`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.85,
        },
        {
            url: `${baseUrl}/dex-analytics`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.85,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
    ]

    try {
        const protocols = await getSolanaDexProtocols()
        const dynamicEntries: MetadataRoute.Sitemap = (protocols || [])
            .filter((p) => !!p.slug)
            .map((p) => ({
                url: `${baseUrl}/dex-analytics/${p.slug}`,
                lastModified: new Date(),
                changeFrequency: "hourly",
                priority: 0.7,
            }))

        return [...staticEntries, ...dynamicEntries]
    } catch {
        // If fetching fails, return static entries so sitemap still works
        return staticEntries
    }
}

