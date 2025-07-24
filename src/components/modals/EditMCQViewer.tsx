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
import { updateMCQ } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import type { MCQ } from "@/types/entities";
import { PenIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function EditMCQViewer({
  item,
  refreshMCQs,
}: {
  item: MCQ;
  refreshMCQs: () => Promise<void>;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Controlled states
  const [formQuestion, setFormQuestion] = useState(item.question);
  const [formExplanation, setFormExplanation] = useState(item.explanation ?? "");
  const [formMarks, setFormMarks] = useState(item.marks ?? 1);
  const [formCorrectAnswer, setFormCorrectAnswer] = useState(item.correctAnswer ?? "a");

  const [formOptionA, setFormOptionA] = useState(item.options?.a ?? "");
  const [formOptionB, setFormOptionB] = useState(item.options?.b ?? "");
  const [formOptionC, setFormOptionC] = useState(item.options?.c ?? "");
  const [formOptionD, setFormOptionD] = useState(item.options?.d ?? "");

  const handleSubmit = async () => {
    const result = await updateMCQ(item.id, {
      question: formQuestion,
      explanation: formExplanation,
      marks: formMarks,
      correctAnswer: formCorrectAnswer,
      options: {
        a: formOptionA,
        b: formOptionB,
        c: formOptionC,
        d: formOptionD,
      },
    });

    if (result.success) {
      toast.success("MCQ updated");
      setOpen(false);
      await refreshMCQs();
    } else {
      toast.error(result.error ?? "Failed to update MCQ");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <PenIcon size={16} />
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
          <DrawerHeader className="gap-1 text-center">
            <DrawerTitle className="text-base font-semibold">Edit MCQ</DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground">
              Edit the MCQ details below.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-3 overflow-y-auto px-4 text-sm max-w-lg w-full mx-auto">

            {/* Question */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="question" className="text-xs">Question</Label>
              <Textarea
                id="question"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                className="h-24 text-sm"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "optionA", label: "Option A", value: formOptionA, setValue: setFormOptionA },
                { id: "optionB", label: "Option B", value: formOptionB, setValue: setFormOptionB },
                { id: "optionC", label: "Option C", value: formOptionC, setValue: setFormOptionC },
                { id: "optionD", label: "Option D", value: formOptionD, setValue: setFormOptionD },
              ].map((opt) => (
                <div key={opt.id} className="flex flex-col gap-1">
                  <Label htmlFor={opt.id} className="text-xs">{opt.label}</Label>
                  <Input
                    id={opt.id}
                    value={opt.value}
                    onChange={(e) => opt.setValue(e.target.value)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Correct Answer & Marks in a single row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Correct Answer */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="correctAnswer" className="text-xs">Correct Answer</Label>
                <Select
                  value={formCorrectAnswer}
                  onValueChange={(value) => setFormCorrectAnswer(value as "a" | "b" | "c" | "d")}
                >
                  <SelectTrigger id="correctAnswer" className="text-sm">
                    <SelectValue placeholder="Select correct option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Marks */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="marks" className="text-xs">Marks</Label>
                <Input
                  id="marks"
                  type="number"
                  value={formMarks}
                  onChange={(e) => setFormMarks(parseInt(e.target.value) || 0)}
                  className="text-sm"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Explanation */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="explanation" className="text-xs">Explanation</Label>
              <Textarea
                id="explanation"
                value={formExplanation}
                onChange={(e) => setFormExplanation(e.target.value)}
                className="h-24 text-sm"
              />
            </div>
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
