// app/components/testpapers/getTestPaperColumns.ts
"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TestPaper } from "@/types/entities";
import { Button } from "@/components/ui/button";
import { MinusCircle, PenIcon, PlusCircle, Trash2 } from "lucide-react";
import { EditTestViewer } from "@/components/modals/EditTestViewer";
import {
  addNewlyAddedItem,
  moveTestPaperToTrash,
  removeNewlyAddedItem,
} from "@/lib/api";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { toggleTestPaperPublish } from "@/lib/api";
import type { ConfirmContextType } from "../modals/global-confirm-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AddQuestionsDialog } from "../modals/AddQuestionsDialog";

export function getTestPaperColumns(
  handleCardClick: (id: string) => void,
  refreshPapers: () => Promise<void>,
  confirm: ConfirmContextType,
  OnDelete?: (id: string) => void
): ColumnDef<TestPaper>[] {
  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete This Note?",
      description:
        "This will move the note to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const res = await moveTestPaperToTrash(id);
    if (!res.success) {
      console.error("Failed to move note to trash.");
      alert("Failed to move note to trash.");
      return;
    }
    OnDelete?.(id);
  };
  return [
    {
      accessorKey: "name",
      header: "Name",
      size: 250,
      cell: ({ row }) => (
        <div
          className="text-sm cursor-pointer truncate"
          onClick={() => handleCardClick(row.original.id)}
        >
          {row.original.name}
        </div>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 300,
      cell: ({ row }) => (
        <div className="max-w-[50vw] truncate overflow-hidden text-sm">
          {row.original.description || (
            <span className="italic text-muted-foreground">No description</span>
          )}
        </div>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "timeLimitMinutes",
      header: () => <div className="text-right">Time</div>,
      size: 80,
      cell: ({ row }) => (
        <div className="text-sm text-right">
          {row.original.timeLimitMinutes ?? "-"} min
        </div>
      ),
      enableResizing: false,
    },
    {
      accessorKey: "totalMarks",
      header: () => <div className="text-right">Marks</div>,
      size: 70,
      cell: ({ row }) => (
        <div className="text-sm text-right">
          {row.original.totalMarks ?? "-"}
        </div>
      ),
      enableResizing: false,
    },
    {
      id: "publish",
      header: "Status",
      size: 80,
      enableResizing: false,
      cell: ({ row }) => {
        const testPaper = row.original;
        const [loading, setLoading] = useState(false);
        const isPublished = !!testPaper.publishedAt;

        const handleToggle = async () => {
          setLoading(true);
          try {
            const res = await toggleTestPaperPublish(testPaper.id);
            if (res.success) {
              await refreshPapers();
            }
          } catch (err) {
            console.error("Toggle publish failed:", err);
          } finally {
            setLoading(false);
          }
        };

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className={`text-xs cursor-pointer 
                ${
                  isPublished
                    ? "text-blue-600 border-blue-600 hover:bg-blue-100"
                    : "text-green-600 border-green-600 hover:bg-green-100"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                disabled={loading}
              >
                {isPublished ? "Published" : "Not Published"}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isPublished ? "Click to unpublish" : "Click to publish"}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      id: "new",
      header: "New MCQ",
      size: 80,
      enableResizing: false,
      cell: ({ row }) => {
        const testPaper = row.original;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <AddQuestionsDialog
              testPaperId={testPaper.id}
              topicId={testPaper.topicId}
              // trigger={
              //   <Button
              //     variant="default"
              //     className="cursor-pointer"
              //     onClick={(e) => e.stopPropagation()}
              //     onPointerDown={(e) => e.stopPropagation()}
              //   >
              //     Open Custom Dialog
              //   </Button>
              // }
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      size: 50,
      enableResizing: false,
      cell: ({ row }) => {
        const testPaper = row.original;
        const [loading, setLoading] = useState(false);
        const [newlyAddedId, setNewlyAddedId] = useState<string | null>(
          testPaper.newlyAddedId
        );

        const toggleNewlyAdded = async () => {
          setLoading(true);
          try {
            if (!newlyAddedId) {
              const res = await addNewlyAddedItem("TestPaper", testPaper.id);
              if (res.success && res.data) {
                setNewlyAddedId(res.data.id);
              }
            } else {
              const res = await removeNewlyAddedItem(newlyAddedId);
              if (res.success) {
                setNewlyAddedId(null);
              }
            }
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
          }
        };

        return (
          <div
            className="flex justify-end items-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <IconDotsVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <EditTestViewer
                  item={testPaper}
                  refreshPapers={refreshPapers}
                  trigger={({ open }) => (
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        open();
                      }}
                    >
                      <PenIcon className="mr-2 size-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  )}
                />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveToTrash(testPaper.id);
                  }}
                  variant="destructive"
                >
                  <Trash2 className="mr-2 size-4 text-destructive" />
                  <span>Move to Trash</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNewlyAdded();
                  }}
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
