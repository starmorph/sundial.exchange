export const SOLANA_TOKEN_MINTS: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112", // Native SOL
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  // Add more tokens as needed
}

export interface SolanaToken {
  symbol: string
  name: string
  icon: string
  mint: string
  decimals: number
}

export const SOLANA_TOKENS: SolanaToken[] = [
  {
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    mint: SOLANA_TOKEN_MINTS.SOL,
    decimals: 9,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "💵",
    mint: SOLANA_TOKEN_MINTS.USDC,
    decimals: 6,
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: "₮",
    mint: SOLANA_TOKEN_MINTS.USDT,
    decimals: 6,
  },
]

export function toTokenAmount(amount: number, decimals: number): string {
  return Math.floor(amount * Math.pow(10, decimals)).toString()
}

export function fromTokenAmount(amount: string, decimals: number): number {
  return Number.parseInt(amount) / Math.pow(10, decimals)
}
