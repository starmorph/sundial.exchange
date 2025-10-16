import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Sundial Exchange – Solana DEX | Best Rates, Low Fees"
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = "image/png"

/**
 * Generates dynamic Open Graph image for Sundial Exchange
 */
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "system-ui",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 20,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <img
                            src="/favicon.png"
                            alt="Sundial favicon"
                            width={96}
                            height={96}
                            style={{ borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
                        />
                        <div
                            style={{
                                fontSize: 80,
                                fontWeight: 900,
                                color: "white",
                                textAlign: "left",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Sundial Exchange
                        </div>
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 500,
                            color: "rgba(255, 255, 255, 0.9)",
                            textAlign: "center",
                        }}
                    >
                        Solana DEX • Best Rates • Low Fees
                    </div>
                    <div
                        style={{
                            fontSize: 30,
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.8)",
                            textAlign: "center",
                            marginTop: 20,
                        }}
                    >
                        Fast • Secure • Low Fees
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        },
    )
}

