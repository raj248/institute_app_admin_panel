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
import { Switch } from "../ui/switch";

export function EditTestViewer({
  item,
  refreshPapers,
  trigger,
}: {
  item: TestPaper;
  refreshPapers: () => Promise<void>;
  trigger?: (props: { open: () => void }) => React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Controlled states
  const [formName, setFormName] = useState(item.name);
  const [formDescription, setFormDescription] = useState(
    item.description ?? ""
  );
  const [formTimeLimit, setFormTimeLimit] = useState(
    item.timeLimitMinutes ?? 120
  );
  const [formIsCaseStudy, setFormIsCaseStudy] = useState(
    item.isCaseStudy ?? false
  );
  const [formCaseText, setFormCaseText] = useState(item.caseText ?? "");

  const handleSubmit = async () => {
    const result = await updateTestPaper(item.id, {
      name: formName,
      description: formDescription,
      timeLimitMinutes: formTimeLimit,
      topicId: item.topicId,
      isCaseStudy: formIsCaseStudy,
      caseText: formCaseText,
    });

    if (result.success) {
      toast.success("Test Paper updated");
      setOpen(false);
      refreshPapers();
    } else {
      toast.error(result.error ?? "Failed to update test paper");
    }
  };

  return (
    <>
      {trigger ? (
        trigger({ open: () => setOpen(true) })
      ) : (
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <PenIcon className="mr-2 size-4" />
          <span>Edit</span>
        </Button>
      )}

      <Drawer
        direction={isMobile ? "bottom" : "right"}
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerContent
          className="w-[95vw] sm:w-[600px] lg:w-[800px] max-w-none"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DrawerHeader className="gap-1 text-center">
            <DrawerTitle className="text-base font-semibold">
              Edit Test Paper
            </DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground">
              Edit the test paper details below.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-3 overflow-y-auto px-4 text-sm max-w-lg w-full mx-auto flex-1">
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

            {/* Time Limit */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="timeLimit" className="text-xs">
                Time Limit (minutes)
              </Label>
              <Input
                id="timeLimit"
                type="number"
                value={formTimeLimit}
                onChange={(e) =>
                  setFormTimeLimit(parseInt(e.target.value) || 0)
                }
                placeholder="120"
                className="text-sm"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 flex-1">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="flex-1 resize-none text-sm min-h-[150px]"
              />
            </div>

            {/* Is Case Study toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="isCaseStudy" className="text-xs">
                Is Case Study?
              </Label>
              <Switch
                id="isCaseStudy"
                checked={formIsCaseStudy}
                onCheckedChange={setFormIsCaseStudy}
              />
            </div>

            {/* Case Study Fields */}
            {formIsCaseStudy && (
              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="caseText" className="text-xs">
                  Case Text
                </Label>
                <Textarea
                  id="caseText"
                  value={formCaseText}
                  onChange={(e) => setFormCaseText(e.target.value)}
                  className="flex-1 resize-none text-sm min-h-[200px]"
                />
              </div>
            )}
          </div>

          <DrawerFooter>
            <Button onClick={handleSubmit} className="text-sm py-2 rounded-xl">
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="text-sm py-2 rounded-xl">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
