import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const EXEMPT_ORIGINS = [
    "http://localhost:3000",
    "https://sundial.exchange",
    "https://www.sundial.exchange",
]

const RECIPIENT_ADDRESS = process.env.X402_RECIPIENT_ADDRESS || "0xde7ae42f066940c50efeed40fd71dde630148c0a"
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
const PRICE_USD_CENTS = 10

function isExemptOrigin(request: NextRequest): boolean {
    const origin = request.headers.get("origin")
    const referer = request.headers.get("referer")

    if (origin && EXEMPT_ORIGINS.includes(origin)) {
        return true
    }

    if (referer) {
        try {
            const refererUrl = new URL(referer)
            const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`
            if (EXEMPT_ORIGINS.includes(refererOrigin)) {
                return true
            }
        } catch {
            // Invalid referer URL, ignore
        }
    }

    return false
}

function create402Response(request: NextRequest): NextResponse {
    const url = new URL(request.url)
    const resource = `${url.origin}${url.pathname}${url.search}`

    const challenge = {
        x402Version: 1,
        error: "X-PAYMENT header is required",
        accepts: [
            {
                scheme: "exact",
                network: "base",
                maxAmountRequired: (PRICE_USD_CENTS * 10000).toString(), // USDC has 6 decimals
                resource,
                description: "",
                mimeType: "application/json",
                payTo: RECIPIENT_ADDRESS,
                maxTimeoutSeconds: 300,
                asset: USDC_BASE,
                outputSchema: {
                    input: {
                        type: "http",
                        method: request.method,
                        discoverable: true,
                    },
                },
                extra: {
                    name: "USD Coin",
                    version: "2",
                },
            },
        ],
    }

    return NextResponse.json(challenge, { status: 402 })
}

async function verifyPayment(paymentHeader: string): Promise<boolean> {
    // In production, verify the payment with facilitator
    // For now, we'll accept the payment header presence as valid
    // You should integrate with https://x402.org/facilitator for real verification
    try {
        const facilitatorUrl = "https://x402.org/facilitator/verify"
        const response = await fetch(facilitatorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                payment: paymentHeader,
                expected: {
                    network: "base",
                    maxAmountRequired: (PRICE_USD_CENTS * 10000).toString(),
                    payTo: RECIPIENT_ADDRESS,
                    asset: USDC_BASE,
                },
            }),
        })
        return response.ok
    } catch {
        return false
    }
}

export async function middleware(request: NextRequest) {
    // Exempt our own frontend
    if (isExemptOrigin(request)) {
        return NextResponse.next()
    }

    // Check for payment header
    const paymentHeader = request.headers.get("x-payment")
    if (paymentHeader) {
        const isValid = await verifyPayment(paymentHeader)
        if (isValid) {
            return NextResponse.next()
        }
    }

    // Return 402 Payment Required
    return create402Response(request)
}

export const config = {
    matcher: "/api/:path*",
}

