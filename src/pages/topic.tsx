import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { List, LayoutGrid, Trash2, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/cn";
import { getAllTestPapersByTopicId, moveTestPaperToTrash } from "@/lib/api";
import { useConfirm } from "@/components/global-confirm-dialog";
import type { TestPaper } from "@/types/entities";

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [testPapers, setTestPapers] = useState<TestPaper[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const loadTestPapers = async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const res = await getAllTestPapersByTopicId(topicId);
      setTestPapers(res.data ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestPapers();
  }, [topicId]);

  const confirm = useConfirm();

  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete this test paper?",
      description: "This will move the test paper to trash. You can restore it later if needed.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    const test = await moveTestPaperToTrash(id);
    if (!test) {
      console.error("Failed to move test paper to trash.");
      alert("Failed to move test paper to trash.");
      return;
    }
    setTestPapers((prev) => prev?.filter((t) => t.id !== id) ?? null);
  };

  return (
    <div className="md:p-3 lg:p-5 space-y-4">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight">Test Papers</h2>
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
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"
          )}
        >
          {[...Array(4)].map((_, idx) => (
            <Skeleton
              key={idx}
              className="h-24 w-full rounded-lg"
            />
          ))}
        </div>
      ) : testPapers && testPapers.length > 0 ? (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          )}
        >
          {testPapers.map((paper) => (
            <Card
              key={paper.id}
              className="relative transition-transform hover:scale-[1.02] hover:shadow-md border border-border/40 rounded-xl cursor-pointer"
              onClick={() => navigate(`/${location.pathname.split("/")[1]}/${topicId}/testpaper/${paper.id}`)}
            >
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveToTrash(paper.id);
                }}
              >
                <Trash2 size={16} className="text-destructive" />
              </Button>

              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold truncate">{paper.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <FileText size={14} />
                  {paper.mcqs?.length ?? 0} question{paper.mcqs?.length !== 1 ? "s" : ""}
                </div>
                {paper.timeLimitMinutes && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {paper.timeLimitMinutes} min
                  </div>
                )}
                {paper.totalMarks && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Marks:</span>
                    {paper.totalMarks}
                  </div>
                )}
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
