// src/pages/testpaper.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Skeleton } from "@/components/ui/skeleton";
import { getTestPaperById, moveMCQToTrash } from "@/lib/api";
import { useConfirm } from "@/components/modals/global-confirm-dialog";
import type { MCQ } from "@/types/entities";

export default function TestPaperPage() {
  const { testPaperId } = useParams<{ testPaperId: string }>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [loading, setLoading] = useState(true);
  const [mcqs, setMcqs] = useState<MCQ[] | null>(null);
  useEffect(() => {
    if (!testPaperId) return;
    getTestPaperById(testPaperId)
      .then((res) => setMcqs(res.data?.mcqs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testPaperId]);

  const confirm = useConfirm();

  const handleMoveToTrash = async (mcqId: string) => {
    const confirmed = await confirm({
      title: "Delete this question?",
      description: "This will move the question to trash. You can restore it later if needed.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    const mcq = await moveMCQToTrash(mcqId);
    if (!mcq) {
      console.error("Failed to move MCQ to trash.");
      alert("Failed to move MCQ to trash.");
      return;
    }
    setMcqs((prev) => prev ? prev.filter((mcq) => mcq.id !== mcqId) : null);
  };


  return (
    <div className="md:p-3 lg:p-5 space-y-4">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Test Paper
        </h2>
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
                "h-24 w-full rounded-md",
                viewMode === "grid" && "max-w-xs flex-1"
              )}
            />
          ))}
        </div>
      ) : mcqs && mcqs.length > 0 ? (
        <div
          className={cn(
            "gap-3",
            viewMode === "grid" ? "flex flex-wrap" : "space-y-3"
          )}
        >
          {mcqs.map((mcq, idx) => (
            <Card
              key={mcq.id}
              className={cn(
                "relative transition-transform hover:scale-[1.02] hover:shadow-sm border border-border/50 rounded-lg mx-4 group",
                viewMode === "grid" && "max-w-xs min-w-[250px] flex-1"
              )}
            >
              {/* Delete Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveToTrash(mcq.id);
                }}
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>

              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  {idx + 1}. {mcq.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <div><strong>A:</strong> {mcq.options.a}</div>
                <div><strong>B:</strong> {mcq.options.b}</div>
                <div><strong>C:</strong> {mcq.options.c}</div>
                <div><strong>D:</strong> {mcq.options.d}</div>
                <div className="mt-1">
                  <span className="font-semibold">Correct:</span>{" "}
                  <span className="uppercase">{mcq.correctAnswer}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No questions found for this test paper.</p>
      )}
    </div>
  );
}
