import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/cn";
import { getAllTestPapersByTopicId, moveTestPaperToTrash } from "@/lib/api";
import { useConfirm } from "@/components/global-confirm-dialog";
import type { TestPaper } from "@/types/entities";
import TestPaperCard from "@/components/TestPaperCards";
import { TestpaperDetailsDialog } from "@/components/TestpaperDetailsDrawer";

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [testPapers, setTestPapers] = useState<TestPaper[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedTestPaperId, setSelectedTestPaperId] = useState<string | null>(null);

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

  const handleCardClick = (id: string) => {
    setSelectedTestPaperId(id);
    setOpenDetailDialog(true);
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

      <TestpaperDetailsDialog
        testPaperId={selectedTestPaperId}
        open={openDetailDialog}
        onOpenChange={setOpenDetailDialog}
      />

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
          {topicId && testPapers.map((paper) => (
            <TestPaperCard
              key={paper.id}
              paper={paper}
              topicId={topicId}
              handleMoveToTrash={handleMoveToTrash}
              onClick={() => handleCardClick(paper.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No test papers found for this topic.</p>
      )}
    </div>
  );
}
