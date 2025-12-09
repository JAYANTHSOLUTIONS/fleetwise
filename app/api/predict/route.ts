import { NextResponse } from "next/server"

const predictions = [
  {
    id: "P001",
    vehicleId: "V001",
    vehicleName: "Hero Xtreme",
    failureType: "Brake pad wear",
    confidence: 89,
    daysUntilMaintenance: 12,
    severity: "medium",
  },
  {
    id: "P002",
    vehicleId: "V003",
    vehicleName: "Maruti Swift",
    failureType: "Engine overheating",
    confidence: 94,
    daysUntilMaintenance: 3,
    severity: "high",
  },
  {
    id: "P003",
    vehicleId: "V003",
    vehicleName: "Maruti Swift",
    failureType: "Transmission fluid",
    confidence: 76,
    daysUntilMaintenance: 7,
    severity: "medium",
  },
  {
    id: "P004",
    vehicleId: "V002",
    vehicleName: "M&M Thar",
    failureType: "Battery degradation",
    confidence: 82,
    daysUntilMaintenance: 20,
    severity: "low",
  },
]

export async function GET() {
  return NextResponse.json({ predictions })
}
