import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'DEX Analytics'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { dexId: string } }) {
    const dexId = params.dexId
    const displayName = dexId.charAt(0).toUpperCase() + dexId.slice(1).replace(/-/g, ' ')

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '30px',
                        }}
                    >
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#ffd700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '16px',
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span
                            style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#ffffff',
                            }}
                        >
                            Sundial Exchange
                        </span>
                    </div>

                    <h1
                        style={{
                            fontSize: '72px',
                            fontWeight: 'bold',
                            color: '#ffd700',
                            marginBottom: '20px',
                            textAlign: 'center',
                        }}
                    >
                        {displayName}
                    </h1>

                    <p
                        style={{
                            fontSize: '32px',
                            color: '#a1a1aa',
                            marginBottom: '40px',
                            textAlign: 'center',
                        }}
                    >
                        DEX Analytics on Solana
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: '40px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px 40px',
                                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 215, 0, 0.2)',
                            }}
                        >
                            <span style={{ fontSize: '18px', color: '#a1a1aa' }}>Volume</span>
                            <span style={{ fontSize: '24px', color: '#ffd700', fontWeight: 'bold' }}>24h • 7d • 30d</span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px 40px',
                                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 215, 0, 0.2)',
                            }}
                        >
                            <span style={{ fontSize: '18px', color: '#a1a1aa' }}>Charts</span>
                            <span style={{ fontSize: '24px', color: '#ffd700', fontWeight: 'bold' }}>Real-time Data</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
