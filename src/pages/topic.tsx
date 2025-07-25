"use client"

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";
import { getAllTestPapersByTopicId, getTopicById, moveTestPaperToTrash } from "@/lib/api";
import { useConfirm } from "@/components/modals/global-confirm-dialog";
import type { Note, TestPaper, Topic, VideoNote } from "@/types/entities";
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
import { AddVideoNoteDialog } from "@/components/modals/AddVideoNoteDialog";
import { AddNotesDialog } from "@/components/modals/AddNotesDialog";
import TopicNotesTabContent from "@/components/tab-content/TopicNotesTabContent";
import TopicVideosTabContent from "@/components/tab-content/TopicVideosTabContent";
import TestpaperGridView from "@/components/cards/TestPaperGridView";
import TestpaperListView from "@/components/TestpaperListView";
import { Input } from "@/components/ui/input";

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [tab, setTab] = useState<"testpapers" | "notes" | "revision_test" | "videos">("testpapers");

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedTestPaperId, setSelectedTestPaperId] = useState<string | null>(null);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [testPapers, setTestPapers] = useState<TestPaper[] | null>(null);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [videos, setVideos] = useState<VideoNote[] | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [videoFilterType, setVideoFilterType] = useState<VideoNote["type"] | "all">("all");
  const [noteFilterType, setNoteFilterType] = useState<Note["type"] | "all">("all");

  const [loading, setLoading] = useState(true);

  const loadTopic = async () => {
    if (!topicId) return;
    try {
      const topicRes = await getTopicById(topicId);
      setTopic(topicRes.data ?? null);
    } catch (e) {
      console.error(e);
    } finally {
    }
  };

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
    loadTopic();
    loadTestPapers();
  }, [topicId]);

  const confirm = useConfirm();

  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete This Test Paper?",
      description: "This will move the test paper to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
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
        <h2 className="text-xl font-semibold tracking-tight text-center">{topic?.name ?? "Loading..."}</h2>

      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "testpapers" | "notes" | "revision_test" | "videos")}
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between">
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
              <SelectItem value="videos">Videos</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className=" **:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 md:flex lg:flex">
            <TabsTrigger value="testpapers">Test Papers</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="videos">Video Notes</TabsTrigger>
          </TabsList>
          <Input
            placeholder="Search name or description..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full h-8  bg-muted placeholder:text-muted-foreground focus:bg-muted mx-2"
          />
          <div className="flex items-center gap-2">
            {tab === "testpapers" && (
              <>
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
                <AddTestPaperDialog
                  topicId={topicId ?? ''}
                  courseType={location.pathname.split("/")[1] as "CAInter" | "CAFinal"}
                  setTestPapers={setTestPapers}
                /></>
            )}
            {tab === "videos" && (
              <>
                {/* Filter Select */}
                <Select value={videoFilterType} onValueChange={(val) => setVideoFilterType(val as VideoNote["type"] | "all")}>
                  <SelectTrigger className="w-40 text-xs rounded-md" style={{ height: '32px' }}>                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="mtp">MTP</SelectItem>
                    <SelectItem value="rtp">RTP</SelectItem>
                    <SelectItem value="revision">Revision</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <AddVideoNoteDialog
                  topicId={topicId ?? ''}
                  courseType={location.pathname.split("/")[1] as "CAInter" | "CAFinal"}
                  setVideos={setVideos}
                />
              </>
            )}
            {tab === "notes" && (
              <>
                <Select value={noteFilterType} onValueChange={(val) => setNoteFilterType(val as Note["type"] | "all")}>
                  <SelectTrigger className="w-40 text-xs rounded-md" style={{ height: '32px' }}>                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="mtp">MTP</SelectItem>
                    <SelectItem value="rtp">RTP</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <AddNotesDialog
                  topicId={topicId ?? ''}
                  courseType={location.pathname.split("/")[1] as "CAInter" | "CAFinal"}
                  setNotes={setNotes}
                />
              </>
            )}
          </div>
        </div>

        <TabsContent value="testpapers">
          <TestpaperDetailsDialog
            testPaperId={selectedTestPaperId}
            topicId={topicId ?? ''}
            open={openDetailDialog}
            onOpenChange={setOpenDetailDialog}
          />

          {viewMode === "grid" ? (
            <TestpaperGridView
              testPapers={testPapers ?? []}
              topicId={topicId ?? ''}
              loading={loading}
              refreshPapers={loadTestPapers}
              handleMoveToTrash={handleMoveToTrash}
              handleCardClick={handleCardClick}
            />
          ) : (
            <TestpaperListView
              testPapers={testPapers ?? []}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              refreshPapers={loadTestPapers}
              handleMoveToTrash={handleMoveToTrash}
              handleCardClick={handleCardClick}
            />
          )}
        </TabsContent>

        <TabsContent value="notes">
          <TopicNotesTabContent
            notes={notes}
            setNotes={setNotes}
            topicId={topicId ?? ''}
            filterType={noteFilterType}
          />
        </TabsContent>

        <TabsContent
          value="videos"
          className="relative flex flex-col gap-4 overflow-auto"
        >
          <TopicVideosTabContent
            videos={videos}
            setVideos={setVideos}
            topicId={topicId ?? ''}
            filterType={videoFilterType}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
