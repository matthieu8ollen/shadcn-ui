'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { 
  GeneratedContent, 
  saveGeneratedContent, 
  updateGeneratedContent,
  getGeneratedContent,
  scheduleContent,
  supabase
} from '../lib/supabase'

// Enhanced interfaces with cyberminds functionality
interface ScheduledContentWithCalendar extends GeneratedContent {
  scheduled_date: string
  scheduled_time?: string
  published_at?: string
  linkedin_post_url?: string
  image_url?: string
}

interface ContentContextType {
  // Content Management (from cyberminds working implementation)
  draftContent: GeneratedContent[]
  scheduledContent: GeneratedContent[]
  publishedContent: GeneratedContent[]
  archivedContent: GeneratedContent[]
  loadingContent: boolean
  
  // Actions (enhanced from cyberminds)
  saveDraft: (content: Omit<GeneratedContent, 'id' | 'created_at' | 'user_id'>, mode?: string) => Promise<GeneratedContent | null>
  updateContent: (contentId: string, updates: Partial<GeneratedContent>) => Promise<boolean>
  deleteContent: (contentId: string) => Promise<boolean>
  refreshContent: () => Promise<void>
  
  // Scheduling functionality (ported from cyberminds)
  scheduleContentItem: (contentId: string, date: string, time: string) => Promise<boolean>
  publishContent: (contentId: string) => Promise<boolean>
  rescheduleContent: (contentId: string, newDate: string, newTime: string) => Promise<boolean>
  moveToArchive: (contentId: string) => Promise<boolean>
  
  // Modal states (from cyberminds)
  selectedContent: GeneratedContent | null
  setSelectedContent: (content: GeneratedContent | null) => void
  showScheduleModal: boolean
  setShowScheduleModal: (show: boolean) => void
  
  // Calendar integration (from cyberminds)
  getContentForDate: (date: Date) => ScheduledContentWithCalendar[]
  getCalendarContent: () => ScheduledContentWithCalendar[]
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  // State management (enhanced from cyberminds)
  const [draftContent, setDraftContent] = useState<GeneratedContent[]>([])
  const [scheduledContent, setScheduledContent] = useState<GeneratedContent[]>([])
  const [publishedContent, setPublishedContent] = useState<GeneratedContent[]>([])
  const [archivedContent, setArchivedContent] = useState<GeneratedContent[]>([])
  const [loadingContent, setLoadingContent] = useState(false)
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // Enhanced content loading (from cyberminds working logic)
  const refreshContent = useCallback(async () => {
    if (!user) return
    
    setLoadingContent(true)
    try {
      const { data: allContent, error } = await supabase
        .from('generated_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Categorize content by status (cyberminds logic)
      const drafts = allContent?.filter(item => !item.status || item.status === 'draft') || []
      const scheduled = allContent?.filter(item => item.status === 'scheduled') || []
      const published = allContent?.filter(item => item.status === 'published') || []
      const archived = allContent?.filter(item => item.status === 'archived') || []

      setDraftContent(drafts)
      setScheduledContent(scheduled)
      setPublishedContent(published)
      setArchivedContent(archived)
    } catch (error) {
      console.error('Error refreshing content:', error)
    } finally {
      setLoadingContent(false)
    }
  }, [user])

  // Enhanced save functionality (from cyberminds)
  const saveDraft = async (
    content: Omit<GeneratedContent, 'id' | 'created_at' | 'user_id'>,
    mode?: string
  ): Promise<GeneratedContent | null> => {
    if (!user) return null

    try {
      const contentData = {
        ...content,
        user_id: user.id,
        status: 'draft',
        // Store creation mode for "Continue" button functionality
        variations_data: {
          ...content.variations_data,
          creation_mode: mode
        }
      }

      const { data, error } = await supabase
        .from('generated_content')
        .insert(contentData)
        .select()
        .single()

      if (error) throw error
      
      await refreshContent()
      return data
    } catch (error) {
      console.error('Error saving draft:', error)
      return null
    }
  }

  // Content update (enhanced from cyberminds)
  const updateContent = async (contentId: string, updates: Partial<GeneratedContent>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error
      
      await refreshContent()
      return true
    } catch (error) {
      console.error('Error updating content:', error)
      return false
    }
  }

  // Delete functionality
  const deleteContent = async (contentId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .delete()
        .eq('id', contentId)

      if (error) throw error
      
      await refreshContent()
      return true
    } catch (error) {
      console.error('Error deleting content:', error)
      return false
    }
  }

  // Scheduling functionality (ported from cyberminds)
  const scheduleContentItem = async (contentId: string, date: string, time: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          status: 'scheduled',
          scheduled_date: date,
          scheduled_time: time,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error
      
      await refreshContent()
      return true
    } catch (error) {
      console.error('Error scheduling content:', error)
      return false
    }
  }

  // Publish functionality (from cyberminds)
  const publishContent = async (contentId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error
      
      await refreshContent()
      return true
    } catch (error) {
      console.error('Error publishing content:', error)
      return false
    }
  }

  // Reschedule functionality (from cyberminds)
  const rescheduleContent = async (contentId: string, newDate: string, newTime: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          scheduled_date: newDate,
          scheduled_time: newTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error
      
      await refreshContent()
      return true
    } catch (error) {
      console.error('Error rescheduling content:', error)
      return false
    }
  }

  // Archive functionality
  const moveToArchive = async (contentId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error
      
      await refreshContent()
      return true
    } catch (error) {
      console.error('Error archiving content:', error)
      return false
    }
  }

  // Calendar integration functions (from cyberminds)
  const getCalendarContent = (): ScheduledContentWithCalendar[] => {
    return [
      // Scheduled content with dates
      ...scheduledContent.filter(content => content.scheduled_date).map(content => ({
        ...content,
        status: content.status || 'scheduled' as const,
        scheduled_date: content.scheduled_date!,
        scheduled_time: content.scheduled_time || '09:00'
      })),
      // Published content using published_at date
      ...publishedContent.map(content => ({
        ...content,
        status: content.status || 'published' as const,
        scheduled_date: content.published_at ? content.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
        scheduled_time: content.published_at ? content.published_at.split('T')[1]?.substring(0, 5) || '10:00' : '10:00'
      })),
      // Archived content with dates
      ...archivedContent.filter(content => content.scheduled_date).map(content => ({
        ...content,
        status: content.status || 'archived' as const,
        scheduled_date: content.scheduled_date!,
        scheduled_time: content.scheduled_time || '09:00'
      }))
    ]
  }

  const getContentForDate = (date: Date): ScheduledContentWithCalendar[] => {
    const dateString = date.toISOString().split('T')[0]
    const calendarContent = getCalendarContent()
    
    return calendarContent.filter(content => {
      if (content.status === 'published' && content.published_at) {
        return content.published_at.split('T')[0] === dateString
      }
      return content.scheduled_date === dateString
    })
  }

  // Initialize content on user change
  useEffect(() => {
    if (user) {
      refreshContent()
    } else {
      // Clear content when user logs out
      setDraftContent([])
      setScheduledContent([])
      setPublishedContent([])
      setArchivedContent([])
    }
  }, [user, refreshContent])

  const value: ContentContextType = {
    // Content state
    draftContent,
    scheduledContent,
    publishedContent,
    archivedContent,
    loadingContent,
    
    // Actions
    saveDraft,
    updateContent,
    deleteContent,
    refreshContent,
    
    // Scheduling
    scheduleContentItem,
    publishContent,
    rescheduleContent,
    moveToArchive,
    
    // Modal state
    selectedContent,
    setSelectedContent,
    showScheduleModal,
    setShowScheduleModal,
    
    // Calendar integration
    getContentForDate,
    getCalendarContent
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}
