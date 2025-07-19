import type { Topic, TestPaper, MCQ, Trash } from "@/types/entities";
import type { APIResponse } from "@/types/api"

const BASE_URL = import.meta.env.VITE_SERVER_URL;

async function safeFetch<T>(url: string, options?: RequestInit): Promise<{ success: boolean; error?: string; data?: T }> {
  try {
    const res = await fetch(url, options);
    const result = await res.json();
    if (!res.ok || !result.success) {
      console.error(`API error (${url}):`, result.error ?? res.statusText);
      return { success: false, error: result.error ?? res.statusText };
    }
    return result;
  } catch (error) {
    console.error(`Fetch error (${url}):`, error);
    return { success: false, error: (error as Error).message };
  }
}

// ------------------- Courses & Topics --------------------

export async function getTopicsByCourseType(courseType: string): Promise<APIResponse<Topic[]>> {
  return safeFetch(`${BASE_URL}/api/courses/${courseType}/topics`, { cache: "no-store" });
}

export async function getTopicById(topicId: string): Promise<APIResponse<Topic>> {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}`);
}

export async function createTopic(data: {
  name: string;
  description?: string;
  courseType: "CAInter" | "CAFinal";
}): Promise<APIResponse<Topic>> {
  return safeFetch<Topic>(`${BASE_URL}/api/topics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateTopic(
  id: string,
  data: {
    name?: string;
    description?: string;
    courseType?: "CAInter" | "CAFinal";
  }
): Promise<APIResponse<Topic>> {
  return safeFetch<Topic>(`${BASE_URL}/api/topics/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ------------------- Test Papers --------------------

export async function getAllTestPapersByTopicId(topicId: string): Promise<APIResponse<TestPaper[]>> {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}/testpapers`);
}

export async function getTestPaperById(testPaperId: string): Promise<APIResponse<TestPaper>> {
  return safeFetch(`${BASE_URL}/api/testpapers/${testPaperId}`);
}

export async function createTestPaper(data: {
  name: string;
  description?: string;
  timeLimitMinutes: number;
  topicId: string;
}): Promise<APIResponse<TestPaper>> {
  return safeFetch<TestPaper>(`${BASE_URL}/api/testpapers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateTestPaper(
  id: string,
  data: {
    name: string;
    description: string;
    timeLimitMinutes: number;
    topicId: string;
  }
): Promise<APIResponse<TestPaper>> {
  return safeFetch<TestPaper>(`${BASE_URL}/api/testpapers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ------------------- MCQs --------------------

export async function getMCQById(id: string): Promise<APIResponse<MCQ>> {
  return safeFetch(`${BASE_URL}/api/mcqs/${id}`);
}

export async function createQuestion(data: {
  question: string,
  options: object,
  explanation: string,
  marks: number,
  correctAnswer: string,
  topicId: string,
  testPaperId: string,
}): Promise<APIResponse<MCQ>> {
  return safeFetch<MCQ>(`${BASE_URL}/api/mcqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateMCQ(
  id: string,
  data: Partial<{
    question: string;
    options: object;
    explanation: string;
    marks: number;
    correctAnswer: string;
  }>
): Promise<APIResponse<MCQ>> {
  return safeFetch<MCQ>(`${BASE_URL}/api/mcqs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
// ------------------- Trash --------------------

export async function getTrashItems(): Promise<APIResponse<Trash[]>> {
  return safeFetch(`${BASE_URL}/api/trash`);
}

export async function restoreTrashItem(id: string): Promise<APIResponse<string>> {
  return safeFetch(`${BASE_URL}/api/trash/${id}/restore`, { method: "POST" });
}

export async function permanentlyDeleteTrashItem(id: string): Promise<APIResponse<string>> {
  return safeFetch(`${BASE_URL}/api/trash/${id}`, { method: "DELETE" });
}

export async function purgeTrash(): Promise<APIResponse<string>> {
  return safeFetch(`${BASE_URL}/api/trash`, { method: "DELETE" });
}

// ------------------- Move to Trash --------------------

export async function moveTopicToTrash(topicId: string): Promise<APIResponse<Topic>> {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}/move-to-trash`, { method: "POST" });
}

export async function moveTestPaperToTrash(testPaperId: string): Promise<APIResponse<TestPaper>> {
  return safeFetch(`${BASE_URL}/api/testpapers/${testPaperId}`, { method: "DELETE" });
}

export async function moveMCQToTrash(mcqId: string): Promise<APIResponse<MCQ>> {
  return safeFetch(`${BASE_URL}/api/mcqs/${mcqId}`, { method: "DELETE" });
}
