import type { Topic, TestPaper, MCQ, Trash, Note, VideoNote, NewlyAdded } from "@/types/entities";
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

export async function getAllTopic(): Promise<APIResponse<Topic[]>> {
  return safeFetch(`${BASE_URL}/api/topics`);
}

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

// ------------------- Notes --------------------

/**
 * Get all notes
 */
export async function getAllNotes(): Promise<APIResponse<Note[]>> {
  return safeFetch(`${BASE_URL}/api/notes`);
}

/**
 * Get a note by its ID
 */
export async function getNoteById(noteId: string): Promise<APIResponse<Note>> {
  return safeFetch(`${BASE_URL}/api/notes/${noteId}`);
}

/**
 * Get all notes under a topic
 */
export async function getNotesByTopicId(topicId: string): Promise<APIResponse<Note[]>> {
  return safeFetch(`${BASE_URL}/api/notes/topic/${topicId}`);
}

/**
 * Upload a note (PDF) with metadata
 */
export async function uploadNote(data: {
  file: File;
  name: string;
  description?: string;
  type: "rtp" | "mtp" | "other"
  topicId: string;
  courseType: "CAInter" | "CAFinal";
}): Promise<APIResponse<Note>> {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("name", data.name);
  if (data.type) formData.append("type", data.type);
  if (data.description) formData.append("description", data.description);
  formData.append("topicId", data.topicId);
  formData.append("courseType", data.courseType);

  try {
    const res = await fetch(`${BASE_URL}/api/notes/upload-note`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      console.error(`API error (uploadNote):`, result.error ?? res.statusText);
      return { success: false, error: result.error ?? res.statusText };
    }
    return result;
  } catch (error) {
    console.error(`Fetch error (uploadNote):`, error);
    return { success: false, error: (error as Error).message };
  }
}

// ------------------ Video ---------------------

export async function getVideoNotesByTopicId(topicId: string): Promise<APIResponse<VideoNote[]>> {
  return safeFetch(`${BASE_URL}/api/videonotes/topic/${topicId}`);
}

/**
 * Get a video by its ID
 */
export async function getVideoNoteById(videoNoteId: string): Promise<APIResponse<Note>> {
  return safeFetch(`${BASE_URL}/api/videonotes/${videoNoteId}`);
}

export async function addVideoNote(data: {
  url: string;
  name: string;
  type: "rtp" | "mtp" | "revision" | "other"
  topicId: string;
  courseType: "CAInter" | "CAFinal";
}): Promise<APIResponse<VideoNote>> {
  return safeFetch<VideoNote>(`${BASE_URL}/api/videonotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
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

export async function moveNoteToTrash(noteId: string): Promise<APIResponse<Note>> {
  return safeFetch(`${BASE_URL}/api/notes/${noteId}`, { method: "DELETE" });
}

export async function moveVideoNoteToTrash(videoNoteId: string): Promise<APIResponse<VideoNote>> {
  return safeFetch(`${BASE_URL}/api/videonotes/${videoNoteId}`, { method: "DELETE" });
}

// ------------------- Newly Added --------------------

/**
 * Get all newly added items
 */
export async function getNewlyAddedItems(): Promise<APIResponse<NewlyAdded[]>> {
  return safeFetch(`${BASE_URL}/api/newlyadded`);
}

/**
 * Add an item to newly added
 * @param tableName - "MCQ" | "TestPaper" | "Note" | "VideoNote"
 * @param entityId - ID of the entity to mark as newly added
 */
export async function addNewlyAddedItem(tableName: "MCQ" | "TestPaper" | "Note" | "VideoNote", entityId: string): Promise<APIResponse<NewlyAdded>> {
  return safeFetch<NewlyAdded>(`${BASE_URL}/api/newlyadded`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableName, entityId }),
  });
}

/**
 * Remove an item from newly added by its ID
 */
export async function removeNewlyAddedItem(id: string): Promise<APIResponse<string>> {
  return safeFetch(`${BASE_URL}/api/newlyadded/${id}`, {
    method: "DELETE",
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

// ------------------- Search --------------------

export async function searchAll(query: string) {
  return safeFetch(`${BASE_URL}/api/search?query=${encodeURIComponent(query)}`);
}
