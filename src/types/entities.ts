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
  timeLimitMinutes?: string;
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

export interface Trash {
  id: string;
  tableName: "Course" | "Topic" | "MCQ" | "TestPaper";
  entityId: string;
  trashedAt: string;
  purgeAfter: string | null;
  displayName: string;
}
