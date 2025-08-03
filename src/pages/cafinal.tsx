import { useEffect, useState } from "react";
import { getTopicsByCourseType } from "@/lib/api";
import type { Topic_schema } from "@/types/entities";
import { DataTable } from "@/components/tables/topic-table";
import { useProtectAdminRoute } from "@/hooks/useProtectAdminRoute";

export default function CAFinal() {
  const [topics, setTopics] = useState<Topic_schema[] | null>(null);
  const [loading, setLoading] = useState(true);
  useProtectAdminRoute();
  useEffect(() => {
    getTopicsByCourseType("CAFinal")
      .then((res) => {
        const result = res.data
        setTopics(result ?? null)
        if (!result) return
      })
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
          {!loading &&
            <DataTable
              key={"CAFinal"}
              data={topics ?? []}
              setData={setTopics}
              loading={loading}
              setLoading={setLoading}
            />}
        </div>
      </div>
    </div>
  );
}