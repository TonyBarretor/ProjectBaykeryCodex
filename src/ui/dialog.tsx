"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { DialogContentProps } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({ className, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-soft focus:outline-none",
          className
        )}
        {...props}
      />
    </DialogPrimitive.Portal>
  );
}
