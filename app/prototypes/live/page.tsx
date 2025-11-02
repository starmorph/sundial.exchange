"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Zap, DollarSign, Users, ArrowUpRight, ArrowDownRight, Sparkles, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"

interface LiveMetric {
  id: string
  label: string
  value: string
  change: number
  trend: "up" | "down"
  icon: any
  color: string
}

interface Transaction {
  id: string
  type: "swap" | "transfer" | "stake"
  amount: string
  token: string
  timestamp: number
}

export default function LiveDashboard() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    {
      id: "price",
      label: "SOL Price",
      value: "$198.42",
      change: 2.4,
      trend: "up",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      id: "tps",
      label: "Network TPS",
      value: "3,247",
      change: 5.2,
      trend: "up",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      id: "volume",
      label: "24h Volume",
      value: "$9.7B",
      change: -1.2,
      trend: "down",
      icon: Activity,
      color: "text-blue-500",
    },
    {
      id: "users",
      label: "Active Users",
      value: "847K",
      change: 3.8,
      trend: "up",
      icon: Users,
      color: "text-green-500",
    },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pulseMetric, setPulseMetric] = useState<string | null>(null)

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * metrics.length)
      setPulseMetric(metrics[randomIndex].id)

      setMetrics((prev) =>
        prev.map((metric, index) => {
          if (index === randomIndex) {
            const changeAmount = (Math.random() - 0.5) * 10
            let newValue = metric.value

            if (metric.id === "price") {
              const current = Number.parseFloat(metric.value.replace("$", ""))
              newValue = `$${(current + changeAmount * 0.5).toFixed(2)}`
            } else if (metric.id === "tps") {
              const current = Number.parseInt(metric.value.replace(/,/g, ""))
              newValue = Math.max(1000, current + Math.floor(changeAmount * 50)).toLocaleString()
            } else if (metric.id === "volume") {
              const current = Number.parseFloat(metric.value.replace("$", "").replace("B", ""))
              newValue = `$${(current + changeAmount * 0.05).toFixed(1)}B`
            } else if (metric.id === "users") {
              const current = Number.parseInt(metric.value.replace("K", ""))
              newValue = `${Math.max(500, current + Math.floor(changeAmount * 2))}K`
            }

            return {
              ...metric,
              value: newValue,
              change: Number.parseFloat((changeAmount * 0.3).toFixed(1)),
              trend: changeAmount >= 0 ? "up" : "down",
            }
          }
          return metric
        }),
      )

      setTimeout(() => setPulseMetric(null), 500)
    }, 2000)

    return () => clearInterval(interval)
  }, [metrics])

  // Simulate real-time transactions
  useEffect(() => {
    const interval = setInterval(() => {
      const types: ("swap" | "transfer" | "stake")[] = ["swap", "transfer", "stake"]
      const tokens = ["SOL", "USDC", "JUP", "ORCA", "RAY"]
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: types[Math.floor(Math.random() * types.length)],
        amount: (Math.random() * 1000).toFixed(2),
        token: tokens[Math.floor(Math.random() * tokens.length)],
        timestamp: Date.now(),
      }

      setTransactions((prev) => [newTx, ...prev].slice(0, 10))
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold font-mono tracking-tight flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
              Live Network Dashboard
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">Real-time Solana network activity</p>
          </div>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(191, 148, 71, 0.3)",
                "0 0 40px rgba(191, 148, 71, 0.5)",
                "0 0 20px rgba(191, 148, 71, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="h-2 w-2 rounded-full bg-green-500"
              />
              <span className="text-xs font-mono font-semibold text-primary">LIVE</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative overflow-hidden p-6 border-border/50 bg-card/50 backdrop-blur-sm transition-all ${
                  pulseMetric === metric.id ? "ring-2 ring-primary/50 shadow-lg shadow-primary/20" : ""
                }`}
              >
                <AnimatePresence>
                  {pulseMetric === metric.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-primary/20 rounded-full"
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={metric.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl font-bold font-mono"
                      >
                        {metric.value}
                      </motion.div>
                    </AnimatePresence>
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className={`flex items-center gap-1 text-xs font-mono ${
                        metric.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span>{Math.abs(metric.change)}%</span>
                    </motion.div>
                  </div>
                  <motion.div
                    animate={{
                      rotate: pulseMetric === metric.id ? [0, 360] : 0,
                      scale: pulseMetric === metric.id ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`p-3 rounded-lg bg-muted/50 ${metric.color}`}
                  >
                    <metric.icon className="h-5 w-5" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Live Transactions Feed */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-mono flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Live Transactions
            </h2>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="text-xs font-mono text-muted-foreground"
            >
              Updating...
            </motion.div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-hidden">
            <AnimatePresence initial={false}>
              {transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`p-2 rounded-md ${
                        tx.type === "swap"
                          ? "bg-blue-500/20 text-blue-500"
                          : tx.type === "transfer"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-purple-500/20 text-purple-500"
                      }`}
                    >
                      {tx.type === "swap" ? (
                        <Activity className="h-4 w-4" />
                      ) : tx.type === "transfer" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                    </motion.div>
                    <div>
                      <p className="text-sm font-mono font-semibold capitalize">{tx.type}</p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {tx.amount} {tx.token}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-mono text-muted-foreground"
                  >
                    Just now
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  )
}
