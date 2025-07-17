// src/pages/topic.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/cn";
import { fetchAllTestPapersByTopicId } from "@/lib/api";

type TestPaper = {
  id: string;
  name: string;
  topicId: string;
  mcqs: { id: string }[];
};

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [testPapers, setTestPapers] = useState<TestPaper[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    if (!topicId) return;
    fetchAllTestPapersByTopicId(topicId)
      .then(setTestPapers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [topicId]);

  return (
    <div className="md:p-3 lg:p-5 space-y-4">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight">Test Papers</h2>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant={viewMode === "list" ? "secondary" : "ghost"}
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid size={18} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div
          className={cn(
            "gap-3",
            viewMode === "grid" ? "flex flex-wrap" : "space-y-3"
          )}
        >
          {[...Array(4)].map((_, idx) => (
            <Skeleton
              key={idx}
              className={cn(
                "h-20 w-full rounded-md",
                viewMode === "grid" && "max-w-xs flex-1"
              )}
            />
          ))}
        </div>
      ) : testPapers && testPapers.length > 0 ? (
        <div
          className={cn(
            "gap-3",
            viewMode === "grid" ? "flex flex-wrap" : "space-y-3"
          )}
        >
          {testPapers.map((paper) => (
            <Card
              key={paper.id}
              onClick={() =>
                navigate(`/CAInter/${topicId}/testpaper/${paper.id}`)
              }
              className={cn(
                "cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-sm border border-border/50 rounded-lg  mx-4",
                viewMode === "grid" && "max-w-xs min-w-[220px] flex-1"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{paper.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {paper.mcqs.length} question{paper.mcqs.length !== 1 ? "s" : ""}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No test papers found for this topic.</p>
      )}
    </div>
  );
}
