"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, BarChart, BookOpen, ClipboardList, Video } from "lucide-react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import ExportUsersButton from "@/components/ExportUserButton"
import { getAllStats } from "@/lib/api"
import type { Stats } from "@/types/entities"

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function fetchStats() {
      const res = await getAllStats()
      if (res.success) setStats(res.data ?? null)
    }
    fetchStats()
  }, [])

  // fallback if no stats yet
  if (!stats) {
    return <div className="p-6">Loading stats...</div>
  }

  // Example weekly data (replace with backend growth data later)
  const weeklyUsers = [
    { name: "Mon", users: 40 },
    { name: "Tue", users: 60 },
    { name: "Wed", users: 80 },
    { name: "Thu", users: 50 },
    { name: "Fri", users: 90 },
    { name: "Sat", users: 120 },
    { name: "Sun", users: 70 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <ExportUsersButton />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.userCount} icon={<Users className="w-4 h-4" />}
          subtitle={`+${stats.registeredUsersThisWeek} this week`} />

        <StatCard title="Total Tests Taken" value={stats.totalTestsTaken} icon={<ClipboardList className="w-4 h-4" />}
          subtitle={`+${stats.testsTakenThisWeek} this week`} />

        <StatCard title="Quizzes" value={stats.testPaperCount} icon={<FileText className="w-4 h-4" />} />
        <StatCard title="MCQs" value={stats.mcqCount} icon={<BarChart className="w-4 h-4" />} />
        <StatCard title="Notes" value={stats.noteCount} icon={<BookOpen className="w-4 h-4" />} />
        <StatCard title="Video Notes" value={stats.videoNoteCount} icon={<Video className="w-4 h-4" />} />
      </div>

      {/* User Growth Graph */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth & Tests (Weekly)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={
                stats
                  ? stats.graph.registrationsByWeek.map((r, i) => ({
                    name: r.week, // e.g., "2025-34"
                    registrations: r.count,
                    tests: stats.graph.testsTakenByWeek[i]?.count ?? 0,
                  }))
                  : []
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#2563eb"
                strokeWidth={2}
                name="User Registrations"
              />
              <Line
                type="monotone"
                dataKey="tests"
                stroke="#16a34a"
                strokeWidth={2}
                name="Tests Taken"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  )
}

function StatCard({ title, value, subtitle, icon }: { title: string, value: number, subtitle?: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
