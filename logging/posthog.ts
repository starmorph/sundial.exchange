// lib/posthog.ts

// NOTE: This is a Node.js client, so you can use it for sending events from the server side to PostHog.
import { PostHog } from "posthog-node"

export default function createPosthogClient(): PostHog | null {
  const apiKey = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) {
    return null
  }

  const host = process.env.POSTHOG_HOST ?? process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com"

  return new PostHog(apiKey, {
    host,
    flushAt: 1,
    flushInterval: 0,
  })
}
