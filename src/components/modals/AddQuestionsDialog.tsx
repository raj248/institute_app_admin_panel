"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createQuestion } from "@/lib/api";
import { IconPlus } from "@tabler/icons-react";
import { questionSchema, type QuestionSchema } from "@/types/entities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function AddQuestionsDialog({
  testPaperId,
  topicId,
  fetchData,
}: {
  testPaperId: string;
  topicId: string | null;
  fetchData: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      testPaperId,
      topicId: topicId ?? "null",
    },
  });

  const onSubmit = async (data: QuestionSchema) => {
    try {
      const res = await createQuestion({
        question: data.question,
        explanation: data.explanation ?? '',
        correctAnswer: data.correctAnswer,
        marks: data.marks,
        topicId: data.topicId,
        testPaperId: data.testPaperId,
        options: {
          a: data.option1,
          b: data.option2,
          c: data.option3,
          d: data.option4,
        },
      });
      if (res.success) {
        setOpen(false);
        reset({ testPaperId }); // reset while preserving testPaperId
        fetchData(); // refresh test paper after adding
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add question.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Question</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>Fill details to create a new question in this test paper.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Question */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="question">Question</Label>
            <Textarea id="question" {...register("question")} />
            {errors.question && <p className="text-sm text-red-500">{errors.question.message}</p>}
          </div>

          {/* Explanation (optional) */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="explanation">Explanation (optional)</Label>
            <Textarea id="explanation" {...register("explanation")} />
            {errors.explanation && <p className="text-sm text-red-500">{errors.explanation.message}</p>}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-1">
            <Label>Options</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Input id="option1" {...register("option1")} placeholder="Option A" />
                {errors.option1 && <p className="text-sm text-red-500">{errors.option1.message}</p>}
              </div>
              <div>
                <Input id="option2" {...register("option2")} placeholder="Option B" />
                {errors.option2 && <p className="text-sm text-red-500">{errors.option2.message}</p>}
              </div>
              <div>
                <Input id="option3" {...register("option3")} placeholder="Option C" />
                {errors.option3 && <p className="text-sm text-red-500">{errors.option3.message}</p>}
              </div>
              <div>
                <Input id="option4" {...register("option4")} placeholder="Option D" />
                {errors.option4 && <p className="text-sm text-red-500">{errors.option4.message}</p>}
              </div>
            </div>
          </div>

          {/* Correct Answer */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="correctAnswer">Correct Answer</Label>
            <Select
              onValueChange={(value) => setValue("correctAnswer", value as "a" | "b" | "c" | "d")}
              value={watch("correctAnswer")}
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
            {errors.correctAnswer && (
              <p className="text-sm text-red-500">{errors.correctAnswer.message}</p>
            )}
          </div>


          {/* Marks */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="marks">Marks</Label>
            <Input
              id="marks"
              type="number"
              {...register("marks", { valueAsNumber: true })}
              placeholder="1"
            />
            {errors.marks && <p className="text-sm text-red-500">{errors.marks.message}</p>}
          </div>

          {/* Test Paper ID (hidden, but error displayed if missing) */}
          <input type="hidden" {...register("testPaperId")} />
          {errors.testPaperId && <p className="text-sm text-red-500">{errors.testPaperId.message}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Question"}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}
