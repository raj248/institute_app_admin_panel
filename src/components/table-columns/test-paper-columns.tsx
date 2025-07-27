// app/components/testpapers/getTestPaperColumns.ts
"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TestPaper } from "@/types/entities";
import { Button } from "@/components/ui/button";
import { MinusCircle, PenIcon, PlusCircle, Trash2 } from "lucide-react";
import { EditTestViewer } from "@/components/modals/EditTestViewer";
import { addNewlyAddedItem, removeNewlyAddedItem } from "@/lib/api";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";

export function getTestPaperColumns(
  handleCardClick: (id: string) => void,
  refreshPapers: () => Promise<void>,
  handleMoveToTrash: (id: string) => void
): ColumnDef<TestPaper>[] {
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
        <div className="truncate text-sm">
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
        <div className="text-sm text-right">{row.original.timeLimitMinutes ?? "-"} min</div>
      ),
      enableResizing: false,
    },
    {
      accessorKey: "totalMarks",
      header: () => <div className="text-right">Marks</div>,
      size: 70,
      cell: ({ row }) => (
        <div className="text-sm text-right">{row.original.totalMarks ?? "-"}</div>
      ),
      enableResizing: false,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      size: 50,
      enableResizing: false,
      cell: ({ row }) => {
        const testPaper = row.original;
        const [loading, setLoading] = useState(false);
        const [newlyAddedId, setNewlyAddedId] = useState<string | null>(testPaper.newlyAddedId);

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
            className="flex justify-end items-center"
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

