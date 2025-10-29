import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Bot, Clock, Code, Coins, DollarSign, ExternalLink, Shield, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-black to-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
                </div>
                <div className="container mx-auto px-4 py-24 md:py-40 max-w-7xl relative">
                    <div className="max-w-5xl mx-auto text-center space-y-10">
                        <Badge className="bg-primary text-black border-primary text-sm px-5 py-2 font-bold tracking-wide shadow-lg shadow-primary/50">
                            <Zap className="w-4 h-4 mr-2" />
                            POWERED BY JUPITER ULTRA • X402 NATIVE
                        </Badge>

                        <h1 className="text-6xl md:text-8xl font-bold text-balance leading-[1.1] tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                            Pay Per Insight.
                            <br />
                            <span className="text-primary">Trade Like Tomorrow.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed font-light">
                            Micropaid access to Solana DEX analytics. No subscriptions, no KYC—just verifiable alpha.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
                            <Button asChild size="lg" className="text-lg px-10 py-7 group font-semibold shadow-lg shadow-primary/30">
                                <Link href="/swap">
                                    Start Trading
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="text-lg px-10 py-7 bg-transparent border-2 border-border hover:border-primary font-semibold hover:bg-primary/10"
                            >
                                <Link href="/chat">Try AI Assistant</Link>
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-8 pt-10 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                <span className="font-medium">$2.4B+ Volume</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                <span className="font-medium">1M+ Swaps</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 border-b border-border">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-20">
                        <Badge className="bg-primary text-black border-primary mb-6 font-bold tracking-wide shadow-lg shadow-primary/50">
                            WHY SUNDIAL
                        </Badge>
                        <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                            Micropayments Meet Real-Time Analytics
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                            No subscriptions, no gatekeeping—just instant insights.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group">
                            <CardContent className="p-10 space-y-5">
                                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 duration-300 shadow-lg shadow-primary/50">
                                    <DollarSign className="w-7 h-7 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight text-white">x402 Micropayments</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Pay $0.10 for stats, $0.001 for pool analytics. No credit cards, no friction—just instant access.
                                </p>
                                <div className="pt-2">
                                    <Badge variant="outline" className="bg-success/20 text-success border-success font-semibold">
                                        0% Platform Fees
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group">
                            <CardContent className="p-10 space-y-5">
                                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 duration-300 shadow-lg shadow-primary/50">
                                    <Bot className="w-7 h-7 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight text-white">AI Chat & Forecasts</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Ask "Raydium TVL?" and get instant, paid insights. Built for traders and autonomous agents.
                                </p>
                                <div className="pt-2">
                                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary font-semibold">
                                        GPT-5 Powered
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group">
                            <CardContent className="p-10 space-y-5">
                                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 duration-300 shadow-lg shadow-primary/50">
                                    <TrendingUp className="w-7 h-7 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight text-white">Real-Time Dashboards</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Spot trends before they pump. Verifiable data via EigenLayer proofs, powered by Helius DAS.
                                </p>
                                <div className="pt-2">
                                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary font-semibold">
                                        {"<"}100ms Loads
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-24 border-b border-border bg-gradient-to-b from-black via-primary/5 to-black">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-20">
                        <Badge className="bg-primary text-black border-primary mb-6 font-bold tracking-wide shadow-lg shadow-primary/50">
                            AGENT-READY API
                        </Badge>
                        <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                            Built for AI Agents & Developers
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                            Pay-per-query API with x402 micropayments. No API keys, no subscriptions—just instant data access.
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <Button
                                asChild
                                variant="outline"
                                className="border-primary hover:border-primary hover:bg-primary hover:text-black bg-black text-white font-bold shadow-lg shadow-primary/30"
                            >
                                <a
                                    href="https://registry.scalar.com/@starmorph/apis/sundial-exchange-api/latest"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View API Docs
                                    <ExternalLink className="ml-2 w-4 h-4" />
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="border-border hover:border-primary hover:bg-primary/10 bg-black text-white font-bold"
                            >
                                <a href="http://sundial.exchange/openapi.yaml" target="_blank" rel="noopener noreferrer">
                                    OpenAPI Spec
                                    <ExternalLink className="ml-2 w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <Card className="border-border bg-card backdrop-blur hover:border-primary/50 transition-all">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">GET</Badge>
                                        <h3 className="text-xl font-bold font-mono text-white">/api/stats</h3>
                                    </div>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        $0.10
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Real-time TPS, SOL price, TVL, and 24h volume with percentage changes. Perfect for dashboards and
                                    monitoring.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        TPS
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        SOL Price
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        TVL
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        24h Volume
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card backdrop-blur hover:border-primary/50 transition-all">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">GET</Badge>
                                        <h3 className="text-xl font-bold font-mono text-white">/api/trending</h3>
                                    </div>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        $0.10
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Trending tokens with 24h price changes and historical data. Spot the next pump before it happens.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        Token Prices
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        24h Change
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        Price History
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card backdrop-blur hover:border-primary/50 transition-all">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">GET</Badge>
                                        <h3 className="text-xl font-bold font-mono text-white">/api/pools/analytics</h3>
                                    </div>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        $0.001
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Deep pool analytics with liquidity, volume, fees, and APR/APY. Powered by Jupiter Ultra API.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        Liquidity
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        Volume
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        Fees
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        APR/APY
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card backdrop-blur hover:border-primary/50 transition-all">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">GET</Badge>
                                        <h3 className="text-xl font-bold font-mono text-white">/api/premium-insight</h3>
                                    </div>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        $10.00
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    AI-generated 24-48h Solana market forecasts with DeFiLlama data. Premium insights for serious traders.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        AI Forecast
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        Market Sentiment
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        Whale Activity
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-12 border-primary bg-primary/10 max-w-5xl mx-auto shadow-2xl shadow-primary/20">
                        <CardContent className="p-10 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/50">
                                    <Bot className="w-6 h-6 text-black" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-white">x402 Payment Protocol</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        AI agents can pay via x402 to retrieve token data instantly. Supports both{" "}
                                        <span className="text-primary font-bold">Base (Ethereum L2)</span> and{" "}
                                        <span className="text-primary font-bold">Solana</span> networks with{" "}
                                        <span className="text-success font-bold">zero gas fees</span> through the PayAI facilitator.
                                    </p>
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <Badge className="bg-primary text-black border-primary font-bold">Base Network</Badge>
                                        <Badge className="bg-primary text-black border-primary font-bold">Solana Network</Badge>
                                        <Badge className="bg-success/30 text-success border-success font-bold">Zero Gas Fees</Badge>
                                        <Badge className="bg-primary text-black border-primary font-bold">USDC Payments</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="py-24 border-b border-border">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                            Built for Everyone in Solana DeFi
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                            From retail traders to AI agents—Sundial delivers the data you need, when you need it.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                                <Coins className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight text-white">Retail Traders</h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Quick volume checks without ads or subscription fees. One-click x402 queries for instant insights.
                            </p>
                            <Button
                                asChild
                                variant="link"
                                className="text-primary p-0 h-auto text-base font-bold hover:text-primary/80"
                            >
                                <Link href="/swap">
                                    Start Trading <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                                <Code className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight text-white">Developers & Bots</h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Integrate DEX data without API keys or gas wars. Scalar-compliant OpenAPI with TypeScript SDK.
                            </p>
                            <Button
                                asChild
                                variant="link"
                                className="text-primary p-0 h-auto text-base font-bold hover:text-primary/80"
                            >
                                <Link href="/portfolio">
                                    View Portfolio <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                                <Bot className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight text-white">AI Agents</h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Verifiable feeds for autonomous trading. x402scan agents with EigenLayer proofs for trust.
                            </p>
                            <Button
                                asChild
                                variant="link"
                                className="text-primary p-0 h-auto text-base font-bold hover:text-primary/80"
                            >
                                <Link href="/chat">
                                    Try AI Chat <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 border-b border-border">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <Badge className="bg-primary text-black border-primary font-bold tracking-wide shadow-lg shadow-primary/50">
                                POWERED BY JUPITER
                            </Badge>
                            <h2 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white">
                                Best Prices. Instant Execution. Zero Bloat.
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed font-light">
                                Built on Jupiter Ultra with 34x sandwich protection. Access $892M+ Solana volume with verifiable
                                analytics powered by DeFiLlama.
                            </p>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-start gap-4">
                                    <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-lg text-white">Non-Custodial & Audited</p>
                                        <p className="text-muted-foreground">Your keys, your crypto. Always.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-lg text-white">Real-Time Data Feeds</p>
                                        <p className="text-muted-foreground">Helius DAS integration for instant updates.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Zap className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-lg text-white">Agent-Ready APIs</p>
                                        <p className="text-muted-foreground">ERC-8004 compliant for reputation scoring.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card className="border-border bg-card p-10 shadow-2xl shadow-primary/20">
                            <CardContent className="p-0 space-y-8">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground font-medium">Total Value Locked</span>
                                        <Badge variant="outline" className="bg-success/20 text-success border-success font-bold">
                                            Live
                                        </Badge>
                                    </div>
                                    <p className="text-5xl font-bold tracking-tight text-white">$892M</p>
                                    <p className="text-sm text-success font-medium">+12.4% this week</p>
                                </div>

                                <div className="h-px bg-border" />

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground font-medium">24h Volume</p>
                                        <p className="text-3xl font-bold tracking-tight text-white">$22.4B</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground font-medium">Total Swaps</p>
                                        <p className="text-3xl font-bold tracking-tight text-white">1.2M+</p>
                                    </div>
                                </div>

                                <div className="h-px bg-border" />

                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground font-medium">Query Cost</p>
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-4xl font-bold text-primary tracking-tight">$0.10</p>
                                        <p className="text-sm text-muted-foreground">per insight</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    <Card className="border-primary bg-gradient-to-br from-primary/20 via-primary/10 to-black shadow-2xl shadow-primary/30">
                        <CardContent className="p-16 md:p-20 text-center space-y-10">
                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-6xl font-bold text-balance tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                                    Ready to Trade Smarter?
                                </h2>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance font-light">
                                    Join Sundial for instant DEX analytics. No subscriptions, no KYC—just alpha.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                <Button
                                    asChild
                                    size="lg"
                                    className="text-lg px-10 py-7 group font-bold shadow-2xl shadow-primary/50 bg-primary text-black hover:bg-primary/90"
                                >
                                    <Link href="/swap">
                                        Connect Wallet to Swap
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="text-lg px-10 py-7 bg-black border-2 border-border hover:border-primary font-bold hover:bg-primary hover:text-black text-white shadow-lg shadow-primary/20"
                                >
                                    <Link href="/chat">Ask AI Assistant</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}
