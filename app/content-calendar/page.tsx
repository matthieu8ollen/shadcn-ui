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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  CalendarIcon,
  Plus,
  Upload,
  Search,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Copy,
  MoreHorizontal,
} from "lucide-react"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { InteractiveHoverButton } from "@/components/interactive-hover-button"
import Link from "next/link"

// Sample data for scheduled content
const scheduledContent = [
  {
    id: 1,
    title: "5 LinkedIn Growth Strategies That Actually Work",
    date: new Date(2024, 11, 15),
    time: "09:00",
    platform: "LinkedIn",
    type: "Article",
    status: "scheduled",
    engagement: "High",
    preview: "Discover the proven strategies that helped me grow my LinkedIn following by 300% in 6 months...",
  },
  {
    id: 2,
    title: "Weekly Industry Insights",
    date: new Date(2024, 11, 17),
    time: "14:30",
    platform: "LinkedIn",
    type: "Carousel",
    status: "draft",
    engagement: "Medium",
    preview: "This week's top trends in content marketing and social media...",
  },
  {
    id: 3,
    title: "Behind the Scenes: Content Creation Process",
    date: new Date(2024, 11, 20),
    time: "11:00",
    platform: "LinkedIn",
    type: "Video",
    status: "scheduled",
    engagement: "High",
    preview: "Take a look at how I create engaging content from ideation to publication...",
  },
]

export default function ContentCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState("month")
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "published":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "High":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredContent = scheduledContent.filter((content) => {
    const matchesType = filterType === "all" || content.type.toLowerCase() === filterType
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.preview.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="flex h-screen bg-background">
      <SidebarNavigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Content Calendar
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Hero Section */}
          <div className="mb-8">
            <TypingAnimation
              className="text-3xl font-medium tracking-tight text-balance font-sans text-emerald-800 mb-2"
              text="Content Calendar"
            />
            <p className="text-gray-600 text-pretty">Plan, schedule, and track your content pipeline</p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex gap-2">
              <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
                <DialogTrigger asChild>
                  <InteractiveHoverButton text="Schedule New Post" className="bg-emerald-600 hover:bg-emerald-700" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Schedule New Post</DialogTitle>
                    <DialogDescription>Create and schedule a new post for your content calendar.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title">Post Title</label>
                      <Input id="title" placeholder="Enter post title..." />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="content">Content</label>
                      <Textarea id="content" placeholder="Write your post content..." rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="date">Date</label>
                        <Input id="date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="time">Time</label>
                        <Input id="time" type="time" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="platform">Platform</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsScheduleModalOpen(false)}>Schedule Post</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
            </div>

            <div className="flex gap-2 ml-auto">
              <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
                <ToggleGroupItem value="month">Month</ToggleGroupItem>
                <ToggleGroupItem value="week">Week</ToggleGroupItem>
                <ToggleGroupItem value="day">Day</ToggleGroupItem>
                <ToggleGroupItem value="list">List</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Gap Alert */}
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You have 3 days without scheduled content this week. Consider filling these gaps to maintain consistent
              engagement.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {viewMode === "month" && "Monthly View"}
                    {viewMode === "week" && "Weekly View"}
                    {viewMode === "day" && "Daily View"}
                    {viewMode === "list" && "List View"}
                  </CardTitle>
                  <CardDescription>
                    {viewMode === "list" ? "All scheduled content" : "Click on dates to view or schedule content"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {viewMode === "list" ? (
                    <div className="space-y-4">
                      {filteredContent.map((content) => (
                        <Card key={content.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">{content.title}</h4>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.preview}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                {content.date.toLocaleDateString()} at {content.time}
                                <span className="mx-2">•</span>
                                {content.platform}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge className={getStatusColor(content.status)}>{content.status}</Badge>
                              <Badge className={getEngagementColor(content.engagement)}>{content.engagement}</Badge>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />

                      {/* Week View Grid */}
                      {viewMode === "week" && (
                        <div className="grid grid-cols-7 gap-2 mt-4">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                            <div key={day} className="border rounded-lg p-3 min-h-[120px]">
                              <div className="font-medium text-sm mb-2">{day}</div>
                              {index === 1 && (
                                <div className="bg-blue-100 text-blue-800 text-xs p-2 rounded mb-1">
                                  LinkedIn Growth
                                </div>
                              )}
                              {index === 3 && (
                                <div className="bg-yellow-100 text-yellow-800 text-xs p-2 rounded mb-1">
                                  Industry Insights
                                </div>
                              )}
                              {index !== 1 && index !== 3 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full h-8 text-xs text-gray-400 border-dashed border"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Content
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Content Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    This Week's Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Posts Scheduled</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engagement Rate</span>
                    <span className="font-medium text-green-600">+12%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Goal</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Create from Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Copy className="h-4 w-4" />
                    Duplicate Last Week
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Users className="h-4 w-4" />
                    Team Collaboration
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">LinkedIn Growth Post</p>
                      <p className="text-xs text-gray-500">Due in 2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Weekly Newsletter</p>
                      <p className="text-xs text-gray-500">Due tomorrow</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
