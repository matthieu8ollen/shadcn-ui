"use client"

import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps {
  text?: string
  className?: string
  onClick?: () => void
}

export function InteractiveHoverButton({ text = "Button", className, onClick }: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        "group relative w-32 cursor-pointer overflow-hidden rounded-full bg-white p-2 text-center font-semibold",
        className,
      )}
      onClick={onClick}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center rounded-full bg-primary text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
      </div>
    </button>
  )
}
