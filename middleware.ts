import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const EXEMPT_ORIGINS = [
    "http://localhost:3000",
    "https://sundial.exchange",
    "https://www.sundial.exchange",
]

const RECIPIENT_ADDRESS = process.env.X402_RECIPIENT_ADDRESS || "0xde7ae42f066940c50efeed40fd71dde630148c0a"
const RECIPIENT_ADDRESS_SOLANA = process.env.X402_RECIPIENT_ADDRESS_SOLANA || "Aia9ukbSndCSrTnv8geoSjeJcY6Q5GvdsMSo1busrr5K"
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
const USDC_SOLANA = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
const PRICE_USD_CENTS = 10
const FACILITATOR_BASE_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network"

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

function getOutputSchema(pathname: string, method: string) {
    // Return proper output schema based on endpoint for x402scan compatibility
    const schemas: Record<string, any> = {
        "/api/stats": {
            input: {
                type: "http",
                method: "GET",
            },
            output: {
                type: "object",
                properties: {
                    tps: { type: "number", description: "Transactions per second" },
                    solPriceUsd: { type: "number", description: "SOL price in USD" },
                    tvlUsd: { type: "number", description: "Total value locked in USD" },
                    volume24hUsd: { type: "number", description: "24h volume in USD" },
                    solChange24hPct: { type: "number", description: "24h SOL price change %" },
                    tvlChange24hPct: { type: "number", description: "24h TVL change %" },
                    volume24hChangePct: { type: "number", description: "24h volume change %" },
                },
            },
        },
        "/api/trending": {
            input: {
                type: "http",
                method: "GET",
                queryParams: {
                    hours: {
                        type: "number",
                        required: false,
                        description: "Number of hours to look back (default: 24)",
                    },
                },
            },
            output: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        symbol: { type: "string", description: "Token symbol" },
                        currentPrice: { type: "number", description: "Current price in USD" },
                        change24h: { type: "number", description: "24h price change percentage" },
                        prices: {
                            type: "array",
                            description: "Historical price data points",
                            items: {
                                type: "object",
                                properties: {
                                    timestamp: { type: "number" },
                                    price: { type: "number" },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/dex/overview": {
            input: {
                type: "http",
                method: "GET",
            },
            output: {
                type: "object",
                properties: {
                    protocols: {
                        type: "array",
                        description: "DEX protocol summaries",
                    },
                    volumes: {
                        type: "array",
                        description: "Aggregated volume timeline",
                    },
                },
            },
        },
        "/api/dex/protocol": {
            input: {
                type: "http",
                method: "GET",
            },
            output: {
                type: "object",
                properties: {
                    summary: {
                        type: "object",
                        description: "Protocol summary statistics",
                    },
                    volumes: {
                        type: "array",
                        description: "Historical volume data",
                    },
                },
            },
        },
        "/api/swap-log": {
            input: {
                type: "http",
                method: "POST",
                bodyType: "json",
                bodyFields: {
                    event: {
                        type: "object",
                        required: true,
                        description: "Swap event payload",
                    },
                },
            },
            output: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                },
            },
        },
    }

    // Match endpoint (handle dynamic routes like /api/dex/protocol/{slug})
    let schema = schemas[pathname]
    if (!schema && pathname.startsWith("/api/dex/protocol/")) {
        schema = schemas["/api/dex/protocol"]
    }

    return (
        schema || {
            input: {
                type: "http",
                method: method as any,
            },
            output: {
                type: "object",
                description: "API response data",
            },
        }
    )
}

function create402Response(request: NextRequest): NextResponse {
    const url = new URL(request.url)
    const resource = `${url.origin}${url.pathname}${url.search}`
    const method = request.method

    const challenge = {
        x402Version: 1,
        error: "X-PAYMENT header is required",
        accepts: [
            // Base payment option
            {
                scheme: "exact",
                network: "base",
                maxAmountRequired: (PRICE_USD_CENTS * 10000).toString(), // USDC has 6 decimals
                resource,
                description: `Access ${url.pathname} - Sundial Exchange API (Base)`,
                mimeType: "application/json",
                payTo: RECIPIENT_ADDRESS,
                maxTimeoutSeconds: 300,
                asset: USDC_BASE,
                outputSchema: getOutputSchema(url.pathname, method),
                extra: {
                    name: "USD Coin",
                    version: "2",
                },
            },
            // Solana payment option
            {
                scheme: "exact",
                network: "solana",
                maxAmountRequired: (PRICE_USD_CENTS * 10000).toString(), // USDC has 6 decimals
                resource,
                description: `Access ${url.pathname} - Sundial Exchange API (Solana)`,
                mimeType: "application/json",
                payTo: RECIPIENT_ADDRESS_SOLANA,
                maxTimeoutSeconds: 300,
                asset: USDC_SOLANA,
                outputSchema: getOutputSchema(url.pathname, method),
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
): Promise<VerificationResponse & { network?: string }> {
    const url = new URL(request.url)
    const resource = `${url.origin}${url.pathname}${url.search}`

    // Try Base network first
    const networks = [
        { network: "base", payTo: RECIPIENT_ADDRESS, asset: USDC_BASE },
        { network: "solana", payTo: RECIPIENT_ADDRESS_SOLANA, asset: USDC_SOLANA },
    ]

    for (const { network, payTo, asset } of networks) {
        try {
            const verifyResponse = await fetch(`${FACILITATOR_BASE_URL}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    x402Version: 1,
                    paymentHeader,
                    paymentRequirements: {
                        scheme: "exact",
                        network,
                        maxAmountRequired: (PRICE_USD_CENTS * 10000).toString(),
                        resource,
                        description: `Access ${url.pathname} - Sundial Exchange API`,
                        mimeType: "application/json",
                        payTo,
                        maxTimeoutSeconds: 300,
                        asset,
                        extra: {
                            name: "USD Coin",
                            version: "2",
                        },
                    },
                }),
            })

            if (verifyResponse.ok) {
                const result = (await verifyResponse.json()) as VerificationResponse
                if (result.isValid) {
                    return { ...result, network }
                }
            }
        } catch (error) {
            // Continue to next network
            continue
        }
    }

    return {
        isValid: false,
        invalidReason: "Payment verification failed for all networks",
    }
}

async function settlePayment(
    paymentHeader: string,
    request: NextRequest,
    network: string,
): Promise<SettlementResponse> {
    const url = new URL(request.url)
    const resource = `${url.origin}${url.pathname}${url.search}`

    const payTo = network === "solana" ? RECIPIENT_ADDRESS_SOLANA : RECIPIENT_ADDRESS
    const asset = network === "solana" ? USDC_SOLANA : USDC_BASE

    try {
        const settleResponse = await fetch(`${FACILITATOR_BASE_URL}/settle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                x402Version: 1,
                paymentHeader,
                paymentRequirements: {
                    scheme: "exact",
                    network,
                    maxAmountRequired: (PRICE_USD_CENTS * 10000).toString(),
                    resource,
                    description: `Access ${url.pathname} - Sundial Exchange API`,
                    mimeType: "application/json",
                    payTo,
                    maxTimeoutSeconds: 300,
                    asset,
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
        // Verify payment with facilitator (tries both networks)
        const verification = await verifyPayment(paymentHeader, request)

        if (verification.isValid && verification.network) {
            // Settle payment with the verified network
            const settlement = await settlePayment(paymentHeader, request, verification.network)

            // Continue to the API route
            const response = NextResponse.next()

            // Add X-PAYMENT-RESPONSE header with settlement details (base64 encoded JSON)
            if (settlement.success && settlement.txHash) {
                const paymentResponse = {
                    success: true,
                    txHash: settlement.txHash,
                    networkId: settlement.networkId || verification.network,
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

