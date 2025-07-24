import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender, type Row } from "@tanstack/react-table";
import { cn } from "@/lib/cn";
import type { TestPaper } from "@/types/entities";

export function DraggableTestPaperRow({
  row,
  onRowClick,
}: {
  row: Row<TestPaper>;
  onRowClick: (id: string) => void;
}) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn(
        "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 cursor-pointer hover:bg-muted/50 transition-colors"
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
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
