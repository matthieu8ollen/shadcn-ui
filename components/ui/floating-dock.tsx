"use client"

import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingDockItem {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  content: string
}

interface FloatingDockProps {
  items: FloatingDockItem[]
  className?: string
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  const [openPopover, setOpenPopover] = React.useState<string | null>(null)

  return (
    <div className={cn("fixed right-4 top-1/2 -translate-y-1/2 z-50", className)}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-2">
        {items.map((item) => (
          <Popover
            key={item.id}
            open={openPopover === item.id}
            onOpenChange={(open) => setOpenPopover(open ? item.id : null)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                title={item.title}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-80 mr-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  )
}
