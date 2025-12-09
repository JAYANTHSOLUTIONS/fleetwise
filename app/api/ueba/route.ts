import { NextResponse } from "next/server"

const alerts = [
  {
    id: "U001",
    message: "Scheduling Agent attempted unauthorized access",
    severity: "high",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    source: "Scheduling Agent",
  },
  {
    id: "U002",
    message: "Unusual data request pattern detected",
    severity: "medium",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    source: "Telemetry Service",
  },
  {
    id: "U003",
    message: "Multiple failed authentication attempts",
    severity: "high",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    source: "API Gateway",
  },
  {
    id: "U004",
    message: "Anomalous query execution time detected",
    severity: "low",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    source: "Database Monitor",
  },
]

export async function GET() {
  return NextResponse.json({ alerts })
}
