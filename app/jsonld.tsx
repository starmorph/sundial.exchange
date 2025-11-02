/**
 * JSON-LD structured data for enhanced SEO
 */
export function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Sundial Exchange",
        description:
            "Fast, secure decentralized exchange built on Solana blockchain for trading SPL tokens",
        url: "https://sundial.exchange",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },

        provider: {
            "@type": "Organization",
            name: "Sundial Exchange",
            url: "https://sundial.exchange",
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

