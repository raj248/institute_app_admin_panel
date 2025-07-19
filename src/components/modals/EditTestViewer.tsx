"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateTestPaper } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TestPaper } from "@/types/entities";
import { PenIcon } from "lucide-react";

export function EditTestViewer({
  item,
  refreshPapers,
}: {
  item: TestPaper;
  refreshPapers: () => Promise<void>;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Controlled states
  const [formName, setFormName] = useState(item.name);
  const [formDescription, setFormDescription] = useState(item.description ?? "");
  const [formTimeLimit, setFormTimeLimit] = useState(item.timeLimitMinutes ?? 120);

  const handleSubmit = async () => {
    const result = await updateTestPaper(item.id, {
      name: formName,
      description: formDescription,
      timeLimitMinutes: formTimeLimit,
      topicId: item.topicId,
    });

    if (result.success) {
      toast.success("Test Paper updated");
      setOpen(false);
      refreshPapers()
    } else {
      toast.error(result.error ?? "Failed to update test paper");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        // className="text-foreground w-full justify-start px-0"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <PenIcon />
        <span className="hidden lg:inline">Edit</span>

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
            <DrawerTitle>Edit Test Paper</DrawerTitle>
            <DrawerDescription>Edit the test paper details below.</DrawerDescription>
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
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={formTimeLimit}
                onChange={(e) => setFormTimeLimit(parseInt(e.target.value) || 0)}
                placeholder="120"
              />
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
