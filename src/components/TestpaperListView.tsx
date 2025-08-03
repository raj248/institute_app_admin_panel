"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type VisibilityState,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import type { TestPaper } from "@/types/entities";
import { getTestPaperColumns } from "@/components/table-columns/test-paper-columns";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Row } from "@/components/tables/TestPaperRow"; // adjust import path
import { useConfirm } from "./modals/global-confirm-dialog";

interface TestpaperListViewProps {
  testPapers: TestPaper[];
  globalFilter: string;
  setPapers: React.Dispatch<React.SetStateAction<TestPaper[] | null>>;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  refreshPapers: () => Promise<void>;
  handleCardClick: (id: string) => void;
}

export default function TestpaperListView({
  testPapers,
  globalFilter,
  setPapers,
  setGlobalFilter,
  refreshPapers,
  handleCardClick,
}: TestpaperListViewProps) {
  const confirm = useConfirm();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const columns = getTestPaperColumns(
    handleCardClick,
    refreshPapers,
    confirm,
    (id: string) => setPapers((prev) => prev?.filter((p) => p.id !== id) ?? null)
  );

  const table = useReactTable({
    data: testPapers ?? [],
    columns,
    state: { sorting, globalFilter, columnVisibility, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-xl border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>

                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <Row
                  key={row.id}
                  row={row}
                  index={index}
                  onRowClick={handleCardClick}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  No test papers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="rows-per-page" className="text-sm">Rows per page</Label>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => setPagination({ ...pagination, pageSize: parseInt(value) })}
          >
            <SelectTrigger id="rows-per-page" className="w-20">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          >
            <IconChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <span className="text-sm">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            <IconChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
