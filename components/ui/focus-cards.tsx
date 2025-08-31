"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any
    index: number
    hovered: number | null
    setHovered: React.Dispatch<React.SetStateAction<number | null>>
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={card.onClick}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-160 w-full transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
        card.onClick && "cursor-pointer hover:scale-[1.02]", // Added hover scale effect for clickable cards
      )}
    >
      <img
        src={card.src || "/placeholder.svg"}
        alt={card.title}
        className="object-cover absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-black/50 flex items-end justify-start">
        <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 p-4">
          {card.title}
        </div>
      </div>
    </div>
  ),
)

Card.displayName = "Card"

type Card = {
  title: string
  src: string
  onClick?: () => void
}

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex gap-4 max-w-6xl mx-auto w-full">
      {cards.map((card, index) => (
        <Card key={card.title} card={card} index={index} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  )
}
