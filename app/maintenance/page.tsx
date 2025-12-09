"use client"

import { useState, useEffect } from "react"
import { PredictionCard } from "@/components/prediction-card"
import { AppointmentForm } from "@/components/appointment-form"
import { AlertCircle, Calendar, Loader } from "lucide-react"
import { fetchPrediction } from "@/lib/prediction-service"

interface Prediction {
  id: string
  vehicleId: string
  vehicleName: string
  failureType: string
  confidence: number
  daysUntilMaintenance: number
  severity: "low" | "medium" | "high"
}

interface Vehicle {
  id: string
  name: string
  engineTemp: number
  brakeHealth: number
  battery: number
  vibration: number
  status: "healthy" | "warning" | "critical"
  lastMaintenance: string
}

interface Appointment {
  id: string
  vehicleId: string
  vehicleName: string
  serviceType: string
  date: string
  time: string
  status: "confirmed" | "pending"
}

export default function MaintenancePage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingMessage, setBookingMessage] = useState<string | null>(null)
  const [predictionErrors, setPredictionErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, appointmentsRes] = await Promise.all([fetch("/api/vehicles"), fetch("/api/schedule")])

        const [vehiclesData, appointmentsData] = await Promise.all([vehiclesRes.json(), appointmentsRes.json()])

        const vehiclesList = vehiclesData.vehicles
        setVehicles(vehiclesList)
        setAppointments(appointmentsData.appointments)

        const predictionsData: Prediction[] = []
        const errors: Record<string, boolean> = {}

        for (const vehicle of vehiclesList) {
          try {
            const prediction = await fetchPrediction({
              vehicle_id: vehicle.id,
              engine_temp: vehicle.engineTemp,
              brake_health: vehicle.brakeHealth,
              battery_health: vehicle.battery,
              vibration_level: vehicle.vibration,
            })

            if (prediction) {
              const riskToDays = {
                low: 30,
                medium: 14,
                high: 5,
              }

              predictionsData.push({
                id: `pred-${vehicle.id}`,
                vehicleId: vehicle.id,
                vehicleName: vehicle.name,
                failureType: prediction.predicted_risk === "high" ? "Engine Failure Risk" : "Maintenance Due",
                confidence: prediction.confidence_score,
                daysUntilMaintenance: riskToDays[prediction.predicted_risk],
                severity: prediction.predicted_risk,
              })
            } else {
              errors[vehicle.id] = true
            }
          } catch (error) {
            console.error(`[v0] Error fetching prediction for ${vehicle.id}:`, error)
            errors[vehicle.id] = true
          }
        }

        setPredictions(predictionsData.sort((a, b) => b.confidence - a.confidence))
        setPredictionErrors(errors)
      } catch (error) {
        console.error("[v0] Failed to fetch maintenance data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleBookAppointment = async (data: any) => {
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setAppointments([...appointments, result.appointment])
        setBookingMessage("Appointment booked successfully!")
        setTimeout(() => setBookingMessage(null), 3000)
      }
    } catch (error) {
      console.error("[v0] Failed to book appointment:", error)
    }
  }

  const highSeverityCount = predictions.filter((p) => p.severity === "high").length
  const mediumSeverityCount = predictions.filter((p) => p.severity === "medium").length
  const apiUnavailableCount = Object.keys(predictionErrors).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Maintenance Management</h1>
        <p className="text-gray-600 mb-8">Predictive maintenance alerts powered by backend AI</p>

        {bookingMessage && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 mb-8 text-emerald-700">
            {bookingMessage}
          </div>
        )}

        {apiUnavailableCount > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-8 text-yellow-700">
            <p className="font-semibold">
              ⚠ Unable to fetch predictions for {apiUnavailableCount} vehicle{apiUnavailableCount > 1 ? "s" : ""}. Make
              sure the backend API is running at http://127.0.0.1:8000
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Predictive Maintenance Alerts</h2>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
                    <p className="text-red-700 font-semibold text-sm">{highSeverityCount}</p>
                    <p className="text-red-600 text-xs">High Risk</p>
                  </div>
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3">
                    <p className="text-amber-700 font-semibold text-sm">{mediumSeverityCount}</p>
                    <p className="text-amber-600 text-xs">Medium Risk</p>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-3">
                    <p className="text-emerald-700 font-semibold text-sm">
                      {predictions.filter((p) => p.severity === "low").length}
                    </p>
                    <p className="text-emerald-600 text-xs">Low Risk</p>
                  </div>
                </div>

                {highSeverityCount > 0 && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
                    <p className="text-red-700 font-semibold">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {highSeverityCount} high-severity maintenance alert{highSeverityCount > 1 ? "s" : ""} require
                      immediate attention
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {predictions.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                      <p>No maintenance predictions available</p>
                    </div>
                  ) : (
                    predictions.map((prediction) => <PredictionCard key={prediction.id} {...prediction} />)
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Booked Appointments</h2>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No appointments booked yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{apt.vehicleName}</p>
                            <p className="text-sm text-gray-600">{apt.serviceType}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              apt.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {apt.date} at {apt.time}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Book Appointment</h2>
                <AppointmentForm vehicles={vehicles} onSubmit={handleBookAppointment} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
