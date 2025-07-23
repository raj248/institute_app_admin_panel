// src/types/entities.ts

import z from "zod";

export type CourseType = "CAInter" | "CAFinal";

export interface Course {
  id: string;
  name: string;
  courseType: CourseType;
  createdAt: string; // Date.toISOString()
  updatedAt: string;
  deletedAt: string | null;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description?: string | null;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course?: Course;
  testPapers?: TestPaper[];
  mcqs?: MCQ[];
  testPaperCount?: number;
  courseType: CourseType;

}

export const TopicSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  courseId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  testPaperCount: z.number().optional(),
  courseType: z.string(),
});

export type Topic_schema = z.infer<typeof TopicSchema>;

export interface TestPaper {
  id: string;
  name: string;
  description?: string;
  timeLimitMinutes?: number;
  totalMarks?: string
  topicId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  topic?: Topic;
  mcqCount?: number;
  mcqs?: MCQ[];
}

export const testPaperSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  timeLimitMinutes: z.coerce.number().min(1, "Time limit is required"),
  topicId: z.string().min(1, "Topic is required"),
});


export type TestPaperSchema = z.infer<typeof testPaperSchema>;


export interface MCQ {
  id: string;
  question: string;
  options: Record<string, string>;
  explanation?: string;
  marks: number;
  correctAnswer: string;
  topicId: string;
  testPaperId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  topic?: Topic;
  testPaper?: TestPaper;
}

export const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  explanation: z.string().optional(),
  option1: z.string().min(1, "Option 1 is required"),
  option2: z.string().min(1, "Option 2 is required"),
  option3: z.string().min(1, "Option 3 is required"),
  option4: z.string().min(1, "Option 4 is required"),
  correctAnswer: z.string().min(1, "Correct Answer is required"),
  marks: z.coerce.number().min(1, "Marks must be a number"),
  testPaperId: z.string().min(1, "TestPaperId is required"),
  topicId: z.string().min(1, "Topic ID is required"),
});

export type QuestionSchema = z.infer<typeof questionSchema>;

export interface Note {
  id: string;
  name: string;
  description?: string;
  topicId: string;
  courseType: "CAInter" | "CAFinal";
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  deletedAt: string | null;
}

// types/entities.ts
export interface VideoNote {
  id: string;         // UUID from your DB
  url: string;        // YouTube URL
  topicId: string;
  courseType: string;
  title?: string;     // optional if you fetch on frontend
  thumbnail?: string; // optional if you fetch on frontend
}


export interface Trash {
  id: string;
  tableName: "Course" | "Topic" | "MCQ" | "TestPaper";
  entityId: string;
  trashedAt: string;
  purgeAfter: string | null;
  displayName: string;
}
