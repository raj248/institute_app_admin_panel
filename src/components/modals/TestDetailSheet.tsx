// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { Trash2 } from "lucide-react";
// import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// import { getTestPaperById, moveMCQToTrash } from "@/lib/api";
// import type { TestPaper } from "@/types/entities";
// import { useState, useEffect } from "react";
// import { useConfirm } from "./global-confirm-dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import { AddQuestionsDialog } from "./AddQuestionsDialog";
// import { EditMCQViewer } from "./EditMCQViewer";
// import { Badge } from "../ui/badge";

// interface TestPaperDetailsDialogProps {
//   testPaperId: string | null;
//   topicId: string | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function TestpaperDetailsDialog({
//   testPaperId,
//   topicId,
//   open,
//   onOpenChange,
// }: TestPaperDetailsDialogProps) {
//   const [testPaper, setTestPaper] = useState<TestPaper | null>(null);
//   const [loading, setLoading] = useState(false);
//   const confirm = useConfirm();

//   const fetchData = async () => {
//     if (!testPaperId || !open) return;
//     setLoading(true);
//     try {
//       const res = await getTestPaperById(testPaperId);
//       if (res.success) {
//         setTestPaper(res.data ?? null);
//       } else {
//         console.error("Error fetching test paper:", res.error);
//         setTestPaper(null);
//       }
//     } catch (e) {
//       console.error(e);
//       setTestPaper(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [testPaperId, open]);

//   const handleMoveToTrash = async (mcqId: string) => {
//     const confirmed = await confirm({
//       title: "Delete This Question?",
//       description:
//         "This will move the question to trash. You can restore it later if needed.",
//       confirmText: "Yes, Delete",
//       cancelText: "Cancel",
//       variant: "destructive",
//     });

//     if (!confirmed) return;

//     const mcq = await moveMCQToTrash(mcqId);
//     if (!mcq) {
//       console.error("Failed to move MCQ to trash.");
//       alert("Failed to move MCQ to trash.");
//       return;
//     }

//     setTestPaper((prev) =>
//       prev ? { ...prev, mcqs: prev.mcqs?.filter((q) => q.id !== mcqId) } : null
//     );
//   };
// }
