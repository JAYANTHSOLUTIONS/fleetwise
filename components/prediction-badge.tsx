import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

interface PredictionBadgeProps {
  risk: "low" | "medium" | "high"
  confidence: number
  loading?: boolean
  error?: boolean
}

export function PredictionBadge({ risk, confidence, loading = false, error = false }: PredictionBadgeProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border-2 border-gray-300">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span className="text-xs font-semibold text-gray-600">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border-2 border-gray-300">
        <span className="text-xs font-semibold text-gray-600">Unavailable</span>
      </div>
    )
  }

  const riskConfig = {
    low: {
      bg: "bg-emerald-100",
      border: "border-emerald-300",
      text: "text-emerald-700",
      icon: CheckCircle,
      label: "Low Risk",
    },
    medium: {
      bg: "bg-amber-100",
      border: "border-amber-300",
      text: "text-amber-700",
      icon: AlertCircle,
      label: "Medium Risk",
    },
    high: {
      bg: "bg-red-100",
      border: "border-red-300",
      text: "text-red-700",
      icon: AlertTriangle,
      label: "High Risk",
    },
  }

  const config = riskConfig[risk]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${config.bg} ${config.border}`}>
      <Icon className={`w-4 h-4 ${config.text}`} />
      <div>
        <span className={`text-xs font-semibold block ${config.text}`}>{config.label}</span>
        <span className={`text-xs ${config.text} opacity-75`}>{Math.round(confidence)}% confidence</span>
      </div>
    </div>
  )
}
