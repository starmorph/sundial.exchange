import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Home, Search } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist. Explore Sundial Exchange for Solana DEX trading and analytics.",
}

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <Card className="border-border bg-card">
                    <CardContent className="p-12 text-center space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-8xl font-bold text-primary">404</h1>
                            <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
                            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                The page you're looking for doesn't exist or has been moved.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="font-semibold">
                                <Link href="/">
                                    <Home className="mr-2 w-4 h-4" />
                                    Back to Home
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="font-semibold">
                                <Link href="/swap">
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    Go to Swap
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="font-semibold">
                                <Link href="/dex-analytics">
                                    <Search className="mr-2 w-4 h-4" />
                                    DEX Analytics
                                </Link>
                            </Button>
                        </div>

                        <div className="pt-8 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Looking for something specific? Try these popular pages:
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                                <Link href="/chat" className="text-primary hover:underline text-sm">
                                    AI Chat
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <Link href="/dex-analytics" className="text-primary hover:underline text-sm">
                                    DEX Analytics
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <Link href="/api-reference" className="text-primary hover:underline text-sm">
                                    API Docs
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
