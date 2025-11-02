const JUPITER_ULTRA_API = "https://lite-api.jup.ag/ultra/v1"
import { track } from "@vercel/analytics"

export interface JupiterOrderParams {
  inputMint: string
  outputMint: string
  amount: string
  taker: string
  slippageBps?: number
  referralAccount?: string
  referralFeeBps?: number
}

export interface JupiterOrderResponse {
  mode: string
  swapType: string
  router: string
  requestId: string
  inAmount: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  priceImpactPct: string
  transaction: string
  routePlan: any[]
  feeBps?: number
  feeMint?: string
}

export interface JupiterExecuteResponse {
  status: "Success" | "Failed"
  signature?: string
  slot?: string
  code: number
  inputAmountResult?: string
  outputAmountResult?: string
  error?: string
}

export interface TokenAccount {
  account: string
  amount: string
  uiAmount: number
  uiAmountString: string
  isFrozen: boolean
  isAssociatedTokenAccount: boolean
  decimals: number
  programId: string
  excludeFromNetWorth: boolean
}

export interface HoldingsResponse {
  amount: string
  uiAmount: number
  uiAmountString: string
  tokens: {
    [mint: string]: TokenAccount[]
  }
}

export interface PoolVolumeMetrics {
  volume24hUsd: number
  volume7dUsd: number
  fees24hUsd: number
  tvlUsd: number
  liquidityUsd: number
  apr: number | null
  apy: number | null
}

export interface PoolReserveSnapshot {
  baseSymbol: string
  quoteSymbol: string
  baseMint: string | null
  quoteMint: string | null
  baseAmount: number
  quoteAmount: number
}

export interface JupiterPoolSnapshot {
  poolId: string
  poolName: string
  lpMint: string | null
  metrics: PoolVolumeMetrics
  reserves: PoolReserveSnapshot
  priceImpactBps: number | null
  updatedAtUnix: number
  fetchedAt: string
  raw: unknown
}

export async function getHoldings(address: string): Promise<HoldingsResponse> {
  const response = await fetch(`${JUPITER_ULTRA_API}/holdings/${address}`)

  if (!response.ok) {
    throw new Error(`Failed to get holdings: ${response.statusText}`)
  }

  return response.json()
}

export async function getPoolAnalytics(poolAddress: string): Promise<JupiterPoolSnapshot> {
  const response = await fetch(`${JUPITER_ULTRA_API}/pools/${poolAddress}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Jupiter pool analytics: ${response.statusText}`)
  }

  const raw = await response.json()
  const data = (raw && typeof raw === "object" && "data" in raw) ? (raw as any).data : raw

  const normalizeNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === "number") return value
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : fallback
    }
    return fallback
  }

  const baseSymbol = (data?.baseSymbol || data?.tokenSymbol0 || data?.baseTicker || "").toString()
  const quoteSymbol = (data?.quoteSymbol || data?.tokenSymbol1 || data?.quoteTicker || "").toString()

  return {
    poolId: (data?.address || poolAddress)?.toString(),
    poolName: (data?.name || `${baseSymbol}/${quoteSymbol}` || "Unknown Pool").toString(),
    lpMint: data?.lpMint?.toString?.() ?? data?.lpTokenMint?.toString?.() ?? null,
    metrics: {
      volume24hUsd: normalizeNumber(data?.volume24h ?? data?.volume24hUsd),
      volume7dUsd: normalizeNumber(data?.volume7d ?? data?.volume7dUsd),
      fees24hUsd: normalizeNumber(data?.fees24h ?? data?.fees24hUsd),
      tvlUsd: normalizeNumber(data?.tvl ?? data?.tvlUsd ?? data?.liquidityUsd),
      liquidityUsd: normalizeNumber(data?.liquidity ?? data?.liquidityUsd ?? data?.tvlUsd),
      apr: typeof data?.apr === "number" ? data.apr : (typeof data?.apr === "string" ? Number(data.apr) : null),
      apy: typeof data?.apy === "number" ? data.apy : (typeof data?.apy === "string" ? Number(data.apy) : null),
    },
    reserves: {
      baseSymbol,
      quoteSymbol,
      baseMint: data?.baseMint?.toString?.() ?? data?.tokenMint0?.toString?.() ?? null,
      quoteMint: data?.quoteMint?.toString?.() ?? data?.tokenMint1?.toString?.() ?? null,
      baseAmount: normalizeNumber(data?.baseReserve ?? data?.baseAmount ?? data?.tokenAmount0),
      quoteAmount: normalizeNumber(data?.quoteReserve ?? data?.quoteAmount ?? data?.tokenAmount1),
    },
    priceImpactBps: typeof data?.priceImpact === "number"
      ? data.priceImpact * 100
      : (typeof data?.priceImpact === "string" ? Number(data.priceImpact) * 100 : null),
    updatedAtUnix: normalizeNumber(
      data?.lastUpdateUnix ?? data?.lastUpdatedUnix ?? data?.updatedAtUnix ?? data?.timestamp,
      Math.floor(Date.now() / 1000),
    ),
    fetchedAt: new Date().toISOString(),
    raw: data,
  }
}

export async function getJupiterOrder(params: JupiterOrderParams): Promise<JupiterOrderResponse> {
  const referralAccount =
    params.referralAccount || (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_ULTRA_REFERRAL_ACCOUNT : undefined)
  const referralFeeBps =
    params.referralFeeBps || (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ULTRA_REFERRAL_FEE_BPS
      ? Number(process.env.NEXT_PUBLIC_ULTRA_REFERRAL_FEE_BPS)
      : undefined)

  const baseParams: Record<string, string> = {
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
    taker: params.taker,
  }

  if (params.slippageBps !== undefined) {
    baseParams.slippageBps = params.slippageBps.toString()
  }

  if (referralAccount) {
    baseParams.referralAccount = referralAccount
  }

  if (referralFeeBps !== undefined) {
    baseParams.referralFee = referralFeeBps.toString()
  }

  const queryParams = new URLSearchParams(baseParams)

  try {
    track("ultra_order_request", {
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      taker: params.taker,
      slippageBps: params.slippageBps ?? null,
      hasReferralAccount: Boolean(referralAccount),
      referralFeeBps: referralFeeBps ?? null,
    })
  } catch { }

  const response = await fetch(`${JUPITER_ULTRA_API}/order?${queryParams}`)

  if (!response.ok) {
    const errorText = await response.text()
    try {
      track("ultra_order_error", {
        status: response.status,
        statusText: response.statusText,
        inputMint: params.inputMint,
        outputMint: params.outputMint,
        amount: params.amount,
      })
    } catch { }
    throw new Error(`Failed to get Jupiter order: ${response.statusText} - ${errorText}`)
  }

  const json = (await response.json()) as JupiterOrderResponse
  try {
    track("ultra_order_success", {
      requestId: json.requestId,
      inAmount: json.inAmount,
      outAmount: json.outAmount,
      feeBps: (json as any).feeBps ?? json.feeBps ?? null,
      feeMint: (json as any).feeMint ?? json.feeMint ?? null,
    })
  } catch { }
  return json
}

export async function executeJupiterOrder(
  signedTransaction: string,
  requestId: string,
): Promise<JupiterExecuteResponse> {
  try {
    track("ultra_execute_attempt", { requestId })
  } catch { }

  const response = await fetch(`${JUPITER_ULTRA_API}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      signedTransaction,
      requestId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    try {
      track("ultra_execute_error", { requestId, status: response.status, statusText: response.statusText })
    } catch { }
    throw new Error(`Failed to execute Jupiter order: ${response.statusText} - ${errorText}`)
  }

  const json = (await response.json()) as JupiterExecuteResponse
  try {
    track("ultra_execute_result", { requestId, status: json.status, signature: json.signature ?? null })
  } catch { }
  return json
}
