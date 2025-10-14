const JUPITER_ULTRA_API = "https://lite-api.jup.ag/ultra/v1"

export interface JupiterOrderParams {
  inputMint: string
  outputMint: string
  amount: string
  taker: string
  slippageBps?: number
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

export async function getHoldings(address: string): Promise<HoldingsResponse> {
  const response = await fetch(`${JUPITER_ULTRA_API}/holdings/${address}`)

  if (!response.ok) {
    throw new Error(`Failed to get holdings: ${response.statusText}`)
  }

  return response.json()
}

export async function getJupiterOrder(params: JupiterOrderParams): Promise<JupiterOrderResponse> {
  const queryParams = new URLSearchParams({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
    taker: params.taker,
    ...(params.slippageBps && { slippageBps: params.slippageBps.toString() }),
  })

  const response = await fetch(`${JUPITER_ULTRA_API}/order?${queryParams}`)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get Jupiter order: ${response.statusText} - ${errorText}`)
  }

  return response.json()
}

export async function executeJupiterOrder(
  signedTransaction: string,
  requestId: string,
): Promise<JupiterExecuteResponse> {
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
    throw new Error(`Failed to execute Jupiter order: ${response.statusText} - ${errorText}`)
  }

  return response.json()
}
