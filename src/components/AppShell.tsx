"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { FloatingAddButton } from "@/components/FloatingAddButton";
import { QuickCreateSheet } from "@/components/QuickCreateSheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 sm:px-8 pt-4 pb-28">
        {children}
      </main>
      <BottomNav />
      <FloatingAddButton onClick={() => setSheetOpen(true)} />
      <QuickCreateSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
