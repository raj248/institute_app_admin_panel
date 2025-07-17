import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchTopicsByCourseType } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { List, LayoutGrid } from "lucide-react";

type Topic = {
  id: string;
  name: string;
  description?: string;
  courseId: string;
};

export default function CAInter() {
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTopicsByCourseType("CAInter")
      .then((data) => setTopics(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (topic: Topic) => {
    navigate(`/CAInter/${topic.id}`);
  };

  return (
    <div className="md:p-3 lg:p-5 space-y-4">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight">CA Inter Topics</h2>
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
      ) : topics && topics.length > 0 ? (
        <div
          className={cn(
            "gap-3",
            viewMode === "grid" ? "flex flex-wrap" : "space-y-3"
          )}
        >
          {topics.map((topic) => (
            <Card
              key={topic.id}
              onClick={() => handleCardClick(topic)}
              className={cn(
                "cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-sm border border-border/50 rounded-lg mx-4",
                viewMode === "grid" && "max-w-xs min-w-[220px] flex-1"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{topic.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {topic.description ?? <em>No description provided.</em>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No topics found for CA Inter.</p>
      )}
    </div>
  );
}
