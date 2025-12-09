import { NextResponse } from "next/server"

let vehicles = [
  {
    id: "V001",
    name: "Hero Xtreme",
    engineTemp: 85,
    brakeHealth: 80,
    battery: 90,
    vibration: 5,
    lastMaintenance: "2025-12-01",
    status: "healthy",
  },
  {
    id: "V002",
    name: "M&M Thar",
    engineTemp: 78,
    brakeHealth: 90,
    battery: 95,
    vibration: 3,
    lastMaintenance: "2025-11-25",
    status: "healthy",
  },
  {
    id: "V003",
    name: "Maruti Swift",
    engineTemp: 92,
    brakeHealth: 65,
    battery: 72,
    vibration: 12,
    lastMaintenance: "2025-10-15",
    status: "warning",
  },
  {
    id: "V004",
    name: "Hyundai Creta",
    engineTemp: 88,
    brakeHealth: 75,
    battery: 85,
    vibration: 8,
    lastMaintenance: "2025-11-10",
    status: "healthy",
  },
]

export async function GET() {
  // Simulate live updates with random fluctuations
  vehicles = vehicles.map((v) => ({
    ...v,
    engineTemp: Math.max(60, Math.min(110, v.engineTemp + Math.floor((Math.random() - 0.5) * 4))),
    brakeHealth: Math.max(0, Math.min(100, v.brakeHealth - Math.floor(Math.random() * 2))),
    battery: Math.max(0, Math.min(100, v.battery - Math.floor(Math.random() * 1))),
    vibration: Math.max(0, v.vibration + Math.floor((Math.random() - 0.5) * 3)),
    status: v.brakeHealth < 70 || v.engineTemp > 100 ? "critical" : v.brakeHealth < 80 ? "warning" : "healthy",
  }))

  return NextResponse.json({ vehicles })
}
