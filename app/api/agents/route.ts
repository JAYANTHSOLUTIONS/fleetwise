import { NextResponse } from "next/server"

const agents = [
  {
    id: "A001",
    type: "Master Agent",
    name: "Fleet Orchestrator",
    action: "Started vehicle health scan",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    status: "completed",
  },
  {
    id: "A002",
    type: "Worker Agent",
    name: "Telemetry Collector",
    action: "Fetched data from 4 vehicles",
    timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
    status: "completed",
  },
  {
    id: "A003",
    type: "Worker Agent",
    name: "Prediction Engine",
    action: "Analyzed vibration patterns",
    timestamp: new Date(Date.now() - 30000).toISOString(),
    status: "running",
  },
  {
    id: "A004",
    type: "Master Agent",
    name: "Alert Manager",
    action: "Dispatched 2 critical alerts",
    timestamp: new Date(Date.now() - 15000).toISOString(),
    status: "running",
  },
]

export async function GET() {
  return NextResponse.json({ agents })
}
