interface VehicleData {
  vehicle_id: string
  engine_temp: number
  brake_health: number
  battery_health: number
  vibration_level: number
  oil_level?: number
}

interface PredictionResponse {
  predicted_risk: "low" | "medium" | "high"
  confidence_score: number
  vehicle_id: string
  timestamp: string
}

const BACKEND_URL = "http://127.0.0.1:8000"

export async function fetchPrediction(vehicleData: VehicleData): Promise<PredictionResponse | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleData),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      predicted_risk: data.predicted_risk,
      confidence_score: data.confidence_score,
      vehicle_id: vehicleData.vehicle_id,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[v0] Prediction fetch error:", error)
    return null
  }
}

export async function fetchAllPredictions(vehicles: any[]): Promise<Record<string, PredictionResponse | null>> {
  const predictions: Record<string, PredictionResponse | null> = {}

  for (const vehicle of vehicles) {
    const vehicleData: VehicleData = {
      vehicle_id: vehicle.id,
      engine_temp: vehicle.engineTemp,
      brake_health: vehicle.brakeHealth,
      battery_health: vehicle.battery,
      vibration_level: vehicle.vibration,
    }

    const prediction = await fetchPrediction(vehicleData)
    predictions[vehicle.id] = prediction
  }

  return predictions
}
