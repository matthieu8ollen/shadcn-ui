"use client"

import { useState, useEffect } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useContent } from "@/contexts/ContentContext"
import { useToast } from "@/components/ui/use-toast"

export default function ProductionPipelinePage() {
  const { user } = useAuth()
  const { draftContent, scheduledContent, publishedContent, archivedContent, refreshContent } = useContent()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      refreshContent()
    }
  }, [user, refreshContent])

  return (
    <div className="flex h-screen bg-white">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Production Pipeline</h1>
          
          <div className="grid grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{draftContent.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{scheduledContent.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Published</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{publishedContent.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Archived</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{archivedContent.length}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
