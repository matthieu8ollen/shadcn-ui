"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
}

const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ text = "Button", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative w-full cursor-pointer overflow-hidden rounded-lg bg-transparent px-6 py-3 text-center font-semibold transition-all duration-300 hover:bg-emerald-700 hover:text-white hover:rounded-xl hover:shadow-lg hover:shadow-emerald-700/25",
          className,
        )}
        {...props}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {text}
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    )
  },
)

InteractiveHoverButton.displayName = "InteractiveHoverButton"

export { InteractiveHoverButton }
