export async function getTopicsByCourseType(courseType: string) {
  const res = await fetch(`http://localhost:3000/api/courses/${courseType}/topics`, {
    cache: "no-store"
  });
  if (!res.ok) return {}
  const result = await res.json()
  console.log("fetchTopicsByCourseType ", result)
  return result;
}

export async function getTopicById(topicId: string) {
  const res = await fetch(`http://localhost:3000/api/topics/${topicId}`);
  if (!res.ok) return {};

  const result = await res.json()
  console.log("fetchTopicById ", result)
  return result;
}

export async function getAllTestPapersByTopicId(topicId: string) {
  const res = await fetch(`http://localhost:3000/api/topics/${topicId}/testpapers`)
  if (!res.ok) return {};
  const result = await res.json()
  console.log("fetchAllTestPapersByTopicId ", result)
  return result;
}

export async function getTestPaperById(testPaperId: string) {
  const res = await fetch(`http://localhost:3000/api/testpapers/${testPaperId}`);
  if (!res.ok) return {};
  const result = await res.json()
  console.log("fetchTestPaperById ", result)
  return result;
}

export async function getMCQById(id: string) {
  const res = await fetch(`http://localhost:3000/api/mcqs/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function moveTopicToTrash(topicId: string) {
  const res = await fetch(`http://localhost:3000/api/topics/${topicId}/move-to-trash`, {
    method: "POST",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getTrashItems() {
  const res = await fetch("http://localhost:3000/api/trash");
  if (!res.ok) throw new Error("Failed to fetch trash items");
  return res.json();
}

export async function restoreTrashItem(id: string) {
  const res = await fetch(`http://localhost:3000/api/trash/${id}/restore`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to restore trash item");
  return res.json();
}

export async function permanentlyDeleteTrashItem(id: string) {
  const res = await fetch(`http://localhost:3000/api/trash/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete trash item");
  return res.json();
}

export async function purgeTrash() {
  const res = await fetch("http://localhost:3000/api/trash", { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to purge trash");
  return res.json();
}
