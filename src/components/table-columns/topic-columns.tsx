// components/tables/topic-columns.tsx

"use client"

import { format } from "date-fns";
import { IconDotsVertical } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditTopicViewer } from "@/components/modals/EditTopicViewer";
import type { Topic_schema } from "@/types/entities";
import { moveTopicToTrash } from "@/lib/api";
import { useConfirm } from "@/components/modals/global-confirm-dialog";

export function getTopicColumns(setTopics: React.Dispatch<React.SetStateAction<Topic_schema[] | null>>) {
  const confirm = useConfirm();

  const handleMoveToTrash = async (topicId: string) => {
    const confirmed = await confirm({
      title: "Move This Topic To Trash?",
      description: "This will move the topic to trash along with its test papers and MCQs. You can restore it later if needed.",
      confirmText: "Move to Trash",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const topic = await moveTopicToTrash(topicId);
    if (!topic) {
      console.error("Failed to move topic to trash.");
      alert("Failed to move topic to trash.");
      return;
    }

    setTopics((prev) => prev?.filter((t) => t.id !== topicId) ?? null);
  };

  const columns: ColumnDef<Topic_schema>[] = [
    {
      accessorKey: "name",
      header: () => <span className="ml-2 font-medium">Name</span>,
      cell: ({ row }) => <div className="ml-2 font-medium">{row.original.name}</div>,
      enableHiding: false,
      filterFn: "includesString"
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="max-w-[180px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-[350px] truncate"
          title={row.original.description ?? "No description provided."}
        >
          {row.original.description ?? <em className="text-muted-foreground">No description</em>}
        </div>
      ),
      filterFn: "includesString"
    },
    {
      accessorKey: "Last Updated",
      header: "Last Updated",
      cell: ({ row }) => {
        const dateString = row.original.updatedAt;
        const formatted = format(new Date(dateString), "dd MMM yyyy, hh:mm a");
        return <div className="w-40 truncate">{formatted}</div>;
      },
    },
    {
      accessorKey: "Test Paper Count",
      header: "# Test Papers",
      cell: ({ row }) => (
        <div className="w-32 text-center justify-center truncate">{row.original.testPaperCount ?? 0}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <EditTopicViewer item={row.original} setTopics={setTopics} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                handleMoveToTrash(row.original.id);
                e.stopPropagation();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return columns;
}