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
          <IconPlus className="size-4" />
          <span className="hidden lg:inline">Add Question</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl p-4 sm:p-6">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-base font-semibold">Add New Question</DialogTitle>
          <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
            Fill details to create a new question in this test paper.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Question */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="question" className="text-sm">Question</Label>
            <Textarea
              id="question"
              {...register("question")}
              className="text-sm"
              placeholder="Type your question here"
            />
            {errors.question && (
              <p className="text-xs text-red-500">{errors.question.message}</p>
            )}
          </div>

          {/* Explanation */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="explanation" className="text-sm">Explanation (optional)</Label>
            <Textarea
              id="explanation"
              {...register("explanation")}
              className="text-sm"
              placeholder="Add explanation if needed"
            />
            {errors.explanation && (
              <p className="text-xs text-red-500">{errors.explanation.message}</p>
            )}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-1">
            <Label className="text-sm">Options</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["option1", "option2", "option3", "option4"].map((optionKey, index) => (
                <div key={optionKey}>
                  <Input
                    id={optionKey}
                    {...register(optionKey as "option1" | "option2" | "option3" | "option4")}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="text-sm"
                  />
                  {errors[optionKey as "option1" | "option2" | "option3" | "option4"]?.message && (
                    <p className="text-xs text-red-500">
                      {errors[optionKey as "option1" | "option2" | "option3" | "option4"]!.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="correctAnswer" className="text-sm">Correct Answer</Label>
            <Select
              onValueChange={(value) => setValue("correctAnswer", value as "a" | "b" | "c" | "d")}
              value={watch("correctAnswer")}
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
            {errors.correctAnswer && (
              <p className="text-xs text-red-500">{errors.correctAnswer.message}</p>
            )}
          </div>

          {/* Marks */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="marks" className="text-sm">Marks</Label>
            <Input
              id="marks"
              type="number"
              {...register("marks", { valueAsNumber: true })}
              placeholder="e.g., 1"
              className="text-sm"
            />
            {errors.marks && (
              <p className="text-xs text-red-500">{errors.marks.message}</p>
            )}
          </div>

          {/* Test Paper ID */}
          <input type="hidden" {...register("testPaperId")} />
          {errors.testPaperId && (
            <p className="text-xs text-red-500">{errors.testPaperId.message}</p>
          )}

          <DialogFooter className="mt-2">
            <Button type="submit" size="sm" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding..." : "Add Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  );
}
