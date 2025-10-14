import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://sundial.exchange"

    return [
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
            url: `${baseUrl}/tokens`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.8,
        },
    ]
}

