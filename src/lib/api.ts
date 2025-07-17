export async function getTopicsByCourseType(courseType: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/courses/${courseType}/topics`, {
    cache: "no-store"
  });
  if (!res.ok) return {}
  const result = await res.json()
  console.log("fetchTopicsByCourseType ", result)
  return result;
}

export async function getTopicById(topicId: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/topics/${topicId}`);
  if (!res.ok) return {};

  const result = await res.json()
  console.log("fetchTopicById ", result)
  return result;
}

export async function getAllTestPapersByTopicId(topicId: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/topics/${topicId}/testpapers`)
  if (!res.ok) return {};
  const result = await res.json()
  console.log("fetchAllTestPapersByTopicId ", result)
  return result;
}

export async function getTestPaperById(testPaperId: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/testpapers/${testPaperId}`);
  if (!res.ok) return {};
  const result = await res.json()
  console.log("fetchTestPaperById ", result)
  return result;
}

export async function getMCQById(id: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mcqs/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function moveTopicToTrash(topicId: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/topics/${topicId}/move-to-trash`, {
    method: "POST",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function moveTestPaperToTrash(testPaperId: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/testpapers/${testPaperId}`, {
    method: "DELETE",
  });
  if (!res.ok) return {};
  return res.json();
}

export async function moveMCQToTrash(mcqId: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mcqs/${mcqId}`, {
    method: "DELETE",
  });
  if (!res.ok) return {};
  return res.json();
}

export async function getTrashItems() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/trash`);
  if (!res.ok) return {};
  return res.json();
}

export async function restoreTrashItem(id: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/trash/${id}/restore`, { method: "POST" });
  if (!res.ok) return {};
  return res.json();
}

export async function permanentlyDeleteTrashItem(id: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/trash/${id}`, { method: "DELETE" });
  if (!res.ok) return {};
  return res.json();
}

export async function purgeTrash() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/trash`, { method: "DELETE" });
  if (!res.ok) return {};
  return res.json();
}
