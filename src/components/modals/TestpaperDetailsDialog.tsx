"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { getTestPaperById, moveMCQToTrash } from "@/lib/api"
import type { TestPaper } from "@/types/entities"
import { useState, useEffect } from "react"
import { useConfirm } from "./global-confirm-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { AddQuestionsDialog } from "./AddQuestionsDialog"
import { EditMCQViewer } from "./EditMCQViewer"
import { Badge } from "../ui/badge"

interface TestPaperDetailsDialogProps {
  testPaperId: string | null
  topicId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TestpaperDetailsDialog({
  testPaperId,
  topicId,
  open,
  onOpenChange,
}: TestPaperDetailsDialogProps) {
  const [testPaper, setTestPaper] = useState<TestPaper | null>(null)
  const [loading, setLoading] = useState(false)
  const confirm = useConfirm()

  const fetchData = async () => {
    if (!testPaperId || !open) return
    setLoading(true)
    try {
      const res = await getTestPaperById(testPaperId)
      if (res.success) {
        setTestPaper(res.data ?? null)
      } else {
        console.error("Error fetching test paper:", res.error)
        setTestPaper(null)
      }
    } catch (e) {
      console.error(e)
      setTestPaper(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [testPaperId, open])

  const handleMoveToTrash = async (mcqId: string) => {
    const confirmed = await confirm({
      title: "Delete This Question?",
      description: "This will move the question to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    })

    if (!confirmed) return

    const mcq = await moveMCQToTrash(mcqId)
    if (!mcq) {
      console.error("Failed to move MCQ to trash.")
      alert("Failed to move MCQ to trash.")
      return
    }

    setTestPaper((prev) =>
      prev ? { ...prev, mcqs: prev.mcqs?.filter((q) => q.id !== mcqId) } : null
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto max-w-[95vw] md:max-w-screen-md lg:max-w-screen-lg">
        {loading || !testPaper ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/3 mx-auto" />
            <Skeleton className="h-3 w-2/3 mx-auto" />
            <div className="flex justify-center gap-3">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-20" />
            </div>
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        ) : (
          <>
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-base font-semibold">
                {testPaper.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {testPaper.description}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap justify-center gap-2 text-xs mb-4">
              {testPaper.timeLimitMinutes && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  Time Limit: {testPaper.timeLimitMinutes} min
                </Badge>
              )}
              {testPaper.totalMarks && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  Total Marks: {testPaper.totalMarks}
                </Badge>
              )}
            </div>


            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Questions</h4>
              <AddQuestionsDialog
                testPaperId={testPaper.id}
                topicId={topicId}
                fetchData={fetchData}
              />
            </div>

            <ScrollArea className="max-h-[400px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Question</TableHead>
                    <TableHead className="text-xs">Explanation</TableHead>
                    <TableHead className="text-xs">Options</TableHead>
                    <TableHead className="text-xs">Correct</TableHead>
                    <TableHead className="text-xs">Marks</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testPaper.mcqs?.map((mcq) => (
                    <TableRow key={mcq.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TableCell className="max-w-[180px] truncate cursor-default text-xs">
                            {mcq.question}
                          </TableCell>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm text-xs">
                          {mcq.question}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TableCell className="max-w-[180px] truncate cursor-default text-xs">
                            {mcq.explanation ?? "-"}
                          </TableCell>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm text-xs">
                          {mcq.explanation ?? "-"}
                        </TooltipContent>
                      </Tooltip>

                      <TableCell className="text-xs">
                        <ul className="space-y-0.5">
                          {Object.entries(mcq.options).map(([key, value]) => (
                            <li key={key}>
                              <span className="font-medium">{key.toUpperCase()}:</span> {value}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="text-xs">
                        {mcq.correctAnswer.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-xs">
                        {mcq.marks ?? "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <EditMCQViewer item={mcq} refreshMCQs={fetchData} />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveToTrash(mcq.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>

  )
}
