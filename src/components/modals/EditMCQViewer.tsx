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
          <DrawerHeader className="gap-1">
            <DrawerTitle>Edit MCQ</DrawerTitle>
            <DrawerDescription>Edit the MCQ details below.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm max-w-lg w-full mx-auto">

            {/* Question */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                className="h-24"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="optionA">Option A</Label>
                <Input
                  id="optionA"
                  value={formOptionA}
                  onChange={(e) => setFormOptionA(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="optionB">Option B</Label>
                <Input
                  id="optionB"
                  value={formOptionB}
                  onChange={(e) => setFormOptionB(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="optionC">Option C</Label>
                <Input
                  id="optionC"
                  value={formOptionC}
                  onChange={(e) => setFormOptionC(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="optionD">Option D</Label>
                <Input
                  id="optionD"
                  value={formOptionD}
                  onChange={(e) => setFormOptionD(e.target.value)}
                />
              </div>
            </div>

            {/* Correct Answer */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="correctAnswer">Correct Answer</Label>
              <Select
                value={formCorrectAnswer}
                onValueChange={(value) => setFormCorrectAnswer(value as "a" | "b" | "c" | "d")}
              >
                <SelectTrigger id="correctAnswer">
                  <SelectValue placeholder="Select correct option (a/b/c/d)" />
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
            <div className="flex flex-col gap-3">
              <Label htmlFor="marks">Marks</Label>
              <Input
                id="marks"
                type="number"
                value={formMarks}
                onChange={(e) => setFormMarks(parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Explanation */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="explanation">Explanation</Label>
              <Textarea
                id="explanation"
                value={formExplanation}
                onChange={(e) => setFormExplanation(e.target.value)}
                className="h-24"
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
