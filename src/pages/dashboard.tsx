import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTopicsByCourseType } from "@/lib/api";
import type { Topic_schema } from "@/types/entities";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [topics, setTopics] = useState<Topic_schema[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopicsByCourseType("CAFinal")
      .then((res) => {
        const result = res.data;
        setTopics(result ?? null);
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-xl" />
          ))
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Total Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{topics?.length ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Test Papers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">24</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Video Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revision Tests Taken</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">58</p>
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
            <BarChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#5B42F3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="downloads" fill="#AF40FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tests" fill="#00DDEB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}