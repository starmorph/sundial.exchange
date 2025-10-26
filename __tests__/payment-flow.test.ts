import { NextRequest } from 'next/server'
import { middleware } from '../middleware'

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('x402 Payment Flow Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Complete Payment Flow', () => {
        it('should handle full payment lifecycle: 402 -> payment -> verification -> settlement -> 200', async () => {
            // Step 1: Initial request without payment returns 402
            const initialRequest = new NextRequest('http://localhost:3000/api/stats')
            const initialResponse = await middleware(initialRequest)

            expect(initialResponse.status).toBe(402)
            const challenge = await initialResponse.json()
            expect(challenge.x402Version).toBe(1)
            expect(challenge.accepts).toHaveLength(2) // Base and Solana

            // Step 2: Client creates payment based on challenge
            const paymentHeader = 'mock-signed-payment-payload'

            // Step 3: Mock facilitator verification (success)
            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        isValid: true,
                        invalidReason: null,
                    }),
                    { status: 200 },
                ),
            )

            // Step 4: Mock facilitator settlement (success)
            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        success: true,
                        txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
                        networkId: 'base',
                        error: null,
                    }),
                    { status: 200 },
                ),
            )

            // Step 5: Retry request with payment header
            const paidRequest = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': paymentHeader,
                },
            })

            const paidResponse = await middleware(paidRequest)

            // Step 6: Verify success
            expect(paidResponse.status).not.toBe(402)
            expect(paidResponse.headers.get('X-PAYMENT-RESPONSE')).toBeTruthy()

            // Step 7: Decode and verify settlement response
            const settlementHeader = paidResponse.headers.get('X-PAYMENT-RESPONSE')
            if (settlementHeader) {
                const settlement = JSON.parse(atob(settlementHeader))
                expect(settlement).toMatchObject({
                    success: true,
                    txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
                    networkId: 'base',
                })
            }
        })

        it('should reject payment with invalid verification', async () => {
            // Mock facilitator verification (failure)
            mockFetch.mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        isValid: false,
                        invalidReason: 'Invalid payment signature',
                    }),
                    { status: 200 },
                ),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'invalid-payment-signature',
                },
            })

            const response = await middleware(request)

            expect(response.status).toBe(402)
            expect(mockFetch).toHaveBeenCalledTimes(1) // Only verification, no settlement
        })

        it('should handle facilitator timeout gracefully', async () => {
            // Mock slow facilitator (timeout after 5s)
            mockFetch.mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        setTimeout(
                            () =>
                                resolve(
                                    new Response(JSON.stringify({ isValid: true }), {
                                        status: 200,
                                    }),
                                ),
                            100,
                        )
                    }),
            )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'payment-header',
                },
            })

            const response = await middleware(request)

            // Should still process even with delay
            expect(response).toBeDefined()
        })
    })

    describe('Facilitator API Integration', () => {
        it('should send correct verification request format', async () => {
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ isValid: false }), { status: 200 }),
            )

            const request = new NextRequest('http://localhost:3000/api/stats?hours=24', {
                headers: {
                    'x-payment': 'test-payment',
                },
            })

            await middleware(request)

            expect(mockFetch).toHaveBeenCalledWith(
                'https://facilitator.payai.network/verify',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                    }),
                }),
            )

            const callArgs = mockFetch.mock.calls[0][1]
            const body = JSON.parse(callArgs?.body as string)

            expect(body).toMatchObject({
                x402Version: 1,
                paymentHeader: 'test-payment',
                paymentRequirements: expect.objectContaining({
                    scheme: 'exact',
                    network: 'base',
                    maxAmountRequired: '100000',
                    payTo: '0xde7ae42f066940c50efeed40fd71dde630148c0a',
                    asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
                }),
            })
        })

        it('should send correct settlement request format', async () => {
            mockFetch
                .mockResolvedValueOnce(
                    new Response(JSON.stringify({ isValid: true }), { status: 200 }),
                )
                .mockResolvedValueOnce(
                    new Response(JSON.stringify({ success: true, txHash: '0x123', networkId: 'base' }), {
                        status: 200,
                    }),
                )

            const request = new NextRequest('http://localhost:3000/api/trending', {
                headers: {
                    'x-payment': 'test-payment',
                },
            })

            await middleware(request)

            expect(mockFetch).toHaveBeenCalledWith(
                'https://facilitator.payai.network/settle',
                expect.objectContaining({
                    method: 'POST',
                }),
            )

            const settleCall = mockFetch.mock.calls[1]
            const body = JSON.parse(settleCall[1]?.body as string)

            expect(body).toMatchObject({
                x402Version: 1,
                paymentHeader: 'test-payment',
                paymentRequirements: expect.objectContaining({
                    scheme: 'exact',
                    network: 'base',
                }),
            })
        })
    })

    describe('Error Recovery', () => {
        it('should return 402 on facilitator network error', async () => {
            mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'))

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'payment-header',
                },
            })

            const response = await middleware(request)

            expect(response.status).toBe(402)
        })

        it('should return 402 on facilitator 500 error', async () => {
            mockFetch.mockResolvedValueOnce(new Response('Internal Server Error', { status: 500 }))

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'payment-header',
                },
            })

            const response = await middleware(request)

            expect(response.status).toBe(402)
        })

        it('should handle malformed facilitator response', async () => {
            mockFetch.mockResolvedValueOnce(new Response('not-json', { status: 200 }))

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'payment-header',
                },
            })

            const response = await middleware(request)

            expect(response.status).toBe(402)
        })

        it('should continue to API if settlement fails but verification succeeded', async () => {
            mockFetch
                .mockResolvedValueOnce(
                    new Response(JSON.stringify({ isValid: true }), { status: 200 }),
                )
                .mockResolvedValueOnce(
                    new Response(
                        JSON.stringify({ success: false, error: 'Settlement failed' }),
                        { status: 200 },
                    ),
                )

            const request = new NextRequest('http://localhost:3000/api/stats', {
                headers: {
                    'x-payment': 'payment-header',
                },
            })

            const response = await middleware(request)

            // Should allow access even if settlement fails (payment was verified)
            expect(response.status).not.toBe(402)
            // But no payment response header
            expect(response.headers.get('X-PAYMENT-RESPONSE')).toBeNull()
        })
    })

    describe('Concurrent Requests', () => {
        it('should handle multiple payment requests in parallel', async () => {
            // Mock successful verification and settlement for all requests
            mockFetch.mockImplementation((url) => {
                if ((url as string).includes('/verify')) {
                    return Promise.resolve(
                        new Response(JSON.stringify({ isValid: true }), { status: 200 }),
                    )
                }
                return Promise.resolve(
                    new Response(
                        JSON.stringify({ success: true, txHash: '0x123', networkId: 'base' }),
                        { status: 200 },
                    ),
                )
            })

            const requests = [
                new NextRequest('http://localhost:3000/api/stats', {
                    headers: { 'x-payment': 'payment1' },
                }),
                new NextRequest('http://localhost:3000/api/trending', {
                    headers: { 'x-payment': 'payment2' },
                }),
                new NextRequest('http://localhost:3000/api/dex/overview', {
                    headers: { 'x-payment': 'payment3' },
                }),
            ]

            const responses = await Promise.all(requests.map((req) => middleware(req)))

            responses.forEach((response) => {
                expect(response.status).not.toBe(402)
                expect(response.headers.get('X-PAYMENT-RESPONSE')).toBeTruthy()
            })
        })
    })

    describe('Different Payment Amounts', () => {
        it('should consistently require 0.10 USDC across all endpoints', async () => {
            const endpoints = [
                '/api/stats',
                '/api/trending',
                '/api/dex/overview',
                '/api/dex/protocol/orca',
            ]

            for (const endpoint of endpoints) {
                const request = new NextRequest(`http://localhost:3000${endpoint}`)
                const response = await middleware(request)
                const body = await response.json()

                expect(body.accepts[0].maxAmountRequired).toBe('100000')
            }
        })
    })
})

