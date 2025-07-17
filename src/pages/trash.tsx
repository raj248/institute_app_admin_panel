// src/pages/trash.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, XCircle } from "lucide-react";
import { getTrashItems, permanentlyDeleteTrashItem, purgeTrash, restoreTrashItem, getTopicById, getTestPaperById, getMCQById } from "@/lib/api";

type TrashItem = {
  id: string;
  tableName: string;
  entityId: string;
  trashedAt: string;
};

export default function Trash() {
  const [trashItems, setTrashItems] = useState<TrashItem[] | null>(null);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrashItems();
  }, []);

  const loadTrashItems = async () => {
    setLoading(true);
    try {
      const items = await getTrashItems();
      setTrashItems(items);
      fetchEntityDetails(items);
    } catch (error) {
      console.error("Error fetching trash items", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityDetails = async (items: TrashItem[]) => {
    const detailMap: Record<string, string> = {};

    for (const item of items) {
      try {
        if (item.tableName === "Topic") {
          const topic = await getTopicById(item.entityId);
          if (topic) detailMap[item.id] = topic.description ?? "No description.";
        } else if (item.tableName === "TestPaper") {
          const testPaper = await getTestPaperById(item.entityId);
          if (testPaper) detailMap[item.id] = testPaper.name;
        } else if (item.tableName === "MCQ") {
          const mcq = await getMCQById(item.entityId);
          if (mcq) detailMap[item.id] = mcq.question;
        } else {
          detailMap[item.id] = "No details available.";
        }
      } catch {
        detailMap[item.id] = "Error loading details.";
      }
    }

    setDetails(detailMap);
  };

  const handleRestore = async (id: string) => {
    if (!confirm("Restore this item?")) return;
    await restoreTrashItem(id);
    await loadTrashItems();
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Permanently delete this item? This cannot be undone.")) return;
    await permanentlyDeleteTrashItem(id);
    await loadTrashItems();
  };

  const handlePurgeAll = async () => {
    if (!confirm("Permanently delete ALL trash? This cannot be undone.")) return;
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
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {trashItems.map((item) => (
            <Card key={item.id} className="relative border border-border/50 rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  {item.tableName} | {item.entityId.slice(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Trashed At:</strong> {new Date(item.trashedAt).toLocaleString()}
                </p>
                <p className="text-foreground mt-1">
                  {details[item.id] ?? "Loading details..."}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRestore(item.id)}
                  >
                    <RotateCcw size={14} className="mr-1" />
                    Restore
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handlePermanentDelete(item.id)}
                  >
                    <XCircle size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
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
