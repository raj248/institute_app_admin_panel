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
import { createTestPaper, getAllTestPapersByTopicId, getTopicsByCourseType } from "@/lib/api";
import { IconPlus } from "@tabler/icons-react";
import { testPaperSchema, type TestPaper, type TestPaperSchema, type Topic_schema } from "@/types/entities";

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
      setOpen(false);
      reset();
      // Refresh test papers after adding
      const refreshed = await getAllTestPapersByTopicId(topicId);
      setTestPapers(refreshed.data ?? null);
    } else {
      alert(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Test Paper</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Test Paper</DialogTitle>
          <DialogDescription>Fill details to create a new test paper.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          {/* Time Limit */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="timeLimitMinutes">Time Limit (minutes)</Label>
            <Input
              id="timeLimitMinutes"
              type="number"
              placeholder="120"
              {...register("timeLimitMinutes", { valueAsNumber: true })}
            />
            {errors.timeLimitMinutes && (
              <p className="text-sm text-red-500">{errors.timeLimitMinutes.message}</p>
            )}
          </div>

          {/* Topic Selection */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="topicId">Topic</Label>
            <Select
              value={watch("topicId")}
              onValueChange={(value) => setValue("topicId", value)}
            >
              <SelectTrigger id="topicId">
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
            {errors.topicId && (
              <p className="text-sm text-red-500">{errors.topicId.message}</p>
            )}
          </div>


          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}
