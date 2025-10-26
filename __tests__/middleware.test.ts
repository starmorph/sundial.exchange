import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '../middleware'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('x402 Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Origin Exemption', () => {
        it('should bypass payment for localhost origin', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    origin: 'http://localhost:3000',
                },
            })

            const response = await middleware(request)

            expect(response instanceof NextResponse).toBe(true)
            expect(response.status).not.toBe(402)
        })

        it('should bypass payment for sundial.exchange origin', async () => {
            const request = new NextRequest('https://sundial.exchange/api/stats', {
                headers: {
                    origin: 'https://sundial.exchange',
                },
            })

            const response = await middleware(request)

            expect(response.status).not.toBe(402)
        })

        it('should bypass payment for www.sundial.exchange origin', async () => {
            const request = new NextRequest('https://sundial.exchange/api/stats', {
                headers: {
                    origin: 'https://www.sundial.exchange',
                },
            })

            const response = await middleware(request)

            expect(response.status).not.toBe(402)
        })

        it('should bypass payment with matching referer header', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    referer: 'http://localhost:3000/dashboard',
                },
            })

            const response = await middleware(request)

            expect(response.status).not.toBe(402)
        })

        it('should NOT bypass payment for external origin', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    origin: 'https://external-site.com',
                },
            })

            const response = await middleware(request)

            expect(response.status).toBe(402)
        })

        it('should NOT bypass payment when no origin or referer', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)

            expect(response.status).toBe(402)
        })
    })

    describe('402 Payment Required Response', () => {
        it('should return 402 status for unauthenticated requests', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)

            expect(response.status).toBe(402)
        })

        it('should return valid x402 challenge structure', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)
            const body = await response.json()

            expect(body).toMatchObject({
                x402Version: 1,
                error: 'X-PAYMENT header is required',
                accepts: expect.arrayContaining([
                    expect.objectContaining({
                        scheme: 'exact',
                        network: 'base',
                        payTo: '0xde7ae42f066940c50efeed40fd71dde630148c0a',
                        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
                        maxAmountRequired: '100000', // 0.10 USDC
                    }),
                ]),
            })
        })

        it('should include proper outputSchema for /api/stats', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)
            const body = await response.json()

            const outputSchema = body.accepts[0].outputSchema
            expect(outputSchema).toHaveProperty('type', 'object')
            expect(outputSchema.properties).toHaveProperty('tps')
            expect(outputSchema.properties).toHaveProperty('solPriceUsd')
            expect(outputSchema.properties).toHaveProperty('tvlUsd')
        })

        it('should include description in challenge', async () => {
            const request = new NextRequest('http://localhost:3000/api/trending')

            const response = await middleware(request)
            const body = await response.json()

            expect(body.accepts[0].description).toContain('/api/trending')
            expect(body.accepts[0].description).toContain('Sundial Exchange API')
        })

        it('should include proper resource URL', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats?hours=24')

            const response = await middleware(request)
            const body = await response.json()

            expect(body.accepts[0].resource).toBe('http://localhost:3000/api/stats?hours=24')
        })
    })

    describe('Payment Verification', () => {
        it('should verify payment with facilitator', async () => {
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: true, invalidReason: null }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }),
            )

            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: true,
                        txHash: '0x1234567890abcdef',
                        networkId: 'base',
                        error: null,
                    }),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    },
                ),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'valid-payment-header',
                },
            })

            const response = await middleware(request)

            expect(mockFetch).toHaveBeenCalledTimes(2)
            expect(mockFetch).toHaveBeenNthCalledWith(
                1,
                'https://x402.org/facilitator/verify',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('valid-payment-header'),
                }),
            )
            expect(response.status).not.toBe(402)
        })

        it('should call settlement endpoint after verification', async () => {
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: true, invalidReason: null }), {
                    status: 200,
                }),
            )

            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: true,
                        txHash: '0xabcdef1234567890',
                        networkId: 'base',
                        error: null,
                    }),
                    {
                        status: 200,
                    },
                ),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'valid-payment-header',
                },
            })

            await middleware(request)

            expect(mockFetch).toHaveBeenNthCalledWith(
                2,
                'https://x402.org/facilitator/settle',
                expect.objectContaining({
                    method: 'POST',
                }),
            )
        })

        it('should return 402 for invalid payment', async () => {
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: false, invalidReason: 'Invalid signature' }), {
                    status: 200,
                }),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'invalid-payment-header',
                },
            })

            const response = await middleware(request)

            expect(response.status).toBe(402)
        })

        it('should handle facilitator errors gracefully', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'))

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'payment-header',
                },
            })

            const response = await middleware(request)

            expect(response.status).toBe(402)
        })
    })

    describe('X-PAYMENT-RESPONSE Header', () => {
        it('should include X-PAYMENT-RESPONSE header on successful payment', async () => {
            const txHash = '0x1234567890abcdef1234567890abcdef12345678'

            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: true, invalidReason: null }), {
                    status: 200,
                }),
            )

            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: true,
                        txHash,
                        networkId: 'base',
                        error: null,
                    }),
                    {
                        status: 200,
                    },
                ),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'valid-payment',
                },
            })

            const response = await middleware(request)

            const paymentResponseHeader = response.headers.get('X-PAYMENT-RESPONSE')
            expect(paymentResponseHeader).toBeTruthy()

            if (paymentResponseHeader) {
                const decoded = JSON.parse(atob(paymentResponseHeader))
                expect(decoded).toMatchObject({
                    success: true,
                    txHash,
                    networkId: 'base',
                    timestamp: expect.any(String),
                })
            }
        })

        it('should not include X-PAYMENT-RESPONSE header if settlement fails', async () => {
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: true, invalidReason: null }), {
                    status: 200,
                }),
            )

            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: false,
                        txHash: null,
                        networkId: null,
                        error: 'Settlement failed',
                    }),
                    {
                        status: 200,
                    },
                ),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'valid-payment',
                },
            })

            const response = await middleware(request)

            const paymentResponseHeader = response.headers.get('X-PAYMENT-RESPONSE')
            expect(paymentResponseHeader).toBeNull()
        })
    })

    describe('Payment Requirements', () => {
        it('should use correct USDC amount (0.10 USD)', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)
            const body = await response.json()

            // 0.10 USD = 10 cents * 10000 = 100000 (USDC has 6 decimals)
            expect(body.accepts[0].maxAmountRequired).toBe('100000')
        })

        it('should use Base USDC contract address', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)
            const body = await response.json()

            expect(body.accepts[0].asset).toBe('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')
        })

        it('should set maxTimeoutSeconds to 300', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)
            const body = await response.json()

            expect(body.accepts[0].maxTimeoutSeconds).toBe(300)
        })

        it('should include extra metadata', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)
            const body = await response.json()

            expect(body.accepts[0].extra).toEqual({
                name: 'USD Coin',
                version: '2',
            })
        })
    })

    describe('Multiple Endpoints', () => {
        const endpoints = [
            '/api/stats',
            '/api/trending',
            '/api/dex/overview',
            '/api/dex/protocol/raydium',
            '/api/swap-log',
        ]

        endpoints.forEach((endpoint) => {
            it(`should protect ${endpoint} with 402`, async () => {
                const request = new NextRequest(`http://localhost:3000${endpoint}`)

                const response = await middleware(request)

                expect(response.status).toBe(402)
            })

            it(`should bypass ${endpoint} for localhost origin`, async () => {
                const request = new NextRequest(`http://localhost:3000${endpoint}`, {
                    headers: {
                        origin: 'http://localhost:3000',
                    },
                })

                const response = await middleware(request)

                expect(response.status).not.toBe(402)
            })
        })
    })
})

