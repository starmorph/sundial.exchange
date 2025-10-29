"use client"

import { ChevronDown, Clock, Menu } from 'lucide-react'
import dynamic from "next/dynamic"
import Link from 'next/link'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Separator } from './ui/separator'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
)

export function Navbar() {
  const navLinkClass = "flex items-center gap-1.5 px-3 h-8 rounded-md bg-muted/50 border border-border/50 hover:bg-muted/70 transition-all text-xs font-mono font-semibold text-muted-foreground hover:text-foreground tracking-wide"

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border/20 bg-black/40 backdrop-blur-xl z-40">
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20">
                <Clock className="h-4 w-4 text-primary" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-mono font-bold tracking-tight text-foreground">SUNDIAL</span>
                <span className="text-[12px] font-mono tracking-wider text-muted-foreground/100">EXCHANGE</span>
              </div>
            </Link>
          </div>
          <div className="hidden h-4 w-px bg-border/40 sm:block" />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/swap"
            className="flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/40 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wide text-foreground transition-all hover:bg-muted/60 md:hidden"
          >
            Swap
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/swap" className={navLinkClass}>
              SWAP
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className={`${navLinkClass} gap-2`}>
                  DEX ANALYTICS
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dex-analytics" className="flex w-full items-center gap-2">
                    DEX Overview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dex-analytics/humidif" className="flex w-full items-center gap-2">
                    Humidifi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dex-analytics/raydium-amm" className="flex w-full items-center gap-2">
                    Raydium
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dex-analytics/meteora-dlmm" className="flex w-full items-center gap-2">
                    Meteora
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/chat" className={navLinkClass}>
              CHAT
            </Link>
            <Link
              href="https://registry.scalar.com/@starmorph/apis/sundial-exchange-api/latest"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 text-xs font-mono font-semibold tracking-wide text-primary transition-all hover:bg-primary/20 hover:text-primary/90 h-8"
            >
              API DOCS
            </Link>
          </div>

          <div className="flex items-center">
            <WalletMultiButton />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="gap-0 p-0">
              <SheetHeader className="px-6 pb-4 pt-6">
                <SheetTitle className="text-lg font-semibold">Navigation</SheetTitle>
              </SheetHeader>
              <Separator className="opacity-40" />
              <div className="flex flex-col gap-4 px-6 py-6">
                <SheetClose asChild>
                  <Link href="/swap" className="text-sm font-semibold tracking-wide text-foreground">
                    Swap
                  </Link>
                </SheetClose>
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dex Analytics</span>
                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link href="/dex-analytics" className="text-sm font-medium text-foreground">
                        Dex Overview
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/dex-analytics/humidif" className="text-sm font-medium text-foreground">
                        Humidifi
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/dex-analytics/raydium-amm" className="text-sm font-medium text-foreground">
                        Raydium
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/dex-analytics/meteora-dlmm" className="text-sm font-medium text-foreground">
                        Meteora
                      </Link>
                    </SheetClose>
                  </div>
                </div>
                <SheetClose asChild>
                  <Link href="/chat" className="text-sm font-semibold tracking-wide text-foreground">
                    Chat
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="https://registry.scalar.com/@starmorph/apis/sundial-exchange-api/latest"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold tracking-wide text-primary"
                  >
                    API Reference
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
