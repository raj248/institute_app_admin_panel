import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender, type Row } from "@tanstack/react-table";
import type { TestPaper } from "@/types/entities";

export function Row({
  row,
  index,
  onRowClick,
}: {
  row: Row<TestPaper>;
  index: number;
  onRowClick: (id: string) => void;
}) {


  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      className={`cursor-pointer transition-colors ${index % 2 === 0 ? "bg-card/80" : "bg-muted/30"
        } hover:bg-muted`}
      onClick={() => onRowClick(row.original.id)}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
