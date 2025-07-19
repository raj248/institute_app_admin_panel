// src/components/topics/TopicGridView.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "@/components/modals/global-confirm-dialog";
import { moveTopicToTrash } from "@/lib/api";
import type { Topic } from "@/types/entities";

interface TopicGridViewProps {
  topics: Topic[] | null;
  loading: boolean;
}

export function TopicGridView({ topics, loading }: TopicGridViewProps) {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const handleMoveToTrash = async (topicId: string) => {
    const confirmed = await confirm({
      title: "Move This Topic To Trash?",
      description: "This will move the topic to trash along with its test papers and MCQs. You can restore it later if needed.",
      confirmText: "Yes, Move to Trash",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const topic = await moveTopicToTrash(topicId);
    if (!topic) {
      console.error("Failed to move topic to trash.");
      alert("Failed to move topic to trash.");
      return;
    }
  };

  const handleCardClick = (topic: Topic) => {
    navigate(`/CAInter/${topic.id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3">
        {[...Array(4)].map((_, idx) => (
          <Skeleton
            key={idx}
            className="h-20 w-full rounded-md max-w-xs flex-1"
          />
        ))}
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return <p className="text-muted-foreground">No topics found for CA Inter.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {topics.map((topic) => (
        <Card
          key={topic.id}
          className="relative transition-transform hover:scale-[1.02] hover:shadow-sm border border-border/50 rounded-lg mx-4 max-w-xs min-w-[220px] flex-1 group"
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToTrash(topic.id);
            }}
          >
            <Trash2 size={16} className="text-yellow-600" />
          </Button>

          <div onClick={() => handleCardClick(topic)} className="cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">{topic.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <div>
                {topic.description ?? <em>No description provided.</em>}
              </div>
              <div>
                {topic.testPaperCount ?? 0} Test Paper{(topic.testPaperCount ?? 0) !== 1 ? "s" : ""}
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
