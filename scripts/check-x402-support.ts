#!/usr/bin/env tsx

/**
 * Check what payment schemes and networks are supported by the x402 facilitator
 * Usage: tsx scripts/check-x402-support.ts
 */

const FACILITATOR_URL = "https://x402.org/facilitator"

interface SupportedKind {
    scheme: string
    network: string
}

interface SupportedResponse {
    kinds: SupportedKind[]
}

async function checkSupport() {
    try {
        console.log("🔍 Checking x402 facilitator support...")
        console.log(`📡 Facilitator: ${FACILITATOR_URL}\n`)

        const response = await fetch(`${FACILITATOR_URL}/supported`)

        if (!response.ok) {
            console.error(`❌ Failed to fetch: ${response.status} ${response.statusText}`)
            return
        }

        const data = (await response.json()) as SupportedResponse

        console.log("✅ Supported payment schemes and networks:\n")

        if (!data.kinds || data.kinds.length === 0) {
            console.log("⚠️  No supported schemes found")
            return
        }

        // Group by scheme
        const byScheme = new Map<string, string[]>()
        for (const kind of data.kinds) {
            if (!byScheme.has(kind.scheme)) {
                byScheme.set(kind.scheme, [])
            }
            byScheme.get(kind.scheme)?.push(kind.network)
        }

        for (const [scheme, networks] of byScheme) {
            console.log(`📋 Scheme: ${scheme}`)
            for (const network of networks) {
                const emoji = network.toLowerCase().includes("solana") ? "🌐" : "⛓️"
                console.log(`   ${emoji} ${network}`)
            }
            console.log()
        }

        // Check mainnet support
        console.log("\n🔍 Mainnet Support:")
        const baseMainnet = data.kinds.some((kind) => kind.network === "base")
        const solanaMainnet = data.kinds.some((kind) => kind.network === "solana")

        if (baseMainnet) {
            console.log("   ✅ Base mainnet supported")
        } else {
            console.log("   ⏳ Base mainnet not yet available")
        }

        if (solanaMainnet) {
            console.log("   ✅ Solana mainnet supported")
        } else {
            console.log("   ⏳ Solana mainnet not yet available")
        }

        if (!baseMainnet && !solanaMainnet) {
            console.log("\n⚠️  Only testnets are currently supported (base-sepolia, solana-devnet)")
        }
    } catch (error) {
        console.error("❌ Error checking facilitator support:")
        console.error(error)
    }
}

checkSupport()

