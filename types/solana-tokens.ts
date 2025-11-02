export const SOLANA_TOKEN_MINTS: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112", // Native SOL
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", // Jupiter Token
  RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", // Raydium
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // Bonk
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // dogwifhat
  PYTH: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", // Pyth Network
  W: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ", // Wormhole
  JTO: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL", // Jito
  RNDR: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof", // Render Token
  HNT: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux", // Helium
  JLP: "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4", // Jupiter LP Token
  PYUSD: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo", // PayPal USD
  EURC: "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr", // Euro Coin
  cbBTC: "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij", // Coinbase Wrapped BTC
  BOME: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82", // Book of Meme
  POPCAT: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", // Popcat
  MEW: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", // Cat in a dogs world
  MOTHER: "3S8qX1MsMqRbiwKg2cQyx7nis1oHMgaCuc9c4VfvVdPN", // MOTHER
  KMNO: "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS", // Kamino
  ORCA: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", // Orca
  MNGO: "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac", // Mango
  FIDA: "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp", // Bonfida
  MSOL: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // Marinade Staked SOL
};

export interface SolanaToken {
  symbol: string;
  name: string;
  icon: string; // Emoji fallback
  logoURI?: string; // Official token logo URL
  mint: string;
  decimals: number;
  volume24h?: string; // Optional: Added for reference (USD)
}

export const SOLANA_TOKENS: SolanaToken[] = [
  {
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    mint: SOLANA_TOKEN_MINTS.SOL,
    decimals: 9,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "💵",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    mint: SOLANA_TOKEN_MINTS.USDC,
    decimals: 6,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    icon: "💵",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    mint: SOLANA_TOKEN_MINTS.USDT,
    decimals: 6,
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    icon: "🪐",
    logoURI: "https://static.jup.ag/jup/icon.png",
    mint: SOLANA_TOKEN_MINTS.JUP,
    decimals: 6,
  },
  {
    symbol: "RAY",
    name: "Raydium",
    icon: "⚡",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
    mint: SOLANA_TOKEN_MINTS.RAY,
    decimals: 6,
  },
  {
    symbol: "BONK",
    name: "Bonk",
    icon: "🐶",
    logoURI: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    mint: SOLANA_TOKEN_MINTS.BONK,
    decimals: 5,
  },
  {
    symbol: "WIF",
    name: "dogwifhat",
    icon: "🐕",
    logoURI: "https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link",
    mint: SOLANA_TOKEN_MINTS.WIF,
    decimals: 6,
  },
  {
    symbol: "PYTH",
    name: "Pyth Network",
    icon: "🔮",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3/logo.png",
    mint: SOLANA_TOKEN_MINTS.PYTH,
    decimals: 6,
  },
  {
    symbol: "W",
    name: "Wormhole",
    icon: "🌐",
    logoURI: "https://shdw-drive.genesysgo.net/CsDkETHRRR1EcueeN346MJoqzymkkr7RFjMqGpZMzAib/wormhole.png",
    mint: SOLANA_TOKEN_MINTS.W,
    decimals: 6,
  },
  {
    symbol: "JTO",
    name: "Jito",
    icon: "🚀",
    logoURI: "https://metadata.jito.network/token/jto/image",
    mint: SOLANA_TOKEN_MINTS.JTO,
    decimals: 9,
  },
  {
    symbol: "RNDR",
    name: "Render Token",
    icon: "🎨",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof/logo.png",
    mint: SOLANA_TOKEN_MINTS.RNDR,
    decimals: 8,
  },
  {
    symbol: "HNT",
    name: "Helium",
    icon: "📡",
    logoURI: "https://shdw-drive.genesysgo.net/GwJapVHVjXJ6cd4BwYZKhHLvARjWyEYZ8xQ1fQMosKqj/hnt.png",
    mint: SOLANA_TOKEN_MINTS.HNT,
    decimals: 8,
  },
  {
    symbol: "JLP",
    name: "Jupiter Perps LP",
    icon: "💧",
    logoURI: "https://static.jup.ag/jlp/icon.png",
    mint: SOLANA_TOKEN_MINTS.JLP,
    decimals: 6,
  },
  {
    symbol: "PYUSD",
    name: "PayPal USD",
    icon: "💰",
    logoURI: "https://pbs.twimg.com/profile_images/1691564611194114048/9RCdtr7S_400x400.png",
    mint: SOLANA_TOKEN_MINTS.PYUSD,
    decimals: 6,
  },
  {
    symbol: "EURC",
    name: "Euro Coin",
    icon: "💶",
    logoURI: "https://www.circle.com/hubfs/Brand/EURC/EURC-icon.png",
    mint: SOLANA_TOKEN_MINTS.EURC,
    decimals: 6,
  },
  {
    symbol: "cbBTC",
    name: "Coinbase Wrapped BTC",
    icon: "₿",
    logoURI: "https://assets.coingecko.com/coins/images/40158/standard/cbBTC_32x32.png",
    mint: SOLANA_TOKEN_MINTS.cbBTC,
    decimals: 8,
  },
  {
    symbol: "BOME",
    name: "BOOK OF MEME",
    icon: "📖",
    logoURI: "https://bafkreidlkvw3vwoede64baaeqty27qvpa5va34a3tkj3wggw5evpn6h2wa.ipfs.nftstorage.link",
    mint: SOLANA_TOKEN_MINTS.BOME,
    decimals: 6,
  },
  {
    symbol: "POPCAT",
    name: "Popcat",
    icon: "🐱",
    logoURI: "https://bafkreidvkvuzyslappw3kntk3mmch755xadaqdu55crre7jyhnfd4cx4eq.ipfs.nftstorage.link",
    mint: SOLANA_TOKEN_MINTS.POPCAT,
    decimals: 9,
  },
  {
    symbol: "MEW",
    name: "cat in a dogs world",
    icon: "😸",
    logoURI: "https://bafkreia3o4t556vpr52wx5pfmzfxjs3bbxfiw7nqz44ip4x4hh7gk4mxbq.ipfs.nftstorage.link",
    mint: SOLANA_TOKEN_MINTS.MEW,
    decimals: 5,
  },
  {
    symbol: "MOTHER",
    name: "MOTHER",
    icon: "👩",
    logoURI: "https://bafkreigu552cau3fqzxq4wqhdrk7e3igvegjt7c4gg6vgvyqe36p3tlwni.ipfs.nftstorage.link",
    mint: SOLANA_TOKEN_MINTS.MOTHER,
    decimals: 6,
  },
  {
    symbol: "KMNO",
    name: "Kamino",
    icon: "🧪",
    logoURI: "https://kamino.finance/logo_circle.svg",
    mint: SOLANA_TOKEN_MINTS.KMNO,
    decimals: 6,
  },
  {
    symbol: "ORCA",
    name: "Orca",
    icon: "🐋",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png",
    mint: SOLANA_TOKEN_MINTS.ORCA,
    decimals: 6,
  },
  {
    symbol: "MNGO",
    name: "Mango",
    icon: "🥭",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac/logo.png",
    mint: SOLANA_TOKEN_MINTS.MNGO,
    decimals: 6,
  },
  {
    symbol: "FIDA",
    name: "Bonfida",
    icon: "🎯",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp/logo.svg",
    mint: SOLANA_TOKEN_MINTS.FIDA,
    decimals: 6,
  },
  {
    symbol: "MSOL",
    name: "Marinade Staked SOL",
    icon: "🌊",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
    mint: SOLANA_TOKEN_MINTS.MSOL,
    decimals: 9,
  },
];

export function toTokenAmount(amount: number, decimals: number): string {
  return Math.floor(amount * Math.pow(10, decimals)).toString();
}

export function fromTokenAmount(amount: string, decimals: number): number {
  return Number.parseInt(amount) / Math.pow(10, decimals);
}