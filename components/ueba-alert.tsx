import { Shield, AlertTriangle, AlertCircle } from "lucide-react"

interface UEBAAlertProps {
  message: string
  severity: "low" | "medium" | "high"
  timestamp: string
  source: string
}

export function UEBAAlert({ message, severity, timestamp, source }: UEBAAlertProps) {
  const severityConfig = {
    low: { bg: "bg-blue-50", border: "border-blue-300", icon: "text-blue-600", label: "text-blue-700" },
    medium: { bg: "bg-amber-50", border: "border-amber-300", icon: "text-amber-600", label: "text-amber-700" },
    high: { bg: "bg-red-50", border: "border-red-300", icon: "text-red-600", label: "text-red-700" },
  }

  const config = severityConfig[severity]

  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const severityIcon =
    severity === "high" ? (
      <AlertTriangle className={`w-5 h-5 ${config.icon}`} />
    ) : (
      <AlertCircle className={`w-5 h-5 ${config.icon}`} />
    )

  return (
    <div className={`rounded-lg border-2 p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <Shield className={`w-5 h-5 ${config.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-1 rounded ${config.label} bg-white bg-opacity-50`}>
              {severity.toUpperCase()}
            </span>
            <span className="text-xs text-gray-600">{source}</span>
          </div>
          <p className="text-sm font-medium text-gray-900 mt-2">{message}</p>
          <p className="text-xs text-gray-600 mt-2">{timeAgo(timestamp)}</p>
        </div>
      </div>
    </div>
  )
}
