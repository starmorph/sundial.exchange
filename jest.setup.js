require('@testing-library/jest-dom')

// Mock environment variables
process.env.X402_RECIPIENT_ADDRESS = '0xde7ae42f066940c50efeed40fd71dde630148c0a'

// Mock global fetch
global.fetch = jest.fn()

// Mock TextEncoder/TextDecoder for Edge runtime APIs
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock btoa/atob for base64 encoding
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64')
global.atob = (str) => Buffer.from(str, 'base64').toString('binary')

