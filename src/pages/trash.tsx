// src/pages/trash.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, XCircle } from "lucide-react";
import { getTrashItems, permanentlyDeleteTrashItem, purgeTrash, restoreTrashItem, getTopicById, getTestPaperById, getMCQById, getNoteById, getVideoNoteById } from "@/lib/api";
import { useConfirm } from "@/components/modals/global-confirm-dialog";
import type { Trash } from "@/types/entities";
import { useProtectAdminRoute } from "@/hooks/useProtectAdminRoute";

export default function Trash() {
  const [trashItems, setTrashItems] = useState<Trash[] | null>(null);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useProtectAdminRoute();
  useEffect(() => {
    loadTrashItems();
  }, []);

  const loadTrashItems = async () => {
    setLoading(true);
    try {
      const res = await getTrashItems();
      const items = res.data ?? null
      setTrashItems(items);
      if (items) fetchEntityDetails(items);
    } catch (error) {
      console.error("Error fetching trash items", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityDetails = async (items: Trash[]) => {
    const detailMap: Record<string, string> = {};

    for (const item of items) {
      try {
        if (item.tableName === "Topic") {
          const topic = await getTopicById(item.entityId);
          if (topic) detailMap[item.id] = topic.data?.description ?? "No description.";
        } else if (item.tableName === "TestPaper") {
          const testPaper = await getTestPaperById(item.entityId);
          if (testPaper) detailMap[item.id] = testPaper.data?.name || "No name.";
        } else if (item.tableName === "MCQ") {
          const mcq = await getMCQById(item.entityId);
          if (mcq) detailMap[item.id] = mcq.data?.question || "No question.";
        } else if (item.tableName === "Note") {
          const note = await getNoteById(item.entityId);
          if (note) detailMap[item.id] = note.data?.name || "No Note Title.";
        } else if (item.tableName === "VideoNote") {
          const video = await getVideoNoteById(item.entityId);
          if (video) detailMap[item.id] = video.data?.name || "No Title.";
        } else {
          detailMap[item.id] = "No details available.";
        }
      } catch {
        detailMap[item.id] = "Error loading details.";
      }
    }

    setDetails(detailMap);
  };

  const confirm = useConfirm();

  const handleRestore = async (id: string) => {
    const confirmed = await confirm({
      title: "Restore This Item?",
      description: "This will restore the item from trash back into your system.",
      confirmText: "Yes, Restore",
      cancelText: "Cancel",
    });
    if (!confirmed) return;

    await restoreTrashItem(id);
    await loadTrashItems();
  };

  const handlePermanentDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Permanently delete item?",
      description:
        "This will permanently delete the item and all its data. This action cannot be undone.",
      confirmText: "Delete Permanently",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (!confirmed) return;

    await permanentlyDeleteTrashItem(id);
    await loadTrashItems();
  };

  const handlePurgeAll = async () => {
    const confirmed = await confirm({
      title: "Permanently purge all trash?",
      description:
        "This will permanently delete ALL trashed items and cannot be undone.",
      confirmText: "Purge All",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (!confirmed) return;

    await purgeTrash();
    await loadTrashItems();
  };


  return (
    <div className="md:p-3 lg:p-5 space-y-4">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight">Trash</h2>
        <Button variant="destructive" size="sm" onClick={handlePurgeAll}>
          <Trash2 size={16} className="mr-1" /> Purge All
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground mx-4">Loading trash items...</p>
      ) : trashItems && trashItems.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start">
          {trashItems.map((item) => (
            <Card key={item.id} className="relative transition-transform hover:scale-[1.02] hover:shadow-sm border border-border/50 rounded-lg mx-4 flex-1 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium break-words line-clamp-1">
                  {item.tableName}: {item.displayName}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Trashed At:</strong> {new Date(item.trashedAt).toLocaleString()}
                </p>
                <div className="max-h-24 overflow-y-auto">
                  <p className="text-foreground mt-1 break-words">
                    {details[item.id] ?? "Loading details..."}
                  </p>
                </div>
                <CardFooter className="flex justify-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-1"
                    onClick={() => handleRestore(item.id)}
                  >
                    <RotateCcw size={14} />
                    <span>Restore</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1"
                    onClick={() => handlePermanentDelete(item.id)}
                  >
                    <XCircle size={14} />
                    <span>Delete</span>
                  </Button>
                </CardFooter>

              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mx-4">Trash is empty.</p>
      )}
    </div>
  );
}
