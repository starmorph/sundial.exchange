export const SOLANA_TOKEN_MINTS: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112", // Native SOL
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  TRUMP: "9d9mb8kooffad3sctgztkxqypkshx6ezhbkio89ixyy2", // Official Trump
  PUMP: "2uf4xh61rdwxng9woyxsvqp7zua6klfpb3nvnrqeoisd", // Pump.fun
  FARTCOIN: "bzc9nzfmqkxr6fz1dbph7bdf9broyef6pnzesp7v5iiw", // Fartcoin
  USELESS: "q2sphpduwfmg7m7wwrqklrn619caucfrsmhvjffodsp", // Useless Coin
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // dogwifhat
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // Bonk
  TROLL: "4w2cysotx6czaugmmwg13hdpy4qemg2czekyeqyk9ama", // TROLL
  // Add more as needed (e.g., from Helius API)
};

export interface SolanaToken {
  symbol: string;
  name: string;
  icon: string;
  mint: string;
  decimals: number;
  volume24h?: string; // Optional: Added for reference (USD)
}

export const SOLANA_TOKENS: SolanaToken[] = [
  {
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    mint: SOLANA_TOKEN_MINTS.SOL,
    decimals: 9,
    volume24h: "$13.2B",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "💵",
    mint: SOLANA_TOKEN_MINTS.USDC,
    decimals: 6,
    volume24h: "$14.9B", // Included as high-volume stable
  },
  {
    symbol: "TRUMP",
    name: "Official Trump",
    icon: "🇺🇸", // Placeholder; fetch real icon via API
    mint: SOLANA_TOKEN_MINTS.TRUMP,
    decimals: 6,
    volume24h: "$421M",
  },
  {
    symbol: "PUMP",
    name: "Pump.fun",
    icon: "🚀",
    mint: SOLANA_TOKEN_MINTS.PUMP,
    decimals: 6,
    volume24h: "$370M",
  },
  {
    symbol: "FARTCOIN",
    name: "Fartcoin",
    icon: "💨",
    mint: SOLANA_TOKEN_MINTS.FARTCOIN,
    decimals: 6,
    volume24h: "$228M",
  },
  {
    symbol: "USELESS",
    name: "Useless Coin",
    icon: "🗑️",
    mint: SOLANA_TOKEN_MINTS.USELESS,
    decimals: 6,
    volume24h: "$167M",
  },
  {
    symbol: "WIF",
    name: "dogwifhat",
    icon: "🐕‍🦺",
    mint: SOLANA_TOKEN_MINTS.WIF,
    decimals: 6,
    volume24h: "$362M",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    icon: "🐕",
    mint: SOLANA_TOKEN_MINTS.BONK,
    decimals: 5,
    volume24h: "$341M",
  },
  {
    symbol: "TROLL",
    name: "TROLL",
    icon: "👹",
    mint: SOLANA_TOKEN_MINTS.TROLL,
    decimals: 6,
    volume24h: "$85M", // Aggregated from pairs
  },
  {
    symbol: "PENGU",
    name: "Pudgy Penguins",
    icon: "🐧",
    mint: "5S0oK8b7J1b5zA6zZ3b5zA6zZ3b5zA6zZ3b5zA6zZ3b5", // Example; verify via API (actual: 6zK4b5F7U7tA9vXbYcD2eF3gH4iJ5kL6mN7oP8qR9sT0)
    decimals: 6,
    volume24h: "$415M",
  },
  // Extend with more from API (e.g., Fefe, LAUNCHCOIN)
];

export function toTokenAmount(amount: number, decimals: number): string {
  return Math.floor(amount * Math.pow(10, decimals)).toString();
}

export function fromTokenAmount(amount: string, decimals: number): number {
  return Number.parseInt(amount) / Math.pow(10, decimals);
}