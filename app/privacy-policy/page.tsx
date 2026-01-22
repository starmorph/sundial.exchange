import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Sundial Exchange. Learn how we handle your data on our non-custodial Solana DEX platform.",
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | Sundial Exchange',
    description: 'Privacy policy for Sundial Exchange decentralized exchange platform.',
    url: 'https://sundial.exchange/privacy-policy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-border/50">
          <CardHeader>
            <h1 className="text-3xl font-mono font-bold">Privacy Policy</h1>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Sundial Exchange. We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you about how we handle your data when you use our decentralized
                exchange platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">2. Data We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                As a decentralized application, Sundial Exchange operates on the Solana blockchain. We do not collect or
                store personal information. However, blockchain transactions are public and permanently recorded on the
                Solana network.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
                <li>Wallet addresses used for transactions</li>
                <li>Transaction history on the blockchain</li>
                <li>Usage analytics (anonymized)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">3. How We Use Your Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use anonymized data to improve our platform and provide better services. Your wallet address is only
                used to facilitate transactions through Jupiter Ultra's swap infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">4. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sundial Exchange integrates with Jupiter Ultra for swap functionality. Please review Jupiter's privacy
                policy for information about how they handle data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">5. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, correct, or delete any personal data we may hold. Since we operate on a
                decentralized blockchain, transaction data cannot be deleted from the public ledger.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">6. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this privacy policy, please contact us through our official channels.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
