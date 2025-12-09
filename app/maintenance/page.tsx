"use client"

import { useState, useEffect } from "react"
import { PredictionCard } from "@/components/prediction-card"
import { AppointmentForm } from "@/components/appointment-form"
import { AlertCircle, Calendar, Loader } from "lucide-react"

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [predictRes, vehiclesRes, appointmentsRes] = await Promise.all([
          fetch("/api/predict"),
          fetch("/api/vehicles"),
          fetch("/api/schedule"),
        ])

        const [predictions, vehicles, appointments] = await Promise.all([
          predictRes.json(),
          vehiclesRes.json(),
          appointmentsRes.json(),
        ])

        setPredictions(predictions.predictions)
        setVehicles(vehicles.vehicles)
        setAppointments(appointments.appointments)
      } catch (error) {
        console.error("Failed to fetch maintenance data:", error)
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
      console.error("Failed to book appointment:", error)
    }
  }

  const highSeverityCount = predictions.filter((p) => p.severity === "high").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Maintenance Management</h1>
        <p className="text-gray-600 mb-8">Predictive maintenance alerts and appointment scheduling</p>

        {bookingMessage && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 mb-8 text-emerald-700">
            {bookingMessage}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Predictions Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Predictive Maintenance Alerts</h2>
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
                  {predictions.map((prediction) => (
                    <PredictionCard key={prediction.id} {...prediction} />
                  ))}
                </div>
              </div>

              {/* Booked Appointments List */}
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

            {/* Booking Form */}
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
