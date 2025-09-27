"use client"

import { useState, useEffect } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GridBeams } from "@/components/magicui/grid-beams"
import {
  Home,
  RefreshCw,
  Calendar,
  Eye,
  Edit3,
  ArrowRight,
  Clock,
  CheckCircle,
  Archive,
  BarChart3,
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Camera,
  MoreVertical,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useContent } from "@/contexts/ContentContext"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function ProductionPipelinePage() {
  const { user } = useAuth()
  const {
    draftContent,
    scheduledContent,
    publishedContent,
    archivedContent,
    loadingContent,
    refreshContent,
    scheduleContentItem,
    publishContent,
    moveToArchive,
    deleteContent,
    setSelectedContent,
    setShowScheduleModal,
  } = useContent()
  const { toast } = useToast()
  
  // State for sectioned layout
  const [activeFilter, setActiveFilter] = useState<'draft' | 'scheduled' | 'published' | 'archived'>('draft')

  // Get current content based on filter
  const getCurrentContent = () => {
    switch (activeFilter) {
      case 'draft': return draftContent
      case 'scheduled': return scheduledContent
      case 'published': return publishedContent
      case 'archived': return archivedContent
      default: return draftContent
    }
  }

  const getEmptyStateMessage = () => {
    switch (activeFilter) {
      case 'draft': return 'Create your first post to get started!'
      case 'scheduled': return 'Schedule content from your drafts.'
      case 'published': return 'Published content will appear here.'
      case 'archived': return 'Archived content will appear here.'
      default: return ''
    }
  }

  useEffect(() => {
    if (user) {
      refreshContent()
    }
  }, [user, refreshContent])

  // Content actions
  const handleScheduleContent = (content: any) => {
    setSelectedContent(content)
    setShowScheduleModal(true)
  }

  const handleContinueEditing = (content: any) => {
    const creationMode = content.variations_data?.creation_mode
    
    if (creationMode === 'marcus') {
      window.location.href = '/chat/marcus?contentId=' + content.id
    } else if (creationMode === 'standard') {
      window.location.href = '/writer-suite?contentId=' + content.id
    } else {
      window.location.href = '/writer-suite?contentId=' + content.id
    }
  }

  const handleImageAction = (content: any) => {
    localStorage.setItem('selectedContentForImage', JSON.stringify(content))
    window.location.href = '/image-generation'
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

  const handleDeleteContent = async (contentId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this content? This action cannot be undone.')
    if (confirmed) {
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
  }

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'scheduled': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'published': return 'bg-green-50 text-green-700 border-green-200'
      case 'archived': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-blue-50 text-blue-700 border-blue-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit3 className="w-3 h-3" />
      case 'scheduled': return <Clock className="w-3 h-3" />
      case 'published': return <CheckCircle className="w-3 h-3" />
      case 'archived': return <Archive className="w-3 h-3" />
      default: return <Edit3 className="w-3 h-3" />
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'framework': return <BarChart3 className="w-4 h-4 text-emerald-600" />
      case 'story': return <Target className="w-4 h-4 text-emerald-600" />
      case 'trend': return <TrendingUp className="w-4 h-4 text-emerald-600" />
      case 'mistake': return <AlertCircle className="w-4 h-4 text-emerald-600" />
      case 'metrics': return <Sparkles className="w-4 h-4 text-emerald-600" />
      default: return <BarChart3 className="w-4 h-4 text-emerald-600" />
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

  // Content Card Component
  const ContentCard = ({ content, columnType }: { content: any; columnType: string }) => {
    const IconComponent = getContentTypeIcon(content.content_type || content.type)
    
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {IconComponent}
              <Badge variant="outline" className={getStatusColor(content.status)}>
                {getStatusIcon(content.status)}
                <span className="ml-1 text-xs font-medium capitalize">
                  {content.status || 'draft'}
                </span>
              </Badge>
            </div>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {content.title || content.prompt_input || 'Untitled Content'}
          </h4>

          {/* Content Preview */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {content.content_text?.length > 120
              ? content.content_text.substring(0, 120) + '...'
              : content.content_text || 'No content available'}
          </p>

          {/* Metadata */}
          <div className="text-xs text-gray-500 mb-4 space-y-1">
            <div className="flex justify-between">
              <span>Tone: {content.tone_used || 'N/A'}</span>
              <span>{content.content_text?.length || 0} chars</span>
            </div>
            <div>
              Created: {content.created_at ? new Date(content.created_at).toLocaleDateString() : 'Unknown'}
            </div>
          </div>

          {/* Actions - Hidden by default, shown on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 px-3 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 px-3 text-xs"
                  onClick={() => handleContinueEditing(content)}
                >
                  <ArrowRight className="w-3 h-3 mr-1" />
                  {getContinueButtonText(content)}
                </Button>
              </div>

              <div className="flex space-x-1">
                {columnType === 'draft' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleScheduleContent(content)}
                  >
                    <Calendar className="w-3 h-3" />
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleImageAction(content)}
                >
                  <Camera className="w-3 h-3" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty State Component
  const EmptyColumn = ({ title, description }: { title: string; description: string }) => (
    <div className="col-span-full">
      <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
        <CardContent className="p-12 text-center">
          <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="font-medium text-gray-600 mb-2">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
      </Card>
    </div>
  )

  if (loadingContent) {
    return (
      <div className="flex h-screen bg-white">
        <SidebarNavigation />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your content...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto">
          <GridBeams
            className="min-h-full"
            backgroundColor="rgba(255, 255, 255, 0.95)"
            gridColor="rgba(16, 185, 129, 0.1)"
            rayCount={12}
            rayOpacity={0.2}
            gridSize={50}
          >
            <div className="p-6 space-y-8">
              {/* Breadcrumb */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Production Pipeline</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-medium tracking-tight text-emerald-800 mb-2">
                    Production Pipeline
                  </h1>
                  <p className="text-gray-600 text-pretty">
                    Manage your content workflow from draft to published
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={refreshContent}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </Button>
              </div>

              {/* Filter Stats - Clickable Cards (Cyberminds Style) */}
              <div className="grid grid-cols-4 gap-4">
                <Card 
                  className={`cursor-pointer transition-all duration-200 bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg group ${
                    activeFilter === 'draft' ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-gray-200'
                  }`}
                  onClick={() => setActiveFilter('draft')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Edit3 className={`w-5 h-5 transition-colors ${
                        activeFilter === 'draft' ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                      }`} />
                      <div className={`text-2xl font-bold transition-colors ${
                        activeFilter === 'draft' ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {draftContent.length}
                      </div>
                    </div>
                    <p className={`text-sm font-medium transition-colors ${
                      activeFilter === 'draft' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      Drafts
                    </p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all duration-200 bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg group ${
                    activeFilter === 'scheduled' ? 'border-yellow-500 shadow-md ring-2 ring-yellow-100' : 'border-gray-200'
                  }`}
                  onClick={() => setActiveFilter('scheduled')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className={`w-5 h-5 transition-colors ${
                        activeFilter === 'scheduled' ? 'text-yellow-600' : 'text-gray-600 group-hover:text-yellow-600'
                      }`} />
                      <div className={`text-2xl font-bold transition-colors ${
                        activeFilter === 'scheduled' ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {scheduledContent.length}
                      </div>
                    </div>
                    <p className={`text-sm font-medium transition-colors ${
                      activeFilter === 'scheduled' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      Scheduled
                    </p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all duration-200 bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg group ${
                    activeFilter === 'published' ? 'border-green-500 shadow-md ring-2 ring-green-100' : 'border-gray-200'
                  }`}
                  onClick={() => setActiveFilter('published')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className={`w-5 h-5 transition-colors ${
                        activeFilter === 'published' ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'
                      }`} />
                      <div className={`text-2xl font-bold transition-colors ${
                        activeFilter === 'published' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {publishedContent.length}
                      </div>
                    </div>
                    <p className={`text-sm font-medium transition-colors ${
                      activeFilter === 'published' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      Published
                    </p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all duration-200 bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg group ${
                    activeFilter === 'archived' ? 'border-gray-500 shadow-md ring-2 ring-gray-100' : 'border-gray-200'
                  }`}
                  onClick={() => setActiveFilter('archived')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Archive className={`w-5 h-5 transition-colors ${
                        activeFilter === 'archived' ? 'text-gray-600' : 'text-gray-600 group-hover:text-gray-600'
                      }`} />
                      <div className={`text-2xl font-bold transition-colors ${
                        activeFilter === 'archived' ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {archivedContent.length}
                      </div>
                    </div>
                    <p className={`text-sm font-medium transition-colors ${
                      activeFilter === 'archived' ? 'text-gray-600' : 'text-gray-600'
                    }`}>
                      Archived
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Content Section - Shows Only Selected Filter */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-emerald-800 capitalize flex items-center space-x-2">
                    <span>{activeFilter} Content ({getCurrentContent().length})</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentContent().length > 0 ? (
                    getCurrentContent().map((content) => (
                      <ContentCard key={content.id} content={content} columnType={activeFilter} />
                    ))
                  ) : (
                    <EmptyColumn 
                      title={`No ${activeFilter} content`}
                      description={getEmptyStateMessage()}
                    />
                  )}
                </div>
              </div>
            </div>
          </GridBeams>
        </div>
      </div>
    </div>
  )
}
