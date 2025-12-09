"use client"

import { useState, useEffect } from "react"
import { VehicleCard } from "@/components/vehicle-card"
import { ChevronRight, Loader } from "lucide-react"

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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "healthy" | "warning" | "critical">("all")

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles")
        const data = await response.json()
        setVehicles(data.vehicles)
      } catch (error) {
        console.error("Failed to fetch vehicles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const filteredVehicles = filter === "all" ? vehicles : vehicles.filter((v) => v.status === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Vehicles</h1>
        <p className="text-gray-600 mb-8">View and manage your entire fleet</p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "healthy", "warning", "critical"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({vehicles.filter((v) => v.status === status).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vehicle List */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} {...vehicle} onClick={() => setSelectedVehicle(vehicle)} />
                ))}
              </div>
            </div>

            {/* Vehicle Details Panel */}
            <div>
              {selectedVehicle ? (
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedVehicle.name}</h3>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Vehicle ID</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedVehicle.id}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Status</p>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {selectedVehicle.status.charAt(0).toUpperCase() + selectedVehicle.status.slice(1)}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-2">Engine Temperature</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{selectedVehicle.engineTemp}°C</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${(selectedVehicle.engineTemp / 120) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-2">Brake Health</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{selectedVehicle.brakeHealth}%</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${selectedVehicle.brakeHealth}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-2">Battery Health</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{selectedVehicle.battery}%</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${selectedVehicle.battery}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-2">Vibration Level</p>
                      <p className="text-lg font-bold text-gray-900">{selectedVehicle.vibration} mm/s</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Last Maintenance</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedVehicle.lastMaintenance}</p>
                    </div>

                    <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      View Full Report
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-600">Select a vehicle to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
