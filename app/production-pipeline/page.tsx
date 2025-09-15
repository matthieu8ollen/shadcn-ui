"use client"

import { useState } from "react"
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
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { InteractiveHoverButton } from "@/components/interactive-hover-button"
import {
  Home,
  RefreshCw,
  MoreVertical,
  Calendar,
  Eye,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Clock,
  CheckCircle,
  FileText,
  ImageIcon,
  Video,
  Layers,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { useContent } from "@/contexts/ContentContext"
import { useToast } from "@/components/ToastNotifications"
import { useEffect } from "react"

// Sample content data for the pipeline
const sampleContent = {
  drafts: [
    {
      id: "1",
      title: "5 LinkedIn Growth Strategies That Actually Work",
      type: "text",
      framework: "Problem-Solution",
      author: "You",
      created: "2 hours ago",
      modified: "30 min ago",
      progress: 75,
      wordCount: 450,
    },
    {
      id: "2",
      title: "Behind the Scenes: Building a Personal Brand",
      type: "carousel",
      framework: "Storytelling",
      author: "You",
      created: "1 day ago",
      modified: "4 hours ago",
      progress: 40,
      wordCount: 280,
    },
  ],
  scheduled: [
    {
      id: "3",
      title: "The Future of Remote Work: What Leaders Need to Know",
      type: "text",
      framework: "Thought Leadership",
      author: "You",
      scheduledDate: "Tomorrow, 9:00 AM",
      platform: "LinkedIn",
      autoPost: true,
    },
  ],
  published: [
    {
      id: "4",
      title: "How I Increased My LinkedIn Engagement by 300%",
      type: "text",
      framework: "Case Study",
      author: "You",
      publishedDate: "2 days ago",
      views: 2847,
      likes: 156,
      comments: 23,
      shares: 12,
      performance: "high",
    },
    {
      id: "5",
      title: "5 Tools Every Content Creator Should Use",
      type: "carousel",
      framework: "List",
      author: "You",
      publishedDate: "1 week ago",
      views: 1523,
      likes: 89,
      comments: 15,
      shares: 7,
      performance: "medium",
    },
  ],
  archived: [
    {
      id: "6",
      title: "My Journey from Corporate to Entrepreneur",
      type: "text",
      framework: "Personal Story",
      author: "You",
      archivedDate: "2 weeks ago",
      reason: "Campaign ended",
      finalViews: 5234,
      finalEngagement: 312,
    },
  ],
}

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case "text":
      return FileText
    case "image":
      return ImageIcon
    case "carousel":
      return Layers
    case "video":
      return Video
    default:
      return FileText
  }
}

const getPerformanceBadge = (performance: string) => {
  switch (performance) {
    case "high":
      return <Badge className="bg-green-100 text-green-800">High Performance</Badge>
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-800">Medium Performance</Badge>
    case "low":
      return <Badge className="bg-red-100 text-red-800">Low Performance</Badge>
    default:
      return null
  }
}

export default function ProductionPipelinePage() {
  const { user } = useAuth()
  const {
    draftContent: rawDraftContent,
    scheduledContent: rawScheduledContent,
    publishedContent: rawPublishedContent,
    archivedContent: rawArchivedContent,
    loadingContent,
    refreshContent,
    updateContent,
    publishContent,
    deleteContent
  } = useContent()

  // Add safe defaults to prevent undefined errors
  const draftContent = rawDraftContent || []
  const scheduledContent = rawScheduledContent || []
  const publishedContent = rawPublishedContent || []
  const archivedContent = rawArchivedContent || []
  const { showToast } = useToast()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>("all")

  // Load content on mount
  useEffect(() => {
    if (user) {
      refreshContent()
    }
  }, [user, refreshContent])

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSelectAll = (stage: string) => {
  let stageItems: any[] = []
  switch(stage) {
    case 'drafts': stageItems = draftContent; break;
    case 'scheduled': stageItems = scheduledContent; break;
    case 'published': stageItems = publishedContent; break;
    case 'archived': stageItems = archivedContent; break;
  }
  const stageIds = stageItems.map((item) => item.id)
  setSelectedItems((prev) => [...prev, ...stageIds])
}

  const handleEditContent = (content: any) => {
    // Navigate to appropriate editor based on source
    if (content.source_page === 'writer-suite') {
      window.open(`/writer-suite?contentId=${content.id}`, '_blank')
    } else {
      window.open(`/create?editId=${content.id}`, '_blank')
    }
  }

  const handleScheduleContent = (content: any) => {
    // Open scheduling modal
    showToast('info', 'Opening schedule modal...')
  }

  const handlePublishNow = async (contentId: string) => {
    try {
      const success = await publishContent(contentId)
      if (success) {
        showToast('success', 'Content published successfully!')
      } else {
        showToast('error', 'Failed to publish content')
      }
    } catch (error) {
      showToast('error', 'Error publishing content')
    }
  }

  const handleDeleteContent = async (contentId: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        const success = await deleteContent(contentId)
        if (success) {
          showToast('success', 'Content deleted successfully')
        } else {
          showToast('error', 'Failed to delete content')
        }
      } catch (error) {
        showToast('error', 'Error deleting content')
      }
    }
  }

  const handleArchiveContent = async (contentId: string) => {
    try {
      const success = await updateContent(contentId, { status: 'archived' })
      if (success) {
        showToast('success', 'Content archived successfully')
      } else {
        showToast('error', 'Failed to archive content')
      }
    } catch (error) {
      showToast('error', 'Error archiving content')
    }
  }
  // Add this loading check right before the existing return statement
  if (loadingContent && (!draftContent || draftContent.length === 0)) {
    return (
      <div className="flex h-screen bg-background">
        <SidebarNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your content...</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex h-screen bg-background">
      <SidebarNavigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Production Pipeline</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Hero Section */}
          <div className="mb-6">
            <TypingAnimation
              text="Production Pipeline"
              className="text-3xl font-medium tracking-tight text-balance font-sans text-emerald-800 mb-2"
            />
            <p className="text-gray-600 text-pretty">Manage your content workflow from draft to published</p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <InteractiveHoverButton
                text="Create New Content"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions
                    <MoreVertical className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Move to Scheduled</DropdownMenuItem>
                  <DropdownMenuItem>Archive Selected</DropdownMenuItem>
                  <DropdownMenuItem>Delete Selected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text Posts</SelectItem>
                  <SelectItem value="carousel">Carousels</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Counter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{draftContent.length}</div>
                <p className="text-xs text-gray-500 mt-1">{draftContent.filter(c => !c.title).length} need attention</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{scheduledContent.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {scheduledContent.length > 0 ? `Next: ${new Date(scheduledContent[0]?.scheduled_date || '').toLocaleDateString()}` : 'None scheduled'}
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{publishedContent.length}</div>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Archived</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{archivedContent.length}</div>
                <p className="text-xs text-gray-500 mt-1">Total archived</p>
              </CardContent>
            </Card>
          </div>


          {/* Kanban Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Drafts Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-600">Drafts ({draftContent.length})</h3>
                <Button variant="ghost" size="sm" onClick={() => handleSelectAll("drafts")}>
                  Select All
                </Button>
              </div>

              <div className="space-y-3">
                {draftContent.map((item) => {
                  const IconComponent = getContentTypeIcon(item.type)
                  return (
                    <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="h-4 w-4 text-gray-500" />
                            <Badge variant="outline" className="text-xs">
                              {item.content_type}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h4>
                          <div className="space-y-2">
                            <Progress value={item.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{item.word_count || 0} words</span>
                              <span>{new Date(item.updated_at || item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-3">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Edit className="h-3 w-3 mr-1" />
                              Continue
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Calendar className="h-3 w-3 mr-1" />
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Scheduled Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-orange-600">Scheduled ({scheduledContent.length})</h3>
                <Button variant="ghost" size="sm" onClick={() => handleSelectAll("scheduled")}>
                  Select All
                </Button>
              </div>

              <div className="space-y-3">
                {scheduledContent.map((item) => {
                  const IconComponent = getContentTypeIcon(item.type)
                  return (
                    <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="h-4 w-4 text-gray-500" />
                            <Badge variant="outline" className="text-xs">
                              {item.content_type}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="h-3 w-3" />
                              {item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString() : 'Not scheduled'}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Auto-posting enabled
                            </div>
                          </div>
                          <div className="flex gap-1 mt-3">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Published Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-600">Published ({publishedContent.length})</h3>
                <Button variant="ghost" size="sm" onClick={() => handleSelectAll("published")}>
                  Select All
                </Button>
              </div>

              <div className="space-y-3">
                {scheduledContent.map((item) => {
                  const IconComponent = getContentTypeIcon(item.type)
                  return (
                    <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="h-4 w-4 text-gray-500" />
                            <Badge variant="outline" className="text-xs">
                              {item.content_type}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h4>
                          <div className="space-y-2">
                            <Badge className="bg-green-100 text-green-800">Published</Badge>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div>{item.word_count || 0} words</div>
                              <div>Published</div>
                            </div>
                            <p className="text-xs text-gray-500">{new Date(item.published_at || item.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-1 mt-3">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              Analytics
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Copy className="h-3 w-3 mr-1" />
                              Repurpose
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Archived Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-600">Archived ({archivedContent.length})</h3>
                <Button variant="ghost" size="sm" onClick={() => handleSelectAll("archived")}>
                  Select All
                </Button>
              </div>

              <div className="space-y-3">
                {archivedContent.map((item) => {
                  const IconComponent = getContentTypeIcon(item.type)
                  return (
                    <Card key={item.id} className="p-4 hover:shadow-md transition-shadow opacity-75">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="h-4 w-4 text-gray-500" />
                            <Badge variant="outline" className="text-xs">
                              {item.content_type}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h4>
                          <div className="space-y-2">
                            <div className="text-xs text-gray-600">
                              <div>Archived: {new Date(item.updated_at || item.created_at).toLocaleDateString()}</div>
                              <div>{item.word_count || 0} words</div>
                            </div>
                            <p className="text-xs text-gray-500">
                              Archived {new Date(item.updated_at || item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1 mt-3">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Copy className="h-3 w-3 mr-1" />
                              Duplicate
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
