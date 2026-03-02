"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full grad-a flex items-center justify-center shadow-xl neon-a"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
    </motion.button>
  );
}
