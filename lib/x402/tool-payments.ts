import { type WalletContextState } from "@solana/wallet-adapter-react"
import { createX402Client } from "x402-solana"

export interface X402PaymentConfig {
    wallet: WalletContextState
    priceUSDC: number
    endpoint: string
    rpcUrl?: string
}

export interface X402PaymentResult<T = unknown> {
    success: boolean
    data?: T
    settlementSignature: string | null
    paymentSettled: boolean
    fetchedAt: string
    error?: string
}

/**
 * Generic x402 payment wrapper for AI tool calls
 * Handles payment flow and returns data with settlement info
 */
export async function executeWithX402Payment<T = unknown>({
    wallet,
    priceUSDC,
    endpoint,
    rpcUrl,
}: X402PaymentConfig): Promise<X402PaymentResult<T>> {
    const { publicKey, signTransaction } = wallet

    if (!wallet.connected || !publicKey || !signTransaction) {
        return {
            success: false,
            settlementSignature: null,
            paymentSettled: false,
            fetchedAt: new Date().toISOString(),
            error: "Connected wallet capable of signing transactions is required",
        }
    }

    try {
        const client = createX402Client({
            wallet: {
                address: publicKey.toString(),
                signTransaction,
            },
            network: "solana",
            maxPaymentAmount: BigInt(Math.ceil(priceUSDC * 2 * 1_000_000)),
            rpcUrl,
        })

        const response = await client.fetch(endpoint, {
            headers: {
                Accept: "application/json",
            },
        })

        const settlementHeader = response.headers.get("X-PAYMENT-RESPONSE")
        const settlement = settlementHeader
            ? (JSON.parse(Buffer.from(settlementHeader, "base64").toString()) as {
                success?: boolean
                txHash?: string | null
            })
            : null

        if (!response.ok) {
            const errorText = await response.text()
            return {
                success: false,
                settlementSignature: settlement?.txHash ?? null,
                paymentSettled: settlement?.success ?? false,
                fetchedAt: new Date().toISOString(),
                error: `Request failed (${response.status}): ${errorText}`,
            }
        }

        const data = await response.json()

        return {
            success: true,
            data: data as T,
            settlementSignature: settlement?.txHash ?? null,
            paymentSettled: settlement?.success ?? false,
            fetchedAt: new Date().toISOString(),
        }
    } catch (error) {
        return {
            success: false,
            settlementSignature: null,
            paymentSettled: false,
            fetchedAt: new Date().toISOString(),
            error: error instanceof Error ? error.message : "Unknown payment error",
        }
    }
}

