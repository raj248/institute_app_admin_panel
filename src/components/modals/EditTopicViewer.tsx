"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getTopicsByCourseType, updateTopic } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Topic_schema } from "@/types/entities";

export function EditTopicViewer({
  item,
  setTopics,
}: {
  item: Topic_schema;
  setTopics: React.Dispatch<React.SetStateAction<Topic_schema[] | null>>;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Controlled form states
  const [formName, setFormName] = useState(item.name);
  const [formDescription, setFormDescription] = useState(
    item.description ?? ""
  );
  const [formCourseType, setFormCourseType] = useState<"CAInter" | "CAFinal">(
    item.courseType as "CAInter" | "CAFinal"
  );

  const handleSubmit = async () => {
    const result = await updateTopic(item.id, {
      name: formName,
      description: formDescription,
      courseType: formCourseType,
    });

    if (result.success) {
      toast.success("Topic updated");
      setOpen(false);
      getTopicsByCourseType(item.courseType).then((res) => {
        setTopics(res.data ?? null);
      });
    } else {
      toast.error(result.error ?? "Failed to update topic");
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="text-foreground w-full justify-start px-0"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        Edit
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          className="w-[90vw] h-full max-w-full sm:max-w-full p-6 overflow-y-auto"
          side={isMobile ? "bottom" : "right"}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <SheetHeader className="gap-1 text-center">
            <SheetTitle className="text-base font-semibold">
              Edit Topic
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Edit the topic details below.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-3 overflow-y-auto px-4 text-sm w-full">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="name" className="text-xs">
                Name
              </Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Course */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="course" className="text-xs">
                Course
              </Label>
              <Select
                value={formCourseType}
                onValueChange={(value) =>
                  setFormCourseType(value as "CAInter" | "CAFinal")
                }
              >
                <SelectTrigger id="course" className="text-sm">
                  <SelectValue placeholder="Select a Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAInter">CA-Inter</SelectItem>
                  <SelectItem value="CAFinal">CA-Final</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="h-28 text-sm"
              />
            </div>
          </div>

          <SheetFooter>
            <Button onClick={handleSubmit} className="text-sm py-2 rounded-xl">
              Submit
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="text-sm py-2 rounded-xl">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
