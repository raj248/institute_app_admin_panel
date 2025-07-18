import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTopicsByCourseType, moveTopicToTrash } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { List, LayoutGrid, Trash2 } from "lucide-react";
import { useConfirm } from "@/components/global-confirm-dialog";
import type { Topic } from "@/types/entities";

export default function CAInter() {
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const navigate = useNavigate();

  useEffect(() => {
    getTopicsByCourseType("CAInter")
      .then((res) => setTopics(res.data ?? null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const confirm = useConfirm();

  const handleMoveToTrash = async (topicId: string) => {
    const confirmed = await confirm({
      title: "Move this topic to trash?",
      description: "This will move the topic to trash along with its test papers and MCQs. You can restore it later if needed.",
      confirmText: "Move to Trash",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    const topic = await moveTopicToTrash(topicId);
    if (!topic) {
      console.error("Failed to move topic to trash.");
      alert("Failed to move topic to trash.");
      return;
    }

    setTopics((prev) => prev?.filter((t) => t.id !== topicId) ?? null);
  };

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
            variant={viewMode === "list" ? "default" : "secondary"}
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "grid" ? "default" : "secondary"}
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
              className={cn(
                "relative transition-transform hover:scale-[1.02] hover:shadow-sm border border-border/50 rounded-lg mx-4 group",
                viewMode === "grid" && "max-w-xs min-w-[220px] flex-1"
              )}
            >
              {/* Move to Trash Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveToTrash(topic.id);
                }}
              >
                <Trash2 size={16} className="text-yellow-600" />
              </Button>

              <div onClick={() => handleCardClick(topic)} className="cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{topic.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <div>
                    {topic.description ?? <em>No description provided.</em>}
                  </div>
                  <div>
                    {topic.testPaperCount ?? 0} Test Paper{(topic.testPaperCount ?? 0) !== 1 ? "s" : ""}
                  </div>
                </CardContent>

              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No topics found for CA Inter.</p>
      )}
    </div>
  );
}
