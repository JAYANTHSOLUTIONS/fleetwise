"use client"

import { useState, useEffect } from "react"
import { VehicleCard } from "@/components/vehicle-card"
import { AlertCircle, RefreshCw } from "lucide-react"

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

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles")
      if (!response.ok) throw new Error("Failed to fetch vehicles")
      const data = await response.json()
      setVehicles(data.vehicles)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
    const interval = setInterval(fetchVehicles, 5000) // Auto-refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const criticalCount = vehicles.filter((v) => v.status === "critical").length
  const warningCount = vehicles.filter((v) => v.status === "warning").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Fleet Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time vehicle health monitoring</p>
          </div>
          <button
            onClick={fetchVehicles}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-900">{vehicles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-amber-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Warnings</p>
                <p className="text-3xl font-bold text-amber-600">{warningCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-red-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Critical</p>
                <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-8 text-red-700">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && vehicles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border-2 border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} {...vehicle} />
              ))}
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="text-right text-sm text-gray-600">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
