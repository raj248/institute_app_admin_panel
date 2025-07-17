// src/pages/testpaper.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/cn";
import { Skeleton } from "@/components/ui/skeleton";
import { getTestPaperById } from "@/lib/api";

type MCQ = {
  id: string;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: "a" | "b" | "c" | "d";
};

export default function TestPaperPage() {
  const { testPaperId } = useParams<{ testPaperId: string }>();
  const [mcqs, setMcqs] = useState<MCQ[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    if (!testPaperId) return;
    getTestPaperById(testPaperId)
      .then((data) => setMcqs(data.mcqs || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [testPaperId]);

  return (
    <div className="md:p-3 lg:p-5 space-y-4">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Test Paper
        </h2>
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
                "transition-transform hover:scale-[1.02] hover:shadow-sm border border-border/50 rounded-lg mx-4",
                viewMode === "grid" && "max-w-xs min-w-[250px] flex-1"
              )}
            >
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
