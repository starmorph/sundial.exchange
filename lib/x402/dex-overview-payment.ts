import { type WalletContextState } from "@solana/wallet-adapter-react"
import { createX402Client } from "x402-solana"

const API_ROOT = "https://sundial.exchange"
const ENDPOINT_PATH = "/api/pools"
const PRICE_USDC = 0.001

export interface PoolAnalyticsPaymentResult {
    poolId: string
    settlementSignature: string | null
    paymentSettled: boolean
    fetchedAt: string
    payload: unknown
}

export async function payForPoolAnalytics({
    wallet,
    poolId,
    rpcUrl,
}: {
    wallet: WalletContextState
    poolId: string
    rpcUrl?: string
}): Promise<PoolAnalyticsPaymentResult> {
    const { publicKey, signTransaction } = wallet

    if (!wallet.connected || !publicKey || !signTransaction) {
        throw new Error("Connected wallet capable of signing transactions is required")
    }

    const client = createX402Client({
        wallet: {
            address: publicKey.toString(),
            signTransaction,
        },
        network: "solana",
        maxPaymentAmount: BigInt(Math.ceil(PRICE_USDC * 2 * 1_000_000)),
        rpcUrl,
    })

    const response = await client.fetch(`${API_ROOT}${ENDPOINT_PATH}/${poolId}/analytics`, {
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
        throw new Error(`Pool analytics request failed (${response.status}): ${errorText}`)
    }

    return {
        poolId,
        settlementSignature: settlement?.txHash ?? null,
        paymentSettled: settlement?.success ?? false,
        fetchedAt: new Date().toISOString(),
        payload: await response.json(),
    }
}

