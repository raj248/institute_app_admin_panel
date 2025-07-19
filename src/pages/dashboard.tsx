import { getTopicsByCourseType } from "@/lib/api";
import type { Topic_schema } from "@/types/entities";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [topics, setTopics] = useState<Topic_schema[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTopicsByCourseType("CAFinal")
      .then((res) => {
        const result = res.data
        setTopics(result ?? null)
        if (!result) return
        console.log(result[0].name)
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  loading
  topics
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards /> */}
          {/* <div className="px-4 lg:px-6"> */}
          {/* <ChartAreaInteractive /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
