/**
 * JSON-LD structured data for enhanced SEO
 */

// Organization schema for brand recognition
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sundial Exchange",
    url: "https://sundial.exchange",
    logo: "https://sundial.exchange/logo.png",
    sameAs: ["https://twitter.com/sundialexchange"],
    description: "Solana DEX with micropaid AI analytics and real-time trading data via x402 protocol",
}

// WebApplication schema for the main app
const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Sundial Exchange",
    description:
        "Pay-per-query Solana DEX analytics via x402 micropayments. AI agent-ready API for real-time volume, TVL, and trading data.",
    url: "https://sundial.exchange",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free to use, pay-per-query for premium analytics",
    },
    featureList: [
        "x402 micropaid analytics",
        "AI-powered crypto chat",
        "Real-time DEX volume tracking",
        "Jupiter Ultra integration",
        "Non-custodial token swaps",
    ],
    provider: {
        "@type": "Organization",
        name: "Sundial Exchange",
        url: "https://sundial.exchange",
    },
}

// FinancialService schema for DEX functionality
const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Sundial Exchange",
    description: "Decentralized exchange for Solana token trading with x402 micropaid analytics",
    url: "https://sundial.exchange",
    areaServed: "Worldwide",
    serviceType: "Cryptocurrency Exchange",
    provider: {
        "@type": "Organization",
        name: "Sundial Exchange",
    },
}

// SoftwareApplication schema for the API
const apiSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sundial Exchange API",
    description: "x402-enabled API for Solana DEX analytics. Pay-per-query access to volume, TVL, and trading data.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: "https://sundial.exchange/api-reference",
    offers: {
        "@type": "Offer",
        price: "0.001",
        priceCurrency: "USD",
        description: "Pay-per-query pricing starting at $0.001",
    },
}

export function JsonLd() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(apiSchema) }}
            />
        </>
    )
}

// FAQ Schema component for homepage
export function FaqJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
    )
}

// Breadcrumb schema component
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `https://sundial.exchange${item.url}`,
        })),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
    )
}
