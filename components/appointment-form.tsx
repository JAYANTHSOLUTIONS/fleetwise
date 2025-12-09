"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, Clock, Truck } from "lucide-react"

interface AppointmentFormProps {
  onSubmit: (data: {
    vehicleId: string
    vehicleName: string
    serviceType: string
    date: string
    time: string
  }) => void
  vehicles: Array<{ id: string; name: string }>
}

export function AppointmentForm({ onSubmit, vehicles }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleName: "",
    serviceType: "Regular Maintenance",
    date: "",
    time: "",
  })

  const serviceTypes = [
    "Regular Maintenance",
    "Engine Repair",
    "Brake Service",
    "Battery Check",
    "Transmission Service",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.vehicleId && formData.date && formData.time) {
      onSubmit(formData)
      setFormData({ vehicleId: "", vehicleName: "", serviceType: "Regular Maintenance", date: "", time: "" })
    }
  }

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicle = vehicles.find((v) => v.id === e.target.value)
    setFormData({
      ...formData,
      vehicleId: e.target.value,
      vehicleName: vehicle?.name || "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Truck className="w-4 h-4 inline mr-2" />
          Vehicle
        </label>
        <select
          value={formData.vehicleId}
          onChange={handleVehicleChange}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          required
        >
          <option value="">Select a vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
        <select
          value={formData.serviceType}
          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
        >
          {serviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Time
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Book Appointment
      </button>
    </form>
  )
}
