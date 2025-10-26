import '@testing-library/jest-dom'

// Mock environment variables
process.env.X402_RECIPIENT_ADDRESS = '0xde7ae42f066940c50efeed40fd71dde630148c0a'

// Mock global fetch
global.fetch = jest.fn()

