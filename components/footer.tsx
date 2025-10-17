"use client"

import Link from "next/link"
import { Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Clock className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
              <span className="font-mono text-base font-semibold">Sundial Exchange</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              Industry-leading DeFi swap interface powered by Jupiter Ultra on Solana.
            </p>
          </div>

          {/* DEX Analytics */}
          <div className="space-y-3">
            <h3 className="font-mono font-semibold text-xs text-primary">DEX Analytics</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dex-analytics"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/dex-analytics/orca"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Orca
                </Link>
              </li>
              <li>
                <Link
                  href="/dex-analytics/raydium"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Raydium
                </Link>
              </li>
              <li>
                <Link
                  href="/dex-analytics/pump-fun"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pump.fun
                </Link>
              </li>
              <li>
                <Link
                  href="/dex-analytics/meteora"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Meteora
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="font-mono font-semibold text-xs text-primary">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/stablecoins"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Stablecoins
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-mono font-semibold text-xs text-primary">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © {new Date().getFullYear()} Sundial Exchange. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">Built on Solana • Powered by Jupiter Ultra</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
