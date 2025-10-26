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
const FACILITATOR_BASE_URL = "https://x402.org/facilitator"

interface SettlementResponse {
    success: boolean
    error: string | null
    txHash: string | null
    networkId: string | null
}

interface VerificationResponse {
    isValid: boolean
    invalidReason: string | null
}

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

function getOutputSchema(pathname: string) {
    // Return proper output schema based on endpoint for better API discovery
    const schemas: Record<string, object> = {
        "/api/stats": {
            type: "object",
            properties: {
                tps: { type: ["number", "null"], description: "Transactions per second" },
                solPriceUsd: { type: ["number", "null"], description: "SOL price in USD" },
                tvlUsd: { type: ["number", "null"], description: "Total value locked in USD" },
                volume24hUsd: { type: ["number", "null"], description: "24h volume in USD" },
                solChange24hPct: { type: ["number", "null"], description: "24h SOL price change %" },
                tvlChange24hPct: { type: ["number", "null"], description: "24h TVL change %" },
                volume24hChangePct: { type: ["number", "null"], description: "24h volume change %" },
            },
        },
        "/api/trending": {
            type: "array",
            items: {
                type: "object",
                properties: {
                    symbol: { type: "string" },
                    currentPrice: { type: "number" },
                    change24h: { type: "number" },
                    prices: { type: "array" },
                },
            },
        },
        "/api/dex/overview": {
            type: "object",
            properties: {
                protocols: { type: "array" },
                volumes: { type: "array" },
            },
        },
    }

    return (
        schemas[pathname] || {
            type: "object",
            description: "API response data",
        }
    )
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
                description: `Access ${url.pathname} - Sundial Exchange API`,
                mimeType: "application/json",
                payTo: RECIPIENT_ADDRESS,
                maxTimeoutSeconds: 300,
                asset: USDC_BASE,
                outputSchema: getOutputSchema(url.pathname),
                extra: {
                    name: "USD Coin",
                    version: "2",
                },
            },
        ],
    }

    return NextResponse.json(challenge, { status: 402 })
}

async function verifyPayment(
    paymentHeader: string,
    request: NextRequest,
): Promise<VerificationResponse> {
    try {
        const url = new URL(request.url)
        const resource = `${url.origin}${url.pathname}${url.search}`

        const verifyResponse = await fetch(`${FACILITATOR_BASE_URL}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                x402Version: 1,
                paymentHeader,
                paymentRequirements: {
                    scheme: "exact",
                    network: "base",
                    maxAmountRequired: (PRICE_USD_CENTS * 10000).toString(),
                    resource,
                    description: `Access ${url.pathname} - Sundial Exchange API`,
                    mimeType: "application/json",
                    payTo: RECIPIENT_ADDRESS,
                    maxTimeoutSeconds: 300,
                    asset: USDC_BASE,
                    extra: {
                        name: "USD Coin",
                        version: "2",
                    },
                },
            }),
        })

        if (!verifyResponse.ok) {
            return { isValid: false, invalidReason: "Verification request failed" }
        }

        const result = (await verifyResponse.json()) as VerificationResponse
        return result
    } catch (error) {
        return {
            isValid: false,
            invalidReason: error instanceof Error ? error.message : "Unknown error",
        }
    }
}

async function settlePayment(
    paymentHeader: string,
    request: NextRequest,
): Promise<SettlementResponse> {
    try {
        const url = new URL(request.url)
        const resource = `${url.origin}${url.pathname}${url.search}`

        const settleResponse = await fetch(`${FACILITATOR_BASE_URL}/settle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                x402Version: 1,
                paymentHeader,
                paymentRequirements: {
                    scheme: "exact",
                    network: "base",
                    maxAmountRequired: (PRICE_USD_CENTS * 10000).toString(),
                    resource,
                    description: `Access ${url.pathname} - Sundial Exchange API`,
                    mimeType: "application/json",
                    payTo: RECIPIENT_ADDRESS,
                    maxTimeoutSeconds: 300,
                    asset: USDC_BASE,
                    extra: {
                        name: "USD Coin",
                        version: "2",
                    },
                },
            }),
        })

        if (!settleResponse.ok) {
            return {
                success: false,
                error: "Settlement request failed",
                txHash: null,
                networkId: null,
            }
        }

        const result = (await settleResponse.json()) as SettlementResponse
        return result
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            txHash: null,
            networkId: null,
        }
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
        // Verify payment with facilitator
        const verification = await verifyPayment(paymentHeader, request)

        if (verification.isValid) {
            // Settle payment and get transaction details
            const settlement = await settlePayment(paymentHeader, request)

            // Continue to the API route
            const response = NextResponse.next()

            // Add X-PAYMENT-RESPONSE header with settlement details (base64 encoded JSON)
            if (settlement.success && settlement.txHash) {
                const paymentResponse = {
                    success: true,
                    txHash: settlement.txHash,
                    networkId: settlement.networkId || "base",
                    timestamp: new Date().toISOString(),
                }
                response.headers.set("X-PAYMENT-RESPONSE", btoa(JSON.stringify(paymentResponse)))
            }

            return response
        }
    }

    // Return 402 Payment Required
    return create402Response(request)
}

export const config = {
    matcher: "/api/:path*",
}

