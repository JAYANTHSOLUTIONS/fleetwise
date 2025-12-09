"use client"

import { useState, useEffect } from "react"
import { AgentLog } from "@/components/agent-log"
import { UEBAAlert } from "@/components/ueba-alert"
import { Activity, Shield, Loader } from "lucide-react"

interface Agent {
  id: string
  type: "Master Agent" | "Worker Agent"
  name: string
  action: string
  timestamp: string
  status: "running" | "completed"
}

interface UEBAAlertType {
  id: string
  message: string
  severity: "low" | "medium" | "high"
  timestamp: string
  source: string
}

export default function ReportsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [alerts, setAlerts] = useState<UEBAAlertType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, uebaRes] = await Promise.all([fetch("/api/agents"), fetch("/api/ueba")])

        const [agentsData, uebaData] = await Promise.all([agentsRes.json(), uebaRes.json()])

        setAgents(agentsData.agents)
        setAlerts(uebaData.alerts)
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const runningAgents = agents.filter((a) => a.status === "running").length
  const highSeverityAlerts = alerts.filter((a) => a.severity === "high").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600 mb-8">Agent activity logs and security monitoring</p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agent Activity */}
            <div>
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Agent Activity</h2>
                  <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {runningAgents} running
                  </span>
                </div>

                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {agents.map((agent) => (
                    <AgentLog key={agent.id} {...agent} />
                  ))}
                </div>
              </div>
            </div>

            {/* UEBA Security Monitoring */}
            <div>
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Security Monitoring</h2>
                  {highSeverityAlerts > 0 && (
                    <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      {highSeverityAlerts} critical
                    </span>
                  )}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {alerts.map((alert) => (
                    <UEBAAlert key={alert.id} {...alert} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Total Agents</p>
            <p className="text-3xl font-bold text-gray-900">{agents.length}</p>
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Running</p>
            <p className="text-3xl font-bold text-blue-600">{runningAgents}</p>
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Security Alerts</p>
            <p className="text-3xl font-bold text-gray-900">{alerts.length}</p>
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Critical Issues</p>
            <p className="text-3xl font-bold text-red-600">{highSeverityAlerts}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
