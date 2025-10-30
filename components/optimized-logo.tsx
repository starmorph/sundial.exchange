"use client"

import Image from "next/image"
import { useState } from "react"

interface OptimizedLogoProps {
  src: string | undefined | null
  alt: string
  size: number
  fallback?: string | React.ReactNode
  className?: string
  priority?: boolean
  type?: "token" | "dex"
}

/**
 * Optimized logo component that:
 * - Uses Next.js Image for automatic optimization and caching
 * - Provides consistent error handling with fallbacks
 * - Reduces redundant API requests through browser and CDN caching
 * - Supports both token and DEX logos
 */
export function OptimizedLogo({
  src,
  alt,
  size,
  fallback,
  className = "",
  priority = false,
  type = "token"
}: OptimizedLogoProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    if (typeof fallback === "string") {
      return (
        <div
          className={`flex items-center justify-center ${className}`}
          style={{ width: size, height: size }}
        >
          <span className="text-xl">{fallback}</span>
        </div>
      )
    }
    return <>{fallback}</>
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        // Aggressive caching configuration
        unoptimized={false} // Enable Next.js optimization
        quality={90} // High quality for logos
        // Loading placeholder for better UX
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
      />
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  )
}

/**
 * Specialized component for token logos with emoji fallback
 */
export function TokenLogo({
  logoURI,
  symbol,
  icon,
  size = 24,
  className,
  priority = false
}: {
  logoURI?: string
  symbol: string
  icon?: string
  size?: number
  className?: string
  priority?: boolean
}) {
  return (
    <OptimizedLogo
      src={logoURI}
      alt={`${symbol} logo`}
      size={size}
      fallback={icon || symbol.charAt(0)}
      className={className}
      priority={priority}
      type="token"
    />
  )
}

/**
 * Specialized component for DEX protocol logos
 */
export function DexLogo({
  logoURL,
  name,
  size = 24,
  className,
  priority = false
}: {
  logoURL?: string
  name: string
  size?: number
  className?: string
  priority?: boolean
}) {
  return (
    <OptimizedLogo
      src={logoURL}
      alt={`${name} logo`}
      size={size}
      fallback={name.charAt(0).toUpperCase()}
      className={className}
      priority={priority}
      type="dex"
    />
  )
}
