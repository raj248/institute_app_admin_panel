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
      title: "Delete this question?",
      description: "This will move the question to trash. You can restore it later if needed.",
      confirmText: "Delete",
      cancelText: "Cancel",
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
            <Skeleton className="h-6 w-1/3 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        ) : (
          <>
            <DialogHeader className="items-center text-center">
              <DialogTitle>{testPaper.name}</DialogTitle>
              <DialogDescription>{testPaper.description}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
              {testPaper.timeLimitMinutes && (
                <div className="bg-muted rounded-lg p-2">
                  Time Limit: {testPaper.timeLimitMinutes} min
                </div>
              )}
              {testPaper.totalMarks && (
                <div className="bg-muted rounded-lg p-2">
                  Total Marks: {testPaper.totalMarks}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Questions</h4>
              <AddQuestionsDialog testPaperId={testPaper.id} topicId={topicId} fetchData={fetchData} />
            </div>

            <ScrollArea className="max-h-[400px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Explanation</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Correct</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testPaper.mcqs?.map((mcq) => (
                    <TableRow key={mcq.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TableCell className="max-w-[200px] truncate cursor-default">
                            {mcq.question}
                          </TableCell>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          {mcq.question}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TableCell className="max-w-[200px] truncate cursor-default">
                            {mcq.explanation ?? "-"}
                          </TableCell>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          {mcq.explanation ?? "-"}
                        </TooltipContent>
                      </Tooltip>

                      <TableCell>
                        <ul className="text-xs space-y-0.5">
                          {Object.entries(mcq.options).map(([key, value]) => (
                            <li key={key}>
                              <span className="font-medium">{key.toUpperCase()}:</span> {value}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>{mcq.correctAnswer.toUpperCase()}</TableCell>
                      <TableCell>{mcq.marks ?? "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveToTrash(mcq.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
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
