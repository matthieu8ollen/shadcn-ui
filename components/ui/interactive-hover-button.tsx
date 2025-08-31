"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
}

const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ className, text = "Button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative w-full overflow-hidden rounded-lg bg-white px-6 py-3 text-base font-medium text-black transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-gray-600/25 active:scale-95 border border-gray-200",
          "dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:shadow-gray-400/25",
          className,
        )}
        {...props}
      >
        <span className="relative z-10">{text}</span>
        <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur transition-all duration-300 group-hover:opacity-100 group-hover:blur-none" />
      </button>
    )
  },
)

InteractiveHoverButton.displayName = "InteractiveHoverButton"

export { InteractiveHoverButton }
