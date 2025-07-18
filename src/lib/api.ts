const BASE_URL = import.meta.env.VITE_SERVER_URL;

async function safeFetch<T>(url: string, options?: RequestInit): Promise<{ success: boolean; error?: string; data?: T }> {
  try {
    const res = await fetch(url, options);
    const result = await res.json();
    if (!res.ok || !result.success) {
      console.error(`API error (${url}):`, result.error ?? res.statusText);
      return { success: false, error: result.error ?? res.statusText };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error(`Fetch error (${url}):`, error);
    return { success: false, error: (error as Error).message };
  }
}

// ------------------- Courses & Topics --------------------

export async function getTopicsByCourseType(courseType: string) {
  return safeFetch(`${BASE_URL}/api/courses/${courseType}/topics`, { cache: "no-store" });
}

export async function getTopicById(topicId: string) {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}`);
}

// ------------------- Test Papers --------------------

export async function getAllTestPapersByTopicId(topicId: string) {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}/testpapers`);
}

export async function getTestPaperById(testPaperId: string) {
  return safeFetch(`${BASE_URL}/api/testpapers/${testPaperId}`);
}

// ------------------- MCQs --------------------

export async function getMCQById(id: string) {
  return safeFetch(`${BASE_URL}/api/mcqs/${id}`);
}

// ------------------- Trash --------------------

export async function getTrashItems() {
  return safeFetch(`${BASE_URL}/api/trash`);
}

export async function restoreTrashItem(id: string) {
  return safeFetch(`${BASE_URL}/api/trash/${id}/restore`, { method: "POST" });
}

export async function permanentlyDeleteTrashItem(id: string) {
  return safeFetch(`${BASE_URL}/api/trash/${id}`, { method: "DELETE" });
}

export async function purgeTrash() {
  return safeFetch(`${BASE_URL}/api/trash`, { method: "DELETE" });
}

// ------------------- Move to Trash --------------------

export async function moveTopicToTrash(topicId: string) {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}/move-to-trash`, { method: "POST" });
}

export async function moveTestPaperToTrash(testPaperId: string) {
  return safeFetch(`${BASE_URL}/api/testpapers/${testPaperId}`, { method: "DELETE" });
}

export async function moveMCQToTrash(mcqId: string) {
  return safeFetch(`${BASE_URL}/api/mcqs/${mcqId}`, { method: "DELETE" });
}
