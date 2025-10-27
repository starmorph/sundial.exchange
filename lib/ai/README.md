# Sundial AI Integration

This directory contains the modular AI chat integration built with Vercel AI SDK and OpenAI, following Next.js 15 best practices.

## 📁 Structure

```
lib/ai/
├── tools/
│   ├── index.ts                  # Tool registry & exports
│   ├── dex-overview.ts           # Free DEX analytics tool
│   └── dex-overview-premium.ts   # Premium DEX tool (x402 payment)
├── config.ts                     # AI model config & system prompts
├── types.ts                      # TypeScript interfaces for tools
├── utils.ts                      # AI-specific utility functions
└── README.md                     # This file
```

## 🚀 Quick Start

### Adding a New Tool

1. **Create the tool file** in `lib/ai/tools/`:

```typescript
// lib/ai/tools/my-new-tool.ts
import { z } from "zod"

export const myNewTool = {
    description: "Clear description of what this tool does",
    inputSchema: z.object({
        param1: z.string().describe("Description for AI"),
        param2: z.number().optional().describe("Optional parameter"),
    }),
    execute: async ({ param1, param2 }) => {
        // Tool logic here
        return {
            result: "Your data",
            generatedAt: new Date().toISOString(),
        }
    },
}
```

2. **Register the tool** in `lib/ai/tools/index.ts`:

```typescript
import { myNewTool } from "./my-new-tool"

export const tools = {
    "dex-overview": dexOverviewTool,
    "my-new-tool": myNewTool, // Add here
}

export const toolMetadata = {
    "my-new-tool": {
        displayName: "My New Tool",
        category: "Category Name",
        requiresPayment: false,
    },
}
```

3. **That's it!** The tool is now available in the chat interface.

## 💳 Creating a Paid Tool (x402)

For tools that require payment, add payment metadata:

```typescript
export const myPaidTool = {
    description: "[PREMIUM - 0.05 USDC] Enhanced analytics with...",
    inputSchema: z.object({
        query: z.string(),
    }),
    payment: {
        requiresPayment: true,
        priceUSDC: 0.05,
        endpoint: "/api/my-paid-endpoint",
    },
    execute: async ({ query }) => {
        // Payment verification would happen here
        // See lib/x402/tool-payments.ts for helpers
        
        return {
            data: "Premium data",
            generatedAt: new Date().toISOString(),
        }
    },
}
```

Update the tool metadata:

```typescript
export const toolMetadata = {
    "my-paid-tool": {
        displayName: "My Paid Tool",
        category: "Premium",
        requiresPayment: true, // Set to true
    },
}
```

## 🛠 Utility Functions

### `extractLatestUserMessage(messages: UIMessage[]): string`
Extracts the most recent user message text from the message array.

```typescript
import { extractLatestUserMessage } from "@/lib/ai/utils"

const userMessage = extractLatestUserMessage(messages)
```

### `formatToolName(toolKey: string): string`
Formats tool names for UI display (e.g., "dex-overview" → "Dex Overview").

```typescript
import { formatToolName } from "@/lib/ai/utils"

const displayName = formatToolName("dex-overview") // "Dex Overview"
```

### `isValidSolanaAddress(address: string): boolean`
Validates Solana wallet address format.

```typescript
import { isValidSolanaAddress } from "@/lib/ai/utils"

if (isValidSolanaAddress(walletAddress)) {
    // Process payment
}
```

## ⚙️ Configuration

### AI Model Settings (`config.ts`)

```typescript
export const AI_CONFIG = {
    model: "gpt-4o-mini",
    temperature: 0.7,
}
```

### System Prompt

The system prompt defines the AI's personality and capabilities. Edit `SYSTEM_PROMPT` in `config.ts`:

```typescript
export const SYSTEM_PROMPT = `You are Sundial, a Solana-focused AI assistant...`
```

## 🔄 Integration with Chat Route

The chat route (`app/api/chat/route.ts`) is now minimal and clean:

```typescript
import { AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config"
import { tools } from "@/lib/ai/tools"
import { extractLatestUserMessage } from "@/lib/ai/utils"

const stream = await streamText({
    model: openai(AI_CONFIG.model),
    system: SYSTEM_PROMPT,
    tools,
    temperature: AI_CONFIG.temperature,
    // ...
})
```

## 📊 Tool Execution Flow

```
User Message
    ↓
AI Determines Tool Needed
    ↓
Tool Called (execute function runs)
    ↓
    ├─ Free Tool → Execute immediately
    └─ Paid Tool → Trigger payment flow
         ↓
    Payment Modal (frontend)
         ↓
    x402 Payment Settlement
         ↓
    Tool Execution Continues
         ↓
Results Returned to AI
    ↓
AI Formats Response to User
```

## 🧪 Testing Tools

You can test tools independently:

```typescript
import { dexOverviewTool } from "@/lib/ai/tools/dex-overview"

const result = await dexOverviewTool.execute({
    protocols: ["raydium", "orca"],
})
console.log(result)
```

## 📝 TypeScript Types

All tool-related types are in `types.ts`:

- `AITool<TInput, TOutput>` - Base tool structure
- `ToolResult<T>` - Standard result format
- `ToolPaymentMetadata` - x402 payment metadata
- `PayableAITool<TInput, TOutput>` - Tool with payment support

## 🔒 Security Considerations

1. **Payment Verification**: Always verify payments server-side before executing premium tools
2. **Rate Limiting**: Consider implementing rate limits per wallet address
3. **Input Validation**: All inputs are validated via Zod schemas
4. **Error Handling**: Tools should return structured errors, never throw

## 📚 Related Files

- `lib/x402/tool-payments.ts` - x402 payment utilities
- `lib/x402/dex-overview-payment.ts` - Example payment implementation
- `components/sundial-chat/chat-interface.tsx` - Chat UI component
- `components/ai-elements/` - UI components for tool rendering

## 🎯 Best Practices

1. **Keep tools focused** - One tool, one responsibility
2. **Use clear descriptions** - The AI uses these to decide when to call the tool
3. **Return structured data** - Always include `generatedAt` timestamp
4. **Handle errors gracefully** - Return error objects, don't throw
5. **Document schemas** - Use `.describe()` on Zod schemas to help the AI
6. **Test independently** - Tools should work standalone without AI
7. **Version your endpoints** - For paid tools, version the API endpoints

## 🚧 Future Enhancements

- [ ] Add middleware for automatic payment verification
- [ ] Implement tool usage analytics
- [ ] Create tool templates for common patterns
- [ ] Add streaming support for long-running tools
- [ ] Build tool testing framework
- [ ] Add tool performance monitoring

