import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender, type Row } from "@tanstack/react-table";
import type { Topic, Topic_schema } from "@/types/entities";

export default function Row({
  index,
  row,
  onRowClick,
}: {
  index: number;
  row: Row<Topic_schema>;
  onRowClick: (topic: Topic) => void;
}) {


  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      className={`cursor-pointer transition-colors ${index % 2 === 0 ? "bg-card/80" : "bg-muted/30"
        } hover:bg-muted`}
      onClick={() => { onRowClick(row.original as Topic) }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
