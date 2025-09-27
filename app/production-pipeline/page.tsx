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
    setSelectedContent,
    setShowScheduleModal,
  } = useContent()
  const { toast } = useToast()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      refreshContent()
    }
  }, [user, refreshContent])

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

  const handleScheduleContent = (content: any) => {
    setSelectedContent(content)
    setShowScheduleModal(true)
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

  // Content Card Component
  const ContentCard = ({ content, columnType }: { content: any; columnType: string }) => {
    const IconComponent = getContentTypeIcon(content.content_type || content.type)
    
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
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
          <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed">
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
                <Button size="sm" variant="outline" className="h-8 px-3">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                
                <Button size="sm" variant="outline" className="h-8 px-3">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Continue
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
                
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
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
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
      <CardContent className="p-8 text-center">
        <div className="text-gray-400 mb-2">
          <Archive className="w-8 h-8 mx-auto" />
        </div>
        <h4 className="font-medium text-gray-600 mb-1">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
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

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{draftContent.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Ready to edit</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{scheduledContent.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Ready to publish</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{publishedContent.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Live content</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Archived</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-600">{archivedContent.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Archived items</p>
                  </CardContent>
                </Card>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Drafts Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-600 flex items-center space-x-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Drafts ({draftContent.length})</span>
                    </h3>
                  </div>
                  
                  <div className="space-y-4 min-h-[400px]">
                    {draftContent.length > 0 ? (
                      draftContent.map((content) => (
                        <ContentCard key={content.id} content={content} columnType="draft" />
                      ))
                    ) : (
                      <EmptyColumn 
                        title="No drafts" 
                        description="Create your first post!" 
                      />
                    )}
                  </div>
                </div>

                {/* Scheduled Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-yellow-600 flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Scheduled ({scheduledContent.length})</span>
                    </h3>
                  </div>
                  
                  <div className="space-y-4 min-h-[400px]">
                    {scheduledContent.length > 0 ? (
                      scheduledContent.map((content) => (
                        <ContentCard key={content.id} content={content} columnType="scheduled" />
                      ))
                    ) : (
                      <EmptyColumn 
                        title="No scheduled content" 
                        description="Schedule content from drafts!" 
                      />
                    )}
                  </div>
                </div>

                {/* Published Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-green-600 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Published ({publishedContent.length})</span>
                    </h3>
                  </div>
                  
                  <div className="space-y-4 min-h-[400px]">
                    {publishedContent.length > 0 ? (
                      publishedContent.map((content) => (
                        <ContentCard key={content.id} content={content} columnType="published" />
                      ))
                    ) : (
                      <EmptyColumn 
                        title="No published content" 
                        description="Content will appear here once published" 
                      />
                    )}
                  </div>
                </div>

                {/* Archived Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-600 flex items-center space-x-2">
                      <Archive className="w-4 h-4" />
                      <span>Archived ({archivedContent.length})</span>
                    </h3>
                  </div>
                  
                  <div className="space-y-4 min-h-[400px]">
                    {archivedContent.length > 0 ? (
                      archivedContent.map((content) => (
                        <ContentCard key={content.id} content={content} columnType="archived" />
                      ))
                    ) : (
                      <EmptyColumn 
                        title="No archived content" 
                        description="Archived content will appear here" 
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </GridBeams>
        </div>
      </div>
    </div>
  )
}
