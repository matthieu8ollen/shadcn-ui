"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ShinyButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function ShinyButton({ children, className, onClick }: ShinyButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className,
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </motion.button>
  )
}
