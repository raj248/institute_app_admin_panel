"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
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
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { createTopic, getTopicsByCourseType } from "@/lib/api"; // defined below
import { IconPlus } from "@tabler/icons-react";
import type { Topic_schema } from "@/types/entities";

const topicSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  courseType: z.enum(["CAInter", "CAFinal"]),
});

type TopicSchema = z.infer<typeof topicSchema>;

export function AddTopicDialog({
  defaultCourseType,
  setTopics,
}: {
  setTopics: React.Dispatch<React.SetStateAction<Topic_schema[] | null>>;
  defaultCourseType: "CAInter" | "CAFinal";
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    // setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TopicSchema>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      courseType: defaultCourseType,
    },
  });

  const onSubmit = async (data: TopicSchema) => {
    const res = await createTopic(data);
    if (res.success) {
      setOpen(false);
      reset();
      getTopicsByCourseType(data.courseType).then((res) => {
        setTopics(res.data ?? null);
      });
    } else {
      alert(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus className="size-4" />
          <span className="hidden lg:inline">Add Topic</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-4 sm:p-6">
        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-base font-semibold tracking-tight">
            Add New Topic
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Fill the details to create a new topic.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Name */}
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="w-28 text-xs">
              Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="E.g., Taxation"
              className="flex-1 text-sm"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 pl-28 -mt-1">
              {errors.name.message}
            </p>
          )}

          {/* Description */}
          <div className="flex items-start gap-2">
            <Label htmlFor="description" className="w-28 text-xs pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={2}
              placeholder="Brief overview of the topic"
              className="flex-1 text-sm h-32 overflow-y-auto"
            />
          </div>
          {errors.description && (
            <p className="text-xs text-red-500 pl-28 -mt-1">
              {errors.description.message}
            </p>
          )}

          {/* Course Type */}
          {/* <div className="flex items-center gap-2">
            <Label htmlFor="courseType" className="w-28 text-xs">
              Course Type
            </Label>
            <Select
              defaultValue={defaultCourseType}
              onValueChange={(value) => setValue("courseType", value as "CAInter" | "CAFinal")}
            >
              <SelectTrigger id="courseType" className="flex-1 text-sm">
                <SelectValue placeholder="Select Course Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAInter">CA-Inter</SelectItem>
                <SelectItem value="CAFinal">CA-Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.courseType && (
            <p className="text-xs text-red-500 pl-28 -mt-1">
              {errors.courseType.message}
            </p>
          )} */}

          {/* Submit */}
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-sm py-2 rounded-xl"
            >
              {isSubmitting ? "Creating..." : "Create Topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
