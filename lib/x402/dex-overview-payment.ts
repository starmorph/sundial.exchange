import { type WalletContextState } from "@solana/wallet-adapter-react"

export async function payForDexOverview(_options: {
    wallet: WalletContextState
}): Promise<void> {
    throw new Error("payForDexOverview is not supported in this offline context")
}

