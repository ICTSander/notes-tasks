"use client";

import { Search, Bell } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

interface TopBarProps {
  title: string;
  showSearch?: boolean;
  showAvatar?: boolean;
  rightContent?: React.ReactNode;
}

export function TopBar({ title, showSearch = true, showAvatar = true, rightContent }: TopBarProps) {
  return (
    <div className="flex items-center justify-between py-2 mb-2">
      <h1 className="text-2xl font-bold text-t1 tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        {rightContent}
        {showSearch && (
          <IconButton variant="ghost" size="sm">
            <Search className="w-4.5 h-4.5" />
          </IconButton>
        )}
        {showAvatar && (
          <div className="w-8 h-8 rounded-full grad-a flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
        )}
      </div>
    </div>
  );
}
