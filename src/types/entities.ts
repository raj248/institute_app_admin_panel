// src/types/entities.ts

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
}

export interface TestPaper {
  id: string;
  name: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  topic?: Topic;
  mcqs?: MCQ[];
}

export interface MCQ {
  id: string;
  question: string;
  options: Record<string, string>;
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
