"use client"

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/cn";
import { getAllTestPapersByTopicId, moveTestPaperToTrash } from "@/lib/api";
import { useConfirm } from "@/components/modals/global-confirm-dialog";
import type { TestPaper } from "@/types/entities";
import TestPaperCard from "@/components/cards/TestPaperCards";
import { TestpaperDetailsDialog } from "@/components/modals/TestpaperDetailsDialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AddTestPaperDialog } from "@/components/modals/AddTestPaperDialog";
import YouTubeVideoGridTab from "@/components/cards/YouTubeVideoGridTab";

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [testPapers, setTestPapers] = useState<TestPaper[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [tab, setTab] = useState<"testpapers" | "notes" | "revision_test" | "videos">("testpapers");

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedTestPaperId, setSelectedTestPaperId] = useState<string | null>(null);

  const loadTestPapers = async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const res = await getAllTestPapersByTopicId(topicId);
      setTestPapers(res.data ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestPapers();
  }, [topicId]);

  const confirm = useConfirm();

  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete this test paper?",
      description: "This will move the test paper to trash. You can restore it later if needed.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    const test = await moveTestPaperToTrash(id);
    if (!test) {
      console.error("Failed to move test paper to trash.");
      alert("Failed to move test paper to trash.");
      return;
    }
    setTestPapers((prev) => prev?.filter((t) => t.id !== id) ?? null);
  };

  const handleCardClick = (id: string) => {
    setSelectedTestPaperId(id);
    setOpenDetailDialog(true);
  };

  return (
    <div className="md:p-3 lg:p-5 space-y-4">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight">Test Papers</h2>

      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "testpapers" | "notes" | "revision_test" | "videos")}
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue={tab} onValueChange={(value) => setTab(value as "testpapers" | "notes" | "revision_test" | "videos")}>
            <SelectTrigger
              className="flex w-fit md:hidden"
              size="sm"
              id="view-selector"
            >

              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="testpapers">Test Papers</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="revision_test">Revision Test</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 md:flex lg:flex">
            <TabsTrigger value="testpapers">Test Papers</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="revision_test">Revision Test</TabsTrigger>
            <TabsTrigger value="videos">Video Notes</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {tab === "testpapers" && (
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant={viewMode === "list" ? "default" : "secondary"}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </Button>
                <Button
                  size="icon"
                  variant={viewMode === "grid" ? "default" : "secondary"}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid size={18} />
                </Button>
              </div>
            )}
            <AddTestPaperDialog
              topicId={topicId ?? ''}
              courseType={location.pathname.split("/")[1] as "CAInter" | "CAFinal"}
              setTestPapers={setTestPapers}
            />
          </div>
        </div>

        <TabsContent value="testpapers">
          <TestpaperDetailsDialog
            testPaperId={selectedTestPaperId}
            topicId={topicId ?? ''}
            open={openDetailDialog}
            onOpenChange={setOpenDetailDialog}
          />

          {loading ? (
            <div
              className={cn(
                "gap-3",
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-3"
              )}
            >
              {[...Array(4)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="h-24 w-full rounded-lg"
                />
              ))}
            </div>
          ) : testPapers && testPapers.length > 0 ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
              )}
            >
              {topicId && testPapers.map((paper) => (
                <TestPaperCard
                  key={paper.id}
                  paper={paper}
                  topicId={topicId}
                  refreshPapers={loadTestPapers}
                  handleMoveToTrash={handleMoveToTrash}
                  onClick={() => handleCardClick(paper.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No test papers found for this topic.</p>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <div className="p-4 text-center text-muted-foreground">
            Notes tab (coming soon).
          </div>
        </TabsContent>

        <TabsContent value="revision_test">
          <div className="p-4 text-center text-muted-foreground">
            Revision Test tab (coming soon).
          </div>
        </TabsContent>
        <TabsContent
          value="videos"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <YouTubeVideoGridTab
            videoLinks={[
              "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
            ]}
            onDelete={(id) => {
              console.log("Delete", id);
              // Remove from DB or state
            }}
            onEdit={(id, newUrl) => {
              console.log("Edit", id, newUrl);
              // Update in DB or state
            }}
          />

        </TabsContent>
      </Tabs>
    </div>
  );
}
