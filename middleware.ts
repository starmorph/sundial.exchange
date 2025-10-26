import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { paymentMiddleware } from "x402-next"

const EXEMPT_ORIGINS = [
    "http://localhost:3000",
    "https://sundial.exchange",
    "https://www.sundial.exchange",
]

function isExemptOrigin(request: NextRequest): boolean {
    const origin = request.headers.get("origin")
    const referer = request.headers.get("referer")

    // Check origin header (for CORS requests)
    if (origin && EXEMPT_ORIGINS.includes(origin)) {
        return true
    }

    // Check referer header (for same-origin requests)
    if (referer) {
        const refererUrl = new URL(referer)
        const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`
        if (EXEMPT_ORIGINS.includes(refererOrigin)) {
            return true
        }
    }

    return false
}

const x402Middleware = paymentMiddleware(
    (process.env.X402_RECIPIENT_ADDRESS || "0xde7ae42f066940c50efeed40fd71dde630148c0a") as `0x${string}`,
    {
        "GET /api/dex/overview": {
            price: "$0.10",
            network: "base",
        },
        "GET /api/dex/protocol/*": {
            price: "$0.10",
            network: "base",
        },
        "GET /api/stats": {
            price: "$0.10",
            network: "base",
        },
        "GET /api/trending": {
            price: "$0.10",
            network: "base",
        },
        "POST /api/swap-log": {
            price: "$0.10",
            network: "base",
        },
    },
    {
        url: "https://x402.org/facilitator",
    },
)

export async function middleware(request: NextRequest) {
    // Exempt our own frontend
    if (isExemptOrigin(request)) {
        return NextResponse.next()
    }

    // Apply x402 payment requirement for external requests
    return x402Middleware(request)
}

export const config = {
    matcher: "/api/:path*",
}

