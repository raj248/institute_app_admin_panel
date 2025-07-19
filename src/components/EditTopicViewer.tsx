"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getTopicsByCourseType, updateTopic } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Topic_schema } from "@/types/entities";

export function EditTopicViewer(
  { item, setTopics }: {
    item: Topic_schema,
    setTopics: React.Dispatch<React.SetStateAction<Topic_schema[] | null>>
  }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Controlled form states
  const [formName, setFormName] = useState(item.name);
  const [formDescription, setFormDescription] = useState(item.description ?? "");
  const [formCourseType, setFormCourseType] = useState<"CAInter" | "CAFinal">(item.courseType as "CAInter" | "CAFinal");

  const handleSubmit = async () => {
    const result = await updateTopic(item.id, {
      name: formName,
      description: formDescription,
      courseType: formCourseType,
    });

    if (result.success) {
      toast.success("Topic updated");
      setOpen(false);
      getTopicsByCourseType(item.courseType)
        .then((res) => { setTopics(res.data ?? null) })
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
      <Drawer
        direction={isMobile ? "bottom" : "right"}
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerContent
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DrawerHeader className="gap-1">
            <DrawerTitle>Edit Topic</DrawerTitle>
            <DrawerDescription>Edit the topic details below.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm max-w-lg w-full mx-auto">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="course">Course</Label>
              <Select
                value={formCourseType}
                onValueChange={(value) => setFormCourseType(value as "CAInter" | "CAFinal")}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select a Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAInter">CA-Inter</SelectItem>
                  <SelectItem value="CAFinal">CA-Final</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="h-32"
              />
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
