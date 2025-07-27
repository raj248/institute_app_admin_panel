"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { addNewlyAddedItem, createTestPaper, getAllTestPapersByTopicId, getTopicsByCourseType } from "@/lib/api";
import { IconPlus } from "@tabler/icons-react";
import { testPaperSchema, type TestPaper, type TestPaperSchema, type Topic_schema } from "@/types/entities";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function AddTestPaperDialog({
  topicId,
  courseType,
  setTestPapers,
}: {
  topicId: string,
  courseType: "CAInter" | "CAFinal",
  setTestPapers: React.Dispatch<React.SetStateAction<TestPaper[] | null>>,
}) {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<Topic_schema[] | null>(null);
  const [markAsNew, setMarkAsNew] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(testPaperSchema),
    defaultValues: {
      topicId: topicId ?? "",
    },
  });

  const loadTopics = async () => {
    const res = await getTopicsByCourseType(courseType);
    if (res.data) setTopics(res.data);
  };

  useEffect(() => {
    if (open) loadTopics();
  }, [open]);

  const onSubmit = async (data: TestPaperSchema) => {

    const res = await createTestPaper(data);
    if (res.success) {
      if (markAsNew && res.data) {
        await addNewlyAddedItem("TestPaper", res.data.id);
      }
      toast.success("Test Paper added successfully!");
      const refreshed = await getAllTestPapersByTopicId(topicId);
      setTestPapers(refreshed.data ?? null);
      setOpen(false);
      reset();
      setMarkAsNew(false); // reset switch
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus className="size-4" />
          <span className="hidden lg:inline">Add Test Paper</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-4 sm:p-6">
        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-base font-semibold tracking-tight">Add New Test Paper</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Fill details to create a new test paper.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Name */}
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="w-28 text-xs">Name</Label>
            <Input
              id="name"
              {...register("name")}
              className="flex-1 text-sm"
              placeholder="E.g., May 2025 Mock"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 pl-28 -mt-1">{errors.name.message}</p>
          )}

          {/* Description */}
          <div className="flex items-start gap-2">
            <Label htmlFor="description" className="w-28 text-xs pt-2">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="flex-1 text-sm"
              rows={2}
              placeholder="Brief description"
            />
          </div>

          {/* Time Limit */}
          <div className="flex items-center gap-2">
            <Label htmlFor="timeLimitMinutes" className="w-28 text-xs">Time Limit</Label>
            <Input
              id="timeLimitMinutes"
              type="number"
              placeholder="120"
              {...register("timeLimitMinutes", { valueAsNumber: true })}
              className="flex-1 text-sm"
            />
          </div>
          {errors.timeLimitMinutes && (
            <p className="text-xs text-red-500 pl-28 -mt-1">{errors.timeLimitMinutes.message}</p>
          )}

          {/* Topic Selection */}
          <div className="flex items-center gap-2">
            <Label htmlFor="topicId" className="w-28 text-xs">Topic</Label>
            <Select
              value={watch("topicId")}
              onValueChange={(value) => setValue("topicId", value)}
            >
              <SelectTrigger id="topicId" className="flex-1 text-sm">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics?.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.topicId && (
            <p className="text-xs text-red-500 pl-28 -mt-1">{errors.topicId.message}</p>
          )}

          <div className="flex items-center gap-2">
            <Label htmlFor="markNew" className="w-28 text-xs">
              Mark as New
            </Label>
            <Switch id="markNew" checked={markAsNew} onCheckedChange={setMarkAsNew} />
          </div>

          {/* Submit */}
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-sm py-2 rounded-xl"
            >
              {isSubmitting ? "Creating..." : "Create Test Paper"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  );
}
