import { NextResponse } from "next/server"

const appointments: any[] = [
  {
    id: "APT001",
    vehicleId: "V001",
    vehicleName: "Hero Xtreme",
    serviceType: "Regular Maintenance",
    date: "2025-12-15",
    time: "10:00",
    status: "confirmed",
  },
  {
    id: "APT002",
    vehicleId: "V003",
    vehicleName: "Maruti Swift",
    serviceType: "Engine Repair",
    date: "2025-12-12",
    time: "14:30",
    status: "pending",
  },
]

export async function GET() {
  return NextResponse.json({ appointments })
}

export async function POST(req: Request) {
  const body = await req.json()
  const appointment = {
    id: `APT${Date.now()}`,
    ...body,
    status: "confirmed",
  }
  appointments.push(appointment)
  return NextResponse.json({ message: "Appointment booked", appointment }, { status: 201 })
}
