"use client"

import { motion } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer } from "recharts"

interface TrendingToken {
  symbol: string
  name: string
  price: number
  change24h: number
  sparklineData: { value: number }[]
  icon: string
}

export function TrendingTokens() {
  const [tokens, setTokens] = useState<TrendingToken[]>([
    {
      symbol: "SOL",
      name: "Solana",
      price: 142.85,
      change24h: 5.2,
      sparklineData: generateSparklineData(142.85, 5.2),
      icon: "◎",
    },
    {
      symbol: "BONK",
      name: "Bonk",
      price: 0.000023,
      change24h: 12.4,
      sparklineData: generateSparklineData(0.000023, 12.4),
      icon: "🐕",
    },
    {
      symbol: "JUP",
      name: "Jupiter",
      price: 0.87,
      change24h: -3.1,
      sparklineData: generateSparklineData(0.87, -3.1),
      icon: "🪐",
    },
    {
      symbol: "JTO",
      name: "Jito",
      price: 2.45,
      change24h: 8.9,
      sparklineData: generateSparklineData(2.45, 8.9),
      icon: "⚡",
    },
    {
      symbol: "PYTH",
      name: "Pyth Network",
      price: 0.42,
      change24h: -1.5,
      sparklineData: generateSparklineData(0.42, -1.5),
      icon: "🔮",
    },
  ])

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((prevTokens) =>
        prevTokens.map((token) => {
          const priceChange = (Math.random() - 0.5) * 0.02 * token.price
          const newPrice = token.price + priceChange
          const newChange = token.change24h + (Math.random() - 0.5) * 0.5

          // Update sparkline data
          const newSparklineData = [...token.sparklineData.slice(1), { value: newPrice }]

          return {
            ...token,
            price: newPrice,
            change24h: newChange,
            sparklineData: newSparklineData,
          }
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className=" hidden sm:block sm:w-full border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Trending on Solana</h3>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {tokens.map((token) => (
            <motion.div
              key={token.symbol}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{token.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{token.symbol}</div>
                    <div className="text-xs text-muted-foreground">{token.name}</div>
                  </div>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-12 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={token.sparklineData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={token.change24h >= 0 ? "#22c55e" : "#ef4444"}
                      strokeWidth={1.5}
                      dot={false}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Price and Change */}
              <div className="flex items-center justify-between">
                <motion.span
                  key={token.price}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-mono font-semibold text-foreground"
                >
                  ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(2)}
                </motion.span>
                <div
                  className={`flex items-center gap-1 text-xs font-mono ${token.change24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {token.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(token.change24h).toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function generateSparklineData(basePrice: number, change24h: number): { value: number }[] {
  const points = 20
  const data: { value: number }[] = []
  const startPrice = basePrice * (1 - change24h / 100)

  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1)
    const trend = startPrice + (basePrice - startPrice) * progress
    const noise = (Math.random() - 0.5) * basePrice * 0.02
    data.push({ value: trend + noise })
  }

  return data
}
