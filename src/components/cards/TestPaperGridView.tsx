// components/TestpaperGridView.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import TestPaperCard from "@/components/cards/TestPaperCards";
import type { TestPaper } from "@/types/entities";

interface TestpaperGridViewProps {
  testPapers: TestPaper[];
  topicId: string;
  loading: boolean;
  refreshPapers: () => Promise<void>;
  handleMoveToTrash: (id: string) => void;
  handleCardClick: (id: string) => void;
}

export default function TestpaperGridView({
  testPapers,
  topicId,
  loading,
  refreshPapers,
  handleMoveToTrash,
  handleCardClick,
}: TestpaperGridViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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