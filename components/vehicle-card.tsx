"use client"
import { useState, useEffect } from "react"
import { Thermometer, Zap, AlertCircle, Waves, Clock } from "lucide-react"
import { PredictionBadge } from "@/components/prediction-badge"
import { fetchPrediction } from "@/lib/prediction-service"

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

interface PredictionState {
  risk: "low" | "medium" | "high" | null
  confidence: number
  loading: boolean
  error: boolean
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
  const [prediction, setPrediction] = useState<PredictionState>({
    risk: null,
    confidence: 0,
    loading: true,
    error: false,
  })

  useEffect(() => {
    const getPrediction = async () => {
      setPrediction((prev) => ({ ...prev, loading: true, error: false }))
      try {
        const result = await fetchPrediction({
          vehicle_id: id,
          engine_temp: engineTemp,
          brake_health: brakeHealth,
          battery_health: battery,
          vibration_level: vibration,
        })

        if (result) {
          setPrediction({
            risk: result.predicted_risk,
            confidence: result.confidence_score,
            loading: false,
            error: false,
          })
        } else {
          setPrediction((prev) => ({
            ...prev,
            loading: false,
            error: true,
          }))
        }
      } catch (error) {
        console.error("[v0] Error fetching prediction:", error)
        setPrediction((prev) => ({
          ...prev,
          loading: false,
          error: true,
        }))
      }
    }

    getPrediction()
  }, [id, engineTemp, brakeHealth, battery, vibration])

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

      <div className="mb-4 pb-4 border-t pt-4">
        <p className="text-xs text-gray-600 font-semibold mb-2">Predictive Risk</p>
        <PredictionBadge
          risk={prediction.risk || "low"}
          confidence={prediction.confidence}
          loading={prediction.loading}
          error={prediction.error}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
        <Clock className="w-4 h-4" />
        <span>Last maintenance: {lastMaintenance}</span>
      </div>
    </div>
  )
}
