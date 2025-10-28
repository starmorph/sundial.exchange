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
const DEFAULT_PRICE_USD = 0.1
const POOL_ANALYTICS_PRICE_USD = 0.001
const FACILITATOR_BASE_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network"
const SETTLEMENT_RETRY_DELAYS_MS = [1000, 5000]
const RETRYABLE_FACILITATOR_ERRORS = [
    "replacement transaction underpriced",
    "nonce too low",
    "already known",
]

type SupportedNetwork = "base" | "solana"

const FACILITATOR_FEE_PAYER_CACHE_TTL_MS = 5 * 60 * 1000
const facilitatorFeePayerCache = new Map<SupportedNetwork, { feePayer: string; expiresAt: number }>()

function isSupportedNetworkGuard(network: string): network is SupportedNetwork {
    return network === "base" || network === "solana"
}

async function getFacilitatorFeePayer(network: SupportedNetwork): Promise<string> {
    const cached = facilitatorFeePayerCache.get(network)
    if (cached && cached.expiresAt > Date.now()) {
        return cached.feePayer
    }

    const response = await fetch(`${FACILITATOR_BASE_URL}/supported`)
    if (!response.ok) {
        throw new Error(`Failed to fetch facilitator supported networks: ${response.status}`)
    }

    const data = (await response.json()) as {
        kinds?: Array<{ network: string; scheme: string; extra?: { feePayer?: string } }>
    }

    const entry = data.kinds?.find((kind) => kind.network === network && kind.scheme === "exact")
    const feePayer = entry?.extra?.feePayer

    if (!feePayer) {
        throw new Error(`Facilitator did not provide feePayer for network ${network}`)
    }

    facilitatorFeePayerCache.set(network, {
        feePayer,
        expiresAt: Date.now() + FACILITATOR_FEE_PAYER_CACHE_TTL_MS,
    })

    return feePayer
}

async function withFacilitatorExtras<T extends { network: SupportedNetwork; extra?: Record<string, unknown> }>(
    requirements: T[],
): Promise<T[]> {
    const hydrated = await Promise.all(
        requirements.map(async (requirement) => {
            if (requirement.network !== "solana") {
                return requirement
            }

            try {
                const feePayer = await getFacilitatorFeePayer("solana")
                return {
                    ...requirement,
                    extra: {
                        ...requirement.extra,
                        feePayer,
                    },
                }
            } catch (error) {
                console.error("[x402] Falling back to default Solana feePayer", error)
                return requirement
            }
        }),
    )

    return hydrated
}

function normalizeResourceUrl(url: string): string {
    try {
        const parsed = new URL(url)
        parsed.host = parsed.host.replace(/^www\./, "")
        return parsed.toString()
    } catch {
        return url
    }
}

async function create402Response(request: NextRequest, priceUsd: number): Promise<NextResponse> {
    const url = new URL(request.url)
    const resource = normalizeResourceUrl(`${url.origin}${url.pathname}${url.search}`)
    const method = request.method
    const maxAmountRequired = Math.round(priceUsd * 1_000_000).toString()

    const fromChatRoute = isFromChatRoute(request)

    const accepts: Array<{
        scheme: string
        network: SupportedNetwork
        maxAmountRequired: string
        resource: string
        description: string
        mimeType: string
        payTo: string
        maxTimeoutSeconds: number
        asset: string
        outputSchema: any
        extra?: Record<string, unknown>
    }> = []

    const allowBase = !isExemptOrigin(request) || !fromChatRoute

    if (allowBase) {
        accepts.push({
            scheme: "exact",
            network: "base",
            maxAmountRequired,
            resource,
            description: `Access ${url.pathname} - Sundial Exchange API (Base) for $${priceUsd.toFixed(2)}`,
            mimeType: "application/json",
            payTo: RECIPIENT_ADDRESS,
            maxTimeoutSeconds: 300,
            asset: USDC_BASE,
            outputSchema: getOutputSchema(url.pathname, method),
        })
    }

    accepts.push({
        scheme: "exact",
        network: "solana",
        maxAmountRequired,
        resource,
        description: `Access ${url.pathname} - Sundial Exchange API (Solana) for $${priceUsd.toFixed(2)}`,
        mimeType: "application/json",
        payTo: RECIPIENT_ADDRESS_SOLANA,
        maxTimeoutSeconds: 300,
        asset: USDC_SOLANA,
        outputSchema: getOutputSchema(url.pathname, method),
        extra: {
            name: "USD Coin",
            version: "2",
            feePayer: RECIPIENT_ADDRESS_SOLANA,
        },
    })

    const hydratedAccepts = await withFacilitatorExtras(accepts)

    const challenge = {
        x402Version: 1,
        error: "X-PAYMENT header is required",
        accepts: hydratedAccepts,
    }

    return NextResponse.json(challenge, { status: 402 })
}

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

function normalizePathname(pathname: string): string {
    if (pathname.length > 1 && pathname.endsWith("/")) {
        return pathname.replace(/\/+$/, "")
    }
    return pathname
}

function isFromChatRoute(request: NextRequest): boolean {
    const referer = request.headers.get("referer")
    if (!referer) return false

    try {
        const refererUrl = new URL(referer)
        return refererUrl.pathname === "/chat"
    } catch {
        return false
    }
}

function getEndpointPriceUsd(pathname: string): number {
    const normalized = normalizePathname(pathname)
    if (normalized === "/api/premium-insight") {
        return 10
    }

    if (normalized === "/api/pools/analytics") {
        return POOL_ANALYTICS_PRICE_USD
    }

    if (normalized === "/api/dex/overview") {
        return 0.01
    }

    return DEFAULT_PRICE_USD
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

function parsePaymentHeader(paymentHeader: string) {
    try {
        return JSON.parse(atob(paymentHeader))
    } catch (error) {
        console.log("[x402] Failed to parse payment header:", error)
        return null
    }
}

function shouldRetrySettlement(status: number, facilitatorError: string | null): boolean {
    if (status >= 500 || status === 429) {
        return true
    }

    if (!facilitatorError) {
        return false
    }

    const normalized = facilitatorError.toLowerCase()
    return RETRYABLE_FACILITATOR_ERRORS.some((hint) => normalized.includes(hint))
}

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function shouldBypassPayment(request: NextRequest, pathname: string): boolean {
    const normalizedPath = normalizePathname(pathname)
    if (normalizedPath !== "/api/dex/overview") {
        return false
    }

    const skipHeader = request.headers.get("x-skip-payment")
    return skipHeader === "true"
}

async function verifyPayment(
    paymentHeader: string,
    request: NextRequest,
    priceUsd: number,
): Promise<VerificationResponse & { network?: SupportedNetwork }> {
    const url = new URL(request.url)
    const resource = normalizeResourceUrl(`${url.origin}${url.pathname}${url.search}`)
    const maxAmountRequired = Math.round(priceUsd * 1_000_000).toString()

    console.log("[x402] Verifying payment for resource:", resource)
    console.log("[x402] Original request URL:", request.url)

    // Parse the payment header to get the payment proof
    const paymentProof = parsePaymentHeader(paymentHeader)
    if (!paymentProof) {
        return {
            isValid: false,
            invalidReason: "Invalid payment header format",
        }
    }

    console.log("[x402] Payment proof network:", paymentProof.network)
    console.log("[x402] Payment proof scheme:", paymentProof.scheme)
    console.log("[x402] Payment proof payload:", JSON.stringify(paymentProof.payload))

    const paymentNetworkRaw = typeof paymentProof.network === "string" ? paymentProof.network.toLowerCase() : ""
    if (!isSupportedNetworkGuard(paymentNetworkRaw)) {
        console.log("[x402] Unsupported payment network in proof:", paymentProof.network)
        return {
            isValid: false,
            invalidReason: `Unsupported payment network: ${paymentProof.network}`,
        }
    }

    const paymentNetwork: SupportedNetwork = paymentNetworkRaw
    const payTo = paymentNetwork === "solana" ? RECIPIENT_ADDRESS_SOLANA : RECIPIENT_ADDRESS
    const asset = paymentNetwork === "solana" ? USDC_SOLANA : USDC_BASE

    let feePayer = paymentNetwork === "solana" ? RECIPIENT_ADDRESS_SOLANA : RECIPIENT_ADDRESS
    if (paymentNetwork === "solana") {
        try {
            feePayer = await getFacilitatorFeePayer("solana")
        } catch (error) {
            console.error("[x402] Failed to fetch facilitator feePayer during verify", error)
        }
    }

    // Check if authorization recipient matches
    if (paymentProof.payload?.authorization?.to) {
        console.log("[x402] Authorization 'to' address:", paymentProof.payload.authorization.to)
        console.log("[x402] Our 'payTo' address:", payTo)
        console.log("[x402] Match:", paymentProof.payload.authorization.to.toLowerCase() === payTo.toLowerCase())
    }

    // Check if authorization value matches our price
    if (paymentProof.payload?.authorization?.value) {
        console.log("[x402] Authorization value:", paymentProof.payload.authorization.value)
        console.log("[x402] Our maxAmountRequired:", maxAmountRequired)
    }

    try {
        const description = `Access ${url.pathname} - Sundial Exchange API (${paymentNetwork === "solana" ? "Solana" : "Base"}) for $${priceUsd.toFixed(2)}`
        const verifyPayload = {
            x402Version: paymentProof.x402Version ?? 1,
            scheme: paymentProof.scheme,
            network: paymentNetwork,
            paymentHeader,
            paymentPayload: paymentProof,
            paymentRequirements: {
                scheme: paymentProof.scheme,
                network: paymentNetwork,
                payTo,
                asset,
                resource,
                maxAmountRequired,
                description,
                maxTimeoutSeconds: 300,
                mimeType: "application/json",
                extra: {
                    name: "USD Coin",
                    version: "2",
                    feePayer,
                },
            },
        }

        console.log(`[x402] Verifying payment on ${paymentNetwork} network...`)
        console.log(`[x402] Verify payload (full):`, JSON.stringify(verifyPayload))

        const verifyResponse = await fetch(`${FACILITATOR_BASE_URL}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(verifyPayload),
        })

        const responseText = await verifyResponse.text()
        console.log(`[x402] Verification response (${verifyResponse.status}):`, responseText.substring(0, 200))
        if (!verifyResponse.ok) {
            console.log("[x402] Verification error payload:", responseText)
            if (verifyResponse.status === 500 || verifyResponse.status === 503) {
                console.log("[x402] Facilitator returned server error during verify")
            }
        }

        if (verifyResponse.ok) {
            const result = JSON.parse(responseText) as VerificationResponse
            if (result.isValid) {
                console.log(`[x402] Payment verified successfully on ${paymentNetwork}!`)
                return { ...result, network: paymentNetwork }
            } else {
                console.log(`[x402] Verification failed:`, result.invalidReason)
                return { ...result, network: paymentNetwork }
            }
        } else {
            return {
                isValid: false,
                invalidReason: `Facilitator returned ${verifyResponse.status}: ${responseText}`,
            }
        }
    } catch (error) {
        console.log(`[x402] Error verifying payment:`, error)
        return {
            isValid: false,
            invalidReason: error instanceof Error ? error.message : "Unknown verification error",
        }
    }
}

async function settlePayment(
    paymentHeader: string,
    request: NextRequest,
    network: SupportedNetwork,
    priceUsd: number,
): Promise<SettlementResponse> {
    const url = new URL(request.url)
    const resource = normalizeResourceUrl(`${url.origin}${url.pathname}${url.search}`)

    const payTo = network === "solana" ? RECIPIENT_ADDRESS_SOLANA : RECIPIENT_ADDRESS
    const asset = network === "solana" ? USDC_SOLANA : USDC_BASE

    // Parse the payment header to get the payment proof
    const paymentProof = parsePaymentHeader(paymentHeader)
    if (!paymentProof) {
        return {
            success: false,
            error: "Invalid payment header format",
            txHash: null,
            networkId: null,
        }
    }

    const description = `Access ${url.pathname} - Sundial Exchange API (${network === "solana" ? "Solana" : "Base"}) for $${priceUsd.toFixed(2)}`
    const maxAmountRequired = Math.round(priceUsd * 1_000_000).toString()
    let feePayer = network === "solana" ? RECIPIENT_ADDRESS_SOLANA : RECIPIENT_ADDRESS
    if (network === "solana") {
        try {
            feePayer = await getFacilitatorFeePayer("solana")
        } catch (error) {
            console.error("[x402] Failed to fetch facilitator feePayer during settle", error)
        }
    }

    const settlePayload = {
        x402Version: paymentProof.x402Version ?? 1,
        scheme: paymentProof.scheme,
        network,
        paymentHeader,
        paymentPayload: paymentProof,
        paymentRequirements: {
            scheme: paymentProof.scheme,
            network,
            payTo,
            asset,
            resource,
            maxAmountRequired,
            description,
            maxTimeoutSeconds: 300,
            mimeType: "application/json",
            extra: {
                name: "USD Coin",
                version: "2",
                feePayer,
            },
        },
    }

    console.log(`[x402] Settling payment on ${network}...`)
    console.log(`[x402] Settle payload:`, JSON.stringify(settlePayload).substring(0, 300))

    let lastErrorMessage: string | null = null

    for (let attempt = 1; attempt <= SETTLEMENT_RETRY_DELAYS_MS.length + 1; attempt++) {
        try {
            const settleResponse = await fetch(`${FACILITATOR_BASE_URL}/settle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settlePayload),
            })

            if (settleResponse.ok) {
                const result = (await settleResponse.json()) as SettlementResponse
                return result
            }

            const responseText = await settleResponse.text()
            console.log(`[x402] Settlement response (${settleResponse.status}):`, responseText)

            let facilitatorError: string | null = null
            try {
                const parsed = JSON.parse(responseText)
                if (parsed && typeof parsed.error === "string") {
                    facilitatorError = parsed.error
                    console.log("[x402] Settlement error detail:", parsed.error)
                }
            } catch {
                // Non-JSON response, already logged raw text above
            }

            if (settleResponse.status === 500 || settleResponse.status === 503) {
                console.log("[x402] Facilitator returned server error during settle")
            }

            lastErrorMessage = facilitatorError || "Settlement request failed"

            if (attempt <= SETTLEMENT_RETRY_DELAYS_MS.length && shouldRetrySettlement(settleResponse.status, facilitatorError)) {
                const delayMs = SETTLEMENT_RETRY_DELAYS_MS[attempt - 1]
                console.log(`[x402] Retryable settlement failure detected (attempt ${attempt}) - retrying in ${delayMs}ms`)
                await delay(delayMs)
                continue
            }

            return {
                success: false,
                error: lastErrorMessage,
                txHash: null,
                networkId: null,
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error"
            lastErrorMessage = message
            console.log(`[x402] Settlement attempt ${attempt} threw:`, message)

            if (attempt <= SETTLEMENT_RETRY_DELAYS_MS.length) {
                const delayMs = SETTLEMENT_RETRY_DELAYS_MS[attempt - 1]
                console.log(`[x402] Retrying settlement after error in ${delayMs}ms`)
                await delay(delayMs)
                continue
            }

            return {
                success: false,
                error: message,
                txHash: null,
                networkId: null,
            }
        }
    }

    return {
        success: false,
        error: lastErrorMessage || "Settlement request failed",
        txHash: null,
        networkId: null,
    }
}

export async function middleware(request: NextRequest) {
    // Log all incoming requests for debugging
    const url = new URL(request.url)
    const origin = request.headers.get("origin") || "none"
    const referer = request.headers.get("referer") || "none"
    const userAgent = request.headers.get("user-agent") || "none"
    const hasPayment = !!request.headers.get("x-payment")

    console.log(`[x402] Incoming ${request.method} ${url.pathname}`, {
        origin: origin.substring(0, 50),
        referer: referer.substring(0, 50),
        userAgent: userAgent.substring(0, 50),
        hasPayment,
    })

    const fromChatRoute = isFromChatRoute(request)
    const normalizedPath = normalizePathname(url.pathname)
    const isPaidEndpoint = normalizedPath === "/api/dex/overview"

    // Exempt our own frontend UNLESS it's a paid endpoint from chat route
    if (isExemptOrigin(request)) {
        if (isPaidEndpoint && fromChatRoute) {
            console.log("[x402] Paid endpoint from /chat route - payment required")
            // Continue to payment check below
        } else {
            console.log("[x402] Origin exempted, allowing through")
            return NextResponse.next()
        }
    }

    if (shouldBypassPayment(request, normalizedPath)) {
        console.log("[x402] Payment bypass header detected, allowing through")
        return NextResponse.next()
    }

    // Check for payment header
    const paymentHeader = request.headers.get("x-payment")
    const priceUsd = getEndpointPriceUsd(url.pathname)

    if (paymentHeader) {
        // Log for debugging (remove in production)
        console.log("[x402] Payment header received:", paymentHeader.substring(0, 50) + "...")

        // Verify payment with facilitator (tries both networks)
        const verification = await verifyPayment(paymentHeader, request, priceUsd)

        console.log("[x402] Verification result:", {
            isValid: verification.isValid,
            network: verification.network,
            invalidReason: verification.invalidReason,
        })

        if (verification.isValid && verification.network) {
            // Settle payment with the verified network
            const settlement = await settlePayment(paymentHeader, request, verification.network, priceUsd)

            console.log("[x402] Settlement result:", {
                success: settlement.success,
                txHash: settlement.txHash,
                error: settlement.error,
            })

            if (!settlement.success) {
                console.warn("[x402] Settlement failed, returning 402:", settlement.error)
                return create402Response(request, priceUsd)
            }

            const forwardedHeaders = new Headers(request.headers)
            forwardedHeaders.set("x-payment-validated", "true")
            forwardedHeaders.set("x-payment-network", settlement.networkId || verification.network)
            if (settlement.txHash) {
                forwardedHeaders.set("x-payment-tx", settlement.txHash)
            }

            // Continue to the API route
            const response = NextResponse.next({
                request: {
                    headers: forwardedHeaders,
                },
            })

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
        } else {
            console.log("[x402] Payment verification failed:", verification.invalidReason)
        }
    } else {
        console.log("[x402] No payment header found, returning 402")
    }

    // Return 402 Payment Required
    return create402Response(request, priceUsd)
}

export const config = {
    matcher: [
        "/api/((?!chat).*)", // Match all /api/* except /api/chat
    ],
}

