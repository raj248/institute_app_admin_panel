import { DataTable } from "@/components/topic-table";
import { getTopicsByCourseType } from "@/lib/api";
import type { Topic_schema } from "@/types/entities";
import { useEffect, useState } from "react";


export default function Dashboard() {
  const [topics, setTopics] = useState<Topic_schema[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTopicsByCourseType("CAInter")
      .then((res) => setTopics(res.data ?? null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards /> */}
          {/* <div className="px-4 lg:px-6"> */}
          {/* <ChartAreaInteractive /> */}
          {/* </div> */}
          {!loading && <DataTable data={topics ?? []} setData={setTopics} setLoading={setLoading} loading={loading} />}
        </div>
      </div>
    </div>
  );
}
