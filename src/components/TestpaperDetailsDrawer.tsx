import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function TestpaperDetailsDrawer() {
  const [open, setOpen] = useState(true);

  const dummyTestpaper = {
    name: "Mock Test Paper 1",
    description: "This test paper covers core topics for revision.",
    timeLimitMinutes: 90,
    totalMarks: 100,
    mcqs: [
      {
        id: "1",
        question: "What is the capital of France?",
        explanation: "The capital of France is Paris.",
        options: { a: "Paris", b: "Lyon", c: "Marseille", d: "Nice" },
        correctAnswer: "a",
        marks: 1,
      },
      {
        id: "2",
        question: "What is 2 + 2?",
        explanation: "2 + 2 equals 4.",
        options: { a: "3", b: "4", c: "5", d: "6" },
        correctAnswer: "b",
        marks: 1,
      },
    ],
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>{dummyTestpaper.name}</DrawerTitle>
          <DrawerDescription>{dummyTestpaper.description}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 space-y-2">
          <div className="text-sm text-muted-foreground">Time Limit: {dummyTestpaper.timeLimitMinutes} minutes</div>
          <div className="text-sm text-muted-foreground">Total Marks: {dummyTestpaper.totalMarks}</div>
        </div>

        <div className="flex justify-end px-4 mt-4">
          <Button size="sm">
            <Plus size={16} className="mr-2" />
            Add Question
          </Button>
        </div>

        <div className="px-4 py-4 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Question</TableHead>
                <TableHead className="w-1/4">Explanation</TableHead>
                <TableHead className="w-1/4">Options</TableHead>
                <TableHead className="w-1/6">Correct</TableHead>
                <TableHead className="w-1/12">Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyTestpaper.mcqs.map((mcq) => (
                <TableRow key={mcq.id}>
                  <TableCell>{mcq.question}</TableCell>
                  <TableCell>{mcq.explanation}</TableCell>
                  <TableCell>
                    {Object.entries(mcq.options).map(([key, val]) => (
                      <div key={key}>
                        <span className="font-medium mr-1">{key.toUpperCase()}:</span>
                        {val}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{mcq.correctAnswer.toUpperCase()}</TableCell>
                  <TableCell>{mcq.marks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
