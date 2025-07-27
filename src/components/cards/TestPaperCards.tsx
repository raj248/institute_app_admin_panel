// components/TestPaperCards.tsx

"use client";

import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Trash2, MinusCircle, PlusCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TestPaper } from "@/types/entities";
import { EditTestViewer } from "../modals/EditTestViewer";
import { addNewlyAddedItem, moveTestPaperToTrash, removeNewlyAddedItem } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "../modals/global-confirm-dialog";

interface TestPaperCardProps {
  paper: TestPaper;
  topicId: string;
  refreshPapers: () => Promise<void>
  onDelete?: () => void;
  onClick: () => void;
}

export default function TestPaperCard({ paper, topicId, onDelete, onClick, refreshPapers }: TestPaperCardProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const confirm = useConfirm();


  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete This Test Paper?",
      description: "This will move the test paper to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const test = await moveTestPaperToTrash(id);
    if (!test) {
      console.error("Failed to move test paper to trash.");
      alert("Failed to move test paper to trash.");
      return;
    }
    onDelete?.();
  };

  const [loading, setLoading] = useState(false);
  console.log("Newly Added ID: ", paper.newlyAddedId)
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(paper.newlyAddedId);

  const toggleNewlyAdded = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (!newlyAddedId) {
        const res = await addNewlyAddedItem("TestPaper", paper.id);
        if (res.success && res.data) {
          setNewlyAddedId(res.data.id);
          toast.success("Marked as newly added");
        }
      } else {
        const res = await removeNewlyAddedItem(newlyAddedId);
        if (res.success) {
          setNewlyAddedId(null);
          toast.success("Unmarked as newly added");
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to toggle newly added");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card
      key={paper.id}
      className="
        relative group
        hover:scale-[1.02] transition-transform hover:shadow-md
        rounded-xl border border-border/40 cursor-pointer
        overflow-hidden
      "
      // onClick={() => navigate(`/${location.pathname.split("/")[1]}/${topicId}/testpaper/${paper.id}`)}
      onClick={onClick ?? (() => navigate(`/${location.pathname.split("/")[1]}/${topicId}/testpaper/${paper.id}`))} // fallback to navigate if onClick not provided
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold truncate">{paper.name}</CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-1 pb-4">
        <div className="flex items-center gap-1">
          <FileText size={14} />
          {paper.mcqCount ?? 0} question{paper.mcqCount !== 1 ? "s" : ""}
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
          <EditTestViewer item={paper} refreshPapers={refreshPapers} />
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
          <EditTestViewer item={paper} refreshPapers={refreshPapers} />

          <Button
            size="sm"
            variant={newlyAddedId ? "secondary" : "outline"}
            disabled={loading}
            onClick={toggleNewlyAdded}
          >
            {newlyAddedId ? (
              <>
                <MinusCircle size={16} className="mr-1" />
                <span className="hidden lg:inline">Unmark</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} className="mr-1" />
                <span className="hidden lg:inline">Mark</span>
              </>
            )}
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
