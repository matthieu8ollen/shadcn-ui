"use client"

import { useState, useEffect } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useContent } from "@/contexts/ContentContext"
import { useToast } from "@/components/ui/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Eye,
  MoreVertical,
  CheckCircle,
  Edit3,
  Home,
  ArrowLeft,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { GridBeams } from "@/components/magicui/grid-beams"

// Types and constants
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
]

export default function CalendarPage() {
  const { user } = useAuth()
  const { 
    scheduledContent, 
    publishedContent,
    archivedContent,
    loadingContent,
    refreshContent,
    rescheduleContent,
    getContentForDate,
  } = useContent()
  const { toast } = useToast()

  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [selectedContentItem, setSelectedContentItem] = useState<any>(null)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('09:00')

  useEffect(() => {
    if (user) {
      refreshContent()
    }
  }, [user, refreshContent])

  // Helper functions
  const getWeekDays = (date: Date): Date[] => {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day
    start.setDate(diff)
    
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      weekDays.push(day)
    }
    return weekDays
  }

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    const days: Date[] = []
    const firstDayOfWeek = firstDay.getDay()
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push(prevDate)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day))
    }
    
    return days
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString()
  }

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === calendarDate.getMonth() && date.getFullYear() === calendarDate.getFullYear()
  }

  const formatDateForScheduling = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Navigation
  const navigateCalendarMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendarDate)
    newDate.setMonth(calendarDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCalendarDate(newDate)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7))
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setCalendarDate(today)
  }

  // Content actions
  const handleReschedule = (content: any) => {
    setSelectedContentItem(content)
    setRescheduleDate(content.scheduled_date || formatDateForScheduling(new Date()))
    setRescheduleTime(content.scheduled_time || '09:00')
    setShowRescheduleModal(true)
  }

  const handleRescheduleSubmit = async () => {
    if (!selectedContentItem) return

    const success = await rescheduleContent(selectedContentItem.id, rescheduleDate, rescheduleTime)
    if (success) {
      toast({
        title: "Success",
        description: "Content rescheduled successfully",
      })
      setShowRescheduleModal(false)
      setSelectedContentItem(null)
    } else {
      toast({
        title: "Error",
        description: "Failed to reschedule content",
        variant: "destructive",
      })
    }
  }

  // UI helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'published': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-3 h-3" />
      case 'published': return <CheckCircle className="w-3 h-3" />
      default: return <Edit3 className="w-3 h-3" />
    }
  }

  // Loading state
  const hasNoContent = scheduledContent.length === 0 && publishedContent.length === 0 && archivedContent.length === 0

  if (loadingContent && hasNoContent) {
    return (
      <div className="flex h-screen bg-white">
        <SidebarNavigation />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your calendar...</p>
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
            <div className="p-6 space-y-6">
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
                    <BreadcrumbPage>Calendar</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-medium tracking-tight text-emerald-800 mb-2">
                    Content Calendar
                  </h1>
                  <p className="text-gray-600 text-pretty">
                    View and manage your scheduled content
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
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Scheduled</p>
                        <p className="text-2xl font-bold text-blue-600">{scheduledContent.length}</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Published</p>
                        <p className="text-2xl font-bold text-green-600">{publishedContent.length}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">This Week</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {getWeekDays(selectedDate).reduce((count, day) => 
                            count + getContentForDate(day).length, 0
                          )}
                        </p>
                      </div>
                      <CalendarIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Two-Column Layout */}
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Mini Calendar */}
                <div className="col-span-4">
                  <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium text-emerald-800">
                          {MONTHS[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                        </CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateCalendarMonth('prev')}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateCalendarMonth('next')}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      {/* Day headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {SHORT_DAYS.map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(calendarDate).map((date, index) => {
                          const hasContent = getContentForDate(date).length > 0
                          const isSelected = isSameDay(date, selectedDate)
                          const isTodayDate = isToday(date)
                          const isCurrentMonthDay = isCurrentMonth(date)
                          
                          return (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDate(date)}
                              className={`
                                h-8 w-8 p-0 text-xs transition-all duration-200 relative
                                ${isSelected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : ''}
                                ${isTodayDate && !isSelected ? 'bg-blue-50 text-blue-700 font-medium' : ''}
                                ${!isCurrentMonthDay ? 'text-gray-400' : 'text-gray-700'}
                                ${hasContent && !isSelected ? 'bg-gray-100' : ''}
                                hover:bg-emerald-50
                              `}
                            >
                              {date.getDate()}
                              {hasContent && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                              )}
                            </Button>
                          )
                        })}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToToday}
                          className="w-full"
                        >
                          Today
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column - Weekly View */}
                <div className="col-span-8">
                  <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium text-emerald-800">
                          Week of {getWeekDays(selectedDate)[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateWeek('prev')}
                          >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateWeek('next')}
                          >
                            Next
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-6">
                        {getWeekDays(selectedDate).map(day => {
                          const dayContent = getContentForDate(day)
                          const isTodayDate = isToday(day)
                          const isSelectedDay = isSameDay(day, selectedDate)
                          
                          return (
                            <div 
                              key={day.toISOString()} 
                              className={`border-l-4 pl-4 transition-all duration-200 ${
                                isTodayDate ? 'border-emerald-500 bg-emerald-50/30' :
                                isSelectedDay ? 'border-emerald-300 bg-emerald-50/20' :
                                'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3 className={`font-medium transition-colors ${
                                  isTodayDate ? 'text-emerald-900' : 
                                  isSelectedDay ? 'text-emerald-800' :
                                  'text-gray-900'
                                }`}>
                                  {FULL_DAYS[day.getDay()]} {day.getDate()}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {dayContent.length} {dayContent.length === 1 ? 'item' : 'items'}
                                </Badge>
                              </div>
                              
                              {dayContent.length > 0 ? (
                                <div className="space-y-2">
                                  {dayContent.map(content => (
                                    <Card key={content.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200 bg-white/90 backdrop-blur-sm">
                                      <CardContent className="p-3">
                                        <div className="flex items-start justify-between mb-2">
                                          <Badge variant="outline" className={`${getStatusColor(content.status)} text-xs`}>
                                            {getStatusIcon(content.status)}
                                            <span className="ml-1">{content.scheduled_time || '09:00'}</span>
                                          </Badge>
                                          
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                                <MoreVertical className="w-3 h-3" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <DropdownMenuItem onClick={() => handleReschedule(content)}>
                                                <CalendarIcon className="w-3 h-3 mr-2" />
                                                Reschedule
                                              </DropdownMenuItem>
                                              <DropdownMenuItem>
                                                <Eye className="w-3 h-3 mr-2" />
                                                Preview
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                        
                                        <h4 className="font-medium text-gray-900 line-clamp-2 leading-tight text-sm mb-1">
                                          {content.title || content.prompt_input || 'Untitled Content'}
                                        </h4>
                                        
                                        <p className="text-xs text-gray-600 line-clamp-2">
                                          {content.content_text?.length > 60
                                            ? content.content_text.substring(0, 60) + '...'
                                            : content.content_text || 'No content'}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic py-2">No content scheduled</p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </GridBeams>
        </div>
      </div>

      {/* Reschedule Modal */}
      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Content</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleSubmit}>
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
