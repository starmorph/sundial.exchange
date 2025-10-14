"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatItem {
  label: string
  value: string
  change?: number
  prefix?: string
  suffix?: string
}

export function StatsBar() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: "TPS", value: "3,247", change: 2.3, suffix: "" },
    { label: "SOL", value: "142.85", change: 5.2, prefix: "$" },
    { label: "TVL", value: "4.2B", change: -1.1, prefix: "$" },
    { label: "24H VOL", value: "892M", change: 8.7, prefix: "$" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => {
          const randomChange = (Math.random() - 0.5) * 10
          let newValue: string

          if (stat.label === "TPS") {
            const currentVal = Number.parseInt(stat.value.replace(/,/g, ""))
            const newVal = Math.max(1000, currentVal + Math.floor(randomChange * 100))
            newValue = newVal.toLocaleString()
          } else if (stat.label === "SOL") {
            const currentVal = Number.parseFloat(stat.value)
            const newVal = Math.max(100, currentVal + randomChange * 0.5)
            newValue = newVal.toFixed(2)
          } else if (stat.label === "TVL") {
            const currentVal = Number.parseFloat(stat.value.replace("B", ""))
            const newVal = Math.max(3, currentVal + randomChange * 0.01)
            newValue = newVal.toFixed(1) + "B"
          } else {
            const currentVal = Number.parseFloat(stat.value.replace("M", ""))
            const newVal = Math.max(500, currentVal + randomChange * 2)
            newValue = newVal.toFixed(0) + "M"
          }

          return {
            ...stat,
            value: newValue,
            change: Number.parseFloat((randomChange * 0.3).toFixed(1)),
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 py-2">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <div className="flex items-center gap-1.5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stat.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-mono font-semibold text-foreground"
                  >
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </motion.span>
                </AnimatePresence>
                {stat.change !== undefined && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-0.5 text-xs font-mono ${
                      stat.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{Math.abs(stat.change)}%</span>
                  </motion.div>
                )}
              </div>
              {index < stats.length - 1 && <div className="h-4 w-px bg-border/50 ml-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
