"use client"
import { Thermometer, Zap, AlertCircle, Waves, Clock } from "lucide-react"

interface VehicleCardProps {
  id: string
  name: string
  engineTemp: number
  brakeHealth: number
  battery: number
  vibration: number
  status: "healthy" | "warning" | "critical"
  lastMaintenance: string
  onClick?: () => void
}

export function VehicleCard({
  id,
  name,
  engineTemp,
  brakeHealth,
  battery,
  vibration,
  status,
  lastMaintenance,
  onClick,
}: VehicleCardProps) {
  const statusColors = {
    healthy: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
  }

  const getMetricColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return "text-emerald-600"
    if (value >= thresholds.warning) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
        onClick ? "hover:border-blue-400" : ""
      } ${status === "critical" ? "border-red-300" : status === "warning" ? "border-amber-300" : "border-gray-200"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-gray-600">Engine Temp</span>
          </div>
          <p className={`text-2xl font-bold ${getMetricColor(engineTemp, { good: 85, warning: 95 })}`}>
            {engineTemp}°C
          </p>
        </div>

        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-600">Battery</span>
          </div>
          <p className={`text-2xl font-bold ${getMetricColor(battery, { good: 80, warning: 60 })}`}>{battery}%</p>
        </div>

        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-600">Brake Health</span>
          </div>
          <p className={`text-2xl font-bold ${getMetricColor(brakeHealth, { good: 85, warning: 75 })}`}>
            {brakeHealth}%
          </p>
        </div>

        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <Waves className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Vibration</span>
          </div>
          <p className={`text-2xl font-bold ${getMetricColor(100 - vibration, { good: 90, warning: 80 })}`}>
            {vibration} mm/s
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
        <Clock className="w-4 h-4" />
        <span>Last maintenance: {lastMaintenance}</span>
      </div>
    </div>
  )
}
