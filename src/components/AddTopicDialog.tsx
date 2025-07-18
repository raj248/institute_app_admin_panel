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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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

export function AddTopicDialog({ defaultCourseType, setTopics }:
  {
    setTopics: React.Dispatch<React.SetStateAction<Topic_schema[] | null>>,
    defaultCourseType: "CAInter" | "CAFinal"
  }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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
      getTopicsByCourseType(data.courseType)
        .then((res) => { setTopics(res.data ?? null) })
    } else {
      alert(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Topic</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogDescription>Fill the details to create a new topic.</DialogDescription>
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

          {/* Course Type */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="courseType">Course Type</Label>
            <Select
              defaultValue={defaultCourseType}
              onValueChange={(value) => setValue("courseType", value as "CAInter" | "CAFinal")}
            >
              <SelectTrigger id="courseType">
                <SelectValue placeholder="Select Course Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAInter">CA-Inter</SelectItem>
                <SelectItem value="CAFinal">CA-Final</SelectItem>
              </SelectContent>
            </Select>
            {errors.courseType && <p className="text-sm text-red-500">{errors.courseType.message}</p>}
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
