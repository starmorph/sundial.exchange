import type { SolanaToken } from "./solana-tokens"

interface JupiterTokenResult {
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  tags?: string[]
  daily_volume?: number
}

/**
 * Search for tokens using Jupiter Token API V2
 * Returns up to 1000 tokens based on search query
 */
export async function searchTokens(query: string): Promise<SolanaToken[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  try {
    const searchQuery = encodeURIComponent(query.trim())
    const response = await fetch(
      `https://lite-api.jup.ag/tokens/v2/search?query=${searchQuery}`,
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      console.error("Jupiter token search failed:", response.status, response.statusText)
      return []
    }

    const data = await response.json()

    // Jupiter V2 API returns an array of token objects
    if (!Array.isArray(data)) {
      console.error("Unexpected response format from Jupiter API")
      return []
    }

    // Transform Jupiter tokens to our SolanaToken format
    return data.slice(0, 100).map((token: JupiterTokenResult) => ({
      symbol: token.symbol,
      name: token.name,
      icon: getTokenIcon(token.symbol), // Fallback emoji
      logoURI: token.logoURI,
      mint: token.address,
      decimals: token.decimals,
    }))
  } catch (error) {
    console.error("Error searching tokens:", error)
    return []
  }
}

/**
 * Get a single token by contract address
 */
export async function getTokenByAddress(address: string): Promise<SolanaToken | null> {
  if (!address || address.trim().length < 32) {
    return null
  }

  try {
    const results = await searchTokens(address)
    // Find exact match for the address
    return results.find((token) => token.mint.toLowerCase() === address.toLowerCase()) || null
  } catch (error) {
    console.error("Error fetching token by address:", error)
    return null
  }
}

/**
 * Get fallback emoji icon based on token symbol
 */
function getTokenIcon(symbol: string): string {
  const symbolUpper = symbol.toUpperCase()

  // Common token emojis
  const emojiMap: Record<string, string> = {
    SOL: "◎",
    USDC: "💵",
    USDT: "💵",
    JUP: "🪐",
    RAY: "⚡",
    BONK: "🐶",
    WIF: "🐕",
    PYTH: "🔮",
    W: "🌐",
    JTO: "🚀",
    RNDR: "🎨",
    HNT: "📡",
    JLP: "💧",
    PYUSD: "💰",
    EURC: "💶",
    CBBTC: "₿",
    BOME: "📖",
    POPCAT: "🐱",
    MEW: "😸",
    MOTHER: "👩",
    KMNO: "🧪",
    ORCA: "🐋",
    MNGO: "🥭",
    FIDA: "🎯",
    MSOL: "🌊",
  }

  return emojiMap[symbolUpper] || "🪙"
}
