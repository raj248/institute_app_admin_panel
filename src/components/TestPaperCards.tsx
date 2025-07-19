// components/TestPaperCards.tsx

"use client";

import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Trash2, PenIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TestPaper } from "@/types/entities";

interface TestPaperCardProps {
  paper: TestPaper;
  topicId: string;
  handleMoveToTrash: (id: string) => void;
}

export default function TestPaperCard({ paper, topicId, handleMoveToTrash }: TestPaperCardProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Card
      key={paper.id}
      className="
        relative group
        hover:scale-[1.02] transition-transform hover:shadow-md
        rounded-xl border border-border/40 cursor-pointer
        overflow-hidden
      "
      onClick={() => navigate(`/${location.pathname.split("/")[1]}/${topicId}/testpaper/${paper.id}`)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold truncate">{paper.name}</CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-1 pb-4">
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

      {isMobile ? (
        <CardFooter
          className="flex items-center justify-between px-4 pb-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            variant="outline"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToTrash(paper.id);
            }}
          >
            <Trash2 size={16} />
            <span className="hidden lg:inline">Edit</span>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToTrash(paper.id);
            }}
          >
            <Trash2 size={16} />
            <span className="hidden lg:inline">Delete</span>
          </Button>
        </CardFooter>
      ) : (
        <div
          className="
            absolute bottom-0 left-0 w-full
            bg-background/80
            flex justify-between items-center gap-2 p-2
            translate-y-full opacity-0
            group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-200 ease-in-out
            rounded-b-xl
          "
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            variant="outline"
            aria-label="Edit"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToTrash(paper.id);
            }}
          >
            <PenIcon size={16} />
            <span className="hidden lg:inline">Edit</span>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            aria-label="Delete"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToTrash(paper.id);
            }}
          >
            <Trash2 size={16} />
            <span className="hidden lg:inline">Delete</span>
          </Button>
        </div>
      )}
    </Card>
  );
}
