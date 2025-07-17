export async function fetchTopicsByCourseType(courseType: string) {
  const res = await fetch(`http://localhost:3000/api/courses/${courseType}/topics`, {
    cache: "no-store"
  });
  if (!res.ok) return {}
  const result = await res.json()
  console.log("fetchTopicsByCourseType ", result)
  return result;
}

export async function fetchTopicById(topicId: string) {
  const res = await fetch(`http://localhost:3000/api/topics/${topicId}`);
  if (!res.ok) return {};

  const result = await res.json()
  console.log("fetchTopicById ", result)
  return result;
}

export async function fetchAllTestPapersByTopicId(topicId: string) {
  const res = await fetch(`http://localhost:3000/api/topics/${topicId}/testpapers`)
  if (!res.ok) return {};
  const result = await res.json()
  console.log("fetchAllTestPapersByTopicId ", result)
  return result;
}

export async function fetchTestPaperById(testPaperId: string) {
  const res = await fetch(`http://localhost:3000/api/testpapers/${testPaperId}`);
  if (!res.ok) return {};
  const result = await res.json()
  console.log("fetchTestPaperById ", result)
  return result;
}

export async function moveTopicToTrash(topicId: string) {
  const res = await fetch(`http://localhost:3000/api/topics/${topicId}/move-to-trash`, {
    method: "POST",
  });
  if (!res.ok) return null;
  return res.json();
}
