import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllStats } from "@/lib/api";
import type { Stats } from "@/types/entities";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useProtectAdminRoute } from "@/hooks/useProtectAdminRoute";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useProtectAdminRoute();
  useEffect(() => {
    getAllStats()
      .then((res) => {
        const result = res.data;
        setStats(result ?? null)
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dummyData = [
    { name: "Mon", views: 120, downloads: 30, tests: 12 },
    { name: "Tue", views: 200, downloads: 50, tests: 20 },
    { name: "Wed", views: 150, downloads: 40, tests: 15 },
    { name: "Thu", views: 220, downloads: 60, tests: 25 },
    { name: "Fri", views: 300, downloads: 80, tests: 35 },
    { name: "Sat", views: 180, downloads: 45, tests: 18 },
    { name: "Sun", views: 250, downloads: 70, tests: 28 },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-xl" />
          ))
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Test Papers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.testPaperCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.mcqCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Video Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.videoNoteCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.noteCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.userCount}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Weekly Engagement</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#5B42F3" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="downloads" stroke="#AF40FF" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="tests" stroke="#00DDEB" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
