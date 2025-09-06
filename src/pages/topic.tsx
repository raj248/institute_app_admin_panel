"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";
import { getAllTestPapersByTopicId, getTopicById } from "@/lib/api";
import type { TestPaper, Topic } from "@/types/entities";
import { TestpaperDetailsDialog } from "@/components/modals/TestpaperDetailsDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AddTestPaperDialog } from "@/components/modals/AddTestPaperDialog";
import TestpaperGridView from "@/components/cards/TestPaperGridView";
import TestpaperListView from "@/components/TestpaperListView";
import { Input } from "@/components/ui/input";
import { useProtectAdminRoute } from "@/hooks/useProtectAdminRoute";

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [tab, setTab] = useState<"testpapers">("testpapers");

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedTestPaperId, setSelectedTestPaperId] = useState<string | null>(
    null
  );

  const [topic, setTopic] = useState<Topic | null>(null);
  const [testPapers, setTestPapers] = useState<TestPaper[] | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

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

  useProtectAdminRoute();
  useEffect(() => {
    loadTopic();
    loadTestPapers();
  }, [topicId]);

  const handleCardClick = (id: string) => {
    setSelectedTestPaperId(id);
    setOpenDetailDialog(true);
  };

  return (
    <div className="md:p-3 lg:p-5 space-y-4">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight text-center">
          {topic?.name ?? "Loading..."}
        </h2>
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "testpapers")}
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select
            defaultValue={tab}
            onValueChange={(value) => setTab(value as "testpapers")}
          >
            <SelectTrigger
              className="flex w-fit md:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="testpapers">Test Papers</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className=" **:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 md:flex lg:flex">
            <TabsTrigger value="testpapers">Test Papers</TabsTrigger>
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
                  topicId={topicId ?? ""}
                  courseType={
                    location.pathname.split("/")[1] as "CAInter" | "CAFinal"
                  }
                  setTestPapers={setTestPapers}
                />
              </>
            )}
          </div>
        </div>

        <TabsContent value="testpapers">
          <TestpaperDetailsDialog
            testPaperId={selectedTestPaperId}
            topicId={topicId ?? ""}
            open={openDetailDialog}
            onOpenChange={setOpenDetailDialog}
          />

          {viewMode === "grid" ? (
            <TestpaperGridView
              testPapers={testPapers ?? []}
              topicId={topicId ?? ""}
              loading={loading}
              globalFilter={globalFilter}
              refreshPapers={loadTestPapers}
              setPapers={setTestPapers}
              handleCardClick={handleCardClick}
            />
          ) : (
            <TestpaperListView
              testPapers={testPapers ?? []}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              refreshPapers={loadTestPapers}
              setPapers={setTestPapers}
              handleCardClick={handleCardClick}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
