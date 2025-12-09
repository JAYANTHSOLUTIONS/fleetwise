import { AlertTriangle, TrendingUp } from "lucide-react"

interface PredictionCardProps {
  id: string
  vehicleId: string
  vehicleName: string
  failureType: string
  confidence: number
  daysUntilMaintenance: number
  severity: "low" | "medium" | "high"
}

export function PredictionCard({
  vehicleName,
  failureType,
  confidence,
  daysUntilMaintenance,
  severity,
}: PredictionCardProps) {
  const severityColors = {
    low: "bg-blue-100 text-blue-700 border-blue-300",
    medium: "bg-amber-100 text-amber-700 border-amber-300",
    high: "bg-red-100 text-red-700 border-red-300",
  }

  const severityIcons = {
    low: "w-5 h-5",
    medium: "w-5 h-5",
    high: "w-5 h-5",
  }

  return (
    <div className={`rounded-lg border-2 p-4 ${severityColors[severity]}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={severityIcons[severity]} />
        <div className="flex-1">
          <p className="font-semibold text-sm">{vehicleName}</p>
          <p className="text-sm opacity-90 mb-2">{failureType}</p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs">Confidence: {confidence}%</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                <div className="bg-current h-full rounded-full" style={{ width: `${confidence}%` }} />
              </div>
            </div>
          </div>
          <p className="text-xs mt-2 font-semibold">Action in {daysUntilMaintenance} days</p>
        </div>
      </div>
    </div>
  )
}
