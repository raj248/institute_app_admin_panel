// components/ExportUsersButton.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  FileSpreadsheet,
  FileJson,
  FileText,
  Download,
} from "lucide-react";
import { BASE_URL } from "@/lib/api";

type ExportFormat = "csv" | "json" | "excel" | "word";

interface ExportUsersButtonProps {
  /** API base URL, e.g. "https://localhost:5000" or "" when proxied */
  baseUrl?: string;
  /** Endpoint path */
  path?: string; // default: "/export-users"
  /** Extra query params to include in the request */
  query?: Record<string, string | number | boolean | undefined>;
  /** Disable the whole control */
  disabled?: boolean;
  /** Called on any error */
  onError?: (err: unknown) => void;
  /** Optional className for the trigger button */
  className?: string;
  /** Optional label for the trigger button */
  label?: string;
}

/** Map formats to file extensions (fallback) */
const EXT: Record<ExportFormat, string> = {
  csv: "csv",
  json: "json",
  excel: "xlsx",
  word: "docx",
};

export default function ExportUsersButton({
  query,
  disabled,
  onError,
  className,
  label = "Export Users",
}: ExportUsersButtonProps) {
  const [loading, setLoading] = React.useState<ExportFormat | null>(null);

  const buildUrl = (format: ExportFormat) => {
    // const url = new URL(baseUrl + path, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const url = new URL(`${BASE_URL}/api/user/export`);
    url.searchParams.set("format", format);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }
    // If baseUrl is absolute, keep it; otherwise drop origin (relative)
    // const finalUrl = baseUrl.startsWith("http") ? url.toString() : url.pathname + "?" + url.searchParams.toString();
    return url.toString();
  };

  const parseFilename = (res: Response, format: ExportFormat) => {
    const cd = res.headers.get("Content-Disposition") || "";
    const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
    const fallback = `users.${EXT[format]}`;
    try {
      return match ? decodeURIComponent(match[1]) : fallback;
    } catch {
      return fallback;
    }
  };

  const download = async (format: ExportFormat) => {
    setLoading(format);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 60_000); // 60s safety

    try {
      const res = await fetch(buildUrl(format), {
        method: "GET",
        credentials: "include", // ✅ send cookies
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const text = await safeText(res);
        throw new Error(
          `Export failed (${res.status}): ${text || res.statusText}`
        );
      }

      const blob = await res.blob();
      const filename = parseFilename(res, format);

      // Create a download link
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error(err);
      onError?.(err);
      // Optional: plug in shadcn/use-toast here
      alert(err instanceof Error ? err.message : "Export failed");
    } finally {
      clearTimeout(t);
      setLoading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={className}
          disabled={disabled || !!loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting…
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {label}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Download as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => download("csv")}>
          <FileText className="mr-2 h-4 w-4" />
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("json")}>
          <FileJson className="mr-2 h-4 w-4" />
          JSON (.json)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("word")}>
          <FileText className="mr-2 h-4 w-4" />
          Word (.docx)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Try to read error text without throwing on binary bodies */
async function safeText(res: Response): Promise<string> {
  try {
    const clone = res.clone();
    const ct = clone.headers.get("Content-Type") || "";
    if (ct.includes("application/json")) {
      const j = await clone.json();
      return typeof j === "string" ? j : JSON.stringify(j);
    }
    if (ct.startsWith("text/")) {
      return await clone.text();
    }
    return "";
  } catch {
    return "";
  }
}
