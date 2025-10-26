# OpenAPI Spec Automation Options

## Current Situation

You're manually updating `openapi.yaml` whenever API changes occur, which is:
- ❌ Error-prone
- ❌ Easy to forget
- ❌ Time-consuming
- ❌ Gets out of sync with actual API

## Best Solutions for Next.js 15

### ✅ **Option 1: TypeSpec (Recommended for Your Stack)**

**What:** Microsoft's TypeSpec (formerly TypeChat) - Define your API in TypeScript-like syntax, generate OpenAPI automatically.

**Why it's best for you:**
- Native TypeScript integration
- Single source of truth
- Generates OpenAPI 3.1 automatically
- Works great with Next.js API routes
- Can also generate TypeScript types from the same spec

**Setup:**
```bash
pnpm add -D @typespec/compiler @typespec/openapi3 @typespec/http
```

**Example (`api-spec.tsp`):**
```typespec
import "@typespec/http";
import "@typespec/openapi3";

using TypeSpec.Http;

@service({
  title: "Sundial Exchange API",
  version: "1.1.2",
})
namespace SundialAPI;

@route("/api/stats")
namespace Stats {
  @get
  op getStats(): {
    tps: float32 | null;
    solPriceUsd: float32 | null;
    tvlUsd: float32 | null;
    volume24hUsd: float32 | null;
    solChange24hPct: float32 | null;
    tvlChange24hPct: float32 | null;
    volume24hChangePct: float32 | null;
  };
}
```

**Generate OpenAPI:**
```bash
tsp compile api-spec.tsp --emit @typespec/openapi3
```

**Pros:**
- ✅ Type-safe
- ✅ Single source of truth
- ✅ Can generate both OpenAPI AND TypeScript types
- ✅ Microsoft-backed (good long-term support)

**Cons:**
- ⚠️ Learning curve
- ⚠️ New tool to maintain

---

### ✅ **Option 2: tsoa (Best for Decorator-Based)**

**What:** TypeScript OpenAPI with decorators directly in your Next.js API routes.

**Why it's good:**
- Generates OpenAPI from your actual API code
- Uses TypeScript decorators (similar to NestJS)
- Validates requests automatically

**Example:**
```typescript
// app/api/stats/route.ts
import { Get, Route, Response } from 'tsoa';

interface StatsResponse {
  tps: number | null;
  solPriceUsd: number | null;
  tvlUsd: number | null;
  // ...
}

@Route("api/stats")
export class StatsController {
  @Get("/")
  @Response<StatsResponse>(200)
  public async getStats(): Promise<StatsResponse> {
    // Your existing logic
  }
}
```

**Generate OpenAPI:**
```bash
tsoa spec-and-routes
```

**Pros:**
- ✅ Code = documentation
- ✅ Automatic validation
- ✅ Works with Next.js

**Cons:**
- ⚠️ Requires refactoring your API routes
- ⚠️ Decorator syntax

---

### ✅ **Option 3: Zod + zod-to-openapi (Easiest for Your Current Setup)**

**What:** Use Zod schemas (which you should already have for validation) to generate OpenAPI.

**Why it's the easiest migration:**
- You're already using TypeScript
- Zod is perfect for Next.js 15
- Minimal refactoring needed
- Can add incrementally

**Setup:**
```bash
pnpm add zod @asteasolutions/zod-to-openapi
```

**Example:**
```typescript
// lib/api-schemas.ts
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const StatsResponseSchema = z.object({
  tps: z.number().nullable().openapi({ description: 'Transactions per second' }),
  solPriceUsd: z.number().nullable().openapi({ description: 'SOL price in USD' }),
  tvlUsd: z.number().nullable().openapi({ description: 'Total value locked in USD' }),
  volume24hUsd: z.number().nullable().openapi({ description: '24h volume in USD' }),
  solChange24hPct: z.number().nullable().openapi({ description: '24h SOL price change %' }),
  tvlChange24hPct: z.number().nullable().openapi({ description: '24h TVL change %' }),
  volume24hChangePct: z.number().nullable().openapi({ description: '24h volume change %' }),
}).openapi('StatsResponse');

// app/api/stats/route.ts
export async function GET() {
  const data = await getStats();
  return Response.json(StatsResponseSchema.parse(data)); // Validates + types!
}
```

**Generate OpenAPI:**
```typescript
// scripts/generate-openapi.ts
import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { StatsResponseSchema } from '../lib/api-schemas';
import fs from 'fs';
import yaml from 'js-yaml';

const registry = new OpenAPIRegistry();

registry.registerPath({
  method: 'get',
  path: '/api/stats',
  responses: {
    200: {
      description: 'Real-time Solana statistics',
      content: {
        'application/json': {
          schema: StatsResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);
const docs = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Sundial Exchange API',
    version: '1.1.2',
  },
});

fs.writeFileSync('openapi.yaml', yaml.dump(docs));
```

**Run:**
```bash
tsx scripts/generate-openapi.ts
```

**Pros:**
- ✅ Easiest to adopt incrementally
- ✅ Runtime validation + type safety
- ✅ Zod is already Next.js-friendly
- ✅ Can keep your existing API structure

**Cons:**
- ⚠️ Still need to define routes manually
- ⚠️ Requires adding Zod schemas

---

### ❌ **Not Recommended: Swagger JSDoc**

**Why not:**
- Old-school approach
- Comments get out of sync
- No type safety
- More work than other options

---

## 🎯 **My Recommendation for Sundial Exchange**

### **Use Zod + zod-to-openapi** (Option 3)

**Why:**
1. ✅ **Easiest migration** - Add schemas incrementally to your existing routes
2. ✅ **Runtime safety** - Validates responses match your OpenAPI spec
3. ✅ **Type safety** - TypeScript types from Zod schemas
4. ✅ **Next.js 15 friendly** - Works perfectly with App Router
5. ✅ **x402 compatible** - Easy to add x402 responses to schemas

**Migration Path:**

### Step 1: Add Zod Schemas (Week 1)
```typescript
// lib/api-schemas.ts
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Define all your response schemas
export const StatsResponseSchema = z.object({...}).openapi('StatsResponse');
export const TrendingTokenSchema = z.object({...}).openapi('TrendingToken');
export const DexProtocolSchema = z.object({...}).openapi('DexProtocol');
```

### Step 2: Update API Routes (Week 1-2)
```typescript
// app/api/stats/route.ts
import { StatsResponseSchema } from '@/lib/api-schemas';

export async function GET() {
  const data = await fetchStats();
  
  // Validates + ensures type safety
  const validated = StatsResponseSchema.parse(data);
  
  return Response.json(validated);
}
```

### Step 3: Generate OpenAPI (Week 2)
```typescript
// scripts/generate-openapi.ts
// Register all routes + schemas
// Generate openapi.yaml automatically
```

### Step 4: Add to CI/CD (Week 2)
```json
// package.json
{
  "scripts": {
    "generate-openapi": "tsx scripts/generate-openapi.ts",
    "prebuild": "pnpm generate-openapi", // Auto-generate before build
    "test": "pnpm generate-openapi && jest" // Ensure OpenAPI is fresh
  }
}
```

---

## Implementation Plan

### Phase 1: Setup (30 minutes)
```bash
pnpm add zod @asteasolutions/zod-to-openapi js-yaml
pnpm add -D @types/js-yaml tsx
```

### Phase 2: Create Schemas (2-3 hours)
Create `lib/api-schemas.ts` with all your response types as Zod schemas.

### Phase 3: Update Routes (1-2 hours)
Update your 5 API routes to use Zod validation.

### Phase 4: Generator Script (1 hour)
Create `scripts/generate-openapi.ts` to generate the YAML.

### Phase 5: Automate (15 minutes)
Add to `package.json` scripts so it runs before build/deploy.

---

## Example: Your /api/stats Route

### Before (Manual OpenAPI):
```yaml
# openapi.yaml (manually written)
/api/stats:
  get:
    responses:
      200:
        schema:
          type: object
          properties:
            tps: { type: number }
```

```typescript
// app/api/stats/route.ts (no validation)
export async function GET() {
  const stats = await fetchStats();
  return Response.json(stats); // No type checking!
}
```

### After (Automatic OpenAPI):
```typescript
// lib/api-schemas.ts
export const StatsResponseSchema = z.object({
  tps: z.number().nullable().openapi({ 
    description: 'Transactions per second',
    example: 2847.5 
  }),
  solPriceUsd: z.number().nullable().openapi({ 
    description: 'SOL price in USD',
    example: 142.53 
  }),
  // ... all fields
}).openapi('StatsResponse');
```

```typescript
// app/api/stats/route.ts
export async function GET() {
  const stats = await fetchStats();
  return Response.json(StatsResponseSchema.parse(stats)); // Validates!
}
```

```typescript
// scripts/generate-openapi.ts
registry.registerPath({
  method: 'get',
  path: '/api/stats',
  tags: ['Solana Stats'],
  responses: {
    200: {
      description: 'Real-time Solana statistics',
      content: {
        'application/json': { schema: StatsResponseSchema },
      },
    },
    402: { $ref: '#/components/responses/PaymentRequired' },
  },
});

// Generates openapi.yaml automatically!
```

**Result:**
- ✅ OpenAPI always in sync
- ✅ Runtime validation
- ✅ Type safety
- ✅ Single source of truth

---

## Cost-Benefit Analysis

| Approach | Setup Time | Maintenance | Type Safety | Auto-Sync |
|----------|-----------|-------------|-------------|-----------|
| **Manual YAML** | 0h | High ❌ | No | No ❌ |
| **Zod + OpenAPI** | 4-6h | Low ✅ | Yes ✅ | Yes ✅ |
| **TypeSpec** | 8-12h | Medium | Yes ✅ | Yes ✅ |
| **tsoa** | 10-15h | Medium | Yes ✅ | Yes ✅ |

---

## Next Steps

**Want me to implement Zod + zod-to-openapi for you?**

I can:
1. Set up the dependencies
2. Create initial schemas for your 5 endpoints
3. Update one API route as an example
4. Create the generator script
5. Add to package.json

**Estimated time: 30-60 minutes** for a working proof-of-concept.

Then you can:
- Deploy the fixed middleware (priority!)
- Migrate to Zod incrementally
- Never manually update OpenAPI again! 🎉

**Should I proceed with the Zod implementation, or do you want to deploy the middleware fix first?**

