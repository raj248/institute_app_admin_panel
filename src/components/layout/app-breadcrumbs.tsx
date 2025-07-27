// src/components/app-breadcrumbs.tsx

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopicById, getTestPaperById } from "@/lib/api"; // implement as needed

export function AppBreadcrumbs() {
  const location = useLocation();
  const [dynamicNames, setDynamicNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDynamicNames = async () => {
      const segments = location.pathname.split("/").filter(Boolean);
      const updates: Record<string, string> = {};

      await Promise.all(
        segments.map(async (segment, idx) => {
          const prevSegment = segments[idx - 1];

          // Check for topicId directly after CAInter/CAFinal
          if (prevSegment === "CAInter" || prevSegment === "CAFinal") {
            const topic = await getTopicById(segment);
            if (topic) updates[segment] = topic.data?.name || 'Unknown Topic';
          }

          // Check for testPaperId after "topic"
          if (prevSegment === "testpaper") {
            const testPaper = await getTestPaperById(segment);
            if (testPaper) updates[segment] = testPaper.data?.name || 'Unknown Test Paper';
          }
        })
      );

      setDynamicNames(updates);
    };

    fetchDynamicNames();
  }, [location.pathname]);

  const segments = location.pathname.split("/").filter(Boolean);
  const paths = segments.map((_, idx) => "/" + segments.slice(0, idx + 1).join("/"));

  // Simple label beautifier for static segments
  const beautify = (segment: string) => {
    if (segment === "CAInter") return "CA Inter";
    if (segment === "CAFinal") return "CA Final";
    if (segment === "topic") return "Topic";
    if (segment === "testpaper") return "Test Paper";
    if (segment === "newlyadded") return "Newly Added";
    return segment;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, idx) => {
          const segment = segments[idx];
          const name = dynamicNames[segment] || beautify(segment);
          return segment === "testpaper" ? null : (
            <span key={path} className="flex items-center">
              <BreadcrumbItem>
                {idx === paths.length - 1 ? (
                  <BreadcrumbPage className="text-base font-medium">{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="text-base font-medium">
                    <Link to={path}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < paths.length - 1 && <BreadcrumbSeparator />}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );

}
