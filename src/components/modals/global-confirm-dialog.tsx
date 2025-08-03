"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/cn";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "secondary";
};

export type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) throw new Error("useConfirm must be used within ConfirmDialogProvider");
  return context;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => () => { });

  const confirm: ConfirmContextType = (options) => {
    setOptions(options);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise(false);
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="w-80 rounded-xl">
          <AlertDialogHeader className="flex flex-col items-center text-center space-y-1 -mt-3">
            <AlertDialogTitle className="font-medium text-sm">
              {options.title || "Are you sure?"}
            </AlertDialogTitle>
            {options.description && (
              <AlertDialogDescription className="text-xs text-muted-foreground text-center leading-snug whitespace-pre-wrap">
                {options.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex flex-1 items-center justify-between">
              <AlertDialogCancel
                onClick={handleCancel}
                className="h-8 rounded-md text-xs px-8 w-30"
              >
                {options.cancelText || "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className={cn(
                  "h-8 rounded-md text-xs px-8 w-30 ",
                  options.variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  options.variant === "secondary" && "bg-secondary",
                )}
              >
                {options.confirmText || "Yes, Delete"}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </ConfirmDialogContext.Provider>
  );
}
