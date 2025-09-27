"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  RefreshCw,
  MoreVertical,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  Edit3,
  ArrowRight,
  Camera,
  BarChart3,
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Archive
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useContent } from "@/contexts/ContentContext"

export default function ProductionPipelinePage() {
  const { user } = useAuth()
  const { 
    draftContent, 
    scheduledContent, 
    publishedContent, 
    archivedContent,
    loadingContent,
    refreshContent,
    updateContent,
    deleteContent,
    setSelectedContent,
    setShowScheduleModal,
    moveToArchive,
    publishContent
  } = useContent()
  const { toast } = useToast()

  // UI State Management
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'published' | 'archived'>('all')
  const [showPreview, setShowPreview] = useState(false)
  const [selectedContentItem, setSelectedContentItem] = useState<any>(null)

  // Load content on mount
  useEffect(() => {
    if (user) {
      refreshContent()
    }
  }, [user, refreshContent])

  // Content actions (ported from cyberminds)
  const handleContinueEditing = (content: any) => {
    const creationMode = content.variations_data?.creation_mode
    
    if (creationMode === 'marcus') {
      // Navigate to Marcus mode
      window.location.href = '/dashboard?mode=marcus&contentId=' + content.id
    } else if (creationMode === 'standard') {
      // Navigate to Standard mode
      window.location.href = '/dashboard?mode=standard&contentId=' + content.id
    } else {
      // Default navigation
      window.location.href = '/dashboard?contentId=' + content.id
    }
  }

  const handleScheduleContent = (content: any) => {
    setSelectedContent(content)
    setShowScheduleModal(true)
  }

  const handleImageAction = (content: any) => {
    localStorage.setItem('selectedContentForImage', JSON.stringify(content))
    window.location.href = '/images'
  }

  const handleDeleteContent = async (contentId: string) => {
    const success = await deleteContent(contentId)
    if (success) {
      toast({
        title: "Success",
        description: "Content deleted successfully",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      })
    }
  }

  const handlePublishNow = async (contentId: string) => {
    const success = await publishContent(contentId)
    if (success) {
      toast({
        title: "Success",
        description: "Content published successfully!",
      })
    } else {
      toast({
        title: "Error", 
        description: "Failed to publish content",
        variant: "destructive",
      })
    }
  }

  const handleArchiveContent = async (contentId: string) => {
    const success = await moveToArchive(contentId)
    if (success) {
      toast({
        title: "Success",
        description: "Content archived successfully",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to archive content", 
        variant: "destructive",
      })
    }
  }

  // Utility functions (from cyberminds)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200' 
      case 'published': return 'bg-green-100 text-green-800 border-green-200'
      case 'archived': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit3 className="w-4 h-4" />
      case 'scheduled': return <Clock className="w-4 h-4" />
      case 'published': return <CheckCircle className="w-4 h-4" />
      case 'archived': return <Archive className="w-4 h-4" />
      default: return <Edit3 className="w-4 h-4" />
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'framework': return <BarChart3 className="w-4 h-4" />
      case 'story': return <Target className="w-4 h-4" />
      case 'trend': return <TrendingUp className="w-4 h-4" />
      case 'mistake': return <AlertCircle className="w-4 h-4" />
      case 'metrics': return <Sparkles className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  const getContinueButtonText = (content: any): string => {
    const creationMode = content.variations_data?.creation_mode
    switch (creationMode) {
      case 'marcus': return 'Continue in Marcus'
      case 'standard': return 'Continue in Standard'
      default: return 'Continue Editing'
    }
  }

  const getSmartDateDisplay = (item: any): string => {
    const formatDateSafely = (dateString: string) => {
      const [year, month, day] = dateString.split('-')
      return `${month}/${day}/${year}`
    }

    switch (item.status) {
      case 'draft':
        return `Created: ${new Date(item.created_at).toLocaleDateString()}`
      case 'scheduled':
        return `Scheduled: ${item.scheduled_date ? formatDateSafely(item.scheduled_date) : new Date(item.created_at).toLocaleDateString()}`
      case 'published':
        return `Published: ${item.published_at ? new Date(item.published_at).toLocaleDateString() : new Date(item.created_at).toLocaleDateString()}`
      case 'archived':
        if (item.published_at) {
          return `Published: ${new Date(item.published_at).toLocaleDateString()}`
        } else if (item.scheduled_date) {
          return `Scheduled: ${formatDateSafely(item.scheduled_date)}`
        } else {
          return `Created: ${new Date(item.created_at).toLocaleDateString()}`
        }
      default:
        return `Created: ${new Date(item.created_at).toLocaleDateString()}`
    }
  }

  // Content Card Component
  const ContentCard = ({ content, columnType }: { content: any, columnType: string }) => {
    const IconComponent = getContentTypeIcon(content.content_type || content.type)
    
    return (
      <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer relative">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <IconComponent />
              <Badge variant="outline" className={getStatusColor(content.status)}>
                {getStatusIcon(content.status)}
                <span className="ml-1 capitalize">{content.status || 'draft'}</span>
              </Badge>
            </div>
            <Checkbox 
              checked={selectedItems.includes(content.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedItems([...selectedItems, content.id])
                } else {
                  setSelectedItems(selectedItems.filter(id => id !== content.id))
                }
              }}
            />
          </div>

          {/* Title */}
          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {content.title || content.prompt_input || 'Untitled Content'}
          </h4>

          {/* Content Preview */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {content.content_text.length > 150 
              ? content.content_text.substring(0, 150) + '...'
              : content.content_text
            }
          </p>

          {/* Metadata */}
          <div className="space-y-1 mb-4 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Tone: {content.tone_used}</span>
              <span>{content.content_text.length} chars</span>
            </div>
            <div>{getSmartDateDisplay(content)}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="default"
                onClick={() => {
                  setSelectedContentItem(content)
                  setShowPreview(true)
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleContinueEditing(content)}
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                {getContinueButtonText(content)}
              </Button>
            </div>

            <div className="flex space-x-1">
              {/* Dynamic action buttons based on status */}
              {columnType === 'draft' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleScheduleContent(content)}
                >
                  <Calendar className="w-3 h-3" />
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleImageAction(content)}
              >
                <Camera className="w-3 h-3" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {columnType === 'scheduled' && (
                    <DropdownMenuItem onClick={() => handlePublishNow(content.id)}>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Publish Now
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleArchiveContent(content.id)}>
                    <Archive className="w-3 h-3 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteContent(content.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loadingContent) {
    return (
      <ContentLayout title="Production Pipeline">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading content...</span>
        </div>
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title="Production Pipeline">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Production Pipeline</h2>
          <p className="text-muted-foreground">
            Manage your content workflow from draft to published
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshContent}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          {selectedItems.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedItems.length})
                  <MoreVertical className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Move to Scheduled</DropdownMenuItem>
                <DropdownMenuItem>Archive Selected</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete Selected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftContent.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledContent.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedContent.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{archivedContent.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Drafts Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-blue-600">Drafts ({draftContent.length})</h3>
          </div>
          
          <div className="space-y-3 min-h-[200px]">
            {draftContent.map((content) => (
              <ContentCard key={content.id} content={content} columnType="draft" />
            ))}
            
            {draftContent.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No drafts yet. Create your first post!
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Scheduled Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-yellow-600">Scheduled ({scheduledContent.length})</h3>
          </div>
          
          <div className="space-y-3 min-h-[200px]">
            {scheduledContent.map((content) => (
              <ContentCard key={content.id} content={content} columnType="scheduled" />
            ))}
            
            {scheduledContent.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No scheduled content. Schedule from drafts!
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Published Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-green-600">Published ({publishedContent.length})</h3>
          </div>
          
          <div className="space-y-3 min-h-[200px]">
            {publishedContent.map((content) => (
              <ContentCard key={content.id} content={content} columnType="published" />
            ))}
            
            {publishedContent.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No published content yet.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Archived Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-orange-600">Archived ({archivedContent.length})</h3>
          </div>
          
          <div className="space-y-3 min-h-[200px]">
            {archivedContent.map((content) => (
              <ContentCard key={content.id} content={content} columnType="archived" />
            ))}
            
            {archivedContent.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No archived content.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
          </DialogHeader>
          
          {selectedContentItem && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getContentTypeIcon(selectedContentItem.content_type)}
                <Badge className={getStatusColor(selectedContentItem.status)}>
                  {selectedContentItem.status || 'draft'}
                </Badge>
              </div>
              
              <h3 className="font-semibold">
                {selectedContentItem.title || selectedContentItem.prompt_input || 'Untitled Content'}
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedContentItem.content_text}</p>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tone: {selectedContentItem.tone_used}</span>
                <span>{getSmartDateDisplay(selectedContentItem)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ContentLayout>
  )
}
