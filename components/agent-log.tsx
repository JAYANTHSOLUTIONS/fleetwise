import { Activity, CheckCircle, Loader } from "lucide-react"

interface AgentLogProps {
  type: "Master Agent" | "Worker Agent"
  name: string
  action: string
  timestamp: string
  status: "running" | "completed"
}

export function AgentLog({ type, name, action, timestamp, status }: AgentLogProps) {
  const typeColor = type === "Master Agent" ? "text-purple-600" : "text-blue-600"
  const statusIcon =
    status === "completed" ? (
      <CheckCircle className="w-4 h-4 text-emerald-600" />
    ) : (
      <Loader className="w-4 h-4 text-blue-600 animate-spin" />
    )

  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <div className="pt-1">{statusIcon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${typeColor}`} />
          <span className={`text-sm font-semibold ${typeColor}`}>{name}</span>
          <span className="text-xs text-gray-500">({type})</span>
        </div>
        <p className="text-sm text-gray-700 mt-1">{action}</p>
        <p className="text-xs text-gray-500 mt-1">{timeAgo(timestamp)}</p>
      </div>
    </div>
  )
}
