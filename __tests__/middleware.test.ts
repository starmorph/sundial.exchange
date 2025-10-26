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

        it('should return valid x402 challenge structure with both Base and Solana', async () => {
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
                    expect.objectContaining({
                        scheme: 'exact',
                        network: 'solana',
                        payTo: 'Aia9ukbSndCSrTnv8geoSjeJcY6Q5GvdsMSo1busrr5K',
                        asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                        maxAmountRequired: '100000', // 0.10 USDC
                    }),
                ]),
            })
            expect(body.accepts).toHaveLength(2)
        })

        it('should include proper outputSchema for /api/stats (x402scan compatible)', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats')

            const response = await middleware(request)
            const body = await response.json()

            const outputSchema = body.accepts[0].outputSchema

            // Should have input and output fields per x402scan spec
            expect(outputSchema).toHaveProperty('input')
            expect(outputSchema).toHaveProperty('output')

            // Input should specify HTTP method
            expect(outputSchema.input).toMatchObject({
                type: 'http',
                method: 'GET',
            })

            // Output should describe response structure
            expect(outputSchema.output).toHaveProperty('type', 'object')
            expect(outputSchema.output.properties).toHaveProperty('tps')
            expect(outputSchema.output.properties).toHaveProperty('solPriceUsd')
            expect(outputSchema.output.properties).toHaveProperty('tvlUsd')
        })

        it('should include description in challenge for both networks', async () => {
            const request = new NextRequest('http://localhost:3000/api/trending')

            const response = await middleware(request)
            const body = await response.json()

            expect(body.accepts[0].description).toContain('/api/trending')
            expect(body.accepts[0].description).toContain('Sundial Exchange API')
            expect(body.accepts[0].description).toContain('Base')

            expect(body.accepts[1].description).toContain('/api/trending')
            expect(body.accepts[1].description).toContain('Sundial Exchange API')
            expect(body.accepts[1].description).toContain('Solana')
        })

        it('should include proper resource URL', async () => {
            const request = new NextRequest('http://localhost:3000/api/stats?hours=24')

            const response = await middleware(request)
            const body = await response.json()

            // Resource URL is normalized to canonical domain (without www)
            expect(body.accepts[0].resource).toBe('https://sundial.exchange/api/stats?hours=24')
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
                'https://facilitator.payai.network/verify',
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
                'https://facilitator.payai.network/settle',
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

    describe('Solana Network Support', () => {
        it('should accept Solana payment header and try both networks', async () => {
            const solanaPaymentHeader = 'mock-solana-payment-header'

            // First attempt with Base (fails)
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: false, invalidReason: 'Wrong network' }), {
                    status: 200,
                }),
            )

            // Second attempt with Solana (succeeds)
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: true, invalidReason: null }), {
                    status: 200,
                }),
            )

            // Settlement
            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: true,
                        txHash: '5J7Xz...mockSolanaHash',
                        networkId: 'solana',
                        error: null,
                    }),
                    {
                        status: 200,
                    },
                ),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': solanaPaymentHeader,
                },
            })

            const response = await middleware(request)

            expect(response.status).toBe(200)
            // Should have tried Base, then Solana, then settle
            expect(mockFetch).toHaveBeenCalledTimes(3)
        })

        it('should use correct Solana USDC contract when Solana network succeeds', async () => {
            const solanaPaymentHeader = 'mock-solana-payment'

            // Base verification fails
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: false, invalidReason: 'Wrong network' }), {
                    status: 200,
                }),
            )

            // Solana verification succeeds
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: true, invalidReason: null }), {
                    status: 200,
                }),
            )

            // Settlement
            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: true,
                        txHash: '5J7Xz...mockHash',
                        networkId: 'solana',
                        error: null,
                    }),
                    {
                        status: 200,
                    },
                ),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': solanaPaymentHeader,
                },
            })

            await middleware(request)

            // Check the second verify call (Solana)
            const solanaVerifyCall = mockFetch.mock.calls[1]
            const solanaVerifyBody = JSON.parse(solanaVerifyCall[1].body as string)

            expect(solanaVerifyBody.network).toBe('solana')
            expect(solanaVerifyBody.asset).toBe(
                'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Solana USDC
            )
            expect(solanaVerifyBody.payTo).toBe(
                'Aia9ukbSndCSrTnv8geoSjeJcY6Q5GvdsMSo1busrr5K', // Solana recipient
            )
        })

        it('should return Solana transaction hash in X-PAYMENT-RESPONSE', async () => {
            const solanaPaymentHeader = 'mock-solana-payment'
            const solanaTxHash = '5J7Xz8k3QmV9YnN2KpL4fG8hR6dS7wT3xU2jA1bC9eD4'

            // Base fails
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: false, invalidReason: 'Wrong network' }), {
                    status: 200,
                }),
            )

            // Solana succeeds
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: true, invalidReason: null }), {
                    status: 200,
                }),
            )

            // Settlement
            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: true,
                        txHash: solanaTxHash,
                        networkId: 'solana',
                        error: null,
                    }),
                    {
                        status: 200,
                    },
                ),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': solanaPaymentHeader,
                },
            })

            const response = await middleware(request)

            const paymentResponseHeader = response.headers.get('X-PAYMENT-RESPONSE')
            expect(paymentResponseHeader).toBeTruthy()

            if (paymentResponseHeader) {
                const decoded = JSON.parse(atob(paymentResponseHeader))
                expect(decoded).toMatchObject({
                    success: true,
                    txHash: solanaTxHash,
                    networkId: 'solana',
                })
            }
        })

        it('should handle Base payment header correctly', async () => {
            const basePaymentHeader = 'mock-base-payment'

            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: true, invalidReason: null }), {
                    status: 200,
                }),
            )

            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: true,
                        txHash: '0xmockBaseHash',
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
                    'x-payment': basePaymentHeader,
                },
            })

            await middleware(request)

            const verifyCall = mockFetch.mock.calls[0]
            const verifyBody = JSON.parse(verifyCall[1].body as string)

            expect(verifyBody.network).toBe('base')
            expect(verifyBody.asset).toBe(
                '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
            )
            expect(verifyBody.payTo).toBe(
                '0xde7ae42f066940c50efeed40fd71dde630148c0a', // Base recipient
            )
        })
    })
})

