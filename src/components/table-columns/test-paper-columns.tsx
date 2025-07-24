// app/components/testpapers/getTestPaperColumns.ts
"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TestPaper } from "@/types/entities";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { EditTestViewer } from "@/components/modals/EditTestViewer";

export function getTestPaperColumns(
  handleCardClick: (id: string) => void,
  refreshPapers: () => Promise<void>,
  handleMoveToTrash: (id: string) => void
): ColumnDef<TestPaper>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div
          className="text-sm cursor-pointer"
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
      cell: ({ row }) => (
        <div className="truncate max-w-[200px] text-sm">
          {row.original.description || (
            <span className="italic text-muted-foreground">No description</span>
          )}
        </div>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "timeLimitMinutes",
      header: "Time Limit",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.timeLimitMinutes ?? "-"} min</div>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "totalMarks",
      header: "Total Marks",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.totalMarks ?? "-"}</div>
      ),
      filterFn: "includesString",
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div
          className="flex justify-end items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <EditTestViewer item={row.original} refreshPapers={refreshPapers} />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleMoveToTrash(row.original.id)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
}
