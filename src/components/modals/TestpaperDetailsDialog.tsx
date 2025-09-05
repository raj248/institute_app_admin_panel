"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { getTestPaperById, moveMCQToTrash } from "@/lib/api";
import type { TestPaper } from "@/types/entities";
import { useState, useEffect } from "react";
import { useConfirm } from "./global-confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AddQuestionsDialog } from "./AddQuestionsDialog";
import { EditMCQViewer } from "./EditMCQViewer";
import { Badge } from "../ui/badge";

interface TestPaperDetailsDialogProps {
  testPaperId: string | null;
  topicId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestpaperDetailsDialog({
  testPaperId,
  topicId,
  open,
  onOpenChange,
}: TestPaperDetailsDialogProps) {
  const [testPaper, setTestPaper] = useState<TestPaper | null>(null);
  const [loading, setLoading] = useState(false);
  const confirm = useConfirm();

  const fetchData = async () => {
    if (!testPaperId || !open) return;
    setLoading(true);
    try {
      const res = await getTestPaperById(testPaperId);
      if (res.success) {
        setTestPaper(res.data ?? null);
      } else {
        console.error("Error fetching test paper:", res.error);
        setTestPaper(null);
      }
    } catch (e) {
      console.error(e);
      setTestPaper(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [testPaperId, open]);

  const handleMoveToTrash = async (mcqId: string) => {
    const confirmed = await confirm({
      title: "Delete This Question?",
      description:
        "This will move the question to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const mcq = await moveMCQToTrash(mcqId);
    if (!mcq) {
      console.error("Failed to move MCQ to trash.");
      alert("Failed to move MCQ to trash.");
      return;
    }

    setTestPaper((prev) =>
      prev ? { ...prev, mcqs: prev.mcqs?.filter((q) => q.id !== mcqId) } : null
    );
  };

  // console.log(typeof testPaper?.totalMarks);
  console.log(testPaper?.notePath);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] lg:max-w-[80%] h-[90vh] rounded-2xl p-4 sm:p-6 flex flex-col">
        {loading || !testPaper ? (
          <div className="space-y-4 flex-1 overflow-y-auto">
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
            <ScrollArea className="flex-1 overflow-y-auto border rounded-md mt-4">
              <div className="flex flex-wrap justify-center gap-2 text-xs mb-4">
                {testPaper.timeLimitMinutes != null && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs"
                  >
                    Time Limit: {testPaper.timeLimitMinutes} min
                  </Badge>
                )}
                {testPaper.totalMarks != null &&
                  Number(testPaper.totalMarks) > 0 && (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs"
                    >
                      Total Marks: {testPaper.totalMarks}
                    </Badge>
                  )}
              </div>

              {testPaper.isCaseStudy && testPaper.caseText && (
                <div className="mb-4 mx-4">
                  <h4 className="text-md font-medium mb-4 text-center">
                    Case Study Text
                  </h4>
                  <p className="whitespace-pre-wrap">
                    {testPaper.caseText ?? "-"}
                  </p>
                  {/* <ScrollArea className="max-h-[150px] border rounded-md p-3 text-xs bg-gray-50 dark:bg-gray-800"> */}
                  {/* </ScrollArea> */}
                </div>
              )}
              {/* show a view casepdf button if testpaper.noteId is available */}
              {testPaper.notePath && (
                <div className="flex justify-center mb-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = `${import.meta.env.VITE_SERVER_URL}${
                        testPaper.notePath
                      }`;
                      // Logic to view the PDF, e.g., open in new tab
                      window.open(url, "_blank");
                    }}
                  >
                    View Case Study PDF
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <h4 className="text-sm font-medium"> </h4>
                <AddQuestionsDialog
                  testPaperId={testPaper.id}
                  topicId={topicId}
                  fetchData={fetchData}
                />
              </div>

              <div className="w-full overflow-x-auto">
                <Table className="w[90%] mx-auto">
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
                    {testPaper.mcqs && testPaper.mcqs.length > 0 ? (
                      testPaper.mcqs.map((mcq) => (
                        <TableRow key={mcq.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TableCell className="max-w-[180px] break-words whitespace-normal text-xs">
                                {mcq.question}
                              </TableCell>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm text-xs">
                              {mcq.question}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TableCell className="max-w-[180px] break-words whitespace-normal text-xs">
                                {mcq.explanation ?? "-"}
                              </TableCell>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm text-xs">
                              {mcq.explanation ?? "-"}
                            </TooltipContent>
                          </Tooltip>

                          <TableCell className="max-w-[180px] break-words whitespace-normal text-xs">
                            <ul className="space-y-0.5">
                              {Object.entries(mcq.options).map(
                                ([key, value]) => (
                                  <li key={key}>
                                    <span className="font-medium">
                                      {key.toUpperCase()}:
                                    </span>{" "}
                                    {value}
                                  </li>
                                )
                              )}
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
                              <EditMCQViewer
                                item={mcq}
                                refreshMCQs={fetchData}
                              />
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-sm text-muted-foreground"
                        >
                          No questions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
