"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, MoreVertical, PenIcon, Trash2, MinusCircle, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { TestPaper } from "@/types/entities";
import {
  addNewlyAddedItem,
  moveTestPaperToTrash,
  removeNewlyAddedItem,
} from "@/lib/api";
import { toast } from "sonner";
import { useConfirm } from "../modals/global-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EditTestViewer } from "../modals/EditTestViewer";

interface TestPaperCardProps {
  paper: TestPaper;
  topicId: string;
  refreshPapers: () => Promise<void>;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function TestPaperCard({
  paper,
  topicId,
  onDelete,
  onClick,
  refreshPapers,
}: TestPaperCardProps) {
  const confirm = useConfirm();
  topicId
  const [loading, setLoading] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(paper.newlyAddedId);

  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete This Test Paper?",
      description:
        "This will move the test paper to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const res = await moveTestPaperToTrash(id);
    if (!res) {
      toast.error("Failed to move test paper to trash.");
      return;
    }

    onDelete?.();
  };

  const toggleNewlyAdded = async () => {
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
    <EditTestViewer
      item={paper}
      refreshPapers={refreshPapers}
      trigger={({ open }) => (
        <Card
          key={paper.id}
          className="relative transition hover:shadow-md hover:shadow-primary/40 border rounded-xl mx-2 sm:mx-4 max-w-xs min-w-[220px] flex-1 group bg-background hover:bg-accent/30"
        >
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNewlyAdded();
                }}
                disabled={loading}
              >
                {newlyAddedId ? (
                  <>
                    <MinusCircle className="mr-2 size-4" />
                    <span>Unmark Newly Added</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 size-4" />
                    <span>Mark as Newly Added</span>
                  </>
                )}
              </DropdownMenuItem>

              {/* Edit option inside dropdown (optional if card already opens editor) */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                <PenIcon className="mr-2 size-4" />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveToTrash(paper.id);
                }}
                variant="destructive"
              >
                <Trash2 className="mr-2 size-4 text-destructive" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Card Content opens edit drawer */}
          <div
            className="cursor-pointer flex flex-col h-full justify-between p-4"
            onClick={(e) => {
              e.stopPropagation();
              // open();
              onClick?.();
            }}
          >
            <div className="space-y-1 text-center">
              <CardTitle className="text-sm font-semibold text-foreground truncate">
                {paper.name ?? "Untitled Test Paper"}
              </CardTitle>
              <CardContent className="text-xs text-muted-foreground space-y-1 p-0">
                <div className="flex justify-center gap-1 items-center">
                  <FileText size={14} />
                  {paper.mcqCount ?? 0} question{paper.mcqCount !== 1 ? "s" : ""}
                </div>
                {paper.timeLimitMinutes && (
                  <div className="flex justify-center gap-1 items-center">
                    <Clock size={14} />
                    {paper.timeLimitMinutes} min
                  </div>
                )}
                {paper.totalMarks && (
                  <div className="flex justify-center gap-1 items-center">
                    <span className="font-medium">Marks:</span>
                    {paper.totalMarks}
                  </div>
                )}
              </CardContent>
            </div>

            <div className="mt-2 flex justify-center gap-1 text-xs text-muted-foreground">
              <Calendar size={14} />
              {format(new Date(paper.createdAt), "dd MMM yyyy")}
            </div>
          </div>
        </Card>
      )}
    />
  );
}
