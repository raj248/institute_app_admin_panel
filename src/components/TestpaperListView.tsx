"use client";

import { Skeleton } from "@/components/ui/skeleton";
import TestPaperCard from "@/components/cards/TestPaperCards";
import type { TestPaper } from "@/types/entities";

interface TestpaperListViewProps {
  testPapers: TestPaper[];
  topicId: string;
  loading: boolean;
  refreshPapers: () => Promise<void>;
  handleMoveToTrash: (id: string) => void;
  handleCardClick: (id: string) => void;
}

export default function TestpaperListView({
  testPapers,
  topicId,
  loading,
  refreshPapers,
  handleMoveToTrash,
  handleCardClick,
}: TestpaperListViewProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!testPapers || testPapers.length === 0) {
    return <p className="text-muted-foreground">No test papers found for this topic.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {testPapers.map((paper) => (
        <TestPaperCard
          key={paper.id}
          paper={paper}
          topicId={topicId}
          refreshPapers={refreshPapers}
          handleMoveToTrash={handleMoveToTrash}
          onClick={() => handleCardClick(paper.id)}
        />
      ))}
    </div>
  );
}

