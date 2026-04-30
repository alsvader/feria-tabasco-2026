"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dlg.addEventListener("cancel", handleCancel);
    return () => dlg.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className={cn(
        "p-0 bg-transparent backdrop:bg-black/70 backdrop:backdrop-blur-sm",
        "max-w-lg w-[calc(100%-2rem)] rounded-3xl text-text-primary",
        "open:animate-fade-in"
      )}
    >
      <div
        className={cn(
          "relative bg-surface rounded-3xl border border-white/10 shadow-surface-lg p-8",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 h-9 w-9 grid place-items-center rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          <X size={18} strokeWidth={2} />
        </button>
        {title && (
          <h2 className="text-2xl font-semibold mb-3 pr-10">{title}</h2>
        )}
        {children}
      </div>
    </dialog>
  );
}
